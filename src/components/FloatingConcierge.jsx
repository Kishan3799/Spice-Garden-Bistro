import { CalendarDays } from 'lucide-react'

export default function FloatingConcierge() {
  return (
    <a 
      className="fixed bottom-8 right-8 z-50 bg-secondary-fixed/90 backdrop-blur-md text-on-secondary-fixed font-label font-bold px-6 py-4 rounded-full shadow-[0_8px_32px_rgba(30,27,22,0.1)] hover:scale-105 transition-transform duration-[600ms] flex items-center gap-2" 
      href="#reservations"
    >
      <CalendarDays size={20} />
      Book a Table
    </a>
  )
}
