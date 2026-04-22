import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutUs from './components/AboutUs'
import WhyChooseUs from './components/WhyChooseUs'
import Menu from './components/Menu'
import Testimonials from './components/Testimonials'
import ReservationForm from './components/ReservationForm'
import Footer from './components/Footer'
import FloatingConcierge from './components/FloatingConcierge'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
      touchMultiplier: 2,
    })

    // FIX: Use only ONE RAF loop — via gsap.ticker (not both)
    // This prevents double-ticking which causes scroll speed/stutter bugs
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Sync GSAP ScrollTrigger with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      // Cleanup on unmount
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutUs />
        <WhyChooseUs />
        <Menu />
        <Testimonials />
        <ReservationForm />
      </main>
      <Footer />
      <FloatingConcierge />
    </>
  )
}

export default App
