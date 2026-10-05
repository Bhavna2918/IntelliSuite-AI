import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { Menu, X, Search, Bell, Moon, Sun, Settings as SettingsIcon, Crown, Mic } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { SignIn, useUser, useClerk } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import SearchModal from '../components/SearchModal';
import { useEffect } from 'react';

const Layout = () => {
    const navigate = useNavigate();
    const [ sidebar , setSidebar ] = useState(false)
    const [ isSearchOpen, setIsSearchOpen ] = useState(false)
    const {user} = useUser()
    const { openUserProfile } = useClerk();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
      const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

  return user ? (
    <div className='flex h-screen w-full bg-app-bg text-app-text overflow-hidden transition-colors'>
        {/* Mobile sidebar overlay mask */}
        {sidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 sm:hidden backdrop-blur-sm"
            onClick={() => setSidebar(false)}
          />
        )}
        <Sidebar sidebar={sidebar} setSidebar={setSidebar}/>
        
        <div className='flex-1 flex flex-col h-screen relative min-w-0 bg-app-bg transition-colors'>
            <nav className='w-full px-4 md:px-8 min-h-[72px] flex items-center justify-between bg-app-bg/50 backdrop-blur-xl border-b border-app-border z-30 transition-colors'>
                <div className='flex items-center gap-4 flex-1'>
                    {
                        sidebar ? <X onClick={()=>setSidebar(false)} className='w-6 h-6 text-app-text sm:hidden cursor-pointer'/>
                        : <Menu onClick={()=>setSidebar(true)} className='w-6 h-6 text-app-text sm:hidden cursor-pointer'/>
                    }
                    {/* Search Bar */}
                    <div onClick={() => setIsSearchOpen(true)} className='hidden md:flex items-center justify-between bg-app-card-sec border border-app-border px-4 py-2 rounded-lg w-full max-w-xl transition-colors cursor-text group hover:border-primary/30'>
                        <div className="flex items-center gap-3 w-full">
                            <Search className='w-4 h-4 text-app-text-sec group-hover:text-primary transition-colors' />
                            <span className='text-sm text-app-placeholder select-none'>Search creations, tools, or docs...</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mic className='w-4 h-4 text-app-text-sec hover:text-primary transition-colors cursor-pointer' />
                            <div className="flex items-center gap-1 text-[10px] font-medium text-app-text-sec bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-black/10 dark:border-white/10">
                                <span>Ctrl</span>
                                <span>K</span>
                            </div>
                        </div>
                    </div>
                </div>

                <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

                <div className='flex items-center gap-6 ml-4'>
                    <button type="button" onClick={() => setIsSearchOpen(true)} className='md:hidden text-app-text-sec hover:text-app-text transition-colors'>
                        <Search className='w-4 h-4' />
                    </button>
                    <button type="button" onClick={toggleTheme} className='text-app-text-sec hover:text-app-text transition-colors'>
                        {theme === 'dark' ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
                    </button>
                    <button type="button" className='text-app-text-sec hover:text-app-text transition-colors hidden sm:block'>
                        <SettingsIcon className='w-4 h-4' />
                    </button>
                    <button className='text-text-secondary hover:text-white transition-colors relative'>
                        <Bell className='w-4 h-4' />
                        <span className='absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full'></span>
                    </button>

                    <div onClick={openUserProfile} className='flex items-center gap-3 cursor-pointer group pl-2'>
                        <div className='text-right hidden md:flex flex-col items-end'>
                            <span className='text-sm font-semibold text-app-text group-hover:text-primary transition-colors leading-tight'>
                                {user.firstName || user.fullName}
                            </span>
                            <span className="text-[10px] font-medium text-purple-600 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 px-2 py-0.5 rounded mt-0.5 border border-purple-500/20 dark:border-purple-500/30">
                                Premium
                            </span>
                        </div>
                        <img src={user.imageUrl} className='w-9 h-9 rounded-full object-cover' alt="User" />
                    </div>
                </div>
            </nav>
            <div className='flex-1 overflow-y-auto custom-scrollbar relative z-10 p-4 sm:p-6 md:p-8'>
                <Outlet />
            </div>
        </div>
    </div>
  ) : (
        <div className='flex items-center justify-center min-h-screen bg-app-bg relative overflow-hidden transition-colors'>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-screen"></div>
            </div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='relative z-10 p-4 sm:p-8 glass-card border border-app-border mx-4 sm:mx-0'
            >
                <SignIn appearance={{
                    variables: {
                        colorPrimary: '#2563EB',
                        colorBackground: '#111827',
                        colorText: '#F8FAFC',
                        colorInputBackground: '#0B1120',
                        colorInputText: '#F8FAFC',
                    }
                }} />
            </motion.div>
        </div>
  )
}

export default Layout
