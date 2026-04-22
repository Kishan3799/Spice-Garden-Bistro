import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flower2, Utensils, Baby, Timer, Tent } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function WhyChooseUs() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.13,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-6 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface mb-4">The Bistro Difference</h2>
          <p className="font-body text-lg md:text-xl text-on-surface-variant">Why our guests return time and again.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(220px,auto)]">

          {/* Feature 1 (Large) */}
          <div className="feature-card md:col-span-2 md:row-span-2 bg-surface-container-lowest rounded-2xl p-8 md:p-10 flex flex-col justify-end relative overflow-hidden group shadow-[0_4px_32px_rgba(30,27,22,0.02)] border border-outline-variant/10 min-h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent z-10"></div>
            <img
              alt="Fresh ingredients"
              className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-1000 opacity-60"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJQFAi3zZaaCbHg9MKwI9sPvhbTDByUoGM2acfi2XPF6zlHE523v8ZlMpOs_DVC5RTUJnV4w4xqcL3AjfWaMCzK4KbW_ieXQ_ihaQrE-9mAcYHNnK2xcl-q2DqMdZGLQbIq40pFtn5QVwFHqUjaMM2lXh9ncvHyNejQA8A9lR0YgYiqqOZarwad8B6pfrzEkz_GLTvf2Iqb61-hQQiKPnt0OYGRyENTdjk4Eh_BwMLzs4TY5tTyB4TlTTUsFPB8V_Vz_zhpn-B"
            />
            <div className="relative z-20">
              <Flower2 size={36} className="text-primary mb-4" />
              <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-2">Fresh Ingredients</h3>
              <p className="font-body text-on-surface-variant">Sourced daily from local organic farms.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-card bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-start shadow-[0_4px_32px_rgba(30,27,22,0.02)] border border-outline-variant/10">
            <div className="w-14 h-14 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
              <Utensils size={28} className="text-primary" />
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Expert Chefs</h3>
            <p className="font-body text-on-surface-variant text-sm">Masters of culinary artistry.</p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-start shadow-[0_4px_32px_rgba(30,27,22,0.02)] border border-outline-variant/10">
            <div className="w-14 h-14 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
              <Baby size={28} className="text-primary" />
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Family-Friendly</h3>
            <p className="font-body text-on-surface-variant text-sm">A welcoming atmosphere for all ages.</p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-start shadow-[0_4px_32px_rgba(30,27,22,0.02)] border border-outline-variant/10">
            <div className="w-14 h-14 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
              <Timer size={28} className="text-primary" />
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Fast Service</h3>
            <p className="font-body text-on-surface-variant text-sm">Attentive without being intrusive.</p>
          </div>

          {/* Feature 5 (Wide) */}
          <div className="feature-card md:col-span-2 bg-surface-container-lowest rounded-2xl p-8 flex items-center gap-6 md:gap-8 shadow-[0_4px_32px_rgba(30,27,22,0.02)] border border-outline-variant/10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-surface-container-high rounded-full flex items-center justify-center flex-shrink-0">
              <Tent size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface mb-2">Indoor/Outdoor Seating</h3>
              <p className="font-body text-on-surface-variant text-sm md:text-base">Dine under the stars or in our elegant dining room.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
