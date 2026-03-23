import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Smartphone, Landmark, CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { cn } from '../lib/utils';

export const Payments: React.FC = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'Mobile Money' | 'Bank'>('Mobile Money');
  const [purpose, setPurpose] = useState('Registration Fee');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    await dataService.recordPayment({
      farmerUid: user.uid,
      amount: Number(amount),
      currency: 'UGX',
      method,
      status: 'completed', // Simulate immediate completion for MVP
      purpose,
      transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: new Date().toISOString()
    });
    
    setAmount('');
    alert('Payment successful!');
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight">Payments</h1>
        <p className="text-black/40 font-medium">Secure transactions via Mobile Money & Bank</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-[3rem] shadow-2xl border border-black/5"
        >
          <h2 className="text-2xl font-bold mb-8">Make a Payment</h2>
          <form onSubmit={handlePay} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Amount (UGX)</label>
              <input 
                type="number"
                required
                placeholder="e.g. 50,000"
                className="w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 ring-[#5A5A40]/20 font-bold text-xl"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setMethod('Mobile Money')}
                  className={cn(
                    "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                    method === 'Mobile Money' ? "border-[#5A5A40] bg-[#5A5A40]/5" : "border-black/5 hover:bg-black/5"
                  )}
                >
                  <Smartphone size={24} />
                  <span className="text-xs font-bold">Mobile Money</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setMethod('Bank')}
                  className={cn(
                    "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                    method === 'Bank' ? "border-[#5A5A40] bg-[#5A5A40]/5" : "border-black/5 hover:bg-black/5"
                  )}
                >
                  <Landmark size={24} />
                  <span className="text-xs font-bold">Bank Transfer</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Purpose</label>
              <select 
                className="w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 ring-[#5A5A40]/20 font-bold"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
              >
                <option>Registration Fee</option>
                <option>Service Fee</option>
                <option>Input Supply Payment</option>
                <option>Loan Repayment</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#5A5A40] text-white py-5 rounded-2xl font-bold hover:bg-[#4A4A30] shadow-lg shadow-[#5A5A40]/20 transition-all flex items-center justify-center gap-3"
            >
              <CreditCard size={20} />
              Confirm Payment
            </button>
          </form>
        </motion.section>

        {/* Payment Info */}
        <section className="space-y-6">
          <div className="bg-[#5A5A40] p-10 rounded-[3rem] text-white shadow-2xl">
            <h3 className="text-2xl font-black mb-4">Payment Security</h3>
            <p className="text-white/70 text-sm mb-6">
              All transactions are encrypted and processed through Uganda's leading payment gateways. Your financial data is never stored on our servers.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/10 p-4 rounded-2xl flex flex-col items-center flex-1">
                <span className="text-xs font-bold opacity-60">MTN</span>
                <span className="text-[10px] font-black">MOMO</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl flex flex-col items-center flex-1">
                <span className="text-xs font-bold opacity-60">AIRTEL</span>
                <span className="text-[10px] font-black">MONEY</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl flex flex-col items-center flex-1">
                <span className="text-xs font-bold opacity-60">VISA</span>
                <span className="text-[10px] font-black">MASTERCARD</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5">
            <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-black/5 rounded-2xl">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">Registration Fee</div>
                  <div className="text-[10px] text-black/40">TXN-882931 • Completed</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm">UGX 50,000</div>
                  <div className="text-[10px] text-black/40">Mar 20</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-black/5 rounded-2xl opacity-50">
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">Input Supply</div>
                  <div className="text-[10px] text-black/40">TXN-110293 • Pending</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm">UGX 120,000</div>
                  <div className="text-[10px] text-black/40">Mar 18</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
