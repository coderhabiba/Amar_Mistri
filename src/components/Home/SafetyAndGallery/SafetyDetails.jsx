import { FiShield, FiCheck, FiUsers, FiClock } from 'react-icons/fi';

const SafetyDetails = ({ isBn }) => {
  const points = [
    {
      icon: <FiCheck className="text-emerald-500" />,
      titleEn: 'Multi-layer Handyman Screening',
      titleBn: 'মাল্টি-লেয়ার মিস্ত্রি স্ক্রিনিং প্রসেস',
      descEn:
        'Every technician undergoes background checking, criminal records monitoring, and strict national identity validation protocol.',
      descBn:
        'প্রত্যেক টেকনিশিয়ানের ব্যাকগ্রাউন্ড চেক, ক্রিমিনাল রেকর্ড মনিটরিং এবং জাতীয় পরিচয়পত্র শতভাগ যাচাই করা হয়।',
    },
    {
      icon: <FiClock className="text-emerald-500" />,
      titleEn: '24/7 Rapid Response Coordination',
      titleBn: '২৪/৭ রেপিড রেসপন্স টিম সমন্বয়',
      descEn:
        'In case of unexpected events, our on-site validation emergency team instantly coordinates with law enforcement.',
      descBn:
        'যেকোনো অনাকাঙ্ক্ষিত পরিস্থিতিতে আমাদের অন-সাইট ইমার্জেন্সি টিম তাৎক্ষণিকভাবে প্রয়োজনীয় ব্যবস্থা গ্রহণ করে।',
    },
    {
      icon: <FiUsers className="text-emerald-500" />,
      titleEn: 'Encrypted Session & Communication Secure',
      titleBn: 'এনক্রিপ্টেড সেশন ও সুরক্ষিত যোগাযোগ',
      descEn:
        'Your private credentials, exact house pointers, and metadata records remain protected within advanced encryption matrices.',
      descBn:
        'আপনার ব্যক্তিগত তথ্য, সুনির্দিষ্ট বাসা-বাড়ির ঠিকানা এবং যোগাযোগের রেকর্ড এনক্রিপ্টেড ডাটাবেজে সুরক্ষিত থাকে।',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
        <FiShield className="text-3xl text-emerald-500" />
        <div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            {isBn
              ? 'নিরাপত্তা প্রোটোকল গাইডলাইন'
              : 'Safety Protocols & Operations'}
          </h3>
        </div>
      </div>

      <div className="space-y-6 pt-2">
        {points.map((p, idx) => (
          <div
            key={idx}
            className="flex gap-4 items-start p-4 bg-slate-950/40 border border-slate-900 rounded-3xl"
          >
            <div className="p-2 bg-slate-950 rounded-2xl border border-slate-800 text-lg flex-shrink-0 mt-0.5">
              {p.icon}
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-200">
                {isBn ? p.titleBn : p.titleEn}
              </h4>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                {isBn ? p.descBn : p.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafetyDetails;
