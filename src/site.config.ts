import type { Facebook } from "lucide-react";

export const siteConfig = {
  name: 'Omar Fuentes',
  description: 'Premium Astro Boilerplate for explorers.',
  logo: {
    src: '/logo-omar-fuentes.svg',
    srcDark: '/logo-omar-fuentes.svg',       // Used when strategy is 'switch'
    alt: 'Logo Omar Fuentes',
    strategy: 'invert' as 'invert' | 'switch' | 'static', // 'invert' | 'switch' | 'static'
  },
  ogImage: '/og-image.webp',
  primaryColor: '#00008B', // Default primary color
  search: {
    enabled: true,
  },
  announcement: {
    enabled: true,
    id: 'launch_v1', // Change this ID to reshow the banner
    link: '/changelog',
    localizeLink: true, // Set to true to apply i18n routing to the link, false for external/absolute links
  },
  blog: {
    postsPerPage: 6,
  },
  contact: {
    email: {
      support: 'joseomarfernandez747@gmail.com',
      sales: 'joseomarfernandez747@gmail.com',
    },
    phone: {
      main: '+57 310 785 1074',
      label: 'Lun-Vie 9am-6pm PST'
    },
    address: {
      city: 'Cali',
      full: 'Cali, Valle del Cauca, Colombia'
    }
  },
  analytics: {
    alwaysLoad: false, // Set to true to bypass cookie consent check
    vendors: {
      googleAnalytics: {
        id: 'G-XXXXXXXXXX', // Reemplazar con tu ID real de Google Analytics
        enabled: false,
      },
      rybbit: {
        id: "your-site-id", // Reemplazar con tu ID real de Rybbit
        src: 'https://analytics.gladtek.cloud/api/script.js', // Default source
        enabled: false,
      },
      umami: {
        id: "your-website-id", // Reemplazar con tu ID real de Umami
        src: 'https://analytics.umami.is/script.js', // Default source
        enabled: false,
      },
      // Add other vendors here (e.g. Plausible, Fathom)
    },
  },
  dateOptions: {
    localeMapping: {
        'ar': 'ar-TN', // Force Maghreb Arabic date format (e.g., جانفي instead of يناير)
        'en': 'en-GB', // Example: Force UK English date format
    }
  }
};

export const NAV_LINKS = [
  { 
    href: '/caracteristicas', 
    label: 'Product',
    children: [
        { href: '/caracteristicas', label: 'Features', description: 'What makes us different', icon: 'Zap' },
        { href: '/precios', label: 'Pricing', description: 'Plans for every team', icon: 'CreditCard' },
    ]
  },
  { 
    href: '/docs', 
    label: 'Resources',
    children: [
        { href: '/blog', label: 'Blog', description: 'Latest updates & guides', icon: 'Newspaper' },
        { href: '/soporte', label: 'Changelog', description: 'New features & fixes', icon: 'FileClock' },
    ]
  },
  { href: '/portfolio', 
    label: 'Work',
    children: [
        { href: '/portfolio/proyectos', label: 'All Projects', description: 'Our complete portfolio', icon: 'LayoutGrid' },
        { href: '/sistema-diseño', label: 'Design System', description: 'Style guide & tokens', icon: 'Palette' },
    ]
  },
  { 
    href: '/sobre-mi', 
    label: 'Company',
    children: [
        { href: '/sobre-mi', label: 'About', description: 'Our story & mission', icon: 'Building2' },
        { href: '/contacto', label: 'Contact', description: 'Get in touch with us', icon: 'Mail' },
    ]
  },
];

export const ACTION_LINKS = {
  primary: { label: 'Get Started', href: '/blog' },
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
    title: 'Product',
    links: [
      { href: '/caracteristicas', label: 'Features' },
      { href: '/sobre-mi', label: 'About' },
      { href: '/precios', label: 'Pricing' },
      { href: '/changelog', label: 'Changelog' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { href: '/politica-privacidad', label: 'Privacy', localize: false },
      { href: '/terminos-condiciones', label: 'Terms', localize: false },
      { href: '/aviso-legal', label: 'legalnotice', localize: false },
      { href: '/politicas-cookies', label: 'Cookies', localize: false }
    ],
  },
};
