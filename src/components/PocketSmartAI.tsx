import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  TrendingUp,
  Sparkles,
  PieChart,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react';

interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
}

const CATEGORIES = [
  'Rent & Housing',
  'Food & Groceries',
  'Dining & Takeout',
  'Utilities & Wifi',
  'Transit & Fuel',
  'Subscriptions & Software',
  'Entertainment & Leisure',
  'Books & Education',
  'Health & Fitness',
  'Personal Care',
  'Savings & Investments',
  'Miscellaneous',
];

export const PocketSmartAI: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [income, setIncome] = useState<number>(2400);
  const [goals, setGoals] = useState('Save $3,000 for emergency fund & reduce unnecessary food delivery');
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', category: 'Rent & Housing', description: 'Apartment share / dorm', amount: 950 },
    { id: '2', category: 'Food & Groceries', description: 'Weekly groceries', amount: 320 },
    { id: '3', category: 'Dining & Takeout', description: 'Cafes & delivery apps', amount: 260 },
    { id: '4', category: 'Utilities & Wifi', description: 'Mobile plan & internet', amount: 85 },
    { id: '5', category: 'Transit & Fuel', description: 'Metro pass / gas', amount: 110 },
    { id: '6', category: 'Subscriptions & Software', description: 'Streaming, AI, music', amount: 65 },
    { id: '7', category: 'Entertainment & Leisure', description: 'Weekend outings', amount: 180 },
  ]);

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netRemaining = income - totalExpenses;

  const addExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        category: 'Food & Groceries',
        description: 'New expense',
        amount: 50,
      },
    ]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const updateExpense = (id: string, field: keyof ExpenseItem, value: any) => {
    setExpenses(
      expenses.map((e) => {
        if (e.id === id) {
          return { ...e, [field]: value };
        }
        return e;
      })
    );
  };

  const loadPreset = (preset: 'student' | 'freelancer') => {
    if (preset === 'student') {
      setIncome(1800);
      setGoals('Save $2,000 for next semester tuition and cut subscription costs');
      setExpenses([
        { id: '1', category: 'Rent & Housing', description: 'Shared student room', amount: 750 },
        { id: '2', category: 'Food & Groceries', description: 'Supermarket essentials', amount: 250 },
        { id: '3', category: 'Dining & Takeout', description: 'Campus takeout & coffee', amount: 190 },
        { id: '4', category: 'Books & Education', description: 'Lab supplies & books', amount: 80 },
        { id: '5', category: 'Subscriptions & Software', description: 'Student Spotify & cloud', amount: 35 },
        { id: '6', category: 'Transit & Fuel', description: 'Monthly student bus pass', amount: 60 },
      ]);
    } else {
      setIncome(4200);
      setGoals('Max out retirement savings and save for new computer equipment');
      setExpenses([
        { id: '1', category: 'Rent & Housing', description: 'Studio apartment', amount: 1550 },
        { id: '2', category: 'Food & Groceries', description: 'Groceries & health food', amount: 450 },
        { id: '3', category: 'Dining & Takeout', description: 'Business lunches & dinners', amount: 380 },
        { id: '4', category: 'Utilities & Wifi', description: 'High-speed fiber & electric', amount: 140 },
        { id: '5', category: 'Subscriptions & Software', description: 'SaaS tools, GitHub, Figma', amount: 180 },
        { id: '6', category: 'Health & Fitness', description: 'Gym membership', amount: 75 },
      ]);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pocketsmart/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyIncome: income,
          expenses,
          goals,
          currency,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze budget');
    } finally {
      setLoading(false);
    }
  };

  const copyAnalysis = () => {
    if (!analysis) return;
    const text = `PocketSmart AI Budget Report
Health Score: ${analysis.healthScore}/100 (${analysis.healthRating})
Summary: ${analysis.executiveSummary}

50/30/20 Breakdown:
Needs: ${analysis.fiftyThirtyTwenty?.needsPercent}%
Wants: ${analysis.fiftyThirtyTwenty?.wantsPercent}%
Savings: ${analysis.fiftyThirtyTwenty?.savingsPercent}%
Analysis: ${analysis.fiftyThirtyTwenty?.analysis}

Top Savings Opportunities:
${analysis.topSavingsOpportunities?.map((o: any) => `- ${o.category}: Potential Savings ${currency} ${o.potentialMonthlySavings} (${o.difficulty}) -> ${o.tip}`).join('\n')}

Actionable Steps:
${analysis.actionableRecommendations?.map((r: string) => `- ${r}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Wallet className="w-3.5 h-3.5" />
              <span>Project #1: PocketSmart AI</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Smart Budget & Recommendation Assistant
            </h2>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
              Calculates your financial health score, audits spending against the 50/30/20 rule, detects wasteful leaks, and generates intelligent savings strategies using Google Gemini.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadPreset('student')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
            >
              🎓 Load Student Budget
            </button>
            <button
              onClick={() => loadPreset('freelancer')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
            >
              💼 Load Pro Budget
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs: Budget & Expenses (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-between mb-4">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Monthly Income & Goals
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 font-semibold text-slate-700"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Net Income ({currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-sm">
                    {currency === 'INR' ? '₹' : '$'}
                  </span>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 2500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Financial Goal / Focus
                </label>
                <input
                  type="text"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Save $5,000 for emergency fund"
                />
              </div>
            </div>

            {/* Quick stats ribbon */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Total Income</span>
                <p className="text-sm md:text-base font-bold text-slate-900">
                  {currency} {income.toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Total Outflow</span>
                <p className="text-sm md:text-base font-bold text-rose-600">
                  {currency} {totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className={`p-2.5 rounded-lg border ${netRemaining >= 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                <span className="text-[11px] uppercase font-semibold">
                  {netRemaining >= 0 ? 'Surplus' : 'Deficit'}
                </span>
                <p className="text-sm md:text-base font-bold">
                  {currency} {Math.abs(netRemaining).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Expense Items List */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Expense Breakdown ({expenses.length})</h3>
                <p className="text-xs text-slate-500">Add or edit your recurring and discretionary costs</p>
              </div>
              <button
                onClick={addExpense}
                className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs px-3 py-1.5 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-lg hover:border-slate-300 transition"
                >
                  <select
                    value={expense.category}
                    onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                    className="w-1/3 text-xs bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-700 font-medium"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={expense.description}
                    onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                    placeholder="Description"
                    className="flex-1 text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                  />

                  <div className="w-24 relative">
                    <span className="absolute left-2 top-1.5 text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      value={expense.amount || ''}
                      onChange={(e) => updateExpense(expense.id, 'amount', Number(e.target.value))}
                      placeholder="Amount"
                      className="w-full pl-5 pr-2 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded text-slate-900 text-right"
                    />
                  </div>

                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition"
                    title="Remove expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Gemini Model: <strong className="text-slate-700">gemini-3.8-flash</strong>
              </span>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Finances...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run PocketSmart AI Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Output: Analysis & Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {!analysis && !loading && (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
                <PieChart className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Ready to Optimize Your Finances</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Click &quot;Run PocketSmart AI Analysis&quot; to receive your AI Health Score, 50/30/20 balance check, and custom savings opportunities.
              </p>
              <button
                onClick={handleAnalyze}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Analyze Current Data
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[460px]">
              <div className="relative mb-4">
                <div className="w-14 h-14 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <Sparkles className="w-5 h-5 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h4 className="text-base font-bold text-slate-800">PocketSmart AI is Crunching Your Numbers...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Auditing expense categories, measuring 50/30/20 ratios, and calculating optimal savings margins.
              </p>
            </div>
          )}

          {analysis && !loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">AI Diagnostic Report</h4>
                </div>
                <button
                  onClick={copyAnalysis}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Report'}</span>
                </button>
              </div>

              {/* Health Score Meter */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      Financial Health Score
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-extrabold text-emerald-400">{analysis.healthScore}</span>
                      <span className="text-xs text-slate-400">/ 100</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 ml-1">
                        {analysis.healthRating}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">Savings Rate</span>
                    <p className="text-lg font-bold text-white mt-1">{analysis.savingsRate}%</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{analysis.executiveSummary}</p>
              </div>

              {/* 50/30/20 Breakdown */}
              <div className="border border-slate-100 bg-slate-50 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>50/30/20 Rule Balance</span>
                  <span className="text-[11px] text-slate-500 font-normal">Needs / Wants / Savings</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Needs (Goal: 50%)</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {analysis.fiftyThirtyTwenty?.needsPercent}%
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Wants (Goal: 30%)</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {analysis.fiftyThirtyTwenty?.wantsPercent}%
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Savings (Goal: 20%)</span>
                    <span className="font-bold text-emerald-600 text-sm">
                      {analysis.fiftyThirtyTwenty?.savingsPercent}%
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 italic mt-1">
                  {analysis.fiftyThirtyTwenty?.analysis}
                </p>
              </div>

              {/* Top Savings Opportunities */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Top Savings Opportunities
                </h5>
                <div className="space-y-2">
                  {analysis.topSavingsOpportunities?.map((opp: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{opp.category}</span>
                        <span className="text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded text-[11px]">
                          Save +{currency} {opp.potentialMonthlySavings}/mo
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{opp.tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Action Steps
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {analysis.actionableRecommendations?.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-lg">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Investment Advice */}
              <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl text-xs text-indigo-950">
                <span className="font-bold block mb-1">🌱 Investment & Wealth Roadmap:</span>
                <p className="leading-relaxed text-indigo-900">{analysis.investmentAdvice}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
