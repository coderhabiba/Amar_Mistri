import { FiMapPin, FiNavigation, FiShare2, FiActivity } from 'react-icons/fi';

const LiveTrackingInfo = ({ isBn }) => {
  const systems = [
    {
      icon: <FiNavigation className="text-emerald-500" />,
      titleEn: 'Satellite Live Matrix Tracking',
      titleBn: 'স্যাটেলাইট লাইভ ম্যাট্রিক্স ট্র্যাকিং',
      descEn:
        'Track your professional approaching path precisely down to accurate step coordinates in real-time.',
      descBn:
        'আপনার বুক করা পেশাদার মিস্ত্রি এখন ঠিক কোন রাস্তায় আছেন তা নিখুঁত কোঅর্ডিনেটসের মাধ্যমে রিয়েল-টাইমে ট্র্যাক করুন।',
    },
    {
      icon: <FiShare2 className="text-emerald-500" />,
      titleEn: 'Secure Family Share Integration',
      titleBn: 'সুরক্ষিত ফ্যামিলি শেয়ার সুবিধা',
      descEn:
        'Instantly stream live job parameters and tracking metrics with family links for comprehensive supervision.',
      descBn:
        'নিরাপত্তা নিশ্চিত করতে চলমান কাজের অগ্রগতি এবং লাইভ লোকেশন লিংক পরিবার ও বন্ধুদের সাথে সহজে শেয়ার করুন।',
    },
    {
      icon: <FiActivity className="text-emerald-500" />,
      titleEn: 'Automated Status State Transitions',
      titleBn: 'স্বয়ংক্রিয় কাজের স্ট্যাটাস ট্রানজিশন',
      descEn:
        'Receive micro-step diagnostic notifications instantly from dispatch initialization to target point arrival.',
      descBn:
        'মিস্ত্রি রওনা হওয়া থেকে শুরু করে গন্তব্যে পৌঁছানো পর্যন্ত প্রতিটি ধাপের অটোমেটেড নোটিফিকেশন অ্যালার্ট পান।',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
        <FiMapPin className="text-3xl text-emerald-500" />
        <div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            {isBn
              ? 'রিয়েল-টাইম লোকেশন ইন্টেলিজেন্স'
              : 'Real-Time Location Intelligence'}
          </h3>
        </div>
      </div>

      <div className="space-y-6 pt-2">
        {systems.map((s, idx) => (
          <div
            key={idx}
            className="flex gap-4 items-start p-4 bg-slate-950/40 border border-slate-900 rounded-2xl"
          >
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-lg flex-shrink-0 mt-0.5">
              {s.icon}
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-200">
                {isBn ? s.titleBn : s.titleEn}
              </h4>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                {isBn ? s.descBn : s.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTrackingInfo;
