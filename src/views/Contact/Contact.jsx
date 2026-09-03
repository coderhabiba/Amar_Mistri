import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiMessageSquare,
} from 'react-icons/fi';

const ContactUs = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'customer',
    message: '',
  });

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Contact Form Data:', formData);
    alert(
      currentLang === 'bn'
        ? 'আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে!'
        : 'Your message has been sent successfully!',
    );
    setFormData({ name: '', phone: '', role: 'customer', message: '' });
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-16 px-4 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <FiMessageSquare className="text-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-amber-400">
            {currentLang === 'bn' ? 'যোগাযোগ করুন' : 'Get In Touch'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'bn'
              ? 'যেকোনো জিজ্ঞাসা বা সহায়তার জন্য "আমার মিস্ত্রি" সাপোর্ট টিমের সাথে যেকোনো সময় যোগাযোগ করুন।'
              : 'Have questions or need assistance? Contact the Amar Mistri support team anytime.'}
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            {/* Phone Support */}
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex gap-4 items-center group hover:border-slate-700/80 transition-all duration-300">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xl text-amber-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <FiPhone />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {currentLang === 'bn' ? 'হেল্পলাইন নম্বর' : 'Call Helpline'}
                </h3>
                <p className="text-sm font-bold text-slate-200 tracking-wide select-all">
                  01893014004
                </p>
                <p className="text-[11px] text-slate-400">
                  {currentLang === 'bn'
                    ? 'নিরাপত্তার স্বার্থে সর্বদা কল রেকর্ড করা হয়।'
                    : 'Calls are recorded for safety.'}
                </p>
              </div>
            </div>

            {/* Email Support */}
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex gap-4 items-center group hover:border-slate-700/80 transition-all duration-300">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xl text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <FiMail />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {currentLang === 'bn' ? 'ইমেইল করুন' : 'Email Address'}
                </h3>
                <p className="text-sm font-bold text-slate-200 select-all">
                  info.amarmistri@gmail.com
                </p>
                <p className="text-[11px] text-slate-400">
                  {currentLang === 'bn'
                    ? 'আমরা ২৪ ঘণ্টার মধ্যে উত্তর দিই।'
                    : 'We respond within 24 hours.'}
                </p>
              </div>
            </div>

            {/* Office Address */}
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex gap-4 items-center group hover:border-slate-700/80 transition-all duration-300">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xl text-emerald-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <FiMapPin />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {currentLang === 'bn' ? 'প্রধান কার্যালয়' : 'Head Office'}
                </h3>
                <p className="text-sm font-bold text-slate-200 leading-relaxed">
                  {currentLang === 'bn'
                    ? 'কুমিল্লা, চট্টগ্রাম, বাংলাদেশ'
                    : 'Comilla, Chittagong, Bangladesh'}
                </p>
              </div>
            </div>

            {/* Work Hours */}
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex gap-4 items-center group hover:border-slate-700/80 transition-all duration-300">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xl text-purple-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <FiClock />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {currentLang === 'bn' ? 'সাপোর্ট সময়' : 'Support Hours'}
                </h3>
                <p className="text-sm font-bold text-slate-200">
                  {currentLang === 'bn'
                    ? 'শনিবার - বৃহস্পতিবার (সকাল ৯টা - রাত ৯টা)'
                    : 'Sat - Thu (9:00 AM - 9:00 PM)'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {currentLang === 'bn'
                    ? 'রাত-বিরাতের জরুরি সেবার অ্যাপ নোটিশ ২৪/৭ সচল।'
                    : 'Emergency app notices are active 24/7.'}
                </p>
              </div>
            </div>
          </div>

          {/*  Contact Interactive Form  */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 tracking-wider">
                    {currentLang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={
                      currentLang === 'bn' ? 'নাম লিখুন' : 'Enter your name'
                    }
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors duration-300"
                  />
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 tracking-wider">
                    {currentLang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Identity Select / Role dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 tracking-wider">
                  {currentLang === 'bn' ? 'আপনি কে?' : 'Identify Yourself'}
                </label>
                <select
                  value={formData.role}
                  onChange={e =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none transition-colors duration-300 cursor-pointer"
                >
                  <option value="customer">
                    {currentLang === 'bn'
                      ? 'আমি সেবা গ্রহণকারী (গ্রাহক)'
                      : 'I am a Service Seeker (Customer)'}
                  </option>
                  <option value="technician">
                    {currentLang === 'bn'
                      ? 'আমি সেবা প্রদানকারী (মিস্ত্রি/টেকনিশিয়ান)'
                      : 'I am a Service Provider (Technician)'}
                  </option>
                  <option value="other">
                    {currentLang === 'bn'
                      ? 'অন্যান্য জিজ্ঞাসা'
                      : 'Other Inquiries'}
                  </option>
                </select>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 tracking-wider">
                  {currentLang === 'bn'
                    ? 'আপনার বার্তা / সমস্যা'
                    : 'Your Message'}
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={e =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder={
                    currentLang === 'bn'
                      ? 'বিস্তারিত এখানে লিখুন...'
                      : 'Write your details here...'
                  }
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors duration-300 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 group"
              >
                <span>
                  {currentLang === 'bn' ? 'মেসেজ পাঠান' : 'Send Message'}
                </span>
                <FiSend className="text-sm group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
