
import React, { useState } from 'react';
import { X } from 'lucide-react';
import Logo from './Logo';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (user: User) => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
        const mockUser: User = {
            name: 'Eze Kelechi',
            email: email,
            avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=300&auto=format&fit=crop',
            plan: 'Basic' // Default plan
        };
        onSignIn(mockUser);
        setIsLoading(false);
        onClose();
        navigate('/dashboard');
    }, 1500);
  };

  const handleSignUpClick = () => {
      onClose();
      navigate('/signup');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#1a1a1a] rounded-2xl border border-white/10 w-full max-w-md p-8 shadow-2xl transform transition-all duration-500 scale-100 animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-2">Sign in to continue watching</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-all"
                    placeholder="you@example.com"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-all"
                    placeholder="••••••••"
                />
            </div>

            <div className="flex justify-end">
                <a href="#" className="text-xs text-[#00bfff] hover:underline">Forgot Password?</a>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#00bfff] hover:bg-[#009acd] text-white font-bold py-3 rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Sign In'}
            </button>
        </form>

        <div className="mt-6 text-center border-t border-white/10 pt-6">
            <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button 
                    onClick={handleSignUpClick}
                    className="text-[#00bfff] font-bold hover:underline"
                >
                    Sign Up Now
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
