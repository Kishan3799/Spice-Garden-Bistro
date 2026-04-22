import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleClose = () => setIsOpen(false)

  return (
    <>
      {/* ─── Header bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 shadow-[0_4px_32px_rgba(30,27,22,0.04)]">
        <div className="flex justify-between items-center px-5 md:px-8 py-4 max-w-screen-2xl mx-auto">

          {/* Logo */}
          <div className="font-headline text-lg md:text-2xl font-bold text-primary leading-tight">
            Spice Garden Bistro
          </div>

          {/* Desktop Nav — only at lg+ (≥1024px) */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8 items-center font-body text-base xl:text-lg tracking-tight">
            <a className="text-primary font-bold border-b-2 border-primary pb-1" href="#">Home</a>
            <a className="text-on-surface hover:text-primary transition-colors duration-300" href="#about">About</a>
            <a className="text-on-surface hover:text-primary transition-colors duration-300" href="#menu">Menu</a>
            <a className="text-on-surface hover:text-primary transition-colors duration-300" href="#reservations">Reservations</a>
            <a className="text-on-surface hover:text-primary transition-colors duration-300" href="#contact">Contact</a>
          </nav>

          {/* Desktop CTA — only at lg+ */}
          <a
            href="#reservations"
            className="hidden lg:inline-flex bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-sm font-medium px-5 xl:px-6 py-3 rounded-full hover:opacity-90 transition-opacity items-center gap-2 whitespace-nowrap"
          >
            Book a Table
          </a>

          {/* Mobile / Tablet hamburger — visible below lg */}
          <button
            className="lg:hidden text-primary p-2 -mr-2 rounded-lg hover:bg-surface-container transition-colors"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* ─── Mobile/Tablet full-screen overlay ──────────────────────
           Rendered OUTSIDE the sticky header so it correctly covers
           the full viewport without stacking-context issues.
      ────────────────────────────────────────────────────────────── */}
      <div
        className={`
          fixed inset-0 z-[9999] bg-surface
          flex flex-col items-center justify-center gap-8
          transition-transform duration-500 ease-in-out
          lg:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-hidden={!isOpen}
      >
        {/* Close button inside overlay */}
        <button
          className="absolute top-5 right-5 text-primary p-2 rounded-lg hover:bg-surface-container transition-colors"
          onClick={handleClose}
          aria-label="Close menu"
        >
          <X size={28} />
        </button>

        {/* Logo in overlay */}
        <div className="font-headline text-2xl font-bold text-primary mb-4">
          Spice Garden Bistro
        </div>

        {/* Nav links */}
        <a className="text-primary font-headline text-3xl font-bold" href="#" onClick={handleClose}>Home</a>
        <a className="text-on-surface hover:text-primary font-headline text-3xl transition-colors" href="#about" onClick={handleClose}>About</a>
        <a className="text-on-surface hover:text-primary font-headline text-3xl transition-colors" href="#menu" onClick={handleClose}>Menu</a>
        <a className="text-on-surface hover:text-primary font-headline text-3xl transition-colors" href="#reservations" onClick={handleClose}>Reservations</a>
        <a className="text-on-surface hover:text-primary font-headline text-3xl transition-colors" href="#contact" onClick={handleClose}>Contact</a>

        {/* CTA */}
        <a
          href="#reservations"
          className="mt-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xl font-medium px-10 py-4 rounded-full hover:opacity-90 shadow-xl"
          onClick={handleClose}
        >
          Book a Table
        </a>
      </div>
    </>
  )
}
