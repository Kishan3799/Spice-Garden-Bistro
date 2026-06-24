

export default function Footer() {
  return (
    <footer className="w-full pt-16 pb-8 bg-surface-container-highest border-t border-primary/10" id="contact">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8 max-w-screen-xl mx-auto">
        
        <div>
          <div className="font-headline text-xl font-bold text-primary mb-6">Spice Garden Bistro</div>
          <p className="font-body text-sm text-on-surface-variant mb-2">123 Culinary Avenue,</p>
          <p className="font-body text-sm text-on-surface-variant mb-6">Connaught Place, New Delhi</p>
          <a className="block font-body text-sm text-on-surface hover:underline decoration-primary transition-opacity opacity-80 hover:opacity-100 mb-2" href="mailto:hello@spicegarden.com">hello@spicegarden.com</a>
          <a className="block font-body text-sm text-on-surface hover:underline decoration-primary transition-opacity opacity-80 hover:opacity-100" href="tel:+919876543210">+91 98765 43210</a>
        </div>
        
        <div>
          <h4 className="font-headline font-bold text-on-surface mb-6">Opening Hours</h4>
          <div className="space-y-2 font-body text-sm text-on-surface-variant">
            <p className="flex justify-between"><span>Mon - Thu:</span> <span>11:00 AM - 10:30 PM</span></p>
            <p className="flex justify-between"><span>Fri - Sun:</span> <span>11:00 AM - 11:30 PM</span></p>
          </div>
        </div>
        
        <div>
          <h4 className="font-headline font-bold text-on-surface mb-6">Social Links</h4>
          <div className="flex flex-col space-y-4">
            <a className="font-body text-sm text-on-surface hover:underline decoration-primary transition-opacity opacity-80 hover:opacity-100 flex items-center gap-2" href="#">
              <span className="material-symbols-outlined text-lg">photo_camera</span> Instagram
            </a>
            <a className="font-body text-sm text-on-surface hover:underline decoration-primary transition-opacity opacity-80 hover:opacity-100 flex items-center gap-2" href="#">
              <span className="material-symbols-outlined text-lg">thumb_up</span> Facebook
            </a>
          </div>
        </div>
        
      </div>
      <div className="text-center mt-16 font-body text-sm tracking-wide text-on-surface-variant opacity-80">
      Spice Garden Bistro  © 2026 Design By <a href="https://craftkoder.com" className="hover:underline">CraftKoder</a> All Rights Reserved.
      </div>
    </footer>
  )
}
