import Link from "next/link"
import Image from "next/image"

const footerLinks = {
  quickLinks: [
    { href: "/all-schools", label: "School Directory" },
    { href: "/about", label: "About Us" },
    { href: "/help-center", label: "Help Center" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-and-conditions", label: "Terms and Conditions" },
    { href: "/community-guidelines", label: "Community Guidelines" },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image 
                  src="/ratemycollegeclub.png" 
                  alt="Rate My College Club Logo" 
                  width={40} 
                  height={40} 
                  priority 
                />
              </div>
              <span className="font-bold text-lg">RateMyCollegeClub™</span>
            </div>
            <p className="text-gray-400 max-w-md">
              The premier platform for college students to discover, rate, and review campus clubs and organizations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} RateMyCollegeClub™. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
