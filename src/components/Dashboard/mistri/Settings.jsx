import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiLock, FiCamera, FiLoader, FiEye, FiEyeOff,
  FiSave, FiShield, FiImage,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || '/api';

const Settings = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';
  const fileInputRef = useRef(null);

  // Password state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [isSavingPw, setIsSavingPw] = useState(false);

  // Photo state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error(currentLang === 'bn' ? 'নতুন পাসওয়ার্ড মিলছে না!' : 'Passwords do not match!');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error(currentLang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }
    setIsSavingPw(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/mechanics/profile`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(currentLang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!' : 'Password changed successfully!');
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || 'Password change failed.');
      }
    } catch (e) {
      toast.error('Failed to change password.');
    } finally {
      setIsSavingPw(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(file);

    setIsUploadingPhoto(true);
    try {
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
        const token = localStorage.getItem('token');
        const updateRes = await fetch(`${API}/mechanics/profile`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ faceImageUrl: url }),
        });
        const updateData = await updateRes.json();
        if (updateData.success) {
          // Update localStorage
          const stored = localStorage.getItem('mistri') || localStorage.getItem('user');
          if (stored) {
            const parsed = JSON.parse(stored);
            parsed.faceImageUrl = url;
            localStorage.setItem('mistri', JSON.stringify(parsed));
            localStorage.setItem('user', JSON.stringify(parsed));
          }
          toast.success(currentLang === 'bn' ? 'ছবি সফলভাবে পরিবর্তন হয়েছে!' : 'Profile photo updated!');
        } else {
          toast.error(updateData.message || 'Photo update failed.');
        }
      } else {
        toast.error(data.error?.message || 'Upload failed.');
      }
    } catch (e) {
      toast.error('Photo upload error.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const getMistriPhoto = () => {
    if (previewUrl) return previewUrl;
    const stored = localStorage.getItem('mistri') || localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.faceImageUrl || null;
    }
    return null;
  };

  const currentPhoto = getMistriPhoto();

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-xl font-bold text-white">
        {currentLang === 'bn' ? 'অ্যাকাউন্ট সেটিংস' : 'Account Settings'}
      </h1>

      {/* Photo Change Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-4">
          <FiImage className="text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            {currentLang === 'bn' ? 'প্রোফাইল ছবি পরিবর্তন' : 'Change Profile Photo'}
          </h3>
        </div>

        <div className="flex items-center gap-5">
          {/* Photo Preview */}
          <div className="w-20 h-20 rounded-2xl border-2 border-slate-700 bg-slate-800 overflow-hidden shrink-0">
            {currentPhoto ? (
              <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 text-3xl">
                <FiCamera />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              {currentLang === 'bn'
                ? 'JPG, PNG অথবা WEBP ফরম্যাটে ৫MB এর নিচে ছবি আপলোড করুন।'
                : 'Upload JPG, PNG or WEBP under 5MB. Square images work best.'}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl transition-all"
            >
              {isUploadingPhoto ? <FiLoader className="animate-spin" /> : <FiCamera />}
              {isUploadingPhoto
                ? (currentLang === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...')
                : (currentLang === 'bn' ? 'ছবি বেছে নিন' : 'Choose Photo')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-4">
          <FiShield className="text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            {currentLang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
          </h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {currentLang === 'bn' ? 'বর্তমান পাসওয়ার্ড *' : 'Current Password *'}
            </label>
            <div className="relative">
              <input
                type={showPw.current ? 'text' : 'password'}
                required
                value={pwForm.currentPassword}
                onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-10 text-xs text-white outline-none focus:border-amber-500 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPw.current ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {currentLang === 'bn' ? 'নতুন পাসওয়ার্ড *' : 'New Password *'}
            </label>
            <div className="relative">
              <input
                type={showPw.new ? 'text' : 'password'}
                required
                value={pwForm.newPassword}
                onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-10 text-xs text-white outline-none focus:border-amber-500 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(p => ({ ...p, new: !p.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPw.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {currentLang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন *' : 'Confirm New Password *'}
            </label>
            <div className="relative">
              <input
                type={showPw.confirm ? 'text' : 'password'}
                required
                value={pwForm.confirmPassword}
                onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                className={`w-full bg-slate-950 border rounded-xl px-4 py-3 pr-10 text-xs text-white outline-none focus:border-amber-500 transition-colors ${
                  pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword
                    ? 'border-red-500/60'
                    : 'border-slate-700'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPw.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
              <p className="text-[10px] text-red-400">
                {currentLang === 'bn' ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match'}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSavingPw}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md"
          >
            {isSavingPw ? <FiLoader className="animate-spin" /> : <FiSave />}
            {isSavingPw
              ? (currentLang === 'bn' ? 'পরিবর্তন হচ্ছে...' : 'Changing...')
              : (currentLang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password')}
          </button>
        </form>
      </div>

      {/* Security Tips */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 space-y-2">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <FiLock className="text-amber-400" />
          {currentLang === 'bn' ? 'নিরাপত্তা টিপস' : 'Security Tips'}
        </p>
        <ul className="space-y-1.5 text-[11px] text-slate-500 list-disc list-inside">
          <li>{currentLang === 'bn' ? 'কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড ব্যবহার করুন।' : 'Use a password with at least 8 characters.'}</li>
          <li>{currentLang === 'bn' ? 'সংখ্যা ও বিশেষ চিহ্ন (!, @, #) যুক্ত পাসওয়ার্ড ব্যবহার করুন।' : 'Mix letters, numbers and symbols (!, @, #).'}</li>
          <li>{currentLang === 'bn' ? 'পাসওয়ার্ড কাউকে শেয়ার করবেন না।' : 'Never share your password with anyone.'}</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
