import { GroupMember, GroupExpense, SettlementTransfer } from '../types';

export interface MemberBalanceSummary {
  memberId: string;
  name: string;
  upiId: string;
  netBalance: number; // positive = owed money, negative = owes money
}

export function computeMemberBalances(
  members: GroupMember[],
  expenses: GroupExpense[]
): Record<string, number> {
  const balances: Record<string, number> = {};

  for (const m of members) {
    balances[m.id] = 0;
  }

  for (const exp of expenses) {
    const amount = Number(exp.amount) || 0;
    if (amount <= 0 || !exp.splitBetweenMemberIds || exp.splitBetweenMemberIds.length === 0) continue;

    // Credit payer
    balances[exp.paidByMemberId] = (balances[exp.paidByMemberId] || 0) + amount;

    // Debit split members
    const perPerson = amount / exp.splitBetweenMemberIds.length;
    for (const memberId of exp.splitBetweenMemberIds) {
      balances[memberId] = (balances[memberId] || 0) - perPerson;
    }
  }

  return balances;
}

export function calculateSettlements(
  members: GroupMember[],
  expenses: GroupExpense[],
  alreadySettledKeys: string[] = []
): SettlementTransfer[] {
  const rawBalances = computeMemberBalances(members, expenses);
  const memberMap = new Map(members.map((m) => [m.id, m]));

  // Separate debtors (< 0) and creditors (> 0)
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  for (const [id, net] of Object.entries(rawBalances)) {
    const rounded = Math.round(net);
    if (rounded < -1) {
      debtors.push({ id, amount: -rounded });
    } else if (rounded > 1) {
      creditors.push({ id, amount: rounded });
    }
  }

  // Sort descending by magnitude
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements: SettlementTransfer[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const transferAmount = Math.min(debtor.amount, creditor.amount);

    if (transferAmount > 0) {
      const fromMember = memberMap.get(debtor.id);
      const toMember = memberMap.get(creditor.id);

      const transferKey = `${debtor.id}-${creditor.id}-${transferAmount}`;
      const isSettled = alreadySettledKeys.includes(transferKey);

      settlements.push({
        fromMemberId: debtor.id,
        fromName: fromMember?.name || 'Member',
        toMemberId: creditor.id,
        toName: toMember?.name || 'Member',
        toUpiId: toMember?.upiId || 'student@upi',
        amount: Math.round(transferAmount),
        settled: isSettled,
      });

      debtor.amount -= transferAmount;
      creditor.amount -= transferAmount;
    }

    if (debtor.amount <= 1) dIdx++;
    if (creditor.amount <= 1) cIdx++;
  }

  return settlements;
}
