import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiPhone,
  FiMail,
  FiMapPin,
  FiArrowUpRight,
} from 'react-icons/fi';

const SOCIAL_LINKS = [
  {
    icon: <FiFacebook />,
    url: '#fb',
    color: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
  },
  {
    icon: <FiTwitter />,
    url: '#tw',
    color: 'hover:bg-[#1DA1F2] hover:border-[#1DA1F2]',
  },
  {
    icon: <FiInstagram />,
    url: '#ig',
    color: 'hover:bg-[#E1306C] hover:border-[#E1306C]',
  },
  {
    icon: <FiLinkedin />,
    url: '#ln',
    color: 'hover:bg-[#0077B5] hover:border-[#0077B5]',
  },
];

const FOOTER_DATA = {
  companyDescription: {
    en: 'The leading premium digital platform for home repair services in Bangladesh. Providing expert verified handymen straight to your doorstep.',
    bn: 'বাংলাদেশের নির্ভরযোগ্য ও প্রথম সারির ডিজিটাল মেকানিক্যাল-হোম-সার্ভিস প্ল্যাটফর্ম। আমরা আপনার ঘরে পৌঁছে দিই যাচাইকৃত ও দক্ষ কারিগরি টিম।',
  },
  servicesTitle: { en: 'POPULAR SERVICES', bn: 'জনপ্রিয় সেবাসমূহ' },
  services: [
    { en: 'AC Repair', bn: 'এসি মেরামত', slug: 'sub/ac-repair' },
    {
      en: 'Electrical Solution',
      bn: 'ইলেকট্রিক্যাল সলিউশন',
      slug: 'sub/electrical-solution',
    },
    {
      en: 'Plumbing & Fitting',
      bn: 'প্লাম্বিং ও ফিটিং',
      slug: 'sub/plumbing-fitting',
    },
    {
      en: 'Carpentry Service',
      bn: 'কার্পেন্ট্রি সার্ভিস',
      slug: 'sub/carpentry-service',
    },
  ],
  companyTitle: { en: 'COMPANY', bn: 'গুরুত্বপূর্ণ পেজ' },
  companyLinks: [
    { en: 'About Us', bn: 'আমাদের সম্পর্কে', path: 'about-us' },
    { en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি', path: 'privacy-policy' },
    { en: 'Terms and Conditions', bn: 'শর্তাবলী', path: 'terms-conditions' },
    { en: 'Booking Mechanic', bn: 'বুকিং মিস্ত্রি', path: 'book-now' },
  ],
  contactTitle: { en: 'CONTACT INFO', bn: 'যোগাযোগ করুন' },
  address: {
    en: 'Comilla, Chittagong, Bangladesh.',
    bn: 'কুমিল্লা, চট্টগ্রাম, বাংলাদেশ।',
  },
  copyright: {
    en: 'ALL RIGHTS RESERVED.',
    bn: 'সর্বস্বত্ব সংরক্ষিত।',
  },
  credit: {
    en: 'MADE WITH PASSION BY It Village',
    bn: 'আইটি ভিলেজের নিবেদিত প্রচেষ্টায় নির্মিত',
  },
};

const Footer = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  return (
    <footer
      className="w-full pt-20 pb-8 text-slate-100 relative overflow-hidden border-t border-slate-800 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(2, 6, 23, 0.88)), url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop')`,
      }}
    >
      {/* Background Ambient Glow Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 p-16 border-b border-slate-700/40 relative z-10">
        
        {/* Column 1: Company Logo & Identity Links */}
        <div className="p-2">
          <Link to="/" className="group block select-none">
            <img
              src="https://i.ibb.co.com/Mkt5cQ1k/logo-Photoroom-Edited.png"
              alt="AMAR MISTRY Logo"
              className="w-42 h-auto mb-4 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>
          
          <Link to="/" className="block group mb-10">
            <p className="text-sm font-medium text-slate-300 leading-relaxed max-w-sm transition-colors duration-300 group-hover:text-primary">
              {FOOTER_DATA.companyDescription[currentLang]}
            </p>
          </Link>

          {/* Social Media Matrix */}
          <div className="flex items-center gap-3 pt-2">
            {SOCIAL_LINKS.map((social, i) => (
              <a
                key={i}
                href={social.url}
                className={`w-9 h-9 bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center rounded-xl text-base transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(0,0,0,0.6)] ${social.color}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Popular Services Directory */}
        <div className="space-y-5 p-2 ">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-8 after:h-[2px] after:bg-primary">
            {FOOTER_DATA.servicesTitle[currentLang]}
          </h4>
          <ul className="space-y-3 text-sm font-medium text-slate-300 pt-1">
            {FOOTER_DATA.services.map((service, idx) => (
              <li key={idx} className="group flex items-center">
                <Link
                  to={`/services/${service.slug}`}
                  className="hover:text-primary transition-colors duration-200 flex items-center gap-1 py-0.5 relative"
                >
                  {service[currentLang]}
                  <FiArrowUpRight className="text-slate-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 text-xs" />
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Important Internal Links */}
        <div className="space-y-5 p-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-8 after:h-[2px] after:bg-primary">
            {FOOTER_DATA.companyTitle[currentLang]}
          </h4>
          <ul className="space-y-3 text-sm font-medium text-slate-300 pt-1">
            {FOOTER_DATA.companyLinks.map((link, idx) => (
              <li key={idx} className="group flex items-center">
                <Link
                  to={`/${link.path}`}
                  className="hover:text-primary transition-colors duration-200 flex items-center gap-1 py-0.5 relative"
                >
                  {link[currentLang]}
                  <FiArrowUpRight className="text-slate-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 text-xs" />
                  <span className="absolute bottom-0 left-0 w-[85%] h-[1px] bg-primary transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Premium Contact Desk */}
        <div className="space-y-5 p-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-8 after:h-[2px] after:bg-primary">
            {FOOTER_DATA.contactTitle[currentLang]}
          </h4>
          <ul className="space-y-4 text-sm font-medium text-slate-300 pt-1">
            <li className="flex items-center gap-3.5 group">
              <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-md">
                <FiPhone className="text-sm" />
              </div>
              <a
                href="https://wa.me/8801893014004"
                className="font-mono text-slate-200 hover:text-primary transition-colors"
              >
                01893014004
              </a>
            </li>
            <li className="flex items-center gap-3.5 group">
              <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-md">
                <FiMail className="text-sm" />
              </div>
              <a
                href="mailto:info.amarmistri@gmail.com"
                className="font-mono text-slate-200 hover:text-primary transition-colors break-all"
              >
                info.amarmistri@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3.5 group">
              <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-md">
                <FiMapPin className="text-sm" />
              </div>
              <span className="leading-relaxed text-slate-200 flex-1 hover:text-primary transition-colors">
                {FOOTER_DATA.address[currentLang]}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom: Copyright & Credits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400 relative z-10">
        <div className="tracking-wide text-center sm:text-left">
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-white font-semibold">AMAR MISTRY</span>.{' '}
          {FOOTER_DATA.copyright[currentLang]}
        </div>
        <div className="text-xs tracking-wider text-white hover:text-primary transition-colors duration-300 font-semibold bg-slate-950/80 px-4 pt-2 pb-1 rounded-xl border border-slate-700/60 backdrop-blur-md shadow-xl">
          {FOOTER_DATA.credit[currentLang]}
        </div>
      </div>
    </footer>
  );
};

export default Footer;