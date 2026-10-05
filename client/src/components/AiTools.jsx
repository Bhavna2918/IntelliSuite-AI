import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion'
import { MessageSquare, SquarePen, Image as ImageIcon, FileText, Eraser, Scissors, FileJson, Code } from 'lucide-react';

const AiTools = () => {
    const navigate=useNavigate();
    const {user} =useUser()

    // We will use our own array that matches Screenshot 4 for the landing page exactly
    const landingTools = [
      {
          title: 'AI Chat',
          description: 'Brainstorm ideas and solve complex problems with our advanced conversational AI assistant.',
          Icon: MessageSquare,
          bg: { from: '#A855F7', to: '#C084FC', glow: 'rgba(168,85,247,0.2)' },
          path: '/ai/ai-chat'
      },
      {
          title: 'Write Article',
          description: 'Draft high-quality, SEO-optimized articles and blog posts in seconds with AI.',
          Icon: SquarePen,
          bg: { from: '#EC4899', to: '#F472B6', glow: 'rgba(236,72,153,0.2)' },
          path: '/ai/write-article'
      },
      {
          title: 'Generate Image',
          description: 'Create stunning, professional-grade AI visuals from simple text descriptions.',
          Icon: ImageIcon,
          bg: { from: '#3B82F6', to: '#60A5FA', glow: 'rgba(59,130,246,0.2)' },
          path: '/ai/generate-images'
      },
      {
          title: 'Resume Analyzer',
          description: 'Get ATS scoring and smart formatting tips to land your dream job faster.',
          Icon: FileText,
          bg: { from: '#10B981', to: '#34D399', glow: 'rgba(16,185,129,0.2)' },
          path: '/ai/resume-analyzer'
      },
      {
          title: 'Background Remover',
          description: 'Extract subjects instantly with precision using our advanced AI vision model.',
          Icon: Eraser,
          bg: { from: '#14B8A6', to: '#2DD4BF', glow: 'rgba(20,184,166,0.2)' },
          path: '/ai/remove-background'
      },
      {
          title: 'Object Remover',
          description: 'Clean up unwanted elements and photobombers effortlessly with AI magic.',
          Icon: Scissors,
          bg: { from: '#06B6D4', to: '#22D3EE', glow: 'rgba(6,182,212,0.2)' },
          path: '/ai/remove-object'
      },
      {
          title: 'Code Generator',
          description: 'Write, debug, and refactor code using an advanced AI programming assistant.',
          Icon: Code,
          bg: { from: '#F59E0B', to: '#FCD34D', glow: 'rgba(245,158,11,0.2)' },
          path: '/ai/code-generator'
      }
    ];

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
      }
    };

    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

  return (
    <div className='px-4 sm:px-10 lg:px-20 xl:px-32 my-24 relative bg-app-bg'>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className='text-center relative z-10'
        >
            <h2 className='text-app-text text-4xl sm:text-5xl font-bold tracking-tight'>Powerful <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'>AI Tools</span></h2>
            <p className='text-app-text-sec max-w-2xl mx-auto mt-4 text-lg'>Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 relative z-10'
        >
            {landingTools.map((tool , index) => (
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                  key={index} 
                  className='p-8 rounded-2xl bg-app-card border border-app-border group transition-all duration-300 cursor-pointer hover:bg-app-input/50' 
                  onClick={()=>navigate(user ? tool.path : '/')} // Just navigate, auth handles the rest
                >
                  <div className='w-14 h-14 rounded-2xl mb-6 flex items-center justify-center' style={{backgroundColor: tool.bg.glow}}>
                    <tool.Icon className='w-7 h-7' style={{color: tool.bg.from}} />
                  </div>
                  <h3 className='mb-3 text-xl font-bold text-app-text'>{tool.title}</h3>
                  <p className='text-app-text-sec text-sm leading-relaxed'>{tool.description}</p>
                </motion.div>
            ))}
        </motion.div>
    </div>
  )
}

export default AiTools