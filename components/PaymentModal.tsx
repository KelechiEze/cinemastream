
import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle, ShieldCheck, Smartphone } from 'lucide-react';
import { SubscriptionPlan, User } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
  user: User | null;
  onSuccess: () => void;
}

type Gateway = 'paystack' | 'flutterwave';

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan, user, onSuccess }) => {
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
  const [gateway, setGateway] = useState<Gateway>('paystack');
  const [email, setEmail] = useState(user?.email || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('method');
      setEmail(user?.email || '');
      setCardNumber('');
      setExpiry('');
      setCvv('');
    }
  }, [isOpen, user]);

  if (!isOpen || !plan) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate API processing time
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2500);
    }, 2000);
  };

  const formatCardNumber = (val: string) => {
    return val.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (val: string) => {
    return val.replace(/\D/g, '').replace(/(\d{2})(\d{1,2})/, '$1/$2').slice(0, 5);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <Lock size={18} className="text-green-600" />
            <span>Secure Checkout</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {step === 'method' && (
            <form onSubmit={handlePay}>
              {/* Order Summary */}
              <div className="mb-8 text-center">
                <p className="text-gray-500 text-sm uppercase tracking-wider font-medium mb-1">You are subscribing to</p>
                <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name} Plan</h3>
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#00bfff]">{plan.price}</span>
                  <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>
              </div>

              {/* Gateway Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setGateway('paystack')}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                    gateway === 'paystack' 
                      ? 'border-[#00bfff] bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className="font-bold">Paystack</div>
                  <ShieldCheck size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setGateway('flutterwave')}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                    gateway === 'flutterwave' 
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className="font-bold">Flutterwave</div>
                  <Smartphone size={20} />
                </button>
              </div>

              {/* Card Inputs */}
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#00bfff] focus:border-transparent outline-none"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#00bfff] focus:border-transparent outline-none pl-12 font-mono"
                      placeholder="0000 0000 0000 0000"
                    />
                    <CreditCard className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                    <input 
                      type="text" 
                      required 
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#00bfff] focus:border-transparent outline-none font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                    <input 
                      type="password" 
                      required 
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#00bfff] focus:border-transparent outline-none font-mono"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform active:scale-95 transition-all ${
                  gateway === 'paystack' ? 'bg-[#00bfff] hover:bg-[#009acd]' : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                Pay {plan.price}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Lock size={12} />
                Payments are secure and encrypted
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center text-center">
              <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-6 ${gateway === 'paystack' ? 'border-[#00bfff]' : 'border-yellow-500'}`}></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment...</h3>
              <p className="text-gray-500 text-sm">Please do not close this window.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center text-center animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-500 text-sm mb-6">Welcome to {plan.name} Membership.</p>
              <p className="text-xs text-gray-400">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
