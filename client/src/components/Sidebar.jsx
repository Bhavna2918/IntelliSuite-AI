import { useClerk } from '@clerk/clerk-react'
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Settings, MessageSquare, FileJson, Brain, Code } from 'lucide-react';
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';

const navGroups = [
  {
    title: '',
    items: [
      { to: '/ai', label: 'Dashboard', Icon: House },
    ]
  },
  {
    title: 'CONTENT TOOLS',
    items: [
      { to: '/ai/ai-chat', label: 'AI Chat', Icon: MessageSquare },
      { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
      { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
    ]
  },
  {
    title: 'DEVELOPER TOOLS',
    items: [
      { to: '/ai/code-generator', label: 'Code Generator', Icon: Code },
    ]
  },
  {
    title: 'IMAGE TOOLS',
    items: [
      { to: '/ai/generate-images', label: 'Generate Image', Icon: Image },
      { to: '/ai/remove-background', label: 'Background Remover', Icon: Eraser },
      { to: '/ai/remove-object', label: 'Object Remover', Icon: Scissors },
    ]
  },
  {
    title: 'DOCUMENT TOOLS',
    items: [
      { to: '/ai/resume-analyzer', label: 'Resume Analyzer', Icon: FileText },
      { to: '/ai/pdf-summarizer', label: 'PDF Summarizer', Icon: FileJson },
    ]
  }
];

const bottomItems = [
  { to: '/ai/settings', label: 'Settings', Icon: Settings },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { signOut } = useClerk()
  const navigate = useNavigate();

  return (
    <div className={`w-64 h-full bg-app-card-sec border-r border-app-border flex flex-col justify-between max-sm:absolute top-0 bottom-0 z-40 ${sidebar ? 'translate-x-0' :
      'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>

      <div className='flex flex-col w-full h-full overflow-y-auto custom-scrollbar pr-1'>
        {/* Logo Section */}
        <div className='p-6 mb-2 flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20">
             <Brain className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-wide text-app-text">
            IntelliSuite <span className="text-primary text-base">AI</span>
          </span>
        </div>

        {/* Navigation Groups */}
        <div className='px-4 flex flex-col gap-6 pb-6'>
          {navGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {group.title && (
                <span className="px-4 text-[10px] font-bold text-app-text-sec uppercase tracking-wider mb-2">
                  {group.title}
                </span>
              )}
              {group.items.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/ai'}
                  onClick={() => setSidebar(false)}
                  className={({ isActive }) => `px-4 py-2.5 flex items-center gap-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/15 text-primary font-semibold shadow-[0_0_15px_rgba(79,140,255,0.3)] border border-primary/30' : 'text-app-text-sec hover:text-app-text hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className='w-full p-4 px-4 flex flex-col gap-1 bg-app-card-sec pb-6'>
         {bottomItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebar(false)}
              className={({ isActive }) => `px-4 py-2.5 flex items-center gap-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/15 text-primary font-semibold shadow-[0_0_15px_rgba(79,140,255,0.3)] border border-primary/30' : 'text-app-text-sec hover:text-app-text hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
          <div className='px-4 py-2.5 flex items-center gap-3 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-app-text-sec hover:text-app-text mt-1' onClick={signOut}>
            <LogOut className='w-5 h-5' />
            <span className='text-sm font-medium'>Log out</span>
          </div>
      </div>
    </div>
  )
}

export default Sidebar