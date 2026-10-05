import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Plan from '../components/Plan'
import Footer from '../components/Footer'

const Home = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/ai', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || isSignedIn) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-app-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-app-border border-t-primary"></div>
      </div>
    );
  }

  return (
    <>
       <Navbar />
       <Hero />
       <AiTools />
       <Plan />
       <Footer />
    </>
  )
}

export default Home
