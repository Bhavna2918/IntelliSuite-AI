import React from 'react';

export const PageHeader = ({ icon: Icon, title, description, className = '' }) => (
  <div className={`flex items-center gap-4 mb-8 ${className}`}>
    <div className="w-12 h-12 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-colors shrink-0">
      <Icon className='w-6 h-6 text-primary' />
    </div>
    <div>
      <h1 className='text-2xl font-bold text-app-text'>{title}</h1>
      {description && <p className='text-sm text-app-text-sec mt-1'>{description}</p>}
    </div>
  </div>
);
