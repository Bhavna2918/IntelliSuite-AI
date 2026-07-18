import React from 'react';

export const Button = ({ children, isLoading, icon: Icon, className = '', ...props }) => (
  <button 
    disabled={isLoading || props.disabled} 
    className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] text-white font-semibold px-4 py-4 rounded-xl transition-all duration-300 disabled:opacity-50 mt-auto ${className}`}
    {...props}
  >
    {isLoading ? (
      <span className='w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin'></span>
    ) : Icon ? (
      <Icon className='w-5 h-5' />
    ) : null}
    {children}
  </button>
);
