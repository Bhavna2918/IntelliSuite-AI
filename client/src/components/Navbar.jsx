import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react';
import { useClerk , UserButton , useUser} from '@clerk/clerk-react'
import { motion } from 'framer-motion'

const Navbar = () => {
    const navigate = useNavigate()
    const {user}=useUser()
    const {openSignIn}=useClerk()

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className='fixed top-0 left-0 right-0 z-50 w-full bg-app-bg/80 backdrop-blur-md border-b border-app-border flex justify-between items-center py-4 px-6 sm:px-20 xl:px-32 transition-colors'
    >
        <motion.div whileHover={{ scale: 1.05 }} className='cursor-pointer flex items-center gap-2' onClick={()=>navigate('/')}>
           <img src={assets.logo} alt="logo" className='w-8 h-8' style={{ filter: 'brightness(0) invert(1)' }}/>
           <span className="text-xl font-bold tracking-widest text-app-text hidden sm:block">IntelliSuite <span className="text-[#A78BFA]">AI</span></span>
        </motion.div>

       {
        user ? (
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/ai')} className='text-sm font-semibold text-app-text hover:text-primary transition-colors'>Dashboard</button>
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border-2 border-app-border hover:border-primary transition-colors" } }} />
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(167,139,250,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={openSignIn} 
            className='flex items-center gap-2 rounded-full text-sm font-semibold cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 transition-all duration-300'
          >
            Get Started <ArrowRight className='w-4 h-4'/>
          </motion.button>
        )
      }
    </motion.div>
  )
}

export default Navbar