
import React, { useEffect, useState } from 'react';
import { BlogPost } from '../types';
import { fetchRealBlogPosts } from '../services/tmdb';
import { ArrowRight, Clock, User, MessageCircle } from 'lucide-react';
import BlogDetailModal from '../components/BlogDetailModal';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
        setIsLoading(true);
        const data = await fetchRealBlogPosts();
        setPosts(data);
        setIsLoading(false);
    };
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#111] pt-24 px-6 pb-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">CineStream <span className="text-[#00bfff]">Insider</span></h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">Your ultimate source for movie reviews, exclusive premieres, and behind-the-scenes deep dives.</p>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
                {posts.map((post) => (
                    <article 
                        key={post.id} 
                        className="group cursor-pointer bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#00bfff]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        onClick={() => setSelectedPost(post)}
                    >
                        <div className="aspect-video overflow-hidden relative">
                            <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                {post.tags?.map((tag, i) => (
                                    <span key={i} className="bg-[#00bfff] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wide">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">
                                <span className="flex items-center gap-1 text-[#00bfff]"><Clock size={12}/> {post.date}</span>
                                <span className="flex items-center gap-1"><User size={12}/> {post.author}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00bfff] transition-colors leading-tight line-clamp-2">
                                {post.title}
                            </h2>
                            <p className="text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed border-l-2 border-gray-700 pl-4">
                                {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                <span className="text-[#00bfff] font-bold text-sm uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Read Article <ArrowRight size={16} />
                                </span>
                                <span className="text-gray-600 flex items-center gap-1 text-xs">
                                    <MessageCircle size={14} /> 12 Comments
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        )}
      </div>

      <BlogDetailModal 
        isOpen={!!selectedPost} 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />
    </div>
  );
};

export default BlogPage;
