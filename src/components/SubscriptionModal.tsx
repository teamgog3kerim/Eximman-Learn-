import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, ShieldCheck, Upload, AlertCircle, Smartphone, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, submitPayment, registerUser } = useApp();

  const [mode, setMode] = useState<'existing_upgrade' | 'new_register'>(
    currentUser.subscriptionStatus === 'free_trial' ? 'existing_upgrade' : 'new_register'
  );

  // Form fields
  const [fullName, setFullName] = useState<string>(currentUser.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser.phoneNumber || '');
  const [email, setEmail] = useState<string>(currentUser.email || '');
  const [telebirrTxId, setTelebirrTxId] = useState<string>('');
  const [selectedProofType, setSelectedProofType] = useState<string>('uploaded_receipt');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'new_register') {
      registerUser({
        fullName,
        phoneNumber,
        email,
        isPaid: true,
        telebirrTxId: telebirrTxId || `TB-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        paymentScreenshot: previewImage || undefined
      });
    } else {
      submitPayment(
        telebirrTxId || `TB-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        previewImage || undefined
      );
    }

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-xl w-full p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>30-Day Masterclass Registration</span>
              </div>
              <h2 className="text-2xl font-serif-title font-bold text-neutral-900 dark:text-neutral-50 mt-1">
                Unlock Complete Academy Access
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                Follow the official Telebirr payment instructions below to activate your 30-day course and financial calculator subscription.
              </p>
            </div>

            {/* Official Telebirr Payment Card */}
            <div className="bg-amber-950 text-white rounded-2xl p-5 border border-amber-800/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-amber-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xs">
                    TB
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Official Telebirr Account</span>
                    <span className="text-[11px] text-amber-300">Ethiopian Trade & Logistics Academy</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">Fee</span>
                  <span className="text-lg font-bold font-mono-numbers text-white">3,900 ETB</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                  <span className="text-amber-300/80 text-[11px] block">Recipient Phone Number</span>
                  <span className="text-base font-bold font-mono-numbers text-white tracking-wider">
                    0967684490
                  </span>
                </div>

                <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                  <span className="text-amber-300/80 text-[11px] block">Registered Account Name</span>
                  <span className="text-base font-bold text-white">
                    Abdulkerim
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-amber-200/90 leading-relaxed bg-amber-900/40 p-3 rounded-xl border border-amber-700/50">
                <strong>Step 1:</strong> Open your Telebirr App (or dial *127#) and transfer <strong>3,900 Birr</strong> to <strong>0967684490 (Abdulkerim)</strong>.<br />
                <strong>Step 2:</strong> Copy the Transaction ID or take a screenshot of the Telebirr confirmation SMS/receipt and attach it below.
              </div>
            </div>

            {/* Registration / Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Dawit Bekele"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Mobile Number (Telebirr phone) *
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
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Telebirr Transaction Reference ID
                </label>
                <input
                  type="text"
                  value={telebirrTxId}
                  onChange={e => setTelebirrTxId(e.target.value)}
                  placeholder="e.g. TB-8931298412 or 7HG82JK9"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* Upload Screenshot */}
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Attach Telebirr Payment Screenshot
                </label>
                <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 text-center hover:border-amber-500 dark:hover:border-amber-400 transition-colors">
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
                        className="text-[11px] text-rose-600 dark:text-rose-400 font-medium hover:underline"
                      >
                        Remove and re-upload screenshot
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">
                        Upload Transfer Screenshot / Receipt
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        PNG, JPG, or PDF snapshot from your phone
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

              <button
                type="submit"
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Request Course Registration Approval</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Payment Request Received
              </span>
              <h3 className="text-2xl font-serif-title font-bold text-neutral-900 dark:text-neutral-50 mt-1">
                Your Registration is Pending Approval
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Admin <strong>Abdulkerim</strong> has received your Telebirr payment confirmation. Once approved in the admin portal, your account will be activated with <strong>30 days of full academy access</strong>.
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl max-w-sm mx-auto text-left text-xs space-y-1.5 border border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between">
                <span className="text-neutral-500">Applicant:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Phone:</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-100">{phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Gmail:</span>
                <span className="text-neutral-900 dark:text-neutral-100">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Amount:</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">3,900 ETB</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
            >
              Back to Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
