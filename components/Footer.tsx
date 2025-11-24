import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-[1600px] mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div>
                <a href="#" className="flex items-center gap-2 mb-6">
                    <Logo className="w-16 h-16" />
                    <span className="sr-only">CineStream</span>
                </a>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    CineStream is a premium movie streaming platform designed to deliver the best cinematic experience directly to your screen. Sleek, fast, and immersive.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-[#00bfff] hover:text-white transition-all">
                        <Facebook size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-[#00bfff] hover:text-white transition-all">
                        <Twitter size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-[#00bfff] hover:text-white transition-all">
                        <Instagram size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-[#00bfff] hover:text-white transition-all">
                        <Youtube size={18} />
                    </a>
                </div>
            </div>

            {/* Categories */}
            <div>
                <h4 className="text-white font-bold text-lg mb-6">Browse Categories</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-[#00bfff] transition-colors">Action & Adventure</a></li>
                    <li><a href="#" className="hover:text-[#00bfff] transition-colors">Comedy & Satire</a></li>
                    <li><a href="#" className="hover:text-[#00bfff] transition-colors">Sci-Fi & Fantasy</a></li>
                    <li><a href="#" className="hover:text-[#00bfff] transition-colors">Documentaries</a></li>
                    <li><a href="#" className="hover:text-[#00bfff] transition-colors">TV Series</a></li>
                    <li><a href="#" className="hover:text-[#00bfff] transition-colors">Kids & Family</a></li>
                </ul>
            </div>

            {/* Quick Links */}
            <div>
                <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-[#00bfff] transition-colors">My Account</a></li>
                    <li><a href="#" className="hover:text-[#00bfff] transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-[#00bfff] transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-[#00bfff] transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-[#00bfff] transition-colors">Cookie Policy</a></li>
                </ul>
            </div>

            {/* Newsletter */}
            <div>
                <h4 className="text-white font-bold text-lg mb-6">Newsletter</h4>
                <p className="text-gray-500 text-sm mb-6">Subscribe to our newsletter to get the latest updates and offers.</p>
                <div className="relative">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full bg-gray-900 text-white px-4 py-4 rounded focus:outline-none focus:ring-1 focus:ring-[#00bfff] text-sm"
                    />
                    <button className="absolute right-2 top-2 bottom-2 bg-[#00bfff] text-white px-4 rounded hover:bg-[#009acd] transition-colors">
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
            <p>&copy; 2024 CineStream. All rights reserved.</p>
            <div className="flex gap-6">
                <a href="#" className="hover:text-gray-400">Privacy</a>
                <a href="#" className="hover:text-gray-400">Security</a>
                <a href="#" className="hover:text-gray-400">Terms</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;