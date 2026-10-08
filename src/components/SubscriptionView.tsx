import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ShieldCheck, Clock, Sparkles, Smartphone, ArrowRight, Upload, UserPlus, RefreshCw } from 'lucide-react';

export const SubscriptionView: React.FC = () => {
  const {
    currentUser,
    registerUser,
    submitPayment,
    hasFullAccess,
    setShowPaywallModal
  } = useApp();

  // Registration & Payment state
  const [fullName, setFullName] = useState<string>(currentUser.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser.phoneNumber || '');
  const [email, setEmail] = useState<string>(currentUser.email || '');
  const [planType, setPlanType] = useState<'free_trial' | 'paid_30_days'>('paid_30_days');
  const [telebirrTxId, setTelebirrTxId] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterOrPay = (e: React.FormEvent) => {
    e.preventDefault();

    if (planType === 'free_trial') {
      registerUser({
        fullName,
        phoneNumber,
        email,
        isPaid: false
      });
      setNotificationMsg('Free Trial activated! You can now explore Module 1, Chapters 1 & 2 freely.');
    } else {
      registerUser({
        fullName,
        phoneNumber,
        email,
        isPaid: true,
        telebirrTxId: telebirrTxId || `TB-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        paymentScreenshot: previewImage || undefined
      });
      setNotificationMsg('Paid registration request submitted for 3,900 Birr! Admin Abdulkerim has been notified for approval.');
    }
  };

  // Remaining days calculation
  const getDaysRemaining = () => {
    if (!currentUser.expiresAt) return 0;
    const diff = new Date(currentUser.expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          <span>Membership & Pricing</span>
          <span>·</span>
          <span>Telebirr Integrated</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif-title font-bold text-neutral-900 dark:text-neutral-50">
          Ethiopian Import & Export Academy Plans
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
          Start with our free trial or activate the complete 30-day masterclass with live interactive calculators, NBE compliance guides, and corridor logistics templates.
        </p>
      </div>

      {notificationMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notificationMsg}</span>
        </div>
      )}

      {/* Current User Status Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Current Account Status
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {currentUser.fullName}
            </h3>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
              currentUser.subscriptionStatus === 'active_paid'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : currentUser.subscriptionStatus === 'pending_approval'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
            }`}>
              {currentUser.subscriptionStatus === 'active_paid'
                ? 'Active 30-Day Subscription'
                : currentUser.subscriptionStatus === 'pending_approval'
                ? 'Pending Admin Approval'
                : 'Free Trial (Module 1 Only)'}
            </span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-3">
            <span>Phone: {currentUser.phoneNumber}</span>
            <span>·</span>
            <span>Gmail: {currentUser.email}</span>
          </div>
        </div>

        {currentUser.subscriptionStatus === 'active_paid' && (
          <div className="text-right">
            <span className="text-xs text-neutral-400 block">Time Remaining</span>
            <span className="text-2xl font-bold font-mono-numbers text-emerald-600 dark:text-emerald-400">
              {getDaysRemaining()} Days Left
            </span>
            <span className="text-[11px] text-neutral-500 block">
              Expires: {new Date(currentUser.expiresAt!).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Plan Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Trial Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Evaluation Tier
              </span>
              <h3 className="text-xl font-serif-title font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                Free Trial Access
              </h3>
              <div className="text-2xl font-bold font-mono-numbers text-neutral-900 dark:text-neutral-100 mt-2">
                0 ETB <span className="text-xs font-normal text-neutral-400 font-sans">/ Forever</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Ideal for evaluating the platform and learning fundamental trade laws.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Access to <strong>Module 1: Chapter 1 & Chapter 2</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Trade licensing & NBE regulatory overview</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sample interactive chapter questionnaires</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400 line-through">
                <span>Modules 2 through 6 (LCs, Corridor, Customs, Landed Cost)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400 line-through">
                <span>Partial vs Full Shipment L/C Calculator</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setPlanType('free_trial');
              window.scrollTo({ top: 600, behavior: 'smooth' });
            }}
            className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-xl transition-colors"
          >
            Register on Free Trial
          </button>
        </div>

        {/* 30-Day Paid Masterclass Card */}
        <div className="bg-amber-950 text-white border-2 border-amber-600 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-amber-500 text-neutral-950 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
            Recommended
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Full Academy Pass
              </span>
              <h3 className="text-xl font-serif-title font-bold text-white mt-1">
                30-Day Professional Subscription
              </h3>
              <div className="text-3xl font-bold font-mono-numbers text-white mt-2">
                3,900 ETB <span className="text-xs font-normal text-amber-200 font-sans">/ 30 Days</span>
              </div>
              <p className="text-xs text-amber-200/80 mt-1">
                Payable via Telebirr to 0967684490 (Abdulkerim). Renewable every 30 days.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-200 pt-3 border-t border-amber-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>All <strong>6 Modules & 12 In-Depth Chapters</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>LC & Freight Calculator:</strong> Case 1 Full & Case 2 Partial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Customs Tax Assessment Calculator:</strong> Codes 01 to 16 with print notice</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Dump Truck Landed Cost Matrix:</strong> 204.49 ETB/USD modeling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Certificate of Masterclass Completion</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setPlanType('paid_30_days');
              window.scrollTo({ top: 600, behavior: 'smooth' });
            }}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Activate 30-Day Access (3,900 ETB)
          </button>
        </div>
      </div>

      {/* Telebirr Registration & Payment Form */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-serif-title font-bold text-neutral-900 dark:text-neutral-50">
            Registration & Payment Submission Form
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Fill your details and submit your Telebirr payment proof to request course activation from admin Abdulkerim.
          </p>
        </div>

        <form onSubmit={handleRegisterOrPay} className="space-y-5 text-xs">
          {/* Plan Choice Selector */}
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Select Registration Plan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between ${
                  planType === 'paid_30_days'
                    ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30'
                    : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="plan"
                    value="paid_30_days"
                    checked={planType === 'paid_30_days'}
                    onChange={() => setPlanType('paid_30_days')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                      Paid Masterclass (3,900 ETB)
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Full 30-day access to all courses & tools
                    </span>
                  </div>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between ${
                  planType === 'free_trial'
                    ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30'
                    : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="plan"
                    value="free_trial"
                    checked={planType === 'free_trial'}
                    onChange={() => setPlanType('free_trial')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                      Free Trial (0 ETB)
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Module 1, Chapters 1 & 2 only
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Solomon Girma"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="e.g. 0911223344"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Gmail Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. solomon@gmail.com"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>

          {planType === 'paid_30_days' && (
            <div className="space-y-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              {/* Telebirr Payment Instructions Box */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                    Telebirr Transfer Details
                  </span>
                  <div className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5">
                    Send <strong>3,900 ETB</strong> to Telebirr Number: <strong>0967684490</strong> (Name: <strong>Abdulkerim</strong>)
                  </div>
                </div>
                <div className="font-mono font-bold text-base text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/60 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700">
                  0967684490
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Telebirr Transaction Number (Reference ID)
                </label>
                <input
                  type="text"
                  value={telebirrTxId}
                  onChange={e => setTelebirrTxId(e.target.value)}
                  placeholder="e.g. TB-9923841920 or SMS Reference code"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Upload Payment Screenshot / Transfer Confirmation
                </label>
                <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 text-center hover:border-amber-500 transition-colors">
                  {previewImage ? (
                    <div className="space-y-2">
                      <img
                        src={previewImage}
                        alt="Telebirr Payment Receipt"
                        className="max-h-40 mx-auto rounded-lg object-contain shadow-xs border"
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewImage(null)}
                        className="text-[11px] text-rose-600 font-medium hover:underline"
                      >
                        Remove file and re-upload
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">
                        Click to upload Telebirr receipt image
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        PNG, JPG or Screenshot from your phone
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
          >
            {planType === 'paid_30_days'
              ? 'Submit Payment & Request 30-Day Course Approval'
              : 'Register for Free Trial (Module 1)'}
          </button>
        </form>
      </div>
    </div>
  );
};
