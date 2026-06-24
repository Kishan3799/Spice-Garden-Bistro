import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, CheckCircle, XCircle, Loader } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
// ────────────────────────────────────────────────────────────────

const initialForm = { name: '', phone: '', date: '', time: '', guests: '' }
const initialErrors = { name: '', phone: '', date: '', time: '', guests: '' }

// ── Validators ──────────────────────────────────────────────────
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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (chosen < today) {
      errors.date = 'Date cannot be in the past.'
      isValid = false
    }
  }

  if (!fields.time) {
    errors.time = 'Please choose a time.'
    isValid = false
  } else {
    const [h] = fields.time.split(':').map(Number)
    if (h < 11 || h >= 23) {
      errors.time = 'Please choose a time between 11:00 AM and 11:00 PM.'
      isValid = false
    }
  }

  if (!fields.guests) {
    errors.guests = 'Please select the number of guests.'
    isValid = false
  }

  return { errors, isValid }
}

// ── Field Error message ──────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="mt-1 text-xs text-error font-body flex items-center gap-1">
      <XCircle size={12} /> {msg}
    </p>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return dateStr
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })
}

function formatTime(timeStr) {
  if (!timeStr) return timeStr
  const [h, m] = timeStr.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`
}

export default function ReservationForm() {
  const containerRef = useRef(null)
  const formRef = useRef(null)

  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState(initialErrors)
  const [touched, setTouched] = useState({})        // which fields were touched
  const [submitState, setSubmitState] = useState('idle')   // 'idle' | 'loading' | 'success' | 'error'
  const [submittedName, setSubmittedName] = useState(null)


  // ── Scroll reveal ──────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reservation-content', {
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // ── Validate touched fields in real-time ──────────────────────
  useEffect(() => {
    const { errors: newErrors } = validate(formData)
    // Only show errors for fields the user has interacted with
    const visibleErrors = { ...initialErrors }
    Object.keys(touched).forEach((key) => {
      if (touched[key]) visibleErrors[key] = newErrors[key]
    })
    setErrors(visibleErrors)
  }, [formData, touched])

  // ── Handlers ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleBlur = (e) => {
    const { id } = e.target
    setTouched((prev) => ({ ...prev, [id]: true }))
  }

  useEffect(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })
  }, [])



  const handleSubmit = async (e) => {
    e.preventDefault()
    // Mark all fields as touched to show all errors
    setTouched({ name: true, phone: true, date: true, time: true, guests: true })

    const { errors: allErrors, isValid } = validate(formData)
    setErrors(allErrors)
    if (!isValid) return

    setSubmitState('loading')

    try {
      // Template variables sent to EmailJS — match these to your template's {{variables}}
      const templateParams = {
        from_name: formData.name,
        phone: formData.phone,
        date: formatDate(formData.date),  // → "Saturday, 19 April 2026"
        time: formatTime(formData.time),  // → "7:30 PM"
        guests: formData.guests,
      }



      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
      )


      setSubmittedName(formData.name)
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

  // ── Helper: input border color ─────────────────────────────────
  const borderClass = (field) =>
    errors[field]
      ? 'border-error focus:border-error'
      : touched[field] && !errors[field]
        ? 'border-tertiary focus:border-tertiary'   // green-ish success
        : 'border-outline-variant/40 focus:border-primary'

  // ── Success screen ─────────────────────────────────────────────
  if (submitState === 'success') {
    return (
      <section ref={containerRef} className="py-32 px-6 bg-surface relative overflow-hidden" id="reservations">
        <div className="absolute -right-64 -bottom-64 w-[800px] h-[800px] bg-surface-container-low rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 bg-surface-container-lowest p-12 md:p-16 rounded-[2rem] shadow-[0_16px_64px_rgba(30,27,22,0.06)] border border-outline-variant/20 text-center">
          <CheckCircle size={64} className="text-tertiary mx-auto mb-6" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">
            Reservation Confirmed! 🎉
          </h2>
          <p className="font-body text-lg text-on-surface-variant mb-8">
            Thank you, <strong>{submittedName || 'Guest'}</strong>! Your table request has been received.
            We'll reach out to confirm your booking shortly.
          </p>
          <button
            onClick={handleReset}
            className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-lg font-medium px-10 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg"
          >
            Make Another Reservation
          </button>
        </div>
      </section>
    )
  }

  return (
    <section ref={containerRef} className="py-32 px-6 bg-surface relative overflow-hidden" id="reservations">
      {/* Decorative blob */}
      <div className="absolute -right-64 -bottom-64 w-[800px] h-[800px] bg-surface-container-low rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="reservation-content max-w-3xl mx-auto relative z-10 bg-surface-container-lowest p-8 md:p-16 rounded-[2rem] shadow-[0_16px_64px_rgba(30,27,22,0.06)] border border-outline-variant/20">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface mb-4">
            Reserve Your Table Today
          </h2>
          <p className="font-body text-base md:text-lg text-on-surface-variant">
            Secure your spot for an unforgettable evening.
          </p>
        </div>

        {/* Error banner */}
        {submitState === 'error' && (
          <div className="mb-8 p-4 rounded-xl bg-error-container text-on-error-container font-body text-sm flex items-start gap-3">
            <XCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span>
              Something went wrong sending your request. Please try again or call us at{' '}
              <a href="tel:+919876543210" className="underline font-semibold">+91 98765 43210</a>.
            </span>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Full Name */}
            <div className="relative group">
              <input
                id="name"
                type="text"
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full bg-transparent border-0 border-b py-3 px-0 text-on-surface focus:ring-0 transition-colors font-body text-lg peer ${borderClass('name')}`}
              />
              <label
                htmlFor="name"
                className="absolute left-0 top-3 text-on-surface-variant font-label text-lg transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-primary peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:text-sm cursor-text"
              >
                Full Name
              </label>
              <FieldError msg={errors.name} />
            </div>

            {/* Phone */}
            <div className="relative group">
              <input
                id="phone"
                type="tel"
                placeholder=" "
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full bg-transparent border-0 border-b py-3 px-0 text-on-surface focus:ring-0 transition-colors font-body text-lg peer ${borderClass('phone')}`}
              />
              <label
                htmlFor="phone"
                className="absolute left-0 top-3 text-on-surface-variant font-label text-lg transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-primary peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:text-sm cursor-text"
              >
                Phone Number
              </label>
              <FieldError msg={errors.phone} />
            </div>

            {/* Date */}
            <div className="relative group">
              <label htmlFor="date" className="block text-primary font-label text-sm mb-1">Date</label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                onBlur={handleBlur}
                min={new Date().toISOString().split('T')[0]}
                className={`block w-full bg-transparent border-0 border-b py-3 px-0 text-on-surface focus:ring-0 transition-colors font-body text-lg ${borderClass('date')}`}
              />
              <FieldError msg={errors.date} />
            </div>

            {/* Time */}
            <div className="relative group">
              <label htmlFor="time" className="block text-primary font-label text-sm mb-1">Time</label>
              <input
                id="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                onBlur={handleBlur}
                min="11:00"
                max="23:00"
                className={`block w-full bg-transparent border-0 border-b py-3 px-0 text-on-surface focus:ring-0 transition-colors font-body text-lg ${borderClass('time')}`}
              />
              <FieldError msg={errors.time} />
            </div>

            {/* Guests */}
            <div className="relative group md:col-span-2">
              <label htmlFor="guests" className="block text-primary font-label text-sm mb-1">Number of Guests</label>
              <div className="relative">
                <select
                  id="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full bg-transparent border-0 border-b py-3 px-0 text-on-surface focus:ring-0 transition-colors font-body text-lg appearance-none cursor-pointer ${borderClass('guests')}`}
                >
                  <option value="" disabled>Select guests</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5+">5+ People (Contact us)</option>
                </select>
                <ChevronDown size={22} className="absolute right-0 top-3.5 text-on-surface-variant pointer-events-none" />
              </div>
              <FieldError msg={errors.guests} />
            </div>

          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitState === 'loading'}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xl font-medium py-5 rounded-full mt-8 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity shadow-lg flex items-center justify-center gap-3"
          >
            {submitState === 'loading' ? (
              <>
                <Loader size={22} className="animate-spin" />
                Sending…
              </>
            ) : (
              'Reserve Now'
            )}
          </button>

          <p className="text-center font-body text-xs text-on-surface-variant/60 mt-4">
            By submitting, you agree to be contacted by our team to confirm your booking.
          </p>
        </form>
      </div>
    </section>
  )
}
