import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Hero = () => {
    const navigate=useNavigate()

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
      }
    };

    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

  return (
    <div className='relative pt-32 pb-20 px-6 sm:px-20 xl:px-32 w-full min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-app-bg'>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className='w-full lg:w-1/2 text-left z-10 flex flex-col gap-6 items-start mt-10 lg:mt-0'
        >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-transparent text-yellow-500 text-xs font-semibold tracking-wide">
              The Next Generation of AI
            </motion.div>
            
            <motion.h1 variants={itemVariants} className='text-5xl sm:text-6xl md:text-[5.5rem] font-bold leading-[1.1] text-app-text'>
              One Platform.<br/>
              Every <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#A78BFA]'>AI Tool</span><br/>
              You Need.
            </motion.h1>
            
             <motion.p variants={itemVariants} className='text-base max-w-xl text-app-text-sec font-normal leading-relaxed mt-2'>
              Generate content, analyze resumes with <span className="text-blue-400 font-semibold">ATS scoring</span>, <span className="text-fuchsia-400 font-semibold">chat with AI</span>, create images, summarize documents, and boost <span className="text-blue-500 font-semibold">productivity</span> from a single intelligent platform.
             </motion.p>

            <motion.div variants={itemVariants} className='flex flex-wrap items-center gap-4 mt-8'>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={()=>navigate('/ai')} 
                  className='bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-3.5 rounded-full transition cursor-pointer flex items-center gap-2 shadow-lg shadow-primary/20'
                >
                    Get Started
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='text-app-text font-semibold px-8 py-3.5 rounded-full bg-app-card border border-app-border hover:bg-app-hover transition cursor-pointer'
                >
                  Watch demo
                </motion.button>
            </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-16 lg:mt-0 z-10"
        >
          <div className="relative rounded-[20px] p-2 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 shadow-[0_0_80px_rgba(99,102,241,0.15)]">
            <div className="absolute inset-0 bg-app-bg/50 rounded-[20px] backdrop-blur-3xl -z-10"></div>
            <img 
              src={assets.ai_hero_graphic || "https://placehold.co/600x600/0B1120/475569.png"} 
              alt="AI Concept Futuristic" 
              className="relative w-full max-w-[600px] rounded-[18px] border border-white/5 object-cover"
            />
          </div>
        </motion.div>
    </div>
  )
}

export default Hero