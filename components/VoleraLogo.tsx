import React from 'react';
import Image from 'next/image';

const VoleraLogo = () => {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative">
        <Image 
          src="/your-logo.png"  // Replace with your logo filename
          alt="Your Logo" 
          width={200}  // Adjust width as needed
          height={100}  // Adjust height as needed
          className="object-contain"
        />
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
