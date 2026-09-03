import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiStar,
  FiAward,
  FiMessageSquare,
  FiMapPin,
  FiShield,
  FiX,
  FiChevronRight,
  FiPhoneCall,
  FiUser,
  FiPhone,
  FiMail,
  FiCamera,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

/* ── Cloudinary unsigned upload ── */
const CLOUD_NAME = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djehgtqjf");
const UPLOAD_PRESET = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "amar_mistri_preset_name");

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: fd,
    },
  );
  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json();
  return data.secure_url;
}

/* ── Star picker ── */
const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="transition-transform hover:scale-110 focus:outline-none"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 14 14"
          fill={star <= value ? '#F59E0B' : 'none'}
          stroke={star <= value ? '#F59E0B' : '#475569'}
          strokeWidth="1.2"
        >
          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.44L7 8.885l-3.09 1.624.59-3.44L2 4.632l3.455-.502z" />
        </svg>
      </button>
    ))}
  </div>
);

const MistriCard = ({ mistri, bookingInfo }) => {
  const [showNumber, setShowNumber] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbReviews, setDbReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Reviewer info fields
  const [reviewerName, setReviewerName] = useState(bookingInfo?.name || '');
  const [reviewerPhone, setReviewerPhone] = useState(bookingInfo?.phone || '');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'bn';

  const {
    _id,
    fullName,
    photo,
    experience,
    phone,
    address,
    isCitizenCertificateSubmitted,
    completedTasks,
    hasBadReview,
  } = mistri || {};

  const isNidVerified = !!(mistri?.isNidVerified || mistri?.nidNumber);
  const isFaceScanVerified = !!(
    mistri?.isFaceScanVerified || mistri?.faceImageUrl
  );
  const displayName = fullName || mistri?.name || 'মিস্ত্রি নাম';
  const displayPhoto =
    photo ||
    mistri?.faceImageUrl ||
    'https://i.ibb.co.com/8m7Yg8N/default-avatar.png';
  const displayExperience = experience || 0;
  const phoneNumber = phone?.toString() || '';
  const displayAddress = address || 'ঠিকানা পাওয়া যায়নি';
  const displayCompletedTasks = completedTasks || 0;

  const displayTotalReviews =
    dbReviews.length > 0 ? dbReviews.length : mistri?.totalReviews || 0;
  const displayRating =
    dbReviews.length > 0
      ? (
          dbReviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) /
          dbReviews.length
        ).toFixed(1)
      : mistri?.rating || 5.0;

  const isFullyVerified =
    isNidVerified &&
    isFaceScanVerified &&
    !!(
      isCitizenCertificateSubmitted || mistri?.isCitizenCertificateSubmitted
    ) &&
    displayCompletedTasks >= 20 &&
    displayTotalReviews >= 15 &&
    Number(displayRating) >= 4.5 &&
    !hasBadReview;

  useEffect(() => {
    if (!_id) return;
    setIsLoadingReviews(true);
    fetch(`${(process.env.NEXT_PUBLIC_API_URL || "/api")}/reviews?mistriId=${_id}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setDbReviews(data);
        else if (data.reviews && Array.isArray(data.reviews))
          setDbReviews(data.reviews);
      })
      .catch(e => console.error('Error fetching reviews:', e))
      .finally(() => setIsLoadingReviews(false));
  }, [_id]);

  // Photo file picker handler
  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleCallMistry = async () => {
    if (!bookingInfo?.name) {
      toast.error(
        lang === 'bn'
          ? 'যোগাযোগ করতে প্রথমে বুকিং ফর্মটি পূরণ করুন!'
          : 'Please fill out the booking form first!',
      );
      navigate('/book-now');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || "/api")}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingInfo,
          mistriId: _id,
          mistriName: displayName,
          status: 'approved',
          createdAt: new Date(),
        }),
      });
      if (response.ok) {
        toast.success(
          lang === 'bn'
            ? 'বুকিং সফলভাবে নথিভুক্ত হয়েছে!'
            : 'Booking successfully registered!',
        );
        setShowNumber(true);
        if (phoneNumber) window.location.href = `tel:${phoneNumber}`;
        else
          toast.error(
            lang === 'bn'
              ? 'ফোন নম্বর পাওয়া যায়নি!'
              : 'Phone number not found!',
          );
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(
        lang === 'bn'
          ? 'বুকিং সম্পন্ন করা যায়নি।'
          : 'Failed to complete booking.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      toast.error(lang === 'bn' ? 'নাম দিন' : 'Please enter your name');
      return;
    }
    setIsSubmitting(true);

    try {
      // Upload photo to Cloudinary if provided
      let reviewerPhotoUrl = null;
      if (photoFile) {
        setIsUploading(true);
        reviewerPhotoUrl = await uploadToCloudinary(photoFile);
        setIsUploading(false);
      }

      const reviewData = {
        mistriId: _id,
        rating: userRating,
        comment: reviewText,
        reviewerName: reviewerName.trim(),
        reviewerPhone: reviewerPhone.trim() || null,
        reviewerEmail: reviewerEmail.trim() || null,
        reviewerPhoto: reviewerPhotoUrl,
        createdAt: new Date(),
      };

      const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || "/api")}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        toast.success(
          lang === 'bn'
            ? 'রিভিউটি সফলভাবে জমা দেওয়া হয়েছে!'
            : 'Review submitted successfully!',
        );
        setDbReviews(prev => [reviewData, ...prev]);
        // Reset form
        setReviewText('');
        setUserRating(5);
        setReviewerName('');
        setReviewerPhone('');
        setReviewerEmail('');
        setPhotoFile(null);
        setPhotoPreview(null);
        setIsModalOpen(false);
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (err) {
      console.error('Review submit error:', err);
      setIsUploading(false);
      toast.error(
        lang === 'bn' ? 'রিভিউ জমা দেওয়া যায়নি।' : 'Failed to submit review.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ────────────────── JSX ────────────────── */
  return (
    <>
      {/* ── Card ── */}
      <div className="card w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300 group">
        {/* Avatar + Name */}
        <div className="flex gap-4 items-start mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={displayPhoto}
              alt={displayName}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              onError={e => {
                e.target.src =
                  'https://i.ibb.co.com/8m7Yg8N/default-avatar.png';
              }}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-700 group-hover:border-yellow-500 transition-colors shadow-md"
            />
            {isFullyVerified && (
              <span
                className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-0.5"
                title="Fully Verified Pro"
              >
                <FiCheckCircle className="w-5 h-5 text-yellow-500 fill-yellow-500/10 animate-pulse" />
              </span>
            )}
          </div>

          <div className="space-y-1 flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl font-bold text-white truncate group-hover:text-yellow-500 transition-colors">
                {displayName}
              </h3>
              {isFullyVerified && (
                <span className="badge badge-warning badge-xs font-bold text-[10px] px-1.5 py-2 text-slate-950">
                  PRO
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <FiStar className="fill-amber-400 w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-slate-200">
                {isLoadingReviews ? '...' : displayRating}
              </span>
              <span className="text-xs text-slate-500">
                ({isLoadingReviews ? '...' : displayTotalReviews}{' '}
                {lang === 'bn' ? 'রিভিউ' : 'Reviews'})
              </span>
            </div>

            {displayTotalReviews > 0 && (
              <button
                onClick={() =>
                  navigate(`/reviews/${_id}`, {
                    state: {
                      mistriName: displayName,
                      mistriPhoto: displayPhoto,
                      rating: displayRating,
                      totalReviews: displayTotalReviews,
                    },
                  })
                }
                className="flex items-center gap-1 text-xs text-yellow-500 hover:text-yellow-400 transition-colors mt-1"
              >
                <span>
                  {lang === 'bn'
                    ? `সব ${displayTotalReviews}টি রিভিউ দেখুন`
                    : `See all ${displayTotalReviews} reviews`}
                </span>
                <FiChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Details block */}
        <div className="space-y-2 bg-slate-800/30 p-3.5 rounded-2xl border border-slate-800/50 mb-5 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <FiMapPin className="text-rose-500 w-4 h-4 flex-shrink-0" />
            <span className="truncate" title={displayAddress}>
              <span className="text-slate-500 font-semibold">
                {lang === 'bn' ? 'এলাকা: ' : 'Area: '}
              </span>
              {displayAddress}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2">
              <FiAward className="text-sky-400 w-4 h-4 flex-shrink-0" />
              <span>
                <span className="text-slate-500 font-semibold">
                  {lang === 'bn' ? 'অভিজ্ঞতা: ' : 'Exp: '}
                </span>
                {lang === 'bn'
                  ? `${displayExperience} বছর`
                  : `${displayExperience} Years`}
              </span>
            </div>
            <div className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700/50">
              {displayCompletedTasks}+{' '}
              {lang === 'bn' ? 'কাজ সম্পন্ন' : 'Tasks Done'}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px]">
            <FiShield
              className={`w-3.5 h-3.5 ${isFullyVerified ? 'text-emerald-500' : 'text-amber-500'}`}
            />
            <span
              className={
                isFullyVerified
                  ? 'text-emerald-400 font-medium'
                  : 'text-slate-400'
              }
            >
              {isFullyVerified
                ? lang === 'bn'
                  ? '✓ শতভাগ ভেরিফাইড ও বিশ্বস্ত মিস্ত্রি'
                  : '✓ 100% Verified Handyman'
                : lang === 'bn'
                  ? '⚠ প্রোফাইল যাচাইকরণ প্রক্রিয়াধীন'
                  : '⚠ Profile Under Verification'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCallMistry}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <FiPhoneCall className="text-lg" />
            )}
            {lang === 'bn'
              ? isSubmitting
                ? 'বুকিং হচ্ছে...'
                : showNumber && phoneNumber
                  ? phoneNumber
                  : 'কল করুন'
              : isSubmitting
                ? 'Booking...'
                : showNumber && phoneNumber
                  ? phoneNumber
                  : 'Call Now'}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/50 font-semibold py-2.5 px-4 rounded-xl transition-all text-sm"
          >
            <FiMessageSquare className="w-4 h-4 text-slate-400" />
            <span>{lang === 'bn' ? 'রিভিউ দিন' : 'Give Review'}</span>
          </button>
        </div>
      </div>

      {/* ── Review Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/60 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'bn'
                    ? `${displayName}-কে রিভিউ দিন`
                    : `Review ${displayName}`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'bn'
                    ? 'আপনার অভিজ্ঞতা শেয়ার করুন'
                    : 'Share your experience'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleReviewSubmit}
              className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto"
            >
              {/* ── Photo upload (optional) ── */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <FiCamera className="w-6 h-6" />
                    </div>
                  )}
                  <label className="absolute inset-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300">
                    {lang === 'bn' ? 'ছবি যোগ করুন' : 'Add Photo'}
                    <span className="text-slate-500 font-normal ml-1">
                      ({lang === 'bn' ? 'ঐচ্ছিক' : 'optional'})
                    </span>
                  </p>
                  <label className="mt-1 inline-block text-xs text-yellow-500 hover:text-yellow-400 cursor-pointer transition-colors">
                    {lang === 'bn' ? 'ছবি আপলোড করুন' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>

              {/* ── Reviewer Name (required) ── */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {lang === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={e => setReviewerName(e.target.value)}
                    placeholder={
                      lang === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'
                    }
                    className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* ── Phone ── */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                  <span className="text-slate-600 normal-case font-normal ml-1">
                    ({lang === 'bn' ? 'ঐচ্ছিক' : 'optional'})
                  </span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    value={reviewerPhone}
                    onChange={e => setReviewerPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* ── Email ── */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {lang === 'bn' ? 'ইমেইল' : 'Email'}
                  <span className="text-slate-600 normal-case font-normal ml-1">
                    ({lang === 'bn' ? 'ঐচ্ছিক' : 'optional'})
                  </span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={reviewerEmail}
                    onChange={e => setReviewerEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* ── Star Rating ── */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  {lang === 'bn' ? 'রেটিং দিন *' : 'Your Rating *'}
                </label>
                <StarPicker value={userRating} onChange={setUserRating} />
              </div>

              {/* ── Comment ── */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {lang === 'bn' ? 'মন্তব্য *' : 'Comment *'}
                </label>
                <textarea
                  required
                  rows="4"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder={
                    lang === 'bn'
                      ? 'মিস্ত্রির কাজ কেমন লেগেছে লিখুন...'
                      : 'Write about your experience...'
                  }
                  className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors resize-none placeholder:text-slate-600"
                />
              </div>

              {/* ── Submit row ── */}
              <div className="flex gap-3 pt-1 pb-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-transparent text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-all"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 active:scale-[0.98]"
                >
                  {(isSubmitting || isUploading) && (
                    <span className="loading loading-spinner loading-xs" />
                  )}
                  {isUploading
                    ? lang === 'bn'
                      ? 'ছবি আপলোড...'
                      : 'Uploading...'
                    : isSubmitting
                      ? lang === 'bn'
                        ? 'জমা হচ্ছে...'
                        : 'Submitting...'
                      : lang === 'bn'
                        ? 'জমা দিন'
                        : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MistriCard;
