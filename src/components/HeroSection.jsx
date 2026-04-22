import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function HeroSection() {
  const contentRef = useRef(null)
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-elem', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.2
      })
    }, contentRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-[921px] flex items-center justify-center bg-surface-container-low overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Elegant restaurant interior" 
          className="w-full h-full object-cover opacity-80 mix-blend-multiply filter contrast-125 saturate-50 brightness-75 grayscale-[20%]" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWB5GnWJWCFKq63jtIVjgDAflFuNObzZVNKLf5Z9E9wViNxqZ5R8j_Y3at6uiBlvNs0WS4llZSBi6YlLXtouvYoLLSwewgWTA1E7bFQE64jWUdTV5egFxnK2tUBvFW9SEl_HXqMFPGtkL-hyfA2txBN3WqAkCyaU7e_xWoKQqOe4oXOJvy13CXgsSthVau7BVLxA7sOxZ36VVsTiaOl-s0dQu1nxUpVmpDZwNQ8_e3HB3o9YHno9VGOrgU47rpaD2ZyXZAqoOc"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
      </div>
      
      <div ref={contentRef} className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        <h1 className="hero-elem font-headline text-5xl md:text-7xl font-bold text-on-surface mb-6 leading-tight tracking-tight drop-shadow-sm">
          Premium Dining Experience<br/>
          <span className="text-primary italic font-normal">in the Heart of the City</span>
        </h1>
        
        <p className="hero-elem font-body text-xl md:text-2xl text-on-surface-variant mb-10 max-w-2xl mx-auto font-light">
          Saffron-infused moments, crafted with passion.
        </p>
        
        <div className="hero-elem flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-lg font-medium px-8 py-4 rounded-full shadow-[0_8px_32px_rgba(148,46,2,0.3)] hover:shadow-[0_12px_40px_rgba(148,46,2,0.4)] transition-all duration-[600ms] w-full sm:w-auto text-center" 
            href="#reservations"
          >
            Book a Table
          </a>
          <a 
            className="bg-surface-container-lowest text-primary font-label text-lg font-medium px-8 py-4 rounded-full hover:bg-surface-container-low transition-colors duration-[600ms] w-full sm:w-auto text-center border border-outline-variant/20 shadow-sm" 
            href="#menu"
          >
            View Menu
          </a>
        </div>
      </div>
    </section>
  )
}
