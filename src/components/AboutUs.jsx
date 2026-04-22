import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ScrollTrigger is registered globally in App.jsx
// but we import it here to avoid "no scrollTrigger property" warning
gsap.registerPlugin(ScrollTrigger)

export default function AboutUs() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal with scale
      gsap.from('.about-img', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
        scale: 0.92,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
      })

      // Text elements staggered fade-up
      gsap.from('.about-text', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.18,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-32 px-6 bg-surface" id="about">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">

        <div className="w-full md:w-1/2 relative about-img">
          <div className="absolute -inset-4 bg-surface-container-low rounded-[2rem] transform -rotate-3 z-0"></div>
          <img
            alt="Chef preparing food"
            className="relative z-10 w-full rounded-xl object-cover h-[400px] md:h-[500px] shadow-[0_16px_48px_rgba(30,27,22,0.08)]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdFOBH-Yh2sZ-E-j2QVTna7Sm-pOQ2H0igtMJyk_eCeOqiYC7Eb8I84ft-yiVHgTbpmWnusRFaQ2ru_9d_cqVdfCTImgcSL4uaKwxZPo0LAMwxyhEjY01xcjHzDa2gLnGI4gpHcmjM1cdBPfnSDhnPlh6NKkqvYwO-k3gg4z6zj84gDw44XQx2YRcjuRO08oXLJoE8iUPWXwXHfrr0LGpfZt6HVeN_govz0p9D6ftVz2-quEKlbCBAPlD_hunngLvJS0UCExTr"
          />
        </div>

        <div className="w-full md:w-1/2">
          <span className="about-text text-primary font-label tracking-widest uppercase text-sm mb-4 block">Since 2018</span>
          <h2 className="about-text font-headline text-3xl md:text-5xl font-bold text-on-surface mb-6 leading-tight">
            Fresh Flavors • Warm Moments • Memorable Dining
          </h2>
          <p className="about-text font-body text-base md:text-lg text-on-surface-variant mb-8 leading-relaxed">
            At Spice Garden Bistro, we believe that a meal is more than just food; it is an experience. Founded in 2018,
            our journey began with a simple desire: to bring authentic, rich flavors to the heart of the city in a
            setting that feels like a curated hearth.
          </p>
          <p className="about-text font-body text-base md:text-lg text-on-surface-variant leading-relaxed">
            Every dish is hand-poured with passion, using the finest ingredients and culinary techniques passed down
            through generations.
          </p>
        </div>

      </div>
    </section>
  )
}
