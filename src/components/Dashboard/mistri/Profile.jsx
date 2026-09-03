import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase,
  FiCheckCircle, FiEdit3, FiSave, FiX, FiCamera,
  FiNavigation, FiLoader, FiTag, FiPlus, FiXCircle,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || '/api';

// All available job categories
const ALL_CATEGORIES = [
  { key: 'electrician', label: { en: 'Electrician', bn: 'ইলেকট্রিশিয়ান' } },
  { key: 'plumber', label: { en: 'Plumber', bn: 'প্লাম্বার' } },
  { key: 'ac-technician', label: { en: 'AC Technician', bn: 'এসি টেকনিশিয়ান' } },
  { key: 'carpenter', label: { en: 'Carpenter', bn: 'কার্পেন্টার' } },
  { key: 'painter', label: { en: 'Painter', bn: 'পেইন্টার' } },
  { key: 'welder', label: { en: 'Welder', bn: 'ওয়েল্ডার' } },
  { key: 'mason', label: { en: 'Mason', bn: 'রাজমিস্ত্রি' } },
  { key: 'cleaner', label: { en: 'Cleaner', bn: 'ক্লিনার' } },
  { key: 'appliance-repair', label: { en: 'Appliance Repair', bn: 'আপ্লায়েন্স রিপেয়ার' } },
  { key: 'cctv-installation', label: { en: 'CCTV Installation', bn: 'সিসিটিভি ইনস্টলেশন' } },
];

const Profile = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setIsLoading(false); return; }
      const res = await fetch(`${API}/mechanics/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.mechanic);
        setEditData(data.mechanic);
      }
    } catch (e) {
      toast.error('Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/mechanics/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(currentLang === 'bn' ? 'প্রোফাইল আপডেট হয়েছে!' : 'Profile updated!');
        setProfile({ ...profile, ...editData });
        setIsEditing(false);
        // Update localStorage
        const stored = localStorage.getItem('mistri') || localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = { ...parsed, ...editData };
          localStorage.setItem('mistri', JSON.stringify(updated));
          localStorage.setItem('user', JSON.stringify(updated));
        }
      } else {
        toast.error(data.message || 'Update failed.');
      }
    } catch (e) {
      toast.error('Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      // Use Cloudinary unsigned upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'amar_mistri_preset_name');
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djehgtqjf'}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        const url = data.secure_url;
        // Save to DB immediately
        const token = localStorage.getItem('token');
        await fetch(`${API}/mechanics/profile`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ faceImageUrl: url }),
        });
        setProfile(prev => ({ ...prev, faceImageUrl: url }));
        setEditData(prev => ({ ...prev, faceImageUrl: url }));
        toast.success(currentLang === 'bn' ? 'ছবি আপডেট হয়েছে!' : 'Photo updated!');
      } else {
        toast.error(data.error?.message || 'Photo upload failed.');
      }
    } catch (e) {
      toast.error('Photo upload error.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleLiveLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocode using nominatim
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const geoData = await geoRes.json();
          const address = geoData.display_name || `${latitude}, ${longitude}`;

          const token = localStorage.getItem('token');
          const mistriData = JSON.parse(localStorage.getItem('mistri') || localStorage.getItem('user') || '{}');
          const mistriId = mistriData._id || mistriData.id || profile?._id;

          await fetch(`${API}/mechanics/${mistriId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coordinates: [longitude, latitude], address }),
          });

          setProfile(prev => ({
            ...prev,
            liveLocation: { type: 'Point', coordinates: [longitude, latitude], address },
          }));
          toast.success(currentLang === 'bn' ? `লোকেশন আপডেট: ${address.substring(0, 50)}...` : `Location updated!`);
        } catch (e) {
          toast.error('Failed to update location.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        toast.error(`Location error: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const toggleCategory = (key) => {
    const current = editData.categories || [];
    const updated = current.includes(key) ? current.filter(c => c !== key) : [...current, key];
    setEditData(prev => ({ ...prev, categories: updated }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-amber-400 text-3xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        {currentLang === 'bn' ? 'প্রোফাইল লোড করা যায়নি। আবার লগইন করুন।' : 'Could not load profile. Please re-login.'}
      </div>
    );
  }

  const statusColor = {
    approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  }[profile.status] || 'bg-amber-500/15 text-amber-400 border-amber-500/30';

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Cover Banner */}
        <div className="h-28 w-full bg-gradient-to-r from-amber-600/20 via-slate-800 to-slate-950 relative" />

        {/* Header */}
        <div className="px-6 pb-5 relative flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-lg">
              <img
                src={profile.faceImageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.fullName || 'M') + '&background=f59e0b&color=000&size=200'}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-amber-500 hover:bg-amber-400 rounded-lg flex items-center justify-center text-slate-950 shadow-lg transition-all"
              title="Change photo"
            >
              {isUploadingPhoto ? <FiLoader className="animate-spin text-xs" /> : <FiCamera className="text-xs" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>

          {/* Name & Status */}
          <div className="flex-1 mb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white">{profile.fullName || 'মিস্ত্রী'}</h2>
              {profile.status === 'approved' && (
                <FiCheckCircle className="text-emerald-400 text-lg" title="Verified" />
              )}
              <span className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-lg ${statusColor}`}>
                {profile.status || 'pending'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {currentLang === 'bn' ? 'পেশাদার মিস্ত্রি' : 'Professional Mistry'} • {profile.mistriId}
            </p>
          </div>

          {/* Edit Buttons */}
          <div className="flex gap-2 mb-1">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
                >
                  {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
                  {currentLang === 'bn' ? 'সেভ করুন' : 'Save'}
                </button>
                <button
                  onClick={() => { setIsEditing(false); setEditData(profile); }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                >
                  <FiX />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl transition-all"
              >
                <FiEdit3 />
                {currentLang === 'bn' ? 'সম্পাদনা' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="border-t border-slate-800/60 p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column */}
          <div className="space-y-4">
            <InfoField icon={<FiUser />} label={currentLang === 'bn' ? 'মিস্ত্রি আইডি' : 'Mistry ID'} value={profile.mistriId} />
            <InfoField
              icon={<FiUser />}
              label={currentLang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
              value={isEditing ? (
                <input
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-amber-500"
                  value={editData.fullName || ''}
                  onChange={e => setEditData(p => ({ ...p, fullName: e.target.value }))}
                />
              ) : profile.fullName}
            />
            <InfoField
              icon={<FiMail />}
              label={currentLang === 'bn' ? 'ইমেইল' : 'Email'}
              value={profile.email}
            />
            <InfoField
              icon={<FiPhone />}
              label={currentLang === 'bn' ? 'ফোন নাম্বার' : 'Phone'}
              value={isEditing ? (
                <input
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-amber-500"
                  value={editData.phone || ''}
                  onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))}
                />
              ) : profile.phone}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <InfoField
              icon={<FiMapPin />}
              label={currentLang === 'bn' ? 'জেলা' : 'District'}
              value={isEditing ? (
                <input
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-amber-500"
                  value={editData.district || ''}
                  onChange={e => setEditData(p => ({ ...p, district: e.target.value }))}
                />
              ) : profile.district}
            />
            <InfoField
              icon={<FiMapPin />}
              label={currentLang === 'bn' ? 'থানা' : 'Thana'}
              value={isEditing ? (
                <input
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-amber-500"
                  value={editData.thana || ''}
                  onChange={e => setEditData(p => ({ ...p, thana: e.target.value }))}
                />
              ) : profile.thana}
            />
            <InfoField
              icon={<FiBriefcase />}
              label={currentLang === 'bn' ? 'চার্জ (৳)' : 'Charge (৳)'}
              value={isEditing ? (
                <input
                  type="number"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-amber-500"
                  value={editData.charge || ''}
                  onChange={e => setEditData(p => ({ ...p, charge: e.target.value }))}
                />
              ) : `৳ ${profile.charge || 500}`}
            />
            {profile.liveLocation?.address && (
              <InfoField
                icon={<FiNavigation className="text-emerald-400" />}
                label={currentLang === 'bn' ? 'লাইভ লোকেশন' : 'Live Location'}
                value={<span className="text-emerald-400 text-[11px]">{profile.liveLocation.address.substring(0, 60)}...</span>}
              />
            )}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FiTag className="text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            {currentLang === 'bn' ? 'জব ক্যাটাগরি' : 'Job Categories'}
          </h3>
          {isEditing && (
            <span className="text-[10px] text-slate-500 ml-auto">
              {currentLang === 'bn' ? 'ক্লিক করে পরিবর্তন করুন' : 'Click to toggle'}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {isEditing
            ? ALL_CATEGORIES.map(cat => {
                const isSelected = (editData.categories || []).includes(cat.key);
                return (
                  <button
                    key={cat.key}
                    onClick={() => toggleCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{cat.label[currentLang]}
                  </button>
                );
              })
            : (profile.categories || []).map(c => {
                const cat = ALL_CATEGORIES.find(a => a.key === c);
                return (
                  <span key={c} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-bold">
                    {cat?.label[currentLang] || c}
                  </span>
                );
              })
          }
          {!isEditing && (!profile.categories || profile.categories.length === 0) && (
            <span className="text-slate-500 text-xs italic">
              {currentLang === 'bn' ? 'কোনো ক্যাটাগরি নেই' : 'No categories selected'}
            </span>
          )}
        </div>
      </div>

      {/* Live Location Button */}
      <button
        onClick={handleLiveLocation}
        disabled={isLocating}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 font-bold rounded-2xl transition-all group"
      >
        {isLocating ? (
          <FiLoader className="animate-spin text-xl" />
        ) : (
          <FiNavigation className="text-xl group-hover:scale-110 transition-transform" />
        )}
        <span>
          {isLocating
            ? (currentLang === 'bn' ? 'লোকেশন নেওয়া হচ্ছে...' : 'Getting location...')
            : (currentLang === 'bn' ? 'ট্যাপ করুন — লাইভ লোকেশন আপডেট করুন' : 'Tap to Update Live Location')}
        </span>
      </button>
    </div>
  );
};

const InfoField = ({ icon, label, value }) => (
  <div className="flex items-start gap-3.5">
    <span className="text-slate-400 text-base mt-0.5 shrink-0">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-xs font-semibold text-white">{value || <span className="text-slate-600">—</span>}</div>
    </div>
  </div>
);

export default Profile;
