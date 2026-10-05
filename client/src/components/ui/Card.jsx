import React from 'react';

export const Card = ({ children, className = '', isForm = false, ...props }) => {
  const Component = isForm ? 'form' : 'div';
  return (
    <Component 
      className={`bg-app-card p-5 sm:p-8 rounded-[20px] border border-app-border flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(79,140,255,0.15)] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
