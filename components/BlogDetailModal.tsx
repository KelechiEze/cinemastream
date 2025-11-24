
import React, { useEffect, useRef } from 'react';
import { X, Calendar, User, Share2, Heart, Bookmark, ArrowLeft } from 'lucide-react';
import { BlogPost } from '../types';
import gsap from 'gsap';

interface BlogDetailModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const BlogDetailModal: React.FC<BlogDetailModalProps> = ({ post, isOpen, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Animate in
      if (contentRef.current) {
          gsap.fromTo(contentRef.current, 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power3.out' }
          );
      }
      if (heroRef.current) {
          gsap.fromTo(heroRef.current,
            { scale: 1.1, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#111] overflow-y-auto">
        {/* Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <button 
                onClick={onClose}
                className="pointer-events-auto flex items-center gap-2 bg-black/40 hover:bg-[#00bfff] backdrop-blur-md px-4 py-2 rounded-full text-white transition-all border border-white/10"
            >
                <ArrowLeft size={18} />
                <span className="text-sm font-bold">Back to Blog</span>
            </button>
            
            <div className="pointer-events-auto flex gap-3">
                <button className="w-10 h-10 rounded-full bg-black/40 hover:bg-white hover:text-black flex items-center justify-center backdrop-blur-md transition-all border border-white/10 text-white">
                    <Share2 size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-black/40 hover:bg-white hover:text-black flex items-center justify-center backdrop-blur-md transition-all border border-white/10 text-white">
                    <Bookmark size={18} />
                </button>
            </div>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
            <div ref={heroRef} className="absolute inset-0">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 max-w-[1000px] mx-auto px-6 pb-12">
                <div className="flex gap-3 mb-4">
                    {post.tags?.map((tag, i) => (
                        <span key={i} className="bg-[#00bfff] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            {tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                    {post.title}
                </h1>
                <div className="flex items-center gap-6 text-gray-300 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} 
                            alt={post.author} 
                            className="w-8 h-8 rounded-full border border-white/20"
                        />
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <span>•</span>
                        <span>5 min read</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="relative max-w-[1000px] mx-auto px-6 -mt-10 mb-20">
            <div ref={contentRef} className="bg-[#1a1a1a] p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl relative z-10">
                <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-10 border-l-4 border-[#00bfff] pl-6 italic">
                    {post.excerpt}
                </p>
                
                <div 
                    className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[#00bfff] prose-strong:text-white prose-blockquote:border-[#00bfff] prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                    <div className="text-gray-400 text-sm">
                        Published in <span className="text-white font-bold">Movies</span>
                    </div>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Heart size={20} />
                        <span className="text-sm font-bold">Like this article</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default BlogDetailModal;
