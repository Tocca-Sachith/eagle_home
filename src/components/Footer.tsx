import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-brand-gold">Eagle Home & Construction</h3>
            <p className="text-gray-300">
              Building dreams, creating homes. Your trusted partner for construction excellence.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-brand-gold transition-colors">Home</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-brand-gold transition-colors">Services</Link></li>
              <li><Link href="/projects" className="text-gray-300 hover:text-brand-gold transition-colors">Projects</Link></li>
              <li><Link href="/process" className="text-gray-300 hover:text-brand-gold transition-colors">Process</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-brand-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@eaglehome.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Available for international clients</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Eagle Home & Construction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
