import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    duration: 'forever',
    description: 'Perfect for exploring AI capabilities.',
    features: ['10 AI Generations/mo', 'Standard Support', 'Basic Templates', 'Watermarked Outputs'],
    icon: Sparkles,
    color: 'text-gray-400',
    bg: 'bg-gray-400/10',
    border: 'border-gray-400/20',
    buttonText: 'Get Started',
    buttonStyle: 'bg-app-input text-app-text hover:bg-app-hover border border-app-border',
  },
  {
    name: 'Pro',
    price: '$15',
    duration: 'per month',
    description: 'For creators who need more power.',
    features: ['250 AI Generations/mo', 'Priority Support', 'Premium Templates', 'No Watermarks', 'Advanced Formatting'],
    icon: Zap,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    buttonText: 'Upgrade to Pro',
    buttonStyle: 'bg-primary text-white hover:bg-blue-600 shadow-lg shadow-primary/25',
    popular: true,
  },
  {
    name: 'Premium',
    price: '$49',
    duration: 'per month',
    description: 'Unlimited access for heavy users.',
    features: ['Unlimited Generations', '24/7 Dedicated Support', 'Custom AI Models', 'API Access', 'Team Collaboration'],
    icon: Crown,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    buttonText: 'Upgrade to Premium',
    buttonStyle: 'bg-app-input text-app-text hover:bg-app-hover border border-app-border',
  }
];

const Plan = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className='max-w-6xl mx-auto z-20 my-30 relative px-6 lg:px-8'
    >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className='text-center relative z-10 mb-16'>
            <h2 className='text-app-text text-[42px] font-bold tracking-tight'>Choose Your <span className='text-primary'>Plan</span></h2>
            <p className='text-app-text-sec max-w-lg mx-auto mt-4'>Start for free and scale up as you grow. Find the perfect plan for your content creation needs.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10'>
            {plans.map((plan, idx) => {
              const Icon = plan.icon;
              return (
                <div key={idx} className={`relative p-8 rounded-3xl bg-app-card border ${plan.popular ? 'border-primary shadow-xl shadow-primary/10' : 'border-app-border'} flex flex-col transition-transform hover:-translate-y-2 duration-300`}>
                  {plan.popular && (
                    <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg'>
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${plan.bg} ${plan.border}`}>
                    <Icon className={`w-6 h-6 ${plan.color}`} />
                  </div>
                  
                  <h3 className='text-xl font-bold text-app-text mb-2'>{plan.name}</h3>
                  <p className='text-sm text-app-text-sec mb-6'>{plan.description}</p>
                  
                  <div className='mb-6'>
                    <span className='text-4xl font-extrabold text-app-text'>{plan.price}</span>
                    <span className='text-app-text-sec text-sm'>/{plan.duration}</span>
                  </div>
                  
                  <ul className='space-y-4 mb-8 flex-1'>
                    {plan.features.map((feature, i) => (
                      <li key={i} className='flex items-center gap-3 text-sm text-app-text'>
                        <div className='w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                          <Check className='w-3 h-3 text-primary' />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => isSignedIn ? navigate('/ai/settings') : navigate('/ai')} 
                    className={`w-full py-3.5 rounded-xl font-semibold transition-all ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              )
            })}
        </div>
    </motion.div>
  )
}

export default Plan;