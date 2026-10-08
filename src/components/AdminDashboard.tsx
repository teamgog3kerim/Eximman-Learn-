import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, SubscriptionStatus } from '../types';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Smartphone,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    adminApproveUser,
    adminRejectUser,
    adminExtendUser,
    switchUser,
    registerUser,
    currentUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProofUser, setSelectedProofUser] = useState<UserProfile | null>(null);

  // Manual User Creation Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPlan, setNewPlan] = useState<'paid' | 'free'>('paid');

  // Metrics
  const totalUsers = users.filter(u => u.role !== 'admin').length;
  const pendingUsers = users.filter(u => u.subscriptionStatus === 'pending_approval');
  const activePaidUsers = users.filter(u => u.subscriptionStatus === 'active_paid' && u.role !== 'admin');
  const totalRevenueETB = users.filter(u => u.subscriptionStatus === 'active_paid' && u.role !== 'admin').length * 3900;

  // Filtered users
  const filteredUsers = users
    .filter(u => u.role !== 'admin')
    .filter(u => {
      if (statusFilter === 'all') return true;
      return u.subscriptionStatus === statusFilter;
    })
    .filter(u => {
      const q = searchQuery.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.phoneNumber.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.telebirrTxId && u.telebirrTxId.toLowerCase().includes(q))
      );
    });

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = registerUser({
      fullName: newFullName,
      phoneNumber: newPhone,
      email: newEmail,
      isPaid: newPlan === 'paid',
      telebirrTxId: newPlan === 'paid' ? `TB-${Date.now().toString().slice(-8)}` : undefined
    });

    if (newPlan === 'paid') {
      adminApproveUser(newUser.id, 30);
    }

    setNewFullName('');
    setNewPhone('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const formatETB = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const getDaysLeft = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Control Dashboard</span>
            <span>·</span>
            <span>Abdulkerim (0967684490)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif-title font-bold text-neutral-900 dark:text-neutral-50 mt-1">
            Subscription Approvals & Student Management
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Review student registrations, verify Telebirr 3,900 ETB payments to 0967684490, grant 30-day access, or extend subscriptions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Enrolled</span>
          <div className="text-2xl md:text-3xl font-bold font-mono-numbers text-neutral-900 dark:text-neutral-100 mt-1">
            {totalUsers}
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">Active & Trial Students</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-amber-300 dark:border-amber-800 rounded-2xl p-5 shadow-xs bg-amber-50/20">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-400">Pending Telebirr Approvals</span>
          <div className="text-2xl md:text-3xl font-bold font-mono-numbers text-amber-700 dark:text-amber-400 mt-1">
            {pendingUsers.length}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block">
            {pendingUsers.length > 0 ? 'Requires your approval' : 'All requests processed'}
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Active Paid (30 Days)</span>
          <div className="text-2xl md:text-3xl font-bold font-mono-numbers text-emerald-600 dark:text-emerald-400 mt-1">
            {activePaidUsers.length}
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">Full Academy Access</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Telebirr Revenue</span>
          <div className="text-2xl md:text-3xl font-bold font-mono-numbers text-neutral-900 dark:text-neutral-100 mt-1">
            {formatETB(totalRevenueETB)} <span className="text-sm font-sans font-normal text-neutral-500">ETB</span>
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">@ 3,900 ETB / student</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, 09 phone, gmail..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Students' },
            { id: 'pending_approval', label: `Pending (${pendingUsers.length})` },
            { id: 'active_paid', label: `Active (${activePaidUsers.length})` },
            { id: 'free_trial', label: 'Free Trial' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === f.id
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 font-semibold">
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Subscription Status</th>
                <th className="py-3 px-4">Telebirr Proof</th>
                <th className="py-3 px-4">Access Period</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No students match the current search and filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const daysLeft = getDaysLeft(user.expiresAt);
                  const isCurrentImpersonated = currentUser.id === user.id;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors ${
                        user.subscriptionStatus === 'pending_approval'
                          ? 'bg-amber-50/40 dark:bg-amber-950/20'
                          : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900 dark:text-neutral-100">
                          {user.fullName}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          Registered: {new Date(user.registeredAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                          <Smartphone className="w-3 h-3 text-neutral-400" />
                          <span>{user.phoneNumber}</span>
                        </div>
                        <div className="text-neutral-500 font-sans text-[11px] flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-neutral-400" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {user.subscriptionStatus === 'pending_approval' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>Pending (3,900 ETB)</span>
                          </span>
                        )}
                        {user.subscriptionStatus === 'active_paid' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active (Paid)</span>
                          </span>
                        )}
                        {user.subscriptionStatus === 'free_trial' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                            <span>Free Trial (Mod 1)</span>
                          </span>
                        )}
                        {user.subscriptionStatus === 'rejected' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" />
                            <span>Declined</span>
                          </span>
                        )}
                      </td>

                      {/* Proof */}
                      <td className="py-3.5 px-4 font-mono">
                        {user.telebirrTxId ? (
                          <div>
                            <span className="text-neutral-800 dark:text-neutral-200 font-semibold block">
                              {user.telebirrTxId}
                            </span>
                            {user.paymentScreenshot ? (
                              <button
                                onClick={() => setSelectedProofUser(user)}
                                className="text-[11px] text-amber-700 dark:text-amber-400 font-sans font-medium hover:underline flex items-center gap-1 mt-0.5"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Receipt Screenshot</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-neutral-400 font-sans">
                                Transfer to 0967684490
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-400 font-sans text-[11px]">No payment proof</span>
                        )}
                      </td>

                      {/* Period */}
                      <td className="py-3.5 px-4">
                        {user.subscriptionStatus === 'active_paid' && daysLeft !== null ? (
                          <div>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                              {daysLeft} Days Left
                            </span>
                            <span className="text-[10px] text-neutral-400 block font-mono">
                              Exp: {new Date(user.expiresAt!).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">Not active</span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {user.subscriptionStatus === 'pending_approval' && (
                            <>
                              <button
                                onClick={() => adminApproveUser(user.id, 30)}
                                className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] transition-colors"
                              >
                                Approve 30 Days
                              </button>
                              <button
                                onClick={() => adminRejectUser(user.id)}
                                className="px-2 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-rose-600 rounded-lg font-medium text-[11px] transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {user.subscriptionStatus === 'active_paid' && (
                            <button
                              onClick={() => adminExtendUser(user.id, 30)}
                              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-600" />
                              <span>Extend +30D</span>
                            </button>
                          )}

                          {user.subscriptionStatus === 'free_trial' && (
                            <button
                              onClick={() => adminApproveUser(user.id, 30)}
                              className="px-2.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold text-[11px] transition-colors"
                            >
                              Upgrade to Paid
                            </button>
                          )}

                          {/* Impersonate button to test perspective */}
                          <button
                            onClick={() => switchUser(user.id)}
                            title="Test app as this user"
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-mono border transition-colors ${
                              isCurrentImpersonated
                                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                                : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                            }`}
                          >
                            {isCurrentImpersonated ? 'Active Session' : 'Login As'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Proof Modal */}
      {selectedProofUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="font-serif-title font-bold text-lg text-neutral-900 dark:text-neutral-100">
                  Payment Verification Receipt
                </h3>
                <span className="text-xs text-neutral-500">
                  {selectedProofUser.fullName} · {selectedProofUser.phoneNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedProofUser(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-2 max-h-80 overflow-y-auto text-center">
              {selectedProofUser.paymentScreenshot ? (
                <img
                  src={selectedProofUser.paymentScreenshot}
                  alt="Receipt"
                  className="max-h-72 mx-auto rounded-lg object-contain shadow-xs"
                />
              ) : (
                <div className="p-8 text-neutral-400 text-xs">
                  No image attached. Verified via SMS code: {selectedProofUser.telebirrTxId}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                Amount: 3,900 ETB
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    adminApproveUser(selectedProofUser.id, 30);
                    setSelectedProofUser(null);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Confirm & Approve 30 Days
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="font-serif-title font-bold text-lg text-neutral-900 dark:text-neutral-100">
                Manual Student Enrollment
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  placeholder="e.g. Almaz Tadesse"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="0911000000"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Gmail Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="almaz@gmail.com"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Initial Plan
                </label>
                <select
                  value={newPlan}
                  onChange={e => setNewPlan(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-xl"
                >
                  <option value="paid">Paid 30 Days (Instant Approval)</option>
                  <option value="free">Free Trial (Module 1 Only)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl"
                >
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
