import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flower2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const menuData = {
  Starters: [
    { name: 'Crispy Veg Spring Rolls', price: '199', desc: 'Golden and crispy rolls filled with a savory mix of fresh vegetables and Asian spices.' },
    { name: 'Garlic Butter Prawns', price: '349', desc: 'Succulent prawns tossed in a rich, aromatic garlic and herb butter sauce.' },
    { name: 'Paneer Tikka Bites', price: '249', desc: 'Charcoal-grilled cottage cheese marinated in a vibrant blend of traditional spices.' },
    { name: 'Chicken Satay Skewers', price: '299', desc: 'Tender grilled chicken skewers served with a creamy, spiced peanut dipping sauce.' },
  ],
  'Main Course': [
    { name: 'Saffron Arancini', price: '450', desc: 'Italian classic risotto balls infused with saffron, served with marinara.' },
    { name: 'Truffle Mushroom Risotto', price: '520', desc: 'Rich and creamy Arborio rice slow-cooked with wild mushrooms and truffle oil.' },
    { name: 'Herb-Crusted Salmon', price: '850', desc: 'Fresh Atlantic salmon baked with an herb crust, accompanied by asparagus.' },
  ],
  Desserts: [
    { name: 'Classic Tiramisu', price: '280', desc: 'Espresso-soaked ladyfingers layered with light mascarpone cream.' },
    { name: 'Mango Panna Cotta', price: '250', desc: 'Silky smooth Italian vanilla cream topped with fresh mango coulis.' },
  ],
  Drinks: [
    { name: 'Signature Mojito', price: '199', desc: 'Classic mix of fresh lime, mint leaves, and a dash of soda.' },
    { name: 'Aromatic Masala Chai', price: '120', desc: 'Distinctive Indian tea brewed with aromatic spices and milk.' },
  ],
}

export default function Menu() {
  const [activeTab, setActiveTab] = useState('Starters')
  const containerRef = useRef(null)
  const listRef = useRef(null)
  // FIX: track if it's the first render to skip animation crash on mount
  const isFirstRender = useRef(true)

  // Section reveal on scroll — runs once
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.menu-title', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Tab cross-fade: animate items whenever activeTab changes
  // FIX: Guard against null ref and skip animation on very first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!listRef.current) return

    gsap.fromTo(
      listRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }
    )
  }, [activeTab])

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-4 md:px-6 bg-surface" id="menu">
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <div className="menu-title text-center mb-12 md:mb-16">
          <h2 className="font-headline text-4xl md:text-6xl font-bold text-on-surface mb-6 tracking-tight">
            Curated Selections
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-primary/30"></div>
            <Flower2 size={24} className="text-primary" />
            <div className="w-16 h-px bg-primary/30"></div>
          </div>
        </div>

        {/* Tabs — horizontally scrollable on mobile */}
        <div className="menu-title flex gap-4 md:gap-8 mb-12 md:mb-20 overflow-x-auto pb-4 border-b border-outline-variant/20 scrollbar-none">
          {Object.keys(menuData).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 font-headline text-lg md:text-xl font-bold pb-4 px-2 whitespace-nowrap transition-colors duration-300 ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div ref={listRef} className="space-y-10 md:space-y-12">
          {menuData[activeTab].map((item, idx) => (
            <div key={`${activeTab}-${idx}`} className="group cursor-pointer">
              <div className="flex items-baseline justify-between mb-2 relative">
                <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface group-hover:text-primary transition-colors bg-surface pr-4 relative z-10">
                  {item.name}
                </h3>
                <div className="absolute left-0 right-0 bottom-2 border-b border-dotted border-outline-variant/60 z-0 hidden md:block"></div>
                <span className="font-headline text-lg md:text-xl font-semibold text-primary bg-surface pl-4 relative z-10 flex-shrink-0">
                  ₹ {item.price}
                </span>
              </div>
              <p className="font-body text-base md:text-lg text-on-surface-variant/80 font-light">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
