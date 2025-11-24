import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionClick?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, actionText = 'VIEW ALL', onActionClick }) => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex items-end justify-between">
        <div>
            <div className="w-12 h-1 bg-gray-700 mb-4"></div>
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
        
        <button 
          onClick={onActionClick}
          className="hidden md:flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-[#00bfff] transition-colors uppercase tracking-widest mb-2"
        >
          {actionText}
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="w-full h-[1px] bg-gray-800" />
    </div>
  );
};

export default SectionHeader;