
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { INDUSTRIES } from '../constants';
import { Globe, ArrowRight } from 'lucide-react';

const SectionRegions: React.FC = () => {
  const navigate = useNavigate();

  const handleIndustryClick = (industry: typeof INDUSTRIES[0]) => {
    navigate(`/movies?country=${industry.country}&lang=${industry.lang}&name=${encodeURIComponent(industry.name)}`);
  };

  const getIndustryImage = (id: string) => {
    switch(id) {
        case 'hollywood': return 'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?q=80&w=600&auto=format&fit=crop';
        case 'bollywood': return 'https://images.unsplash.com/photo-1590401416624-3990886f456e?q=80&w=600&auto=format&fit=crop';
        case 'korean': return 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?q=80&w=600&auto=format&fit=crop';
        case 'japanese': return 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=600&auto=format&fit=crop';
        case 'indian': return 'https://images.unsplash.com/photo-1517672651691-24622a91b550?q=80&w=600&auto=format&fit=crop';
        default: return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop';
    }
  };

  return (
    <section className="animate-fadeIn">
      <div className="flex items-center justify-between mb-10">
        <div>
            <div className="flex items-center gap-2 text-[#00bfff] text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                <Globe size={14} /> Global Discovery
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Explore By Industry</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {INDUSTRIES.map((ind) => (
          <div 
            key={ind.id}
            onClick={() => handleIndustryClick(ind)}
            className="group relative h-40 md:h-52 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-[#00bfff]/50 transition-all shadow-xl"
          >
            <img 
                src={getIndustryImage(ind.id)} 
                alt={ind.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-black text-sm md:text-lg uppercase tracking-widest mb-1 group-hover:text-[#00bfff] transition-colors">{ind.name}</h3>
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">View Catalog</span>
                    <ArrowRight size={14} className="text-[#00bfff]" />
                </div>
            </div>

            {/* Accent Glow */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#00bfff]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionRegions;
