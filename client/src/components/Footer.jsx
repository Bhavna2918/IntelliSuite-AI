import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-16 pb-8 w-full text-app-text-sec mt-20 border-t border-app-border bg-app-bg relative overflow-hidden transition-colors">
        
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

    <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-app-border pb-12 relative z-10">
        <div className="md:max-w-96">
            <div className='flex items-center gap-2'>
              <img className="h-10" src={assets.logo} alt="logo" style={{ filter: 'brightness(0) invert(1)' }}/>
              <span className="text-xl font-bold tracking-widest text-app-text hidden sm:block">IntelliSuite <span className="text-[#A78BFA]">AI</span></span>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-app-text-sec">
                Experience the power of AI with IntelliSuite AI. <br/>Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance your workflow.
            </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-16 lg:gap-24">
            <div>
                <h2 className="font-semibold mb-6 text-app-text tracking-wide uppercase text-sm">Company</h2>
                <ul className="text-sm space-y-4">
                    <li><a href="#" className='hover:text-primary transition-colors'>Home</a></li>
                    <li><a href="#" className='hover:text-primary transition-colors'>About us</a></li>
                    <li><a href="#" className='hover:text-primary transition-colors'>Contact us</a></li>
                    <li><a href="#" className='hover:text-primary transition-colors'>Privacy policy</a></li>
                </ul>
            </div>
            <div>
                <h2 className="font-semibold text-app-text mb-6 tracking-wide uppercase text-sm">Subscribe</h2>
                <div className="text-sm space-y-4">
                    <p className='max-w-[200px] text-app-text-sec'>The latest news, articles, and resources, sent to your inbox weekly.</p>
                    <div className="flex items-center gap-2 pt-2">
                        <input className="bg-app-card border border-app-border placeholder-app-placeholder focus:border-primary/50 outline-none w-full max-w-64 h-10 rounded-lg px-3 transition-colors text-app-text" type="email" 
                        placeholder="Enter your email"/>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity w-24 h-10 text-white font-semibold rounded-lg cursor-pointer">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <p className="pt-8 text-center text-xs md:text-sm text-app-text-sec relative z-10">
        Copyright 2025 © <a href="#" className='hover:text-primary'>IntelliSuite AI</a>. All Right Reserved.
    </p>
</footer>
  )
}

export default Footer