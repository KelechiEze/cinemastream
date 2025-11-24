
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import Logo from '../components/Logo';
import { ChevronLeft } from 'lucide-react';

interface SignUpProps {
  onSignUp: (user: User) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        name: name,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00bfff&color=fff`,
        plan: 'Basic' // Default plan
      };
      onSignUp(newUser);
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col relative overflow-hidden">
      {/* Background Abstract Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#00bfff]/10 rounded-full blur-[120px]" />
         <div className="absolute top-[60%] -left-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
            Back to Home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
                <Logo className="w-20 h-20" />
            </div>
            
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-white text-center mb-2">Create Account</h1>
                <p className="text-gray-400 text-center text-sm mb-8">Join CineStream for unlimited entertainment</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-900 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-all"
                            placeholder="John Doe"
                        />
                    </div>
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
                            placeholder="Create a strong password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-[#00bfff] hover:bg-[#009acd] text-white font-bold py-4 rounded mt-4 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : 'Sign Up Now'}
                    </button>
                </form>
                
                <p className="text-center text-xs text-gray-500 mt-6">
                    By signing up, you agree to our <a href="#" className="text-[#00bfff] hover:underline">Terms of Service</a> and <a href="#" className="text-[#00bfff] hover:underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
