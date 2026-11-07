import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import pg from 'pg';
import { randomUUID } from 'node:crypto';
import { createClerkClient, clerkMiddleware, getAuth } from '@clerk/express';
import { publishableKeyFromHost } from '@clerk/shared/keys';
import { clerkProxyMiddleware, CLERK_PROXY_PATH, getClerkProxyHost } from './middlewares/clerkProxyMiddleware';
import { COURSE_MODULES } from '../src/data/courseData';

const { Pool } = pg;
const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const PORT = Number(process.env.PORT || 5000);
const ADMIN_EMAIL = 'teamgog3@gmail.com';
const SUBSCRIPTION_PRICE_ETB = 3900;
const RECEIPT_MAX_BYTES = 5 * 1024 * 1024;
const COURSE_CHAPTERS = COURSE_MODULES.flatMap(module => module.chapters);
const COURSE_CHAPTERS_BY_ID = new Map(COURSE_CHAPTERS.map(chapter => [chapter.id, chapter]));

type LearnerProgress = {
  completedChapters: string[];
  quizScores: Record<string, { score: number; maxScore: number; date: string }>;
  certificateId: string | null;
  certificateIssuedAt: string | null;
};

function progressFromRow(row: {
  completed_chapters: string[];
  quiz_scores: LearnerProgress['quizScores'];
  certificate_id: string | null;
  certificate_issued_at: Date | string | null;
}): LearnerProgress {
  return {
    completedChapters: row.completed_chapters || [],
    quizScores: row.quiz_scores || {},
    certificateId: row.certificate_id,
    certificateIssuedAt: row.certificate_issued_at
      ? new Date(row.certificate_issued_at).toISOString()
      : null,
  };
}

function validateProgressInput(input: unknown): LearnerProgress | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  if (!Array.isArray(value.completedChapters) ||
    !value.completedChapters.every(id => typeof id === 'string' && COURSE_CHAPTERS_BY_ID.has(id)) ||
    !value.quizScores || typeof value.quizScores !== 'object' || Array.isArray(value.quizScores)) return null;

  const completedChapters = [...new Set(value.completedChapters as string[])];
  const quizScores: LearnerProgress['quizScores'] = {};
  for (const [chapterId, rawScore] of Object.entries(value.quizScores)) {
    const chapter = COURSE_CHAPTERS_BY_ID.get(chapterId);
    if (!chapter || !rawScore || typeof rawScore !== 'object' || Array.isArray(rawScore)) return null;
    const score = rawScore as Record<string, unknown>;
    if (!Number.isInteger(score.score) || !Number.isInteger(score.maxScore) ||
      score.maxScore !== chapter.quiz.length || (score.score as number) < 0 ||
      (score.score as number) > chapter.quiz.length ||
      typeof score.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(score.date) ||
      Number.isNaN(Date.parse(`${score.date}T00:00:00.000Z`))) return null;
    quizScores[chapterId] = {
      score: score.score as number,
      maxScore: score.maxScore as number,
      date: score.date,
    };
  }

  const certificateId = value.certificateId === null ? null : value.certificateId;
  const certificateIssuedAt = value.certificateIssuedAt === null ? null : value.certificateIssuedAt;
  const validCertificateId = certificateId === null ||
    (typeof certificateId === 'string' && /^ET-IMPEX-\d{4}-[A-F0-9]{8}$/i.test(certificateId));
  const validCertificateDate = certificateIssuedAt === null ||
    (typeof certificateIssuedAt === 'string' && !Number.isNaN(Date.parse(certificateIssuedAt)));
  if (!validCertificateId || !validCertificateDate ||
    (certificateId === null) !== (certificateIssuedAt === null) ||
    (certificateId !== null && completedChapters.length !== COURSE_CHAPTERS.length)) return null;

  return {
    completedChapters,
    quizScores,
    certificateId: certificateId as string | null,
    certificateIssuedAt: certificateIssuedAt as string | null,
  };
}

app.set('trust proxy', 1);
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '32kb' }));
app.use(clerkMiddleware(req => ({
  publishableKey: publishableKeyFromHost(getClerkProxyHost(req) ?? '', process.env.CLERK_PUBLISHABLE_KEY),
})));

type Identity = { userId: string; email: string; name: string; isAdmin: boolean };
async function currentIdentity(req: Request): Promise<Identity | null> {
  const { userId } = getAuth(req);
  if (!userId) return null;
  const user = await clerk.users.getUser(userId);
  const primary = user.emailAddresses.find(item => item.id === user.primaryEmailAddressId);
  const email = primary?.verification?.status === 'verified'
    ? primary.emailAddress.toLowerCase()
    : '';
  return {
    userId,
    email,
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || email,
    isAdmin: email === ADMIN_EMAIL,
  };
}

async function requireIdentity(req: Request, res: Response, next: NextFunction) {
  try {
    const identity = await currentIdentity(req);
    if (!identity) return res.status(401).json({ error: 'Sign in to continue.' });
    res.locals.identity = identity;
    next();
  } catch (error) {
    console.error('Could not verify the signed-in user.', error);
    res.status(401).json({ error: 'Your sign-in could not be verified. Please sign in again.' });
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!(res.locals.identity as Identity | undefined)?.isAdmin) {
    return res.status(403).json({ error: 'Administrator access required.' });
  }
  next();
}

function requireSameOrigin(req: Request, res: Response, next: NextFunction) {
  const origin = req.get('origin');
  if (origin) {
    try {
      const expectedHost = getClerkProxyHost(req);
      if (new URL(origin).host !== expectedHost) return res.status(403).json({ error: 'Request origin was not accepted.' });
    } catch {
      return res.status(403).json({ error: 'Request origin was not accepted.' });
    }
  }
  next();
}

app.use('/api', requireIdentity);
app.use('/api', requireSameOrigin);

const receiptUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: RECEIPT_MAX_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => {
    callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype));
  },
});

function sniffReceipt(buffer: Buffer): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png';
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

app.get('/api/me', async (_req, res) => {
  const identity = res.locals.identity as Identity;
  const subscription = await pool.query(
    `SELECT status, expires_at FROM academy_payment_requests
     WHERE clerk_user_id = $1 AND status = 'approved'
     ORDER BY expires_at DESC LIMIT 1`,
    [identity.userId],
  );
  const latest = subscription.rows[0];
  const active = latest?.expires_at && new Date(latest.expires_at).getTime() > Date.now();
  res.json({
    id: identity.userId,
    email: identity.email,
    fullName: identity.name,
    role: identity.isAdmin ? 'admin' : 'user',
    subscriptionStatus: active ? 'active_paid' : latest ? 'expired' : 'free_trial',
    expiresAt: active ? latest.expires_at : null,
    paymentAmount: active ? SUBSCRIPTION_PRICE_ETB : 0,
  });
});

app.get('/api/progress', async (_req, res) => {
  const identity = res.locals.identity as Identity;
  const result = await pool.query(
    `SELECT completed_chapters, quiz_scores, certificate_id, certificate_issued_at
     FROM academy_learner_progress WHERE clerk_user_id = $1`,
    [identity.userId],
  );
  res.setHeader('Cache-Control', 'private, no-store');
  res.json({ progress: result.rows[0] ? progressFromRow(result.rows[0]) : null });
});

// A local import is scoped to the authenticated learner. If two of their devices
// initialize at once, retain both sets of completed chapters while preferring
// values already present in PostgreSQL for quiz attempts and certificate state.
app.put('/api/progress', async (req, res) => {
  const identity = res.locals.identity as Identity;
  const progress = validateProgressInput(req.body);
  if (!progress) return res.status(400).json({ error: 'The saved learning progress is not valid.' });
  await pool.query(
    `INSERT INTO academy_learner_progress
       (clerk_user_id, completed_chapters, quiz_scores, certificate_id, certificate_issued_at)
     VALUES ($1, $2::text[], $3::jsonb, $4, $5::timestamptz)
     ON CONFLICT (clerk_user_id) DO UPDATE SET
       completed_chapters = ARRAY(
         SELECT DISTINCT item.chapter_id
         FROM unnest(academy_learner_progress.completed_chapters || EXCLUDED.completed_chapters) AS item(chapter_id)
       ),
       quiz_scores = EXCLUDED.quiz_scores || academy_learner_progress.quiz_scores,
       certificate_id = COALESCE(academy_learner_progress.certificate_id, EXCLUDED.certificate_id),
       certificate_issued_at = COALESCE(academy_learner_progress.certificate_issued_at, EXCLUDED.certificate_issued_at),
       updated_at = now()`,
    [
      identity.userId,
      progress.completedChapters,
      JSON.stringify(progress.quizScores),
      progress.certificateId,
      progress.certificateIssuedAt,
    ],
  );
  const result = await pool.query(
    `SELECT completed_chapters, quiz_scores, certificate_id, certificate_issued_at
     FROM academy_learner_progress WHERE clerk_user_id = $1`,
    [identity.userId],
  );
  res.setHeader('Cache-Control', 'private, no-store');
  res.json({ progress: progressFromRow(result.rows[0]) });
});

app.patch('/api/progress', async (req, res) => {
  const identity = res.locals.identity as Identity;
  const action = req.body?.action;
  let result;

  if (action === 'chapter') {
    const { chapterId, completed } = req.body;
    if (!COURSE_CHAPTERS_BY_ID.has(chapterId) || typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Choose a valid course chapter and completion state.' });
    }
    result = await pool.query(
      `UPDATE academy_learner_progress
       SET completed_chapters = CASE
         WHEN $2::boolean THEN ARRAY(
           SELECT DISTINCT item.chapter_id
           FROM unnest(completed_chapters || ARRAY[$3]::text[]) AS item(chapter_id)
         )
         ELSE array_remove(completed_chapters, $3)
       END, updated_at = now()
       WHERE clerk_user_id = $1
       RETURNING completed_chapters, quiz_scores, certificate_id, certificate_issued_at`,
      [identity.userId, completed, chapterId],
    );
  } else if (action === 'quiz') {
    const { chapterId, score } = req.body;
    const chapter = COURSE_CHAPTERS_BY_ID.get(chapterId);
    if (!chapter || !Number.isInteger(score) || score < 0 || score > chapter.quiz.length ||
      chapter.quiz.length < 1) {
      return res.status(400).json({ error: 'The quiz result is not valid for this chapter.' });
    }
    const date = new Date().toISOString().slice(0, 10);
    result = await pool.query(
      `UPDATE academy_learner_progress
       SET completed_chapters = CASE WHEN $4::boolean THEN ARRAY(
             SELECT DISTINCT item.chapter_id
             FROM unnest(completed_chapters || ARRAY[$5]::text[]) AS item(chapter_id)
           ) ELSE completed_chapters END,
           quiz_scores = jsonb_set(
             quiz_scores, ARRAY[$2::text],
             jsonb_build_object('score', $3::integer, 'maxScore', $6::integer, 'date', $7::text),
             true
           ),
           updated_at = now()
       WHERE clerk_user_id = $1
       RETURNING completed_chapters, quiz_scores, certificate_id, certificate_issued_at`,
      [identity.userId, chapterId, score, score / chapter.quiz.length >= 0.6, chapterId, chapter.quiz.length, date],
    );
  } else if (action === 'certificate') {
    const certificateId = `ET-IMPEX-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
    result = await pool.query(
      `UPDATE academy_learner_progress
       SET certificate_id = COALESCE(certificate_id, $2),
           certificate_issued_at = COALESCE(certificate_issued_at, now()),
           updated_at = now()
       WHERE clerk_user_id = $1 AND cardinality(completed_chapters) = $3
       RETURNING completed_chapters, quiz_scores, certificate_id, certificate_issued_at`,
      [identity.userId, certificateId, COURSE_CHAPTERS.length],
    );
    if (!result.rowCount) {
      return res.status(409).json({ error: 'Complete every course chapter before issuing a course record.' });
    }
  } else {
    return res.status(400).json({ error: 'Choose a valid progress update.' });
  }

  if (!result.rowCount) return res.status(404).json({ error: 'Your saved progress could not be found. Refresh and try again.' });
  res.setHeader('Cache-Control', 'private, no-store');
  res.json({ progress: progressFromRow(result.rows[0]) });
});

app.get('/api/payment-settings', async (_req, res) => {
  const result = await pool.query(
    'SELECT telebirr_account_name, telebirr_account_number FROM academy_payment_settings WHERE id = 1',
  );
  res.json({
    priceEtb: SUBSCRIPTION_PRICE_ETB,
    accountName: result.rows[0]?.telebirr_account_name || '',
    accountNumber: result.rows[0]?.telebirr_account_number || '',
  });
});

app.get('/api/payment-requests', async (_req, res) => {
  const identity = res.locals.identity as Identity;
  const result = identity.isAdmin
    ? await pool.query(`SELECT id, learner_email, amount_etb, telebirr_reference, status, submitted_at, reviewed_at, expires_at, rejection_reason FROM academy_payment_requests ORDER BY submitted_at DESC LIMIT 300`)
    : await pool.query(`SELECT id, amount_etb, telebirr_reference, status, submitted_at, reviewed_at, expires_at, rejection_reason FROM academy_payment_requests WHERE clerk_user_id = $1 ORDER BY submitted_at DESC LIMIT 25`, [identity.userId]);
  res.json({ requests: result.rows });
});

app.post('/api/payment-requests', receiptUpload.single('screenshot'), async (req, res) => {
  const identity = res.locals.identity as Identity;
  if (identity.isAdmin) return res.status(400).json({ error: 'Administrators do not need a learner subscription.' });
  if (!req.file || !req.body?.telebirrReference?.trim()) {
    return res.status(400).json({ error: 'Add the Telebirr reference and a screenshot to continue.' });
  }
  if (Number(req.body.amountEtb) !== SUBSCRIPTION_PRICE_ETB) {
    return res.status(400).json({ error: `Subscription requests must be ${SUBSCRIPTION_PRICE_ETB} ETB.` });
  }
  const actualMime = sniffReceipt(req.file.buffer);
  if (!actualMime || actualMime !== req.file.mimetype) {
    return res.status(400).json({ error: 'Upload a valid JPG, PNG, or WebP receipt image.' });
  }
  if (!/^[a-zA-Z0-9-]{3,80}$/.test(req.body.telebirrReference.trim())) {
    return res.status(400).json({ error: 'The Telebirr reference can contain letters, numbers, and dashes.' });
  }
  const settings = await pool.query('SELECT telebirr_account_number FROM academy_payment_settings WHERE id = 1');
  if (!settings.rows[0]?.telebirr_account_number) {
    return res.status(409).json({ error: 'Telebirr payment details are not set up yet. Please check back later.' });
  }
  const pending = await pool.query(
    `SELECT id FROM academy_payment_requests WHERE clerk_user_id = $1 AND status = 'pending' LIMIT 1`,
    [identity.userId],
  );
  if (pending.rowCount) return res.status(409).json({ error: 'You already have a payment request waiting for review.' });
  const result = await pool.query(
    `INSERT INTO academy_payment_requests
      (clerk_user_id, learner_email, amount_etb, telebirr_reference, screenshot_mime, screenshot_data)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, amount_etb, telebirr_reference, status, submitted_at`,
    [identity.userId, identity.email, SUBSCRIPTION_PRICE_ETB, req.body.telebirrReference.trim(), actualMime, req.file.buffer],
  );
  res.status(201).json({ request: result.rows[0] });
});

app.get('/api/admin/users', requireAdmin, async (_req, res) => {
  const users = await clerk.users.getUserList({ limit: 200 });
  const rows = await Promise.all(users.data.map(async user => {
    const primary = user.emailAddresses.find(item => item.id === user.primaryEmailAddressId);
    const latest = await pool.query(
      `SELECT status, expires_at FROM academy_payment_requests WHERE clerk_user_id = $1 ORDER BY submitted_at DESC LIMIT 1`,
      [user.id],
    );
    const latestStatus = latest.rows[0]?.status === 'approved'
      && latest.rows[0]?.expires_at
      && new Date(latest.rows[0].expires_at).getTime() <= Date.now()
      ? 'expired'
      : latest.rows[0]?.status || 'free_trial';
    return {
      id: user.id,
      email: primary?.emailAddress || '',
      name: [user.firstName, user.lastName].filter(Boolean).join(' ') || primary?.emailAddress || 'Learner',
      role: primary?.emailAddress.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user',
      subscriptionStatus: latestStatus,
      expiresAt: latest.rows[0]?.expires_at || null,
    };
  }));
  res.json({ users: rows });
});

app.get('/api/admin/payment-settings', requireAdmin, async (_req, res) => {
  const result = await pool.query('SELECT telebirr_account_name, telebirr_account_number FROM academy_payment_settings WHERE id = 1');
  res.json({ accountName: result.rows[0]?.telebirr_account_name || '', accountNumber: result.rows[0]?.telebirr_account_number || '' });
});

app.put('/api/admin/payment-settings', requireAdmin, async (req, res) => {
  const name = String(req.body?.accountName || '').trim();
  const number = String(req.body?.accountNumber || '').replace(/\s/g, '');
  if (name.length < 2 || name.length > 100 || !/^\+?[0-9]{9,15}$/.test(number)) {
    return res.status(400).json({ error: 'Enter the Telebirr account name and a valid number.' });
  }
  await pool.query(
    `UPDATE academy_payment_settings SET telebirr_account_name = $1, telebirr_account_number = $2, updated_at = now() WHERE id = 1`,
    [name, number],
  );
  res.json({ success: true });
});

app.get('/api/admin/payment-requests/:id/screenshot', requireAdmin, async (req, res) => {
  const result = await pool.query(
    'SELECT screenshot_mime, screenshot_data FROM academy_payment_requests WHERE id = $1',
    [req.params.id],
  );
  if (!result.rowCount) return res.status(404).json({ error: 'Receipt not found.' });
  res.setHeader('Cache-Control', 'private, no-store');
  res.type(result.rows[0].screenshot_mime).send(result.rows[0].screenshot_data);
});

app.post('/api/admin/payment-requests/:id/review', requireAdmin, async (req, res) => {
  const identity = res.locals.identity as Identity;
  const action = req.body?.action;
  const reason = String(req.body?.reason || '').trim().slice(0, 500);
  if (!['approved', 'rejected'].includes(action)) return res.status(400).json({ error: 'Choose approve or reject.' });
  if (action === 'rejected' && !reason) return res.status(400).json({ error: 'Enter a short reason so the learner can correct the request.' });
  const result = await pool.query(
    `UPDATE academy_payment_requests SET
      status = $1, reviewed_at = now(), reviewed_by = $2,
      expires_at = CASE WHEN $1 = 'approved' THEN GREATEST(now(), COALESCE(expires_at, now())) + interval '30 days' ELSE NULL END,
      rejection_reason = CASE WHEN $1 = 'rejected' THEN $3 ELSE NULL END
     WHERE id = $4 AND status = 'pending'
     RETURNING id, status, reviewed_at, expires_at, rejection_reason`,
    [action, identity.email, reason, req.params.id],
  );
  if (!result.rowCount) return res.status(404).json({ error: 'This request was already reviewed or no longer exists.' });
  res.json({ request: result.rows[0] });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Receipt images must be smaller than 5 MB.' });
  }
  console.error('Request failed.', error);
  res.status(500).json({ error: 'The request could not be completed. Try again later.' });
});

async function start() {
  if (!process.env.DATABASE_URL || !process.env.CLERK_SECRET_KEY) {
    throw new Error('Database and authentication setup are required to start the academy.');
  }
  await pool.query('SELECT 1');
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const { default: path } = await import('node:path');
    app.use(express.static(path.resolve(import.meta.dirname, '../dist')));
    app.get('*', (_req, res) => res.sendFile(path.resolve(import.meta.dirname, '../dist/index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`Academy server listening on ${PORT}`));
}

start().catch(error => {
  console.error('Academy server could not start.', error);
  process.exit(1);
});
