"use client";

import Link from 'next/link';
import { Facebook, Twitter, Rss, Globe2, Image } from 'lucide-react';

interface FooterSection {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

const footerSections: FooterSection[] = [
  {
    title: 'WEEBLY THEMES',
    links: [
      { label: 'Pre-Sale FAQs', href: '/faqs' },
      { label: 'Submit a Ticket', href: '/contact' }
    ]
  },
  {
    title: 'SERVICES',
    links: [
      { label: 'Theme Tweak', href: '/services/theme-tweak' }
    ]
  },
  {
    title: 'SHOWCASE',
    links: [
      { label: 'Widgetkit', href: '/showcase/widgetkit' },
      { label: 'Support', href: '/support' }
    ]
  },
  {
    title: 'ABOUT US',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Affiliates', href: '/affiliates' },
      { label: 'Resources', href: '/resources' }
    ]
  }
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Rss, href: '#', label: 'RSS Feed' },
  { icon: Globe2, href: '#', label: 'Website' },
  { icon: Image, href: '#', label: 'Gallery' }
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        {/* <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-medium text-emerald-400">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div> */}

        {/* Logo Section */}
        <div className="py-6 sm:py-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <Link href="/" className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                LOGO
              </Link>
              <p className="mt-1 text-xs sm:text-sm text-gray-400">SOLOGAN COMPANY</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-4 sm:py-6 border-t border-white/5 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            ©{new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}