import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';

export const EmptyState = ({ text, image = assets.document_graphic }) => (
  <div className='flex-1 flex justify-center items-center rounded-xl bg-app-card-sec border border-app-border border-dashed transition-colors'>
    <div className='text-sm flex flex-col items-center gap-4 text-app-text-sec text-center px-4'>
      <motion.img 
        src={image} 
        alt="Empty State"
        className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="mt-2 text-app-text-sec">{text}</p>
    </div>
  </div>
);
