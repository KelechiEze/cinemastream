
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import Logo from '../components/Logo';
import { ChevronLeft, Lock, Mail } from 'lucide-react';

interface SignInProps {
  onSignIn: (user: User) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        name: 'Guest User',
        email: email,
        avatar: `https://ui-avatars.com/api/?name=Guest&background=00bfff&color=fff`,
        plan: 'Basic'
      };
      onSignIn(mockUser);
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">
      {/* Background Abstract Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#00bfff]/10 rounded-full blur-[120px]" />
         <div className="absolute top-[60%] -left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 relative z-10 py-20">
        <div className="w-full max-w-md">
            {/* Back to Home Link - Positioned slightly lower as requested */}
            <button 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2 text-gray-500 hover:text-[#00bfff] transition-all mb-8 group mx-auto"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Back to Home</span>
            </button>

            <div className="flex justify-center mb-8">
                <Logo className="w-20 h-20 shadow-2xl" />
            </div>
            
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-sm">
                <h1 className="text-3xl font-black text-white text-center mb-2 uppercase tracking-tighter">Welcome Back</h1>
                <p className="text-gray-400 text-center text-sm mb-10">Sign in to resume your cinematic journey</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-all pl-12"
                                placeholder="you@example.com"
                            />
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-all pl-12"
                                placeholder="••••••••"
                            />
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                        </div>
                    </div>

                    <div className="flex justify-end px-1">
                        <button type="button" className="text-xs font-bold text-gray-500 hover:text-[#00bfff] transition-colors">Forgot Password?</button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-[#00bfff] hover:bg-white hover:text-black text-white font-black py-4 rounded-2xl mt-4 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/20 uppercase tracking-widest text-sm"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : 'Sign In Now'}
                    </button>
                </form>
                
                <div className="mt-10 text-center border-t border-white/5 pt-8">
                    <p className="text-gray-500 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-[#00bfff] font-black hover:underline uppercase tracking-tighter">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
