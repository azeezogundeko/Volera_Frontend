import React from 'react';

const VoleraLogo = () => {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative">
        <h1 className="text-6xl font-extrabold tracking-tight flex items-baseline">
          <span className="text-[#4ade80] drop-shadow-[0_2px_8px_rgba(74,222,128,0.3)] relative">
            V
            <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#4ade80] via-[#4ade80]/50 to-transparent"></span>
          </span>
          <span className="bg-gradient-to-r from-[#4ade80]/80 via-[#4ade80]/50 to-transparent bg-clip-text text-transparent">
            olera
          </span>
        </h1>
        <div className="absolute -right-6 top-0 w-12 h-12 bg-[#4ade80]/10 rounded-full blur-xl"></div>
        <div className="absolute -left-4 bottom-0 w-8 h-8 bg-[#4ade80]/10 rounded-full blur-lg"></div>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#4ade80]/30 to-transparent"></div>
        <span className="text-[#4ade80]/20 text-xs font-medium tracking-widest uppercase">Shopping Assistant</span>
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#4ade80]/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default VoleraLogo;
