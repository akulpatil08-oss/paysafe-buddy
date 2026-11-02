import React, { useState } from 'react';
import {
  Users,
  Plus,
  ArrowRight,
  CheckCircle2,
  Receipt,
  Sparkles,
  XCircle,
  IndianRupee,
  ShieldCheck,
  Send,
  UserPlus,
} from 'lucide-react';
import { GroupExpense, GroupMember, GroupWallet, SettlementTransfer } from '../types';
import { calculateSettlements, computeMemberBalances } from '../utils/splitEngine';

interface GroupWalletTabProps {
  groups: GroupWallet[];
  onCreateGroup: (name: string, emoji: string, members: string[]) => void;
  onAddGroupExpense: (groupId: string, expense: Omit<GroupExpense, 'id'>) => void;
  onInitiateMockUpiPayment: (transfer: SettlementTransfer, groupId: string) => void;
  settledTransferKeys: string[];
}

export const GroupWalletTab: React.FC<GroupWalletTabProps> = ({
  groups,
  onCreateGroup,
  onAddGroupExpense,
  onInitiateMockUpiPayment,
  settledTransferKeys,
}) => {
  const [activeGroupId, setActiveGroupId] = useState<string>(groups[0]?.id || 'group-1');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  // New Group state
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupEmoji, setNewGroupEmoji] = useState('🍕');
  const [newGroupMembersText, setNewGroupMembersText] = useState('Rohan Verma, Kabir Mehta, Tanmay');

  // New Shared Expense state
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expPaidBy, setExpPaidBy] = useState('');
  const [expSplitWith, setExpSplitWith] = useState<string[]>([]);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  // Settlements calculation
  const settlements = activeGroup
    ? calculateSettlements(activeGroup.members, activeGroup.expenses, settledTransferKeys)
    : [];

  const memberBalances = activeGroup
    ? computeMemberBalances(activeGroup.members, activeGroup.expenses)
    : {};

  const currentMember = activeGroup?.members.find((m) => m.isCurrentUser);
  const myNetBalance = currentMember ? memberBalances[currentMember.id] || 0 : 0;

  // Initialize modal defaults when opened
  const handleOpenAddExpense = () => {
    if (!activeGroup) return;
    setExpTitle('');
    setExpAmount('');
    setExpPaidBy(activeGroup.members[0]?.id || '');
    setExpSplitWith(activeGroup.members.map((m) => m.id));
    setShowAddExpenseModal(true);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const names = newGroupMembersText
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    onCreateGroup(newGroupName.trim(), newGroupEmoji, names);
    setNewGroupName('');
    setShowCreateGroupModal(false);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(expAmount);
    if (!expTitle.trim() || isNaN(amountVal) || amountVal <= 0 || expSplitWith.length === 0) return;

    onAddGroupExpense(activeGroup.id, {
      title: expTitle.trim(),
      amount: amountVal,
      paidByMemberId: expPaidBy,
      splitBetweenMemberIds: expSplitWith,
      date: new Date().toISOString().split('T')[0],
    });

    setShowAddExpenseModal(false);
  };

  const toggleSplitMember = (memberId: string) => {
    if (expSplitWith.includes(memberId)) {
      if (expSplitWith.length > 1) {
        setExpSplitWith(expSplitWith.filter((id) => id !== memberId));
      }
    } else {
      setExpSplitWith([...expSplitWith, memberId]);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Group Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveGroupId(group.id)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeGroupId === group.id
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
            }`}
          >
            <span>{group.emoji}</span>
            <span>{group.name}</span>
            <span className="text-[11px] opacity-75">({group.members.length})</span>
          </button>
        ))}

        <button
          onClick={() => setShowCreateGroupModal(true)}
          className="px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Group</span>
        </button>
      </div>

      {/* Active Group Overview Card */}
      {activeGroup && (
        <div className="bg-gradient-to-br from-white via-slate-50 to-teal-50/20 dark:from-slate-900 dark:via-[#0a182b] dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeGroup.emoji}</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] dark:text-white">
                  {activeGroup.name}
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{activeGroup.description}</p>
            </div>

            {/* My Personal Net Status */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
                  Your Balance
                </span>
                <span
                  className={`text-lg sm:text-xl font-black tabular-nums font-mono-numbers ${
                    myNetBalance > 1
                      ? 'text-teal-600 dark:text-teal-400'
                      : myNetBalance < -1
                      ? 'text-rose-500 dark:text-rose-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {myNetBalance > 1
                    ? `+₹${Math.round(myNetBalance)} (You get back)`
                    : myNetBalance < -1
                    ? `-₹${Math.abs(Math.round(myNetBalance))} (You owe)`
                    : 'All Settled Up'}
                </span>
              </div>
            </div>
          </div>

          {/* Members Avatars Row */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 font-medium">Roommates:</span>
              {activeGroup.members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 shadow-xs"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: m.avatarColor }}
                  />
                  <span>{m.name}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleOpenAddExpense}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Shared Bill</span>
            </button>
          </div>
        </div>
      )}

      {/* Settle-Up Screen: Minimum Number of Payments Needed */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0B2545] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Optimized UPI Settle-Up</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Algorithm solved minimum transactions needed to clear all group debts
            </p>
          </div>
          <span className="text-xs text-teal-700 dark:text-teal-300 font-bold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50">
            {settlements.filter((s) => !s.settled).length} Pending
          </span>
        </div>

        {settlements.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <CheckCircle2 className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">Everyone is all settled up!</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">No pending debts in this group.</p>
          </div>
        ) : (
          <div className="grid gap-2.5">
            {settlements.map((settlement, idx) => {
              const transferKey = `${settlement.fromMemberId}-${settlement.toMemberId}-${settlement.amount}`;
              const isSettled = settlement.settled || settledTransferKeys.includes(transferKey);

              return (
                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-3 shadow-xs ${
                    isSettled
                      ? 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/50 opacity-60'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-teal-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                      <span className="text-slate-700 dark:text-slate-300">{settlement.fromName}</span>
                      <ArrowRight className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="text-teal-300">{settlement.toName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-left sm:text-right">
                      <span className="text-lg font-black text-white tabular-nums font-mono-numbers">
                        ₹{settlement.amount}
                      </span>
                      <span className="block text-[11px] text-slate-400 font-mono-numbers">
                        UPI: {settlement.toUpiId}
                      </span>
                    </div>

                    {isSettled ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Settled</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onInitiateMockUpiPayment(settlement, activeGroup.id)}
                        className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Settle via UPI</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shared Expenses Activity Feed */}
      {activeGroup && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-400" />
            <span>Group Bill History ({activeGroup.expenses.length})</span>
          </h3>

          <div className="grid gap-2">
            {activeGroup.expenses.map((exp) => {
              const payer = activeGroup.members.find((m) => m.id === exp.paidByMemberId);
              const perPerson = Math.round(exp.amount / exp.splitBetweenMemberIds.length);

              return (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white leading-tight">{exp.title}</h4>
                    <p className="text-slate-400 mt-0.5">
                      Paid by <strong className="text-teal-300">{payer?.name || 'Someone'}</strong> · Split among{' '}
                      {exp.splitBetweenMemberIds.length} members (₹{perPerson}/each) · {exp.date}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-white tabular-nums font-mono-numbers">
                      ₹{exp.amount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Shared Expense Modal */}
      {showAddExpenseModal && activeGroup && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-400" />
                <span>Add Shared Group Bill</span>
              </h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Bill Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Behrouz Biryani feast, Wi-Fi recharge"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Amount (₹):
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 840"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-teal-300 font-bold font-mono-numbers text-sm focus:outline-none focus:border-teal-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Paid By:</label>
                  <select
                    value={expPaidBy}
                    onChange={(e) => setExpPaidBy(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                  >
                    {activeGroup.members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Split Between Members:
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {activeGroup.members.map((m) => {
                    const isChecked = expSplitWith.includes(m.id);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => toggleSplitMember(m.id)}
                        className={`p-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>{m.name}</span>
                        <span>{isChecked ? '✓' : ''}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20"
                >
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                <span>Create Group Wallet</span>
              </h3>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Group Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Mess Committee, Hackathon Team, Wing 4"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Emoji Icon:</label>
                <div className="flex gap-2">
                  {['🏠', '🌴', '🍕', '💻', '🚗', '📚'].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setNewGroupEmoji(emoji)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border cursor-pointer ${
                        newGroupEmoji === emoji
                          ? 'bg-teal-500/20 border-teal-500'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Add Members (Comma-separated names):
                </label>
                <input
                  type="text"
                  value={newGroupMembersText}
                  onChange={(e) => setNewGroupMembersText(e.target.value)}
                  placeholder="Rohan, Kabir, Ananya"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-teal-400"
                  required
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  You (Aryan) are automatically added as the group admin.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
