import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    initials: 'PS',
    bgClass: 'bg-secondary-container text-on-secondary-container',
    quote: '"An absolute delight. The ambiance feels like a warm embrace, and the saffron arancini is life-changing."',
    name: 'Priya Sharma',
  },
  {
    initials: 'RM',
    bgClass: 'bg-primary-container text-on-primary-container',
    quote: '"Impeccable service and flavors that transport you. The perfect spot for our anniversary."',
    name: 'Rohit Mehta',
  },
  {
    initials: 'SW',
    bgClass: 'bg-tertiary-container text-on-tertiary-container',
    quote: '"Every detail is curated beautifully. The outdoor seating under the fairy lights is magical."',
    name: 'Sarah Wilson',
  },
]

export default function Testimonials() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonial-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-6 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface mb-16 text-center">
          Guest Voices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <div
              key={index}
              className="testimonial-card bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-[0_4px_32px_rgba(30,27,22,0.02)] border border-outline-variant/10 relative mt-8"
            >
              <div
                className={`absolute -top-8 left-10 w-16 h-16 ${test.bgClass} rounded-full flex items-center justify-center text-2xl font-headline font-bold`}
              >
                {test.initials}
              </div>
              <div className="flex text-secondary mb-6 mt-4 gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="font-body text-on-surface-variant italic mb-6 leading-relaxed text-sm md:text-base">
                {test.quote}
              </p>
              <h4 className="font-headline font-bold text-on-surface">{test.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
