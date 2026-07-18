import React from 'react';

export const Input = ({ label, ...props }) => (
  <div className="mb-6">
    {label && (
      <label className='text-xs font-bold text-app-text-sec mb-3 uppercase tracking-wider block'>
        {label}
      </label>
    )}
    <input 
      className='w-full p-4 bg-app-input text-app-text outline-none text-sm rounded-xl border border-transparent focus:border-primary/50 transition-colors placeholder-app-placeholder' 
      {...props} 
    />
  </div>
);

export const TextArea = ({ label, ...props }) => (
  <div className="mb-6 flex-1 flex flex-col">
    {label && (
      <label className='text-xs font-bold text-app-text-sec mb-3 uppercase tracking-wider block'>
        {label}
      </label>
    )}
    <textarea 
      className='w-full flex-1 p-4 bg-app-input text-app-text outline-none text-sm rounded-xl border border-transparent focus:border-primary/50 transition-colors resize-none placeholder-app-placeholder custom-scrollbar' 
      {...props} 
    />
  </div>
);

export const FileInput = ({ label, ...props }) => (
  <div className="mb-6">
    {label && (
      <label className='text-xs font-bold text-app-text-sec mb-3 uppercase tracking-wider block'>
        {label}
      </label>
    )}
    <input 
      type="file"
      className='w-full p-3.5 bg-app-input text-app-text outline-none text-sm rounded-xl border border-transparent focus:border-primary/50 transition-colors file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20' 
      {...props} 
    />
  </div>
);
