import type { Facebook } from "lucide-react";

export const siteConfig = {
  name: 'Omar Fuentes',
  description: 'Web Design, Development and SEO Company in USA for Small Business',
  logo: {
    src: '/logo-omar-fuentes.svg',
    srcDark: '/logo-omar-fuentes.svg',
    alt: 'Omar Fuentes Logo',
    strategy: 'invert' as 'invert' | 'switch' | 'static',
  },
  ogImage: '/imagen-destacada-omarfuentes.jpg',
  primaryColor: '#00008B',
  search: {
    enabled: true,
  },
  announcement: {
    enabled: true,
    id: 'launch_v1_en',
    link: 'https://wa.me/573107851074?text=Hi%20Omar,%20I%20saw%20your%20website%20and%20want%20to%20get%20a%20quote.',
    localizeLink: false,
  },
  blog: {
    postsPerPage: 6,
  },
  contact: {
    email: {
      support: 'contact@omarfuentes.com',
      sales: 'contact@omarfuentes.com',
    },
    phone: {
      main: '+57 310 785 1074',
      label: 'Mon-Fri 9am-6pm EST'
    },
    address: {
      city: 'Cali',
      full: 'Cali, Valle del Cauca, Colombia'
    }
  },
  analytics: {
    alwaysLoad: false,
    vendors: {
      googleAnalytics: {
        id: 'G-NBYYE8QMXG',
        enabled: true,
      },
      rybbit: {
        id: "your-site-id",
        src: 'https://analytics.gladtek.cloud/api/script.js',
        enabled: false,
      },
      umami: {
        id: "your-website-id",
        src: 'https://analytics.umami.is/script.js',
        enabled: false,
      },
    },
  },
  dateOptions: {
    localeMapping: {
        'en': 'en-US',
    }
  }
};

export const NAV_LINKS = [
  { 
    href: '/en/services', 
    label: 'Services',
    children: [
        { href: '/en/services', label: 'Web Development', description: 'Design, development & programming', icon: 'Zap' },
        { href: '/en/affordable-seo-services-for-small-business', label: 'SEO', description: 'SEO optimization & ranking', icon: 'Search' },
        { href: '/en/pricing', label: 'Pricing', description: 'Plans for every business', icon: 'CreditCard' },
    ]
  },
  { 
    href: '/en/blog', 
    label: 'Resources',
    children: [
        { href: '/en/blog', label: 'Blog', description: 'SEO tips & web design guides', icon: 'Newspaper' },
        { href: '/en/tools', label: 'Tools', description: 'Content generators & utilities', icon: 'Cpu' },
        { href: '/en/support', label: 'Support', description: 'Technical help & maintenance', icon: 'FileClock' },
    ]
  },
  { 
    href: '/en/portfolio/projects', 
    label: 'Portfolio',
    children: [
        { href: '/en/portfolio/projects', label: 'All Projects', description: 'Our complete portfolio', icon: 'LayoutGrid' },
        { href: '/en/system-design', label: 'System Design', description: 'Architecture & planning', icon: 'Cpu' },
    ]
  },
  { 
    href: '/en/about', 
    label: 'Company',
    children: [
        { href: '/en/about', label: 'About Us', description: 'Our story & mission', icon: 'Building2' },
        { href: '/en/contact', label: 'Contact', description: 'Get in touch with us', icon: 'Mail' },
    ]
  },
];

export const ACTION_LINKS = {
  primary: { label: 'Get Started', href: '/en/contact' },
  social: { 
    linkedin: 'https://www.linkedin.com/in/omarfuentes052/',
    youtube: 'https://www.youtube.com/@OmarFuentes052',
    github: 'https://github.com/onar1710',
    facebook: 'https://www.facebook.com/omarfuentes052',
    twitter: 'https://x.com/omarfuentes052'
  }
};

export const FOOTER_LINKS = {
  product: {
    title: 'Solutions',
    links: [
      { href: '/en/services', label: 'Services' },
      { href: '/en/affordable-seo-services-for-small-business', label: 'SEO' },
      { href: '/en/pricing', label: 'Pricing' },
      { href: '/en/portfolio/projects', label: 'Portfolio' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { href: '/en/about', label: 'About Us' },
      { href: '/en/contact', label: 'Contact' },
      { href: '/en/blog', label: 'Blog' },
      { href: '/en/support', label: 'Support' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { href: '/en/privacy-policy', label: 'Privacy Policy' },
      { href: '/en/terms-conditions', label: 'Terms & Conditions' },
      { href: '/en/legal-notice', label: 'Legal Notice' },
      { href: '/en/cookies-policy', label: 'Cookies Policy' },
      { href: '/en/refund-policy', label: 'Refund Policy' },
    ],
  },
};
