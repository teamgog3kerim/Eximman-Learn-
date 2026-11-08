import React, { useCallback, useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

type RequestRow = {
  id: string; learner_email?: string; amount_etb: number; transaction_reference: string;
  payment_method: 'telebirr' | 'cbe';
  status: 'pending' | 'approved' | 'rejected'; submitted_at: string; expires_at?: string;
  rejection_reason?: string;
};

const fieldClass = 'min-h-11 w-full rounded-xl border academy-line academy-paper px-3 text-sm outline-none focus:ring-2 focus:ring-[#176b60]';
const buttonClass = 'inline-flex min-h-10 items-center justify-center rounded-xl bg-[#176b60] px-4 text-sm font-bold text-white transition hover:bg-[#14594f] disabled:cursor-not-allowed disabled:opacity-50';

export const PaymentWorkspace: React.FC<{ adminMode?: boolean }> = ({ adminMode = false }) => {
  const { currentUser } = useApp();
  const { t } = useLanguage();
  const [account, setAccount] = useState({ telebirrAccountName: '', telebirrAccountNumber: '', cbeAccountNumber: '' });
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [users, setUsers] = useState<{ id: string; email: string; name: string; role: string; subscriptionStatus: string; expiresAt?: string }[]>([]);
  const [reference, setReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe'>('telebirr');
  const [copiedAccount, setCopiedAccount] = useState<'telebirr' | 'cbe' | null>(null);
  const [reason, setReason] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const [settingsResponse, requestResponse] = await Promise.all([
        fetch(adminMode ? '/api/admin/payment-settings' : '/api/payment-settings'),
        fetch('/api/payment-requests'),
      ]);
      if (!settingsResponse.ok || !requestResponse.ok) throw new Error('Unable to load subscription information.');
      setAccount(await settingsResponse.json());
      setRequests((await requestResponse.json()).requests);
      if (adminMode) {
        const response = await fetch('/api/admin/users');
        if (!response.ok) throw new Error('Unable to load the learner list.');
        setUsers((await response.json()).users);
      }
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Unable to load information.');
    }
  }, [adminMode]);

  useEffect(() => { void load(); }, [load]);

  const copyAccountNumber = async (method: 'telebirr' | 'cbe', number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setError('');
      setCopiedAccount(method);
      window.setTimeout(() => setCopiedAccount(current => current === method ? null : current), 1800);
    } catch {
      setError('Could not copy the account number. Please select and copy it manually.');
    }
  };

  const review = async (id: string, action: 'approved' | 'rejected') => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/payment-requests/${id}/review`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason: reason[id] || '' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Review could not be saved.');
      setMessage(action === 'approved' ? 'Payment approved. Access is active for 30 days.' : 'Payment request rejected.');
      await load();
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Review could not be saved.');
    } finally { setBusy(false); }
  };

  if (adminMode) {
    const saveAccount = async (event: React.FormEvent) => {
      event.preventDefault();
      setBusy(true);
      setError('');
      try {
        const response = await fetch('/api/admin/payment-settings', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(account),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not save payment details.');
        setMessage('Payment details saved.');
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2500);
      } catch (value) {
        setError(value instanceof Error ? value.message : 'Could not save settings.');
      } finally { setBusy(false); }
    };

    return (
      <section className="mx-auto max-w-6xl space-y-8">
        <header><p className="text-xs font-bold uppercase tracking-[.16em] academy-brand">Academy administration</p><h1 className="mt-1 font-serif-title text-3xl font-bold">Learners & subscription requests</h1><p className="mt-2 text-sm academy-muted">Only the verified main admin account can change payment recipients or approve access from transaction references.</p></header>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {message && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-900">{message}</p>}
        <form onSubmit={saveAccount} className="academy-card grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <label className="block text-xs font-bold">Telebirr account name<input maxLength={100} className={`${fieldClass} mt-1.5`} value={account.telebirrAccountName} onChange={event => setAccount({ ...account, telebirrAccountName: event.target.value })} /></label>
          <label className="block text-xs font-bold">Telebirr number<input type="tel" maxLength={30} className={`${fieldClass} mt-1.5`} value={account.telebirrAccountNumber} onChange={event => setAccount({ ...account, telebirrAccountNumber: event.target.value })} /></label>
          <label className="block text-xs font-bold">CBE account number<input required inputMode="numeric" pattern="[0-9]{8,20}" maxLength={20} className={`${fieldClass} mt-1.5`} value={account.cbeAccountNumber} onChange={event => setAccount({ ...account, cbeAccountNumber: event.target.value })} /></label>
          <button className={buttonClass} disabled={busy}>{saved ? 'Saved' : 'Save payment details'}</button>
        </form>
        <div className="academy-card overflow-hidden">
          <div className="border-b academy-line p-5"><h2 className="font-serif-title text-xl font-bold">Payment requests</h2><p className="mt-1 text-xs academy-muted">{requests.length} recent requests · verify each transaction reference before approval</p></div>
          <div className="divide-y academy-line">
            {requests.map(item => (
              <article key={item.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,.8fr)]">
                <div><p className="break-all text-sm font-bold">{item.learner_email}</p><p className="mt-1 text-xs academy-muted">{item.amount_etb.toLocaleString()} ETB · {item.payment_method === 'cbe' ? 'CBE' : 'Telebirr'} · reference {item.transaction_reference}</p><p className="mt-1 text-xs academy-muted">Submitted {new Date(item.submitted_at).toLocaleString()}</p><p className="mt-2 text-xs font-bold capitalize">Status: {item.status}{item.expires_at && item.status === 'approved' ? ` · access through ${new Date(item.expires_at).toLocaleDateString()}` : ''}</p>{item.rejection_reason && <p className="mt-1 text-xs text-red-700">Reason: {item.rejection_reason}</p>}</div>
                {item.status === 'pending' ? <div className="space-y-3"><textarea className={`${fieldClass} min-h-20 py-2`} placeholder="Reason if rejecting (required)" value={reason[item.id] || ''} onChange={event => setReason({ ...reason, [item.id]: event.target.value })} /><div className="flex flex-wrap gap-2"><button disabled={busy} className={buttonClass} onClick={() => void review(item.id, 'approved')}>Approve · 30 days</button><button disabled={busy || !reason[item.id]?.trim()} className="min-h-10 rounded-xl border border-red-300 px-4 text-sm font-bold text-red-700 disabled:opacity-50" onClick={() => void review(item.id, 'rejected')}>Reject</button></div></div> : <div /> }
              </article>
            ))}
            {!requests.length && <p className="p-6 text-sm academy-muted">No payment requests yet.</p>}
          </div>
        </div>
        <div className="academy-card overflow-hidden"><div className="border-b academy-line p-5"><h2 className="font-serif-title text-xl font-bold">Learner accounts</h2></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="academy-muted"><tr><th className="p-4">Learner</th><th className="p-4">Email</th><th className="p-4">Subscription</th><th className="p-4">Expires</th></tr></thead><tbody>{users.map(user => <tr key={user.id} className="border-t academy-line"><td className="p-4 font-semibold">{user.name}{user.role === 'admin' && <span className="ml-2 text-xs academy-brand">Admin</span>}</td><td className="p-4">{user.email}</td><td className="p-4 capitalize">{user.subscriptionStatus.replaceAll('_', ' ')}</td><td className="p-4">{user.expiresAt ? new Date(user.expiresAt).toLocaleDateString() : '—'}</td></tr>)}</tbody></table></div></div>
      </section>
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/payment-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountEtb: 3900, paymentMethod, transactionReference: reference }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Payment request could not be submitted.');
      setMessage('Your transaction reference was submitted. The admin will verify it before enabling 30-day access.');
      setReference('');
      await load();
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Payment request could not be submitted.');
    } finally { setBusy(false); }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
        <header><p className="text-xs font-bold uppercase tracking-[.16em] academy-brand">{t('Learner account')}</p><h1 className="mt-1 font-serif-title text-3xl font-bold">{t('Subscription & payment')}</h1><p className="mt-2 text-sm academy-muted">{t('30 days of full course access · 3,900 ETB · verified manually by the academy admin.')}</p></header>
      {currentUser.expiresAt && <p className="rounded-xl bg-green-50 p-3 text-sm text-green-900">Your subscription expires {new Date(currentUser.expiresAt).toLocaleDateString()}.</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-900">{message}</p>}
      <div className="academy-card space-y-5 p-5 sm:p-7">
        <div><h2 className="font-serif-title text-xl font-bold">{t('1. Choose how to pay')}</h2><p className="mt-1 text-sm academy-muted">{t('Send exactly 3,900 ETB, then submit the transaction reference. The admin will verify it and approve 30 days of access.')}</p></div>
        <label className="block text-xs font-bold">{t('Payment method')}
          <select className={`${fieldClass} mt-1.5`} value={paymentMethod} onChange={event => setPaymentMethod(event.target.value as 'telebirr' | 'cbe')}>
            <option value="telebirr">Telebirr</option>
            <option value="cbe">{t('Commercial Bank of Ethiopia (CBE)')}</option>
          </select>
        </label>
        {paymentMethod === 'cbe'
          ? <dl className="rounded-xl bg-[#e6f1ed] p-4 text-sm dark:bg-[#263a35]"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><dt className="text-xs academy-muted">CBE account number</dt><dd className="mt-1 break-all font-bold tracking-wide">{account.cbeAccountNumber || '1000342413904'}</dd></div><button type="button" onClick={() => void copyAccountNumber('cbe', account.cbeAccountNumber || '1000342413904')} aria-label={copiedAccount === 'cbe' ? 'CBE account number copied' : 'Copy CBE account number'} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border academy-line px-3 text-xs font-bold transition hover:bg-white/70 dark:hover:bg-white/10">{copiedAccount === 'cbe' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}<span>{copiedAccount === 'cbe' ? 'Copied' : 'Copy'}</span></button></div></dl>
          : account.telebirrAccountNumber
            ? <dl className="rounded-xl bg-[#e6f1ed] p-4 text-sm dark:bg-[#263a35]"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><dt className="text-xs academy-muted">Telebirr number</dt><dd className="mt-1 break-all font-bold">{account.telebirrAccountNumber}</dd></div><button type="button" onClick={() => void copyAccountNumber('telebirr', account.telebirrAccountNumber)} aria-label={copiedAccount === 'telebirr' ? 'Telebirr number copied' : 'Copy Telebirr number'} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border academy-line px-3 text-xs font-bold transition hover:bg-white/70 dark:hover:bg-white/10">{copiedAccount === 'telebirr' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}<span>{copiedAccount === 'telebirr' ? 'Copied' : 'Copy'}</span></button></div></dl>
            : <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">The admin has not set the Telebirr recipient yet. Choose CBE or check back later.</p>}
         <form onSubmit={submit} className="space-y-4">
           <div><h2 className="font-serif-title text-xl font-bold">{t('2. Submit the transaction reference')}</h2><p className="mt-1 text-sm academy-muted">{t('Enter the reference from your Telebirr or CBE payment confirmation. No screenshot is needed.')}</p></div>
           <label className="block text-xs font-bold">{t('Transaction reference')}<input required maxLength={80} pattern="[a-zA-Z0-9-]{3,80}" className={`${fieldClass} mt-1.5`} value={reference} onChange={event => setReference(event.target.value)} /></label>
           <p className="text-xs academy-muted">{t('Your access starts only after the admin verifies the transaction and approves it.')}</p>
           <button className={buttonClass} disabled={busy || (paymentMethod === 'telebirr' && !account.telebirrAccountNumber) || requests.some(request => request.status === 'pending')}>{busy ? t('Submitting…') : t('Submit for admin review')}</button>
        </form>
      </div>
      <section className="academy-card overflow-hidden"><h2 className="border-b academy-line p-5 font-serif-title text-xl font-bold">{t('Your requests')}</h2><div className="divide-y academy-line">{requests.map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><div><p className="font-bold">{item.amount_etb.toLocaleString()} ETB · {item.payment_method === 'cbe' ? 'CBE' : 'Telebirr'} · {item.transaction_reference}</p><p className="mt-1 text-xs academy-muted">{new Date(item.submitted_at).toLocaleString()}</p></div><span className="rounded-full bg-[#e6f1ed] px-3 py-1 text-xs font-bold capitalize dark:bg-[#263a35]">{item.status}</span>{item.rejection_reason && <p className="w-full text-xs text-red-700">{item.rejection_reason}</p>}</div>)}{!requests.length && <p className="p-5 text-sm academy-muted">{t('No requests submitted yet.')}</p>}</div></section>
    </section>
  );
};
