import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import dynamic from 'next/dynamic';
import {
  FiClock, FiCalendar, FiMapPin, FiPhone, FiUser,
  FiLayers, FiSettings, FiSearch, FiNavigation,
  FiLoader, FiStar, FiDollarSign,
} from 'react-icons/fi';

// Leaflet map must be dynamically imported (no SSR)
const NearbyMistriMap = dynamic(
  () => import('@/components/NearbyMistriMap'),
  { ssr: false, loading: () => <div className="h-[420px] w-full rounded-2xl bg-slate-900 animate-pulse flex items-center justify-center"><span className="text-slate-600 text-sm">Map loading...</span></div> }
);

const TRANSLATIONS = {
  title: {
    en: 'Find a Professional Mistry',
    bn: 'একজন প্রফেশনাল মিস্ত্রি খুঁজুন',
  },
  subtitle: {
    en: 'Select your service, choose your location, and find the perfect verified mistry for your job instantly.',
    bn: 'আপনার প্রয়োজনীয় সার্ভিস ও এলাকা নির্বাচন করুন এবং মুহূর্তেই আপনার কাজের জন্য সঠিক যাচাইকৃত মিস্ত্রি খুঁজে নিন।',
  },
  serviceStep: {
    en: '1. Select Service & Specialization',
    bn: '১. সার্ভিস ও স্পেশালাইজেশন',
  },
  scheduleStep: {
    en: '2. Date & Preferred Time',
    bn: '২. তারিখ ও সময়',
  },
  addressStep: {
    en: '3. Contact & Delivery Address',
    bn: '৩. যোগাযোগ ও বর্তমান ঠিকানা',
  },
  searchBtn: {
    en: 'Search Mistry',
    bn: 'মিস্ত্রি খুঁজুন',
  },
};

// All 18 original time slots preserved perfectly
const TIME_SLOTS = [
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 08:00 PM',
  '08:00 PM - 09:00 PM',
  '09:00 PM - 10:00 PM',
  '10:00 PM - 11:00 PM',
  '11:00 PM - 12:00 AM',
  '12:00 AM - 01:00 AM',
  '01:00 AM - 02:00 AM',
];

const BookNow = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';
  const navigate = useNavigate();
  const [rawApiData, setRawApiData] = useState(null);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('');
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');

  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '',
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  // Nearby map state
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [nearbyMechanics, setNearbyMechanics] = useState([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);
  const [selectedMistri, setSelectedMistri] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Fetch your custom raw database service schemas
  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const response = await fetch(
          `${(process.env.NEXT_PUBLIC_API_URL || "/api")}/services`,
        );
        const data = await response.json();
        setRawApiData(data);
      } catch (error) {
        console.error(
          'Database connection or translation injection failure:',
          error,
        );
      }
    };
    fetchServicesData();
  }, []);

  // Sync sub-services automatically when the main service category changes
  useEffect(() => {
    if (selectedCategoryKey && rawApiData && rawApiData[selectedCategoryKey]) {
      setAvailableServices(rawApiData[selectedCategoryKey].services || []);
      setSelectedService('');
      // Auto-fetch nearby mechanics for this category
      fetchNearbyMechanics(selectedCategoryKey, userLat, userLng);
    } else {
      setAvailableServices([]);
      setSelectedService('');
    }
  }, [selectedCategoryKey, rawApiData]);

  const fetchNearbyMechanics = async (categoryKey, lat, lng) => {
    if (!categoryKey) return;
    setIsLoadingNearby(true);
    try {
      const params = new URLSearchParams({ categoryKey });
      if (lat) params.set('lat', lat);
      if (lng) params.set('lng', lng);
      const res = await fetch(`/api/mechanics/nearby?${params}`);
      const data = await res.json();
      if (data.success) setNearbyMechanics(data.mechanics || []);
    } catch (e) {
      console.error('Nearby fetch error:', e);
    } finally {
      setIsLoadingNearby(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setIsLocating(false);
        if (selectedCategoryKey) {
          fetchNearbyMechanics(selectedCategoryKey, pos.coords.latitude, pos.coords.longitude);
        }
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  // Process search submit and safely bundle everything as query parameters
  const handleSearchSubmit = e => {
    if (e) e.preventDefault();

    const categoryName =
      rawApiData[selectedCategoryKey]?.category?.[currentLang] ||
      selectedCategoryKey;

    const queryParams = new URLSearchParams({
      categoryKey: selectedCategoryKey || '',
      categoryName: categoryName || '',
      specificService: selectedService || '',
      date: bookingData.date || '',
      timeSlot: bookingData.timeSlot || '',
      name: bookingData.name || '',
      phone: bookingData.phone || '',
      address: bookingData.address || '',
      notes: bookingData.notes || '',
    }).toString();

    // Changed path to /mistries to perfectly align with your MistryList route configuration
    navigate(`/mistries?${queryParams}`);
  };

  const categoryKeys = rawApiData
    ? Object.keys(rawApiData).filter(key => key !== '_id')
    : [];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-24 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center space-y-1 mb-14">
          <h1 className="text-3xl pt-2 font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-amber-400 tracking-tight">
            {TRANSLATIONS.title[currentLang]}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {TRANSLATIONS.subtitle[currentLang]}
          </p>
        </div>

        {/* Input Structural Grid Processing Panel Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-3xl mx-auto bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-10 space-y-10 shadow-2xl"
        >
          {/* Reactive Dynamic Database Categories */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-slate-800/60">
              <FiLayers className="text-primary text-lg" />
              {TRANSLATIONS.serviceStep[currentLang]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category Dropdown Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? 'সার্ভিস ক্যাটাগরি *'
                    : 'Service Category *'}
                </label>
                <div className="relative">
                  <FiSettings className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none" />
                  <select
                    required
                    value={selectedCategoryKey}
                    onChange={e => setSelectedCategoryKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-medium appearance-none"
                  >
                    <option value="" disabled>
                      {currentLang === 'bn'
                        ? 'ক্যাটাগরি সিলেক্ট করুন'
                        : 'Select Category'}
                    </option>
                    {categoryKeys.map(key => (
                      <option key={key} value={key}>
                        {rawApiData[key].category[currentLang]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specific Skill Classification Sub-Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? 'নির্দিষ্ট সেবার ধরন *'
                    : 'Specific Service Type *'}
                </label>
                <div className="relative">
                  <FiSettings className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none" />
                  <select
                    required
                    disabled={!selectedCategoryKey}
                    value={selectedService}
                    onChange={e => setSelectedService(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-medium appearance-none disabled:opacity-50"
                  >
                    <option value="" disabled>
                      {currentLang === 'bn'
                        ? 'সেবার ধরন বাছুন'
                        : 'Select Service Type'}
                    </option>
                    {availableServices.map((service, idx) => (
                      <option key={idx} value={service.en}>
                        {service[currentLang]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Temporal Scheduler Inputs */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-slate-800/60">
              <FiCalendar className="text-primary text-lg" />
              {TRANSLATIONS.scheduleStep[currentLang]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Date Input Vector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? 'তারিখ নির্বাচন করুন *'
                    : 'Select Date *'}
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none" />
                  <input
                    type="date"
                    required
                    name="date"
                    value={bookingData.date}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-medium dark-color-scheme"
                  />
                </div>
              </div>

              {/* Time Slot Input Vector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? 'পছন্দনীয় সময় *'
                    : 'Preferred Time Slot *'}
                </label>
                <div className="relative">
                  <FiClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none" />
                  <select
                    required
                    name="timeSlot"
                    value={bookingData.timeSlot}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-medium appearance-none"
                  >
                    <option value="" disabled>
                      {currentLang === 'bn'
                        ? 'সময় নির্বাচন করুন'
                        : 'Choose Time Slot'}
                    </option>
                    {TIME_SLOTS.map((slot, i) => (
                      <option key={i} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Client Profiling and Address Vectors */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-slate-800/60">
              <FiMapPin className="text-primary text-lg" />
              {TRANSLATIONS.addressStep[currentLang]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* User Full Name Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? 'আপনার পূর্ণ নাম *'
                    : 'Your Full Name *'}
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
                  <input
                    type="text"
                    required
                    name="name"
                    value={bookingData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-medium"
                  />
                </div>
              </div>

              {/* Mobile Number Input Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Full Address Multi-line Field */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? 'বিস্তারিত ঠিকানা (বাসা/রোড/এলাকা) *'
                    : 'Detailed Address *'}
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-3 text-slate-500 text-base" />
                  <textarea
                    required
                    rows="2"
                    name="address"
                    value={bookingData.address}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-medium resize-none"
                  />
                </div>
              </div>

              {/* Optional Additional Instructions Field */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? 'অতিরিক্ত নির্দেশনা (ঐচ্ছিক)'
                    : 'Additional Instructions (Optional)'}
                </label>
                <textarea
                  rows="2"
                  name="notes"
                  value={bookingData.notes}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Form Trigger Search Submission Button */}
          <button
            type="submit"
            disabled={!selectedService}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none"
          >
            <FiSearch className="text-base font-bold" />
            {TRANSLATIONS.searchBtn[currentLang]}
          </button>
        </form>

        {/* === Nearby Mistri Map Section === */}
        {selectedCategoryKey && (
          <div className="mt-12 space-y-6">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">
                  {currentLang === 'bn' ? '📍 কাছের মিস্ত্রিরা' : '📍 Nearby Mistris'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentLang === 'bn'
                    ? 'আপনার এলাকার অনুমোদিত মিস্ত্রিদের লাইভ লোকেশন ম্যাপে দেখুন'
                    : 'See approved mistris near you on the live map'}
                </p>
              </div>
              <button
                onClick={getUserLocation}
                disabled={isLocating}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl transition-all"
              >
                {isLocating ? <FiLoader className="animate-spin" /> : <FiNavigation />}
                {currentLang === 'bn' ? 'আমার অবস্থান' : 'My Location'}
              </button>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <NearbyMistriMap
                mechanics={nearbyMechanics}
                userLat={userLat}
                userLng={userLng}
                onSelectMistri={setSelectedMistri}
              />
            </div>

            {/* Selected Mistri Card Popup */}
            {selectedMistri && (
              <div className="bg-gradient-to-br from-amber-500/10 to-slate-900 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-4 relative">
                <button
                  onClick={() => setSelectedMistri(null)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-white"
                >×</button>
                <img
                  src={selectedMistri.faceImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMistri.fullName || 'M')}&background=334155&color=f59e0b`}
                  alt={selectedMistri.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shrink-0"
                />
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{selectedMistri.fullName}</p>
                  <p className="text-[10px] text-amber-400 font-semibold">{selectedMistri.mistriId}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><FiPhone /> {selectedMistri.phone}</span>
                    <span className="flex items-center gap-1"><FiDollarSign /> ৳{selectedMistri.charge}/সার্ভিস</span>
                    {selectedMistri.distance < 9999 && (
                      <span className="flex items-center gap-1 text-emerald-400"><FiMapPin /> {selectedMistri.distance} km দূরে</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(selectedMistri.categories || []).map(c => (
                      <span key={c} className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Proximity-sorted Mistri Cards */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                {currentLang === 'bn' ? 'কাছের মিস্ত্রির তালিকা' : 'Mistris Sorted by Distance'}
                {isLoadingNearby && <FiLoader className="animate-spin text-amber-400" />}
                <span className="text-slate-500 font-normal text-xs ml-auto">{nearbyMechanics.length} {currentLang === 'bn' ? 'জন পাওয়া গেছে' : 'found'}</span>
              </h3>
              {nearbyMechanics.length === 0 && !isLoadingNearby ? (
                <p className="text-slate-500 text-xs p-5 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-center">
                  {currentLang === 'bn' ? 'এই ক্যাটাগরিতে কাছে কোনো মিস্ত্রি পাওয়া যায়নি।' : 'No mistris found nearby for this category.'}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {nearbyMechanics.map(m => (
                    <div
                      key={m._id}
                      onClick={() => setSelectedMistri(m)}
                      className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all group"
                    >
                      <img
                        src={m.faceImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName || 'M')}&background=334155&color=f59e0b&size=80`}
                        alt={m.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 group-hover:border-amber-500/40 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white truncate">{m.fullName}</p>
                          {m.distance < 9999 && (
                            <span className="text-[9px] text-emerald-400 font-bold shrink-0">{m.distance}km</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{m.mistriId}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                          <span className="flex items-center gap-0.5"><FiStar className="text-amber-400" /> {m.rating}</span>
                          <span className="flex items-center gap-0.5"><FiDollarSign /> ৳{m.charge}</span>
                          {m.address && <span className="truncate flex items-center gap-0.5"><FiMapPin /> {m.address.substring(0, 20)}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookNow;
