
import React from 'react';
import { X, Crown, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    // Navigate to dashboard and signal to open the 'news' view where plans are
    navigate('/dashboard', { state: { initialView: 'news' } });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#1a1a1a] rounded-2xl border-2 border-[#00bfff]/50 w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,191,255,0.15)] animate-slow-zoom">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative h-40 bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00bfff] blur-[80px] rounded-full opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl">
                    <Crown size={40} className="text-[#00bfff]" fill="currentColor" />
                </div>
            </div>
        </div>

        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Upgrade Your Experience</h2>
            <p className="text-gray-400 mb-6">
                You are currently on the <span className="text-white font-bold">Basic Plan</span>. 
                Unlock the full power of CineStream today.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                    <Star size={16} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm text-gray-200">4K Ultra HD</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                    <Star size={16} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm text-gray-200">No Ads</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                    <Star size={16} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm text-gray-200">Offline Downloads</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                    <Star size={16} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm text-gray-200">Early Access</span>
                </div>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={onClose}
                    className="flex-1 py-3 rounded-lg font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    Maybe Later
                </button>
                <button 
                    onClick={handleUpgrade}
                    className="flex-[1.5] bg-[#00bfff] hover:bg-[#009acd] text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                    Upgrade Now <ArrowRight size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePromptModal;
