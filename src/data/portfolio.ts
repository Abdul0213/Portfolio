/**
 * Portfolio Data for Abdul Rehman — Graphic Designer
 * Single source of truth for all content, links, projects, experience, and skills.
 */

export interface Project {
  id: string;
  number: string;
  title: string;
  category: 'Branding' | 'Social Media' | 'Real Estate' | 'SaaS' | 'Food & Beverage' | 'Packaging' | 'UI/UX';
  year: string;
  description: string;
  tags: string[];
  image: string;
  gradientFallback: string;
  behanceUrl: string;
}

export interface Service {
  number: string;
  title: string;
  description: string;
  tags: [string, string, string];
  iconName: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  isCurrent?: boolean;
  bullets: string[];
  initial: string;
}

export interface ToolItem {
  name: string;
  role: string;
  color: string;
  textColor: string;
  type: 'ps' | 'ai' | 'figma' | 'canva' | 'capcut';
}

export const PORTFOLIO_LINKS = {
  email: 'mailto:abrehmn02@gmail.com',
  emailAddress: 'abrehmn02@gmail.com',
  phone: 'tel:+923029206760',
  phoneDisplay: '(+92) 302 9206760',
  whatsapp: 'https://wa.me/923029206760',
  behance: 'https://www.behance.net/abdullife',
  instagram: 'https://www.instagram.com/kagenoink/',
  linkedin: 'https://www.linkedin.com/in/abdul-rehman-9017a6322/',
  cv: '/Abdul_Rehman_CV.pdf',
} as const;

export const NAV_LINKS = [
  { label: 'About', href: '#about', index: '01' },
  { label: 'Services', href: '#services', index: '02' },
  { label: 'Work', href: '#work', index: '03' },
  { label: 'Experience', href: '#experience', index: '04' },
  { label: 'Skills', href: '#skills', index: '05' },
  { label: 'Education', href: '#education', index: '06' },
  { label: 'Contact', href: '#contact', index: '07' },
];

export const MARQUEE_ROW_1 = [
  'BRANDING',
  'SOCIAL MEDIA',
  'AD CREATIVES',
  'PACKAGING',
  'UI/UX',
  'BRANDING',
  'SOCIAL MEDIA',
  'AD CREATIVES',
  'PACKAGING',
  'UI/UX',
];

export const MARQUEE_ROW_2 = [
  '3D MOCKUPS',
  'MOTION',
  'LOGO DESIGN',
  'POSTERS',
  'PRINT',
  '3D MOCKUPS',
  'MOTION',
  'LOGO DESIGN',
  'POSTERS',
  'PRINT',
];

export const ABOUT_DATA = {
  label: '(01) — ABOUT ME',
  statement:
    "Hi, I'm Abdul Rehman — a self-taught Graphic Designer with 3+ years of hands-on experience, driven by creativity and curiosity. With a sharp eye for detail and a love for clean, bold visuals, I specialize in digital design, UI/UX and branding. I thrive on learning new tools and turning ideas into designs that not only look great but work.",
  stats: [
    { value: '3+', label: 'Years Experience' },
    { value: '3', label: 'Companies' },
    { value: '4+', label: 'Industries Served' },
  ],
  industries: [
    'Food & Beverage',
    'SaaS',
    'Real Estate',
    'Mechanical & Industrial',
  ],
  languages: [
    { name: 'English', code: 'EN', level: 'Professional working', proficiency: 85 },
    { name: 'Urdu', code: 'UR', level: 'Native', proficiency: 100 },
  ],
  offTheClock: [
    { title: 'First-Person Shooter Gaming', icon: 'Gamepad2' },
    { title: 'Visual Designing', icon: 'Sparkles' },
    { title: 'Manga Reading', icon: 'BookOpen' },
    { title: 'Instrumental Music', icon: 'Headphones' },
  ],
  quote: {
    text: 'Action is the spark that ignites potential.',
    author: 'John Long',
  },
};

export const SERVICES_DATA: Service[] = [
  {
    number: '01',
    title: 'Brand Identity & Logo Design',
    description:
      'Logos, color systems, typography and consistent brand guidelines.',
    tags: ['Logos', 'Color', 'Typography'],
    iconName: 'Palette',
  },
  {
    number: '02',
    title: 'Social Media Design',
    description:
      'Posts, carousels, stories and campaigns that stop the scroll.',
    tags: ['Posts', 'Carousels', 'Stories'],
    iconName: 'LayoutGrid',
  },
  {
    number: '03',
    title: 'Ad Creatives & Marketing',
    description:
      'Performance-driven ad graphics built for click-through rates and brand awareness.',
    tags: ['Meta Ads', 'Banners', 'Campaigns'],
    iconName: 'Flame',
  },
  {
    number: '04',
    title: 'Packaging & 3D Mockups',
    description:
      'Realistic 3D product and packaging mockups to visualize designs before production.',
    tags: ['Packaging', '3D', 'Merch'],
    iconName: 'Box',
  },
  {
    number: '05',
    title: 'UI/UX Presentations',
    description:
      'Clear app and website presentations that explain the design process.',
    tags: ['Figma', 'Flows', 'Decks'],
    iconName: 'MonitorSmartphone',
  },
  {
    number: '06',
    title: 'Short-Form Video',
    description:
      'Engaging reels and short videos with smooth transitions and storytelling.',
    tags: ['CapCut', 'Reels', 'Shorts'],
    iconName: 'Film',
  },
  {
    number: '07',
    title: 'Print & Corporate Design',
    description:
      'Brochures, company profiles, catalogs, menus and posters.',
    tags: ['Brochures', 'Profiles', 'Menus'],
    iconName: 'Printer',
  },
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'real-estate-launch',
    number: '01',
    title: 'Real Estate Launch Campaign',
    category: 'Real Estate',
    year: '2026',
    description:
      'Property brochures, listing creatives and launch campaign visuals for a UAE real estate client.',
    tags: ['Real Estate', 'Branding', 'Brochures', 'UAE Market'],
    image: '/images/project_real_estate_1790922476156.jpg',
    gradientFallback: 'radial-gradient(circle at 70% 30%, #5530A7 0%, #161616 65%, #0E0E0E 100%)',
    behanceUrl: 'https://www.behance.net/abdullife',
  },
  {
    id: 'saas-ad-system',
    number: '02',
    title: 'SaaS Ad Creative System',
    category: 'SaaS',
    year: '2026',
    description:
      'Conversion-focused ad creatives, product visuals and web banners for a UAE SaaS brand.',
    tags: ['SaaS Ads', 'Banners', 'Conversion', 'Digital UI'],
    image: '/images/project_saas_ad_1790922495531.jpg',
    gradientFallback: 'radial-gradient(circle at 30% 70%, #7B5CFF 0%, #1F1F1F 55%, #0E0E0E 100%)',
    behanceUrl: 'https://www.behance.net/abdullife',
  },
  {
    id: 'restaurant-social',
    number: '03',
    title: 'Restaurant Social Campaign',
    category: 'Food & Beverage',
    year: '2026',
    description:
      'Appetizing social media creatives and menu design for a UAE food brand.',
    tags: ['Food & Beverage', 'Menu Design', 'Social Media', 'Creative Direction'],
    image: '/images/project_restaurant_social_1790922508641.jpg',
    gradientFallback: 'radial-gradient(circle at 60% 40%, #E3242B 0%, #2A1520 45%, #0E0E0E 100%)',
    behanceUrl: 'https://www.behance.net/abdullife',
  },
  {
    id: 'industrial-company-profile',
    number: '04',
    title: 'Industrial Company Profile',
    category: 'Branding',
    year: '2026',
    description:
      'Company profile and product catalog for a mechanical/industrial brand.',
    tags: ['Company Profile', 'Technical Catalog', 'Branding', 'Editorial'],
    image: '/images/project_packaging_3d_1790922523095.jpg',
    gradientFallback: 'radial-gradient(circle at 50% 50%, #5530A7 0%, #1F1F1F 60%, #0E0E0E 100%)',
    behanceUrl: 'https://www.behance.net/abdullife',
  },
  {
    id: 'chiltan-pure-packaging',
    number: '05',
    title: 'Chiltan Pure Packaging Mockups',
    category: 'Packaging',
    year: '2025',
    description:
      'Realistic 3D packaging and product mockups visualized before production.',
    tags: ['3D Mockups', 'Cosmetic Packaging', 'Product Visualization', 'Chiltan Pure'],
    image: '/images/project_packaging_3d_1790922523095.jpg',
    gradientFallback: 'radial-gradient(circle at 40% 60%, #7B5CFF 0%, #161616 60%, #0E0E0E 100%)',
    behanceUrl: 'https://www.behance.net/abdullife',
  },
  {
    id: 'chiltan-pure-campaigns',
    number: '06',
    title: 'Chiltan Pure Digital Campaigns',
    category: 'Social Media',
    year: '2025',
    description:
      'Performance-driven ad graphics and campaign visuals aligned with a premium brand identity.',
    tags: ['Meta Ads', 'Social Media', 'Brand Strategy', 'Performance Graphics'],
    image: '/images/project_restaurant_social_1790922508641.jpg',
    gradientFallback: 'radial-gradient(circle at 75% 25%, #5530A7 0%, #2A2A2A 60%, #0E0E0E 100%)',
    behanceUrl: 'https://www.behance.net/abdullife',
  },
  {
    id: 'huemono-identity',
    number: '07',
    title: 'Huemono Brand Identity',
    category: 'Branding',
    year: '2023',
    description:
      'Logo, color palette and typography system kept consistent across all materials.',
    tags: ['Logo Design', 'Visual Identity', 'Color Palette', 'Brand Guidelines'],
    image: '/images/project_saas_ad_1790922495531.jpg',
    gradientFallback: 'radial-gradient(circle at 20% 80%, #7B5CFF 0%, #161616 55%, #0E0E0E 100%)',
    behanceUrl: 'https://www.behance.net/abdullife',
  },
  {
    id: 'uiux-case-presentation',
    number: '08',
    title: 'UI/UX Case Presentation',
    category: 'UI/UX',
    year: '2023',
    description:
      'A clear presentation explaining how an app was planned and designed.',
    tags: ['UI/UX', 'Figma', 'Flows', 'App Architecture'],
    image: '/images/project_real_estate_1790922476156.jpg',
    gradientFallback: 'radial-gradient(circle at 60% 60%, #5530A7 0%, #1F1F1F 55%, #0E0E0E 100%)',
    behanceUrl: 'https://www.behance.net/abdullife',
  },
];

export const WORK_CATEGORIES = [
  'All',
  'Branding',
  'Social Media',
  'Real Estate',
  'SaaS',
  'Food & Beverage',
  'Packaging',
  'UI/UX',
] as const;

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'apex',
    company: 'APEX CREATIVE AGENCY',
    role: 'Graphic Designer',
    period: 'Apr 2026 – Present',
    location: 'Lahore · UAE Clients',
    isCurrent: true,
    initial: 'A',
    bullets: [
      'Designing high-impact visual content for a diverse portfolio of UAE-based brands across food & beverage, SaaS, mechanical and real estate sectors.',
      'Creating appetizing social media creatives, menu designs and promotional campaigns for food and restaurant brands.',
      'Designing clean, conversion-focused ad creatives, product visuals and web banners for SaaS clients.',
      'Producing premium property brochures, listing creatives and launch campaign visuals for real estate clients in the UAE market.',
      'Developing company profiles, product catalogs and technical marketing visuals for mechanical and industrial brands.',
    ],
  },
  {
    id: 'chiltan',
    company: 'CHILTAN PURE PAKISTAN',
    role: 'Senior Graphic Designer',
    period: 'Feb 2024 – Mar 2026',
    location: 'Onsite, Lahore',
    isCurrent: false,
    initial: 'C',
    bullets: [
      'Spearheaded the creation of original visual content, bridging the gap between raw concepts and polished, platform-ready digital assets.',
      'Designed performance-driven ad graphics and marketing materials focused on increasing click-through rates and brand awareness.',
      'Produced and edited engaging short-form video content using CapCut, with advanced transitions and storytelling for social media.',
      'Developed realistic 3D and digital product mockups to visualize new packaging and merchandise before production.',
      'Managed the aesthetic direction of digital campaigns, keeping all content aligned with Chiltan Pure’s premium brand identity.',
    ],
  },
  {
    id: 'huemono',
    company: 'HUEMONO',
    role: 'Junior Graphic Designer',
    period: 'Dec 2022 – Jan 2024',
    location: 'Onsite, Lahore',
    isCurrent: false,
    initial: 'H',
    bullets: [
      'Created social media graphics, YouTube thumbnails, web banners and multi-image carousels to help clients reach more people online.',
      'Designed detailed, easy-to-understand UI/UX presentations showing how apps and websites were planned and built.',
      'Shaped Huemono’s visual identity through logos, color combinations and fonts, kept consistent across all materials.',
      'Collaborated with the marketing team on design ideas and refined visuals based on feedback.',
    ],
  },
];

export const TOOLS_DATA: ToolItem[] = [
  {
    name: 'Photoshop',
    role: 'Photo Editing & Retouching',
    color: '#001E36',
    textColor: '#31A8FF',
    type: 'ps',
  },
  {
    name: 'Illustrator',
    role: 'Vector Design & Logos',
    color: '#330000',
    textColor: '#FF9A00',
    type: 'ai',
  },
  {
    name: 'Figma',
    role: 'UI Design & Presentations',
    color: '#1E1E1E',
    textColor: '#FFFFFF',
    type: 'figma',
  },
  {
    name: 'Canva',
    role: 'Quick Social Content',
    color: '#00C4CC',
    textColor: '#FFFFFF',
    type: 'canva',
  },
  {
    name: 'CapCut',
    role: 'Short-Form Video Editing',
    color: '#000000',
    textColor: '#FFFFFF',
    type: 'capcut',
  },
];

export const SKILLS_PLAYGROUND_LIST = [
  { name: 'Typography & Layout', variant: 'violet' },
  { name: 'Color Theory', variant: 'outline' },
  { name: 'Illustration & Vector Art', variant: 'white' },
  { name: 'Image Editing & Retouching', variant: 'outline' },
  { name: 'Social Media Graphics', variant: 'violet' },
  { name: 'Logo Design', variant: 'white' },
  { name: 'Poster Design', variant: 'outline' },
  { name: 'Branding', variant: 'violet' },
  { name: '3D Product Mockups', variant: 'white' },
  { name: 'Ad Creatives', variant: 'violet' },
  { name: 'UI/UX Presentations', variant: 'outline' },
  { name: 'Video Editing', variant: 'white' },
  { name: 'Communication', variant: 'outline' },
  { name: 'Collaboration', variant: 'violet' },
  { name: 'Creativity', variant: 'white' },
  { name: 'Resilience', variant: 'outline' },
];

export const EDUCATION_DATA = [
  {
    institution: 'Arfa Karim Technology Incubator (AKTI)',
    program: 'Graphic Design Course',
    duration: '3 Months',
    period: 'Intensive Training',
  },
  {
    institution: 'Govt. Islamia High School',
    program: 'Matriculation in Arts',
    duration: '10 Years',
    period: '2011 – 2021',
  },
];

export const HERO_PROFILE_IMAGE = '/images/abdul_rehman_portrait_1790922540468.jpg';
