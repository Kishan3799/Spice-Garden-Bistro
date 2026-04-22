import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  CheckCircle,
  XCircle,
  Loader,
  UtensilsCrossed,
  Phone,
  Clock,
  CalendarDays,
  Users,
  ChevronDown,
  MapPin,
  Star,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ─── EmailJS Configuration ───────────────────────────────────────
// Get these from https://dashboard.emailjs.com/admin
// Service ID  → EmailJS Dashboard → Email Services → your service
// Template ID → EmailJS Dashboard → Email Templates → your template
// Public Key  → EmailJS Dashboard → Account → General → Public Key
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'YOUR_PUBLIC_KEY'
// ────────────────────────────────────────────────────────────────

const initialForm   = { name: '', phone: '', date: '', time: '', guests: '' }
const initialErrors = { name: '', phone: '', date: '', time: '', guests: '' }

// ── Validators ───────────────────────────────────────────────────
function validate(fields) {
  const errors = { ...initialErrors }
  let isValid = true

  if (!fields.name.trim()) {
    errors.name = 'Full name is required.'
    isValid = false
  } else if (fields.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
    isValid = false
  }

  const phoneRegex = /^[+]?[\d\s\-().]{7,15}$/
  if (!fields.phone.trim()) {
    errors.phone = 'Phone number is required.'
    isValid = false
  } else if (!phoneRegex.test(fields.phone.trim())) {
    errors.phone = 'Enter a valid phone number.'
    isValid = false
  }

  if (!fields.date) {
    errors.date = 'Please choose a date.'
    isValid = false
  } else {
    const chosen = new Date(fields.date)
    const today  = new Date()
    today.setHours(0, 0, 0, 0)
    if (chosen < today) {
      errors.date = 'Date cannot be in the past.'
      isValid = false
    }
  }

  if (!fields.time) {
    errors.time = 'Please choose a time.'
    isValid = false
  }

  if (!fields.guests) {
    errors.guests = 'Please select the number of guests.'
    isValid = false
  }

  return { errors, isValid }
}

// ── Field Error ──────────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 text-xs text-error font-body flex items-center gap-1.5">
      <XCircle size={11} />
      {msg}
    </p>
  )
}

// ── Floating Label Input ─────────────────────────────────────────
function FloatingInput({ id, type = 'text', label, value, onChange, onBlur, error, touched, min, icon: Icon }) {
  const isSuccess = touched && !error && value
  const borderColor = error
    ? 'border-error'
    : isSuccess
    ? 'border-[#5a8a5a]'
    : 'border-outline-variant/50 focus-within:border-primary'

  return (
    <div className="relative group">
      <div className={`relative flex items-center border-b-2 transition-all duration-300 bg-transparent pb-1 ${borderColor}`}>
        {Icon && (
          <Icon
            size={16}
            className={`mr-3 flex-shrink-0 transition-colors duration-300 ${
              error ? 'text-error' : isSuccess ? 'text-[#5a8a5a]' : 'text-on-surface-variant/50 group-focus-within:text-primary'
            }`}
          />
        )}
        <div className="relative flex-1">
          <input
            id={id}
            type={type}
            placeholder=" "
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            min={min}
            className="peer block w-full bg-transparent pt-5 pb-0.5 text-on-surface font-body text-base focus:outline-none focus:ring-0 appearance-none"
          />
          <label
            htmlFor={id}
            className="absolute left-0 top-4 text-on-surface-variant/70 font-body text-sm transition-all duration-200 pointer-events-none
              peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary peer-focus:font-medium
              peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:font-medium"
          >
            {label}
          </label>
        </div>
        {isSuccess && !error && (
          <CheckCircle size={14} className="text-[#5a8a5a] ml-2 flex-shrink-0" />
        )}
      </div>
      <FieldError msg={error} />
    </div>
  )
}

// ── Info Badge ───────────────────────────────────────────────────
function InfoBadge({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/15">
      <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-[#f5bd64]" />
      </div>
      <div>
        <p className="text-white/50 font-body text-[10px] uppercase tracking-widest">{label}</p>
        <p className="text-white font-body text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────
export default function ReservationForm() {
  const sectionRef  = useRef(null)
  const leftRef     = useRef(null)
  const rightRef    = useRef(null)

  const [formData, setFormData]       = useState(initialForm)
  const [errors, setErrors]           = useState(initialErrors)
  const [touched, setTouched]         = useState({})
  const [submitState, setSubmitState] = useState('idle') // idle | loading | success | error

  // ── Scroll reveal ────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left panel slides in from left
      gsap.from(leftRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        x: -60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
      })
      // Right panel slides in from right
      gsap.from(rightRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        x: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.15,
      })
      // Stagger children inside left panel
      gsap.from('.hero-badge', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true },
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.4,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // ── Real-time validation ─────────────────────────────────────
  useEffect(() => {
    const { errors: newErrors } = validate(formData)
    const visibleErrors = { ...initialErrors }
    Object.keys(touched).forEach((key) => {
      if (touched[key]) visibleErrors[key] = newErrors[key]
    })
    setErrors(visibleErrors)
  }, [formData, touched])

  // ── Handlers ────────────────────────────────────────────────
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleBlur = (e) => {
    const { id } = e.target
    setTouched((prev) => ({ ...prev, [id]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, phone: true, date: true, time: true, guests: true })

    const { errors: allErrors, isValid } = validate(formData)
    setErrors(allErrors)
    if (!isValid) return

    setSubmitState('loading')

    try {
      const templateParams = {
        from_name: formData.name,
        phone:     formData.phone,
        date:      formData.date,
        time:      formData.time,
        guests:    formData.guests,
        reply_to:  'noreply@spicegarden.com',
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )

      setSubmitState('success')
      setFormData(initialForm)
      setTouched({})
    } catch (err) {
      console.error('EmailJS error:', err)
      setSubmitState('error')
    }
  }

  const handleReset = () => {
    setSubmitState('idle')
    setFormData(initialForm)
    setErrors(initialErrors)
    setTouched({})
  }

  // ── Guest options ────────────────────────────────────────────
  const guestOptions = ['1 Person', '2 People', '3 People', '4 People', '5 People', '6+ People (Contact us)']

  // ── Success Screen ───────────────────────────────────────────
  if (submitState === 'success') {
    return (
      <section
        ref={sectionRef}
        id="reservations"
        className="relative py-28 px-6 bg-surface overflow-hidden"
      >
        {/* Ambient blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10 text-center">
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-12 md:p-16 shadow-[0_24px_80px_rgba(30,27,22,0.08)] border border-outline-variant/15">
            {/* Animated check */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#edf7ed] flex items-center justify-center">
              <CheckCircle size={40} className="text-[#2e7d32]" />
            </div>
            <div className="inline-flex items-center gap-2 bg-primary/8 text-primary rounded-full px-4 py-1.5 text-xs font-label font-semibold uppercase tracking-widest mb-6">
              <Star size={10} fill="currentColor" /> Reservation Received
            </div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">
              See you at the table!
            </h2>
            <p className="font-body text-on-surface-variant mb-3 text-base leading-relaxed">
              Thank you, <strong className="text-on-surface">{formData.name || 'Guest'}</strong>! Your table request
              has been received. Our team will call you shortly to confirm.
            </p>
            <p className="font-body text-on-surface-variant/60 text-sm mb-10">
              Questions? Reach us at{' '}
              <a href="tel:+919876543210" className="text-primary font-medium underline underline-offset-2">
                +91 98765 43210
              </a>
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label font-semibold px-8 py-4 rounded-full shadow-[0_8px_32px_rgba(148,46,2,0.3)] hover:shadow-[0_12px_40px_rgba(148,46,2,0.45)] hover:opacity-95 transition-all duration-300"
            >
              <CalendarDays size={16} />
              Make Another Reservation
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="reservations"
      className="relative py-24 px-4 md:px-6 bg-surface overflow-hidden"
    >
      {/* Ambient background blobs */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-primary/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ── Split card wrapper ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 rounded-[2rem] overflow-hidden shadow-[0_32px_100px_rgba(30,27,22,0.12)] border border-outline-variant/10">

          {/* ── LEFT: Hero panel (2/5) ─────────────────────────── */}
          <div
            ref={leftRef}
            className="lg:col-span-2 relative bg-gradient-to-br from-[#6b1501] via-primary to-[#b5451b] p-8 md:p-10 flex flex-col justify-between overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute top-1/2 right-4 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2" />

            {/* Top content */}
            <div className="relative z-10">
              {/* Icon badge */}
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-8 border border-white/20">
                <UtensilsCrossed size={24} className="text-[#f5bd64]" />
              </div>

              {/* Pre-title */}
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-4">
                <Star size={10} className="text-[#f5bd64]" fill="#f5bd64" />
                <span className="text-white/80 font-body text-xs uppercase tracking-widest">
                  Private Dining
                </span>
              </div>

              <h2 className="font-headline text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Reserve Your<br />
                <span className="text-[#f5bd64] italic font-normal">Perfect Table</span>
              </h2>

              <p className="font-body text-white/70 text-sm leading-relaxed max-w-xs">
                Every meal is a story. Let us craft yours — from the first sip to the last sweet moment.
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 my-8">
                <div className="h-px flex-1 bg-white/15" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#f5bd64]/60" />
                <div className="h-px flex-1 bg-white/15" />
              </div>
            </div>

            {/* Bottom: Info badges */}
            <div className="relative z-10 space-y-3">
              <p className="text-white/40 font-body text-[10px] uppercase tracking-widest mb-4">
                Quick Info
              </p>
              <div className="hero-badge">
                <InfoBadge icon={Clock} label="Opening Hours" value="11:00 AM – 11:00 PM" />
              </div>
              <div className="hero-badge">
                <InfoBadge icon={Phone} label="Reservations" value="+91 98765 43210" />
              </div>
              <div className="hero-badge">
                <InfoBadge icon={MapPin} label="Location" value="MG Road, Bangalore" />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Form panel (3/5) ────────────────────────── */}
          <div
            ref={rightRef}
            className="lg:col-span-3 bg-surface-container-lowest p-8 md:p-12"
          >
            {/* Error banner */}
            {submitState === 'error' && (
              <div className="mb-8 flex items-start gap-3 bg-error-container text-on-error-container rounded-2xl px-4 py-4 border border-error/15">
                <XCircle size={18} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-sm font-semibold mb-0.5">Oops, something went wrong.</p>
                  <p className="font-body text-xs opacity-80">
                    Please try again or call{' '}
                    <a href="tel:+919876543210" className="underline font-medium">
                      +91 98765 43210
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-1">
                Book a Table
              </h3>
              <p className="font-body text-on-surface-variant text-sm">
                Fill in the details below — we'll confirm within the hour.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-7">

              {/* Row 1: Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <FloatingInput
                  id="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name}
                  touched={touched.name}
                  icon={Users}
                />
                <FloatingInput
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone}
                  touched={touched.phone}
                  icon={Phone}
                />
              </div>

              {/* Row 2: Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <FloatingInput
                  id="date"
                  type="date"
                  label="Date"
                  value={formData.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.date}
                  touched={touched.date}
                  icon={CalendarDays}
                  min={new Date().toISOString().split('T')[0]}
                />
                <FloatingInput
                  id="time"
                  type="time"
                  label="Time"
                  value={formData.time}
                  onChange={(e) => {
                    handleChange(e)
                  }}
                  onBlur={handleBlur}
                  error={errors.time}
                  touched={touched.time}
                  icon={Clock}
                  min="11:00"
                  max="23:00"
                />
              </div>

              {/* Row 3: Guests (full-width custom select) */}
              <div>
                <div
                  className={`relative flex items-center border-b-2 pb-1 transition-all duration-300 ${
                    errors.guests
                      ? 'border-error'
                      : touched.guests && !errors.guests && formData.guests
                      ? 'border-[#5a8a5a]'
                      : 'border-outline-variant/50 focus-within:border-primary'
                  }`}
                >
                  <Users
                    size={16}
                    className={`mr-3 flex-shrink-0 transition-colors ${
                      errors.guests
                        ? 'text-error'
                        : touched.guests && !errors.guests && formData.guests
                        ? 'text-[#5a8a5a]'
                        : 'text-on-surface-variant/50'
                    }`}
                  />
                  <div className="relative flex-1">
                    <select
                      id="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full bg-transparent pt-5 pb-0.5 text-on-surface font-body text-base focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled hidden></option>
                      {guestOptions.map((opt, i) => (
                        <option key={i} value={i === guestOptions.length - 1 ? '6+' : String(i + 1)}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {/* Floating label for select */}
                    <label
                      htmlFor="guests"
                      className={`absolute left-0 pointer-events-none font-body transition-all duration-200 ${
                        formData.guests
                          ? 'top-0 text-xs font-medium text-primary'
                          : 'top-4 text-sm text-on-surface-variant/70'
                      }`}
                    >
                      Number of Guests
                    </label>
                  </div>
                  <ChevronDown
                    size={16}
                    className="text-on-surface-variant/50 pointer-events-none ml-2 flex-shrink-0"
                  />
                </div>
                <FieldError msg={errors.guests} />
              </div>

              {/* Special Occasion note (optional extra flair) */}
              <div className="bg-surface-container-low rounded-2xl px-5 py-4 border border-outline-variant/15 flex items-center gap-3">
                <Star size={14} className="text-secondary flex-shrink-0" fill="#7f5600" />
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                  Celebrating something special?{' '}
                  <span className="text-primary font-medium">
                    Mention it when we call — we love creating magic moments.
                  </span>
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitState === 'loading'}
                className="relative w-full overflow-hidden group bg-gradient-to-r from-primary to-primary-container text-on-primary font-label font-semibold text-base py-4 rounded-full shadow-[0_8px_32px_rgba(148,46,2,0.3)] hover:shadow-[0_12px_40px_rgba(148,46,2,0.45)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-400 flex items-center justify-center gap-2.5"
              >
                {/* Shine sweep */}
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />

                {submitState === 'loading' ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Sending your request…
                  </>
                ) : (
                  <>
                    <CalendarDays size={16} />
                    Reserve Now
                  </>
                )}
              </button>

              <p className="text-center font-body text-[11px] text-on-surface-variant/50 leading-relaxed">
                By submitting, you agree to be contacted by our team to confirm your booking.
                <br />No spam — ever.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
