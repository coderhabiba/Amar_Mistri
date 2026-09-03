import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Webcam from 'react-webcam';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import {
  FiUser,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiMapPin,
  FiCreditCard,
  FiUploadCloud,
  FiCheckCircle,
  FiCamera,
  FiRefreshCw,
  FiLock,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';

const JoinAsMistri = () => {
  const TRANSLATIONS = {
    title: {
      en: 'Join as a Verified Mistry',
      bn: 'যাচাইকৃত মিস্ত্রি হিসেবে যুক্ত হোন',
    },
    subtitle: {
      en: 'Earn with respect. Fill out the form and secure your professional account with NID & Face Verification.',
      bn: 'সম্মানের সাথে আয় করুন। ফর্মটি পূরণ করুন এবং NID ও ফেস ভেরিফিকেশনের মাধ্যমে অ্যাকাউন্ট সুরক্ষিত করুন।',
    },
    personalHeading: { en: 'Personal Information', bn: 'ব্যক্তিগত তথ্য' },
    nidHeading: {
      en: 'Identity Verification (NID)',
      bn: 'পরিচয়পত্র যাচাইকরণ (NID)',
    },
    faceHeading: {
      en: 'Face Verification (Live Photo)',
      bn: 'ফেস ভেরিফিকেশন (লাইভ ছবি)',
    },
    privacyText: {
      en: 'I have read and agree to the Terms of Service and Privacy Policy.',
      bn: 'আমি শর্তাবলী এবং প্রাইভেসী পলিসি পড়েছি এবং এতে সম্মতি জানাচ্ছি।',
    },
    errors: {
      fullName: { en: 'Full name is required', bn: 'পূর্ণ নাম দেওয়া আবশ্যিক' },
      phone: {
        en: 'Mobile number is required',
        bn: 'মোবাইল নম্বর দেওয়া আবশ্যিক',
      },
      password: { en: 'Password is required', bn: 'পাসওয়ার্ড দেওয়া আবশ্যিক' },
      experience: {
        en: 'Years of experience is required',
        bn: 'কাজের অভিজ্ঞতা উল্লেখ করুন',
      },
      categories: {
        en: 'Select at least one category',
        bn: 'কমপক্ষে একটি কাজের ক্যাটাগরি সিলেক্ট করুন',
      },
      services: {
        en: 'Select at least one specific skill',
        bn: 'কমপক্ষে একটি নির্দিষ্ট দক্ষতা বাছাই করুন',
      },
      division: { en: 'Select your division', bn: 'বিভাগ সিলেক্ট করুন' },
      district: { en: 'Select your district', bn: 'জেলা সিলেক্ট করুন' },
      thana: { en: 'Select your thana', bn: 'থানা সিলেক্ট করুন' },
      area: { en: 'Area details are required', bn: 'এলাকা বা বাসার বিবরণ দিন' },
      gps: {
        en: 'Live GPS verification is required',
        bn: 'লাইভ জিপিএস লোকেশন ভেরিফাই করা আবশ্যিক',
      },
      nidNumber: {
        en: 'NID number is required',
        bn: 'NID নম্বর দেওয়া আবশ্যিক',
      },
      nidFront: {
        en: 'NID front image is required',
        bn: 'NID সামনের ছবি আপলোড করা আবশ্যিক',
      },
      nidBack: {
        en: 'NID back image is required',
        bn: 'NID পিছনের ছবি আপলোড করা আবশ্যিক',
      },
      faceImage: {
        en: 'Live face verification is required',
        bn: 'লাইভ ফেস স্ক্যান সম্পন্ন করা আবশ্যিক',
      },
      privacy: {
        en: 'You must accept the privacy policy',
        bn: 'দয়া করে প্রাইভেসী পলিসিতে সম্মতি দিন',
      },
    },
  };

  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  // API Integration States
  const [servicesData, setServicesData] = useState({});
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    categories: [],
    services: [],
    experience: '',
    nidNumber: '',
    referredBy: '',
    addressDetails: {
      division: '',
      district: '',
      thana: '',
      area: '',
    },
    liveLocation: {
      address: '',
      coordinates: [0, 0],
    },
  });

  // Assets Upload States
  const [nidFront, setNidFront] = useState(null);
  const [nidBack, setNidBack] = useState(null);
  const [faceImage, setFaceImage] = useState(null);

  // Status Indicators
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assignedMistriId, setAssignedMistriId] = useState('');

  // Validation Error Tracking State
  const [errors, setErrors] = useState({});

  // Webcam Configuration
  const webcamRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(true);

  // Fetch Dynamic Services on Mount
  useEffect(() => {
    fetch(`${(process.env.NEXT_PUBLIC_API_URL || "/api")}/services`)
      .then(res => res.json())
      .then(data => setServicesData(data))
      .catch(err =>
        console.error('Failed to load services database configuration:', err),
      );
  }, []);

  // Fetch Geo-Location Configurations on Mount
  useEffect(() => {
    fetch(`${(process.env.NEXT_PUBLIC_API_URL || "/api")}/locations`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDivisions(data);
        }
      })
      .catch(err =>
        console.error(
          'Failed to fetch standard administrative geographies:',
          err,
        ),
      );
  }, []);

  // Real-time local error clearer helper
  const clearFieldError = fieldName => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const remaining = { ...prev };
        delete remaining[fieldName];
        return remaining;
      });
    }
  };

  // Handle Category Checkbox Toggling
  const handleCategoryCheckboxChange = slug => {
    setFormData(prev => {
      const isAlreadySelected = prev.categories.includes(slug);
      let updatedCategories = [];
      if (isAlreadySelected) {
        updatedCategories = prev.categories.filter(cat => cat !== slug);
        const targetCategoryServices =
          servicesData[slug]?.services?.map(s => s.en) || [];
        const remainingServices = prev.services.filter(
          srv => !targetCategoryServices.includes(srv),
        );

        return {
          ...prev,
          categories: updatedCategories,
          services: remainingServices,
        };
      } else {
        updatedCategories = [...prev.categories, slug];
        return { ...prev, categories: updatedCategories };
      }
    });
    clearFieldError('categories');
  };

  // Handle Service Checkbox Toggling
  const handleServiceCheckboxChange = serviceNameEn => {
    setFormData(prev => {
      const isAlreadySelected = prev.services.includes(serviceNameEn);
      const updatedServices = isAlreadySelected
        ? prev.services.filter(s => s !== serviceNameEn)
        : [...prev.services, serviceNameEn];
      return { ...prev, services: updatedServices };
    });
    clearFieldError('services');
  };

  // Form Inputs Handler
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  // Handle Division Change
  const handleDivisionChange = e => {
    const selectedDivisionName = e.target.value;
    setFormData(prev => ({
      ...prev,
      addressDetails: {
        division: selectedDivisionName,
        district: '',
        thana: '',
        area: '',
      },
    }));

    const foundDivision = divisions.find(d => d.name === selectedDivisionName);
    setDistricts(foundDivision?.districts || []);
    setThanas([]);
    clearFieldError('division');
  };

  // 
  const handleDistrictChange = e => {
    const selectedDistrictName = e.target.value;
    setFormData(prev => ({
      ...prev,
      addressDetails: {
        ...prev.addressDetails,
        district: selectedDistrictName,
        thana: '',
        area: '',
      },
    }));

    const foundDistrict = districts.find(d => d.name === selectedDistrictName);
    setThanas(foundDistrict?.thanas || []);
    clearFieldError('district');
  };

  // Nested Address Handler
  const handleAddressDetailsChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      addressDetails: { ...prev.addressDetails, [name]: value },
    }));
    clearFieldError(name);
  };

  // File Upload to base64 parser
  const handleFileChange = (e, setter, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
      clearFieldError(fieldName);
    }
  };

  // Geolocation Resolution Logic
  const captureLiveCoordinates = () => {
    if (!navigator.geolocation) {
      toast.error(
        currentLang === 'bn'
          ? 'আপনার ব্রাউজারে জিওলোকেশন সাপোর্ট করে না।'
          : 'Geolocation is not supported by your browser framework.',
      );
      return;
    }

    setIsCapturingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();
          const readableAddress =
            data.display_name || `Lat: ${latitude}, Lng: ${longitude}`;

          setFormData(prev => ({
            ...prev,
            liveLocation: {
              address: readableAddress,
              coordinates: [longitude, latitude],
            },
          }));
          clearFieldError('gps');
          toast.success(
            currentLang === 'bn'
              ? 'লাইভ লোকেশন সফলভাবে যাচাই করা হয়েছে।'
              : 'Live positioning vectors mapped successfully.',
          );
        } catch (error) {
          console.error(error);
          setFormData(prev => ({
            ...prev,
            liveLocation: {
              address: `Lat: ${latitude}, Lng: ${longitude}`,
              coordinates: [longitude, latitude],
            },
          }));
          clearFieldError('gps');
        } finally {
          setIsCapturingLocation(false);
        }
      },
      error => {
        console.error(error);
        toast.error(
          currentLang === 'bn'
            ? 'লোকেশন অ্যাক্সেস করা সম্ভব হয়নি। অনুগ্রহ করে জিপিএস পারমিশন চেক করুন।'
            : 'Position capture rejected. Ensure GPS permissions are explicitly enabled.',
        );
        setIsCapturingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  // Face Scan Shutter Trigger
  const captureFaceSnapshot = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setFaceImage(imageSrc);
      setShowWebcam(false);
      clearFieldError('faceImage');
    }
  };

  // Retake Profile Picture
  const resetFaceCapturePipeline = () => {
    setFaceImage(null);
    setShowWebcam(true);
  };

  // Validates the state data scheme before deployment
  const validateFormSchema = () => {
    const localErrors = {};

    if (!formData.fullName.trim())
      localErrors.fullName = TRANSLATIONS.errors.fullName[currentLang];
    if (!formData.phone.trim())
      localErrors.phone = TRANSLATIONS.errors.phone[currentLang];
    if (!formData.password.trim())
      localErrors.password = TRANSLATIONS.errors.password[currentLang];
    if (!formData.experience.trim())
      localErrors.experience = TRANSLATIONS.errors.experience[currentLang];

    if (formData.categories.length === 0)
      localErrors.categories = TRANSLATIONS.errors.categories[currentLang];
    if (formData.services.length === 0)
      localErrors.services = TRANSLATIONS.errors.services[currentLang];

    if (!formData.addressDetails.division)
      localErrors.division = TRANSLATIONS.errors.division[currentLang];
    if (!formData.addressDetails.district)
      localErrors.district = TRANSLATIONS.errors.district[currentLang];
    if (!formData.addressDetails.thana)
      localErrors.thana = TRANSLATIONS.errors.thana[currentLang];
    if (!formData.addressDetails.area.trim())
      localErrors.area = TRANSLATIONS.errors.area[currentLang];

    if (!formData.nidNumber.trim())
      localErrors.nidNumber = TRANSLATIONS.errors.nidNumber[currentLang];

    if (
      !formData.liveLocation.address ||
      formData.liveLocation.coordinates[0] === 0
    ) {
      localErrors.gps = TRANSLATIONS.errors.gps[currentLang];
    }

    if (!nidFront)
      localErrors.nidFront = TRANSLATIONS.errors.nidFront[currentLang];
    if (!nidBack)
      localErrors.nidBack = TRANSLATIONS.errors.nidBack[currentLang];
    if (!faceImage)
      localErrors.faceImage = TRANSLATIONS.errors.faceImage[currentLang];
    if (!isPrivacyAccepted)
      localErrors.privacy = TRANSLATIONS.errors.privacy[currentLang];

    setErrors(localErrors);

    // Return true if schema is completely empty of error flags
    return Object.keys(localErrors).length === 0;
  };

  // Cloudinary image asset pipeline
  const uploadBinaryAssetToCloud = async fileOrBase64 => {
    if (!fileOrBase64) return '';

    const formPayload = new FormData();

    if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
      try {
        const [header, base64String] = fileOrBase64.split(',');
        const mimeMatch = header.match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const binaryString = atob(base64String);
        const arrayBuffer = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          arrayBuffer[i] = binaryString.charCodeAt(i);
        }
        const blobFile = new Blob([arrayBuffer], { type: mimeType });
        formPayload.append(
          'file',
          blobFile,
          `webcam_snapshot_${Date.now()}.jpg`,
        );
      } catch (parseError) {
        console.error('Failed to process Base64 data asset:', parseError);
        formPayload.append('file', fileOrBase64);
      }
    } else {
      formPayload.append('file', fileOrBase64);
    }

    const uploadPreset = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "amar_mistri_preset_name");
    const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djehgtqjf");

    if (!cloudName || !uploadPreset) {
      throw new Error(
        'Cloudinary environment configuration is incomplete in .env',
      );
    }

    formPayload.append('upload_preset', uploadPreset);
    const targetUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      body: formPayload,
    });

    const json = await response.json();

    if (!response.ok || json.error) {
      throw new Error(
        json.error?.message || 'Cloud asset dispatch operation failed.',
      );
    }
    return json.secure_url;
  };

  // Master Gateway Form Submission Handler
  const executeFinalSubmission = useCallback(
    async e => {
      if (e) e.preventDefault();

      // Trigger validation and prevent submission if checks fail
      if (!validateFormSchema()) {
        toast.error(
          currentLang === 'bn'
            ? 'অনুগ্রহ করে ফর্মের ভুল বা খালি ফিল্ডগুলো ঠিক করুন।'
            : 'Please resolve all required fields and errors before submitting.',
        );

        // Auto scroll to first error field for accessibility
        setTimeout(() => {
          const firstErrorKey = Object.keys(errors)[0];
          if (firstErrorKey) {
            const element =
              document.getElementsByName(firstErrorKey)[0] ||
              document.getElementById(firstErrorKey);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }, 100);
        return;
      }

      setIsSubmitting(true);

      const trackingToastId = toast.loading(
        currentLang === 'bn'
          ? 'আপনার সিকিউর প্রোফাইল এবং আইডেন্টিটি ডাটাবেজে আপলোড হচ্ছে...'
          : 'Encrypting and routing compliance schemas to centralized cloud nodes...',
      );

      try {
        const [uploadedNidFrontUrl, uploadedNidBackUrl, uploadedFaceImageUrl] =
          await Promise.all([
            uploadBinaryAssetToCloud(nidFront),
            uploadBinaryAssetToCloud(nidBack),
            uploadBinaryAssetToCloud(faceImage),
          ]);

        const conceptualStructuredAddress = [
          formData.addressDetails.area,
          formData.addressDetails.thana,
          formData.addressDetails.district,
          formData.addressDetails.division,
        ]
          .filter(Boolean)
          .join(', ');

        const submissionSchema = {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          categories: formData.categories,
          services: formData.services,
          experience: Number(formData.experience) || 0,
          charge: Number(formData.charge) || 100,
          photo: uploadedFaceImageUrl,
          nidNumber: formData.nidNumber,
          nidFrontUrl: uploadedNidFrontUrl,
          nidBackUrl: uploadedNidBackUrl,
          address: conceptualStructuredAddress || formData.liveLocation.address,
          district: formData.addressDetails.district,
          thana: formData.addressDetails.thana,
          liveLocation: formData.liveLocation,
          referredBy: formData.referredBy || null,
        };

        const endpoint = `${(process.env.NEXT_PUBLIC_API_URL || "/api")}/mechanics`;
        const serverResponse = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionSchema),
        });

        const outcomeData = await serverResponse.json();

        if (!serverResponse.ok || !outcomeData.success) {
          throw new Error(
            outcomeData.message ||
              'System validation pipeline returned structural faults.',
          );
        }

        setAssignedMistriId(outcomeData.mistriId || 'AM-PENDING');
        setIsSubmitted(true);
        toast.success(
          currentLang === 'bn'
            ? 'অভিনন্দন! আপনার আবেদনটি সফলভাবে গৃহীত হয়েছে।'
            : 'Compliance clearance approved.',
          { id: trackingToastId },
        );
      } catch (err) {
        console.error(err);
        toast.error(
          err.message ||
            (currentLang === 'bn'
              ? 'সার্ভার প্রক্রিয়াকরণে ত্রুটি ঘটেছে।'
              : 'Gateway routing failed.'),
          { id: trackingToastId },
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, nidFront, nidBack, faceImage, currentLang, errors],
  );

  // Field label reusable style schema
  const lb =
    'block text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-2';

  // Input standard wrapper styling class
  const ic =
    'w-full bg-slate-900 border border-slate-700/80 hover:border-slate-600 focus:border-primary/70 focus:ring-1 focus:ring-primary/20 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200';

  // Selection dropdown styling configuration
  const sl =
    'w-full bg-slate-900 border border-slate-700/80 hover:border-slate-600 focus:border-primary/70 text-slate-200 rounded-xl py-3 px-4 text-sm outline-none transition-all appearance-none cursor-pointer';

  // Inline dynamic form field error message element block
  const ErrorMsg = ({ message }) =>
    message ? (
      <p className="text-xs text-red-500 font-medium mt-1 transition-all duration-150 animate-pulse">
        {message}
      </p>
    ) : null;

  // Section header sub-component representation
  const SectionHeader = ({ label, icon: Icon, accent = 'primary', step }) => (
    <div className="flex items-center gap-3 mb-6">
      {step && (
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 ${accent === 'amber' ? 'bg-amber-500' : 'bg-primary'}`}
        >
          {step}
        </div>
      )}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${accent === 'amber' ? 'bg-amber-500/15 border border-amber-500/30' : 'bg-primary/15 border border-primary/30'}`}
      >
        <Icon
          className={`text-sm ${accent === 'amber' ? 'text-amber-400' : 'text-primary'}`}
        />
      </div>
      <div>
        <h2 className="text-sm font-bold text-white tracking-wide">{label}</h2>
        <div
          className={`h-px w-full mt-0.5 ${accent === 'amber' ? 'bg-amber-500/20' : 'bg-primary/20'}`}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#080c14] text-slate-100 py-20 px-4 relative overflow-hidden">
      {/* Atmosphere radial context meshes */}
      <div className="absolute top-[-15%] left-[-5%] w-[55%] h-[55%] bg-primary/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[45%] h-[45%] bg-amber-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2MmgEdjRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NGgMdjJoNHY0aDJWNDBoNHYtMkg2ek02IDRWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {!isSubmitted ? (
          <form onSubmit={executeFinalSubmission} noValidate>
            {/* Page header element banner code template */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary text-[10px] font-black px-4 py-1.5 rounded-full mb-5 uppercase tracking-[0.2em]">
                <FiCheckCircle className="text-xs" />
                {currentLang === 'bn'
                  ? 'সম্পূর্ণ বিনামূল্যে'
                  : 'Completely Free'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                {TRANSLATIONS.title[currentLang]}
              </h1>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                {TRANSLATIONS.subtitle[currentLang]}
              </p>
              <p className="mt-4 text-xs text-slate-400">
                {currentLang === 'bn'
                  ? 'ইতোমধ্যে অ্যাকাউন্ট আছে?'
                  : 'Already have an account?'}{' '}
                <Link
                  to="/login"
                  className="text-primary font-bold hover:text-primary/80 transition-colors underline underline-offset-2"
                >
                  {currentLang === 'bn' ? 'লগইন করুন →' : 'Log in →'}
                </Link>
              </p>
            </div>

            {/* Central compilation data form entry card architecture */}
            <div className="rounded-2xl overflow-hidden border border-slate-800/60 shadow-2xl shadow-black/70 divide-y divide-slate-800/60">
              {/* STEP 1: Personal Info Segment Container */}
              <div className="bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8">
                <SectionHeader
                  label={TRANSLATIONS.personalHeading[currentLang]}
                  icon={FiUser}
                  step="1"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <label className={lb}>
                      {currentLang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={
                          currentLang === 'bn'
                            ? 'যেমন: হাবিবুর রহমান'
                            : 'e.g. Habibur Rahman'
                        }
                        className={`${ic} ${errors.fullName ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    <ErrorMsg message={errors.fullName} />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className={lb}>
                      {currentLang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="01XXXXXXXXX"
                        className={`${ic} ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    <ErrorMsg message={errors.phone} />
                  </div>

                  {/* Email Field (Optional) */}
                  <div className="space-y-2">
                    <label className={lb}>
                      {currentLang === 'bn' ? 'ইমেইল' : 'Email'}
                      <span className="text-slate-500 ml-2 normal-case font-normal text-[10px]">
                        ({currentLang === 'bn' ? 'ঐচ্ছিক' : 'optional'})
                      </span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@gmail.com"
                        className={ic}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className={lb}>
                      {currentLang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`${ic} pr-12 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                      </button>
                    </div>
                    <ErrorMsg message={errors.password} />
                  </div>

                  {/* Experience Input Segment */}
                  <div className="space-y-2 md:col-span-2">
                    <label className={lb}>
                      {currentLang === 'bn'
                        ? 'কাজের অভিজ্ঞতা (বছর)'
                        : 'Years of Experience'}
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <div className="relative">
                      <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="number"
                        name="experience"
                        min="0"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder={
                          currentLang === 'bn' ? 'যেমন: ৫' : 'e.g. 5'
                        }
                        className={`${ic} ${errors.experience ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    <ErrorMsg message={errors.experience} />
                  </div>
                </div>
              </div>

              {/* Work Categories Segment Box */}
              <div
                id="categories"
                className="bg-slate-900/70 backdrop-blur-sm p-6 sm:p-8"
              >
                <SectionHeader
                  label={
                    currentLang === 'bn' ? 'কাজের ক্যাটাগরি' : 'Work Categories'
                  }
                  icon={FiBriefcase}
                  step="2"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.keys(servicesData).map(slug => {
                    const isChecked = formData.categories.includes(slug);
                    return (
                      <label
                        key={slug}
                        className={`relative flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/10'
                            : 'bg-slate-950/50 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:text-white hover:bg-slate-900/80'
                        } ${errors.categories ? 'border-red-500/50' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCategoryCheckboxChange(slug)}
                          className="checkbox checkbox-primary checkbox-sm rounded-md shrink-0"
                        />
                        <span className="text-xs font-semibold leading-tight">
                          {currentLang === 'bn'
                            ? servicesData[slug].category?.bn
                            : servicesData[slug].category?.en}
                        </span>
                        {isChecked && (
                          <FiCheckCircle className="absolute top-2 right-2 text-amber-400 text-xs" />
                        )}
                      </label>
                    );
                  })}
                </div>
                <ErrorMsg message={errors.categories} />

                {/* Specific Skills / Sub-services Mapping Rendering Block */}
                {formData.categories.length > 0 && (
                  <div id="services" className="mt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-slate-800" />
                      <p className="text-[11px] font-black text-amber-400 uppercase tracking-widest shrink-0">
                        {currentLang === 'bn'
                          ? 'নির্দিষ্ট দক্ষতা বাছাই করুন'
                          : 'Pick Specific Skills'}
                        <span className="text-primary ml-1">*</span>
                      </p>
                      <div className="h-px flex-1 bg-slate-800" />
                    </div>

                    {formData.categories.map(catSlug => (
                      <div
                        key={catSlug}
                        className={`bg-slate-950/70 border rounded-xl p-4 ${errors.services ? 'border-red-500/40' : 'border-slate-800/80'}`}
                      >
                        <h4 className="text-[11px] font-black text-amber-400/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <span className="w-1 h-3 bg-amber-500 rounded-full inline-block" />
                          {currentLang === 'bn'
                            ? servicesData[catSlug]?.category?.bn
                            : servicesData[catSlug]?.category?.en}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {servicesData[catSlug]?.services?.map((srv, i) => {
                            const isChecked = formData.services.includes(
                              srv.en,
                            );
                            return (
                              <label
                                key={i}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all duration-150 ${
                                  isChecked
                                    ? 'bg-primary/8 border-primary/35 text-white'
                                    : 'border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() =>
                                    handleServiceCheckboxChange(srv.en)
                                  }
                                  className="checkbox checkbox-xs rounded shrink-0"
                                />
                                <span className="text-xs font-medium">
                                  {currentLang === 'bn' ? srv.bn : srv.en}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <ErrorMsg message={errors.services} />
                  </div>
                )}
              </div>

              {/* Address & GPS Location Configurations Container */}
              <div className="bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8">
                <SectionHeader
                  label={
                    currentLang === 'bn'
                      ? 'কার্যপরিধি ও ঠিকানা'
                      : 'Location & Address'
                  }
                  icon={FiMapPin}
                  step="3"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Division Selection Dropdown Grid */}
                  <div className="space-y-2">
                    <label className={lb}>
                      {currentLang === 'bn' ? 'বিভাগ' : 'Division'}
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <select
                      name="division"
                      value={formData.addressDetails.division}
                      onChange={handleDivisionChange}
                      className={`${sl} ${errors.division ? 'border-red-500 focus:border-red-500' : ''}`}
                    >
                      <option value="">
                        {currentLang === 'bn'
                          ? 'বিভাগ বেছে নিন'
                          : 'Select Division'}
                      </option>
                      {divisions.map((d, i) => (
                        <option key={i} value={d.name}>
                          {currentLang === 'bn' ? d.bn : d.name}
                        </option>
                      ))}
                    </select>
                    <ErrorMsg message={errors.division} />
                  </div>

                  {/* District Selection Dropdown Grid */}
                  <div className="space-y-2">
                    <label className={lb}>
                      {currentLang === 'bn' ? 'জেলা' : 'District'}
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <select
                      disabled={!formData.addressDetails.division}
                      name="district"
                      value={formData.addressDetails.district}
                      onChange={handleDistrictChange}
                      className={`${sl} disabled:opacity-40 disabled:cursor-not-allowed ${errors.district ? 'border-red-500 focus:border-red-500' : ''}`}
                    >
                      <option value="">
                        {currentLang === 'bn'
                          ? 'জেলা বেছে নিন'
                          : 'Select District'}
                      </option>
                      {districts.map((d, i) => (
                        <option key={i} value={d.name}>
                          {currentLang === 'bn' ? d.bn : d.name}
                        </option>
                      ))}
                    </select>
                    <ErrorMsg message={errors.district} />
                  </div>

                  {/* Thana Selection Dropdown Grid */}
                  <div className="space-y-2">
                    <label className={lb}>
                      {currentLang === 'bn'
                        ? 'থানা / উপজেলা'
                        : 'Thana / Upazila'}
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <select
                      disabled={!formData.addressDetails.district}
                      name="thana"
                      value={formData.addressDetails.thana}
                      onChange={handleAddressDetailsChange}
                      className={`${sl} disabled:opacity-40 disabled:cursor-not-allowed ${errors.thana ? 'border-red-500 focus:border-red-500' : ''}`}
                    >
                      <option value="">
                        {currentLang === 'bn'
                          ? 'থানা বেছে নিন'
                          : 'Select Thana'}
                      </option>
                      {thanas.map((t, i) => (
                        <option key={i} value={t.name}>
                          {currentLang === 'bn' ? t.bn : t.name}
                        </option>
                      ))}
                    </select>
                    <ErrorMsg message={errors.thana} />
                  </div>

                  {/* Area Details Input String */}
                  <div className="space-y-2">
                    <label className={lb}>
                      {currentLang === 'bn'
                        ? 'এলাকা / রোড / বাসা নং'
                        : 'Area / Road / House No.'}
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.addressDetails.area}
                      onChange={handleAddressDetailsChange}
                      placeholder={
                        currentLang === 'bn'
                          ? 'যেমন: রোড-৩, বাসা-২৪'
                          : 'e.g. Road-3, House-24'
                      }
                      className={`w-full bg-slate-900 border border-slate-700/80 hover:border-slate-600 focus:border-primary/70 rounded-xl py-3 px-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all ${errors.area ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    <ErrorMsg message={errors.area} />
                  </div>

                  {/* GPS Live Vector Lock UI Box Grid Component */}
                  <div id="gps" className="md:col-span-2">
                    <div
                      className={`rounded-xl p-4 border transition-all ${formData.liveLocation.address ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-slate-950/60 border-slate-700/50'} ${errors.gps ? 'border-red-500' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-200 flex items-center gap-2">
                            <FiMapPin
                              className={
                                formData.liveLocation.address
                                  ? 'text-emerald-400'
                                  : 'text-primary'
                              }
                            />
                            {currentLang === 'bn'
                              ? 'লাইভ GPS লোকেশন'
                              : 'Live GPS Location'}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {currentLang === 'bn'
                              ? 'নিকটস্থ গ্রাহক পেতে GPS সেট করুন।'
                              : 'Required to match nearby customers.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={captureLiveCoordinates}
                          disabled={isCapturingLocation}
                          className="shrink-0 py-2 px-4 bg-slate-900 border border-slate-700 hover:border-primary/50 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 disabled:opacity-40"
                        >
                          <FiRefreshCw
                            className={
                              isCapturingLocation ? 'animate-spin' : ''
                            }
                          />
                          {isCapturingLocation
                            ? currentLang === 'bn'
                              ? 'নেওয়া হচ্ছে...'
                              : 'Locating...'
                            : currentLang === 'bn'
                              ? 'GPS সেট করুন'
                              : 'Set GPS'}
                        </button>
                      </div>

                      {formData.liveLocation.address && (
                        <div className="flex items-start gap-2 mt-3 pt-3 border-t border-emerald-800/30">
                          <FiCheckCircle className="text-emerald-400 shrink-0 mt-0.5 text-sm" />
                          <p className="text-xs text-emerald-300 leading-relaxed">
                            {formData.liveLocation.address}
                          </p>
                        </div>
                      )}
                    </div>
                    <ErrorMsg message={errors.gps} />
                  </div>
                </div>
              </div>

              {/* NID Identification Verification Elements */}
              <div className="bg-slate-900/70 backdrop-blur-sm p-6 sm:p-8">
                <SectionHeader
                  label={TRANSLATIONS.nidHeading[currentLang]}
                  icon={FiCreditCard}
                  step="4"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* NID Numeric Key Input Entry */}
                  <div className="space-y-2 md:col-span-2">
                    <label className={lb}>
                      {currentLang === 'bn' ? 'NID নম্বর' : 'NID Number'}
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="nidNumber"
                      id="nidNumber"
                      value={formData.nidNumber}
                      onChange={handleInputChange}
                      placeholder="XXXXXXXXXX"
                      className={`w-full bg-slate-900 border hover:border-slate-600 focus:border-primary/70 rounded-xl py-3 px-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all font-mono tracking-widest ${errors.nidNumber ? 'border-red-500 focus:border-red-500' : 'border-slate-700/80'}`}
                    />
                    <ErrorMsg message={errors.nidNumber} />
                  </div>

                  {/* NID Front Segment File Upload Card Element */}
                  <div id="nidFront" className="space-y-2">
                    <label className={lb}>
                      {currentLang === 'bn' ? 'NID সামনের ছবি' : 'NID Front'}
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <label
                      className={`group relative h-36 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden border-2 border-dashed ${nidFront ? 'border-emerald-600/50' : 'border-slate-700 hover:border-primary/50 bg-slate-950/50'} ${errors.nidFront ? 'border-red-500' : ''}`}
                    >
                      {nidFront ? (
                        <>
                          <img
                            src={nidFront}
                            alt="NID Front"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              {currentLang === 'bn'
                                ? 'পরিবর্তন করুন'
                                : 'Change'}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <FiUploadCloud
                            className={`text-2xl text-slate-500 group-hover:text-primary/80 transition-colors ${errors.nidFront ? 'text-red-400' : ''}`}
                          />
                          <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                            {currentLang === 'bn'
                              ? 'ছবি আপলোড করুন'
                              : 'Upload Image'}
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e =>
                          handleFileChange(e, setNidFront, 'nidFront')
                        }
                        className="hidden"
                      />
                    </label>
                    <ErrorMsg message={errors.nidFront} />
                  </div>

                  {/* NID Reversal Segment File Upload Card Element */}
                  <div id="nidBack" className="space-y-2">
                    <label className={lb}>
                      {currentLang === 'bn' ? 'NID পিছনের ছবি' : 'NID Back'}
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <label
                      className={`group relative h-36 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden border-2 border-dashed ${nidBack ? 'border-emerald-600/50' : 'border-slate-700 hover:border-primary/50 bg-slate-950/50'} ${errors.nidBack ? 'border-red-500' : ''}`}
                    >
                      {nidBack ? (
                        <>
                          <img
                            src={nidBack}
                            alt="NID Back"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              {currentLang === 'bn'
                                ? 'পরিবর্তন করুন'
                                : 'Change'}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <FiUploadCloud
                            className={`text-2xl text-slate-500 group-hover:text-primary/80 transition-colors ${errors.nidBack ? 'text-red-400' : ''}`}
                          />
                          <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                            {currentLang === 'bn'
                              ? 'ছবি আপলোড করুন'
                              : 'Upload Image'}
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e =>
                          handleFileChange(e, setNidBack, 'nidBack')
                        }
                        className="hidden"
                      />
                    </label>
                    <ErrorMsg message={errors.nidBack} />
                  </div>
                </div>
              </div>

              {/* STEP 5: Face Verification Biometrics Capturing Unit */}
              <div
                id="faceImage"
                className="bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8"
              >
                <SectionHeader
                  label={TRANSLATIONS.faceHeading[currentLang]}
                  icon={FiCamera}
                  accent="amber"
                  step="5"
                />

                <div className="flex flex-col items-center gap-5">
                  <div className="relative">
                    <div
                      className={`w-52 h-52 rounded-full overflow-hidden shadow-2xl transition-all duration-500 ${showWebcam ? 'border-4 border-primary/40 shadow-primary/10' : 'border-4 border-emerald-500/40 shadow-emerald-500/10'} ${errors.faceImage ? 'border-red-500' : ''}`}
                    >
                      {showWebcam ? (
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          className="w-full h-full object-cover scale-125"
                          videoConstraints={{
                            facingMode: 'user',
                            aspectRatio: 1,
                          }}
                        />
                      ) : (
                        <img
                          src={faceImage}
                          alt="Face"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {showWebcam && (
                      <div className="absolute inset-[-8px] rounded-full border-2 border-dashed border-primary/25 animate-[spin_10s_linear_infinite] pointer-events-none" />
                    )}

                    {!showWebcam && faceImage && (
                      <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-[3px] border-[#080c14] shadow-lg">
                        <FiCheckCircle className="text-white text-sm" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed">
                    {currentLang === 'bn'
                      ? 'সঠিকভাবে মুখ রেখে পরিষ্কার আলোতে ছবি তুলুন।'
                      : 'Position face clearly in the frame with good lighting.'}
                  </p>

                  {showWebcam ? (
                    <button
                      type="button"
                      onClick={captureFaceSnapshot}
                      className="py-2.5 px-8 bg-primary hover:bg-primary/90 active:scale-95 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                      <FiCamera />
                      {currentLang === 'bn' ? 'ছবি তুলুন' : 'Capture Photo'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={resetFaceCapturePipeline}
                      className="py-2.5 px-8 bg-slate-900 border border-slate-700 hover:border-slate-600 active:scale-95 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                    >
                      <FiRefreshCw />
                      {currentLang === 'bn' ? 'পুনরায় তুলুন' : 'Retake Photo'}
                    </button>
                  )}
                  <ErrorMsg message={errors.faceImage} />
                </div>
              </div>

              {/* STEP 6: Referral Verification Metadata Node */}
              <div className="bg-slate-900/70 backdrop-blur-sm p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-2">
                      {currentLang === 'bn' ? 'রেফারেল কোড' : 'Referral Code'}
                      <span className="text-[10px] normal-case font-normal text-slate-400 border border-slate-700 px-2 py-0.5 rounded-md">
                        {currentLang === 'bn' ? 'ঐচ্ছিক' : 'optional'}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {currentLang === 'bn'
                        ? 'কোনো মিস্ত্রি আমন্ত্রণ জানালে তার কোড লিখুন।'
                        : 'Enter the code if invited by an existing technician.'}
                    </p>
                  </div>
                  <input
                    type="text"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleInputChange}
                    placeholder="AM-024"
                    className="w-full bg-slate-900 border border-slate-700/80 hover:border-amber-500/30 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm font-mono text-amber-400 placeholder:text-slate-700 outline-none transition-all uppercase tracking-widest text-center"
                  />
                </div>
              </div>

              {/* Privacy Policy Legal Acceptance Wrapper Box Component */}
              <div
                id="privacy"
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="privacyCheck"
                    checked={isPrivacyAccepted}
                    onChange={e => {
                      setIsPrivacyAccepted(e.target.checked);
                      if (e.target.checked) clearFieldError('privacy');
                    }}
                    className="checkbox checkbox-amber checkbox-sm border-slate-600 rounded-md"
                  />
                  <label
                    htmlFor="privacyCheck"
                    className="text-xs text-slate-300 cursor-pointer select-none"
                  >
                    {TRANSLATIONS.privacyText[currentLang]}
                  </label>
                </div>
                <ErrorMsg message={errors.privacy} />
              </div>

              {/* Application Submit Trigger Area Panel */}
              <div className="bg-slate-900 p-6 sm:p-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-primary via-primary to-amber-500 hover:brightness-110 disabled:from-slate-800 disabled:to-slate-800 text-white font-black text-sm uppercase tracking-[0.15em] rounded-xl transition-all duration-300 shadow-lg shadow-primary/15 active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <FiRefreshCw className="animate-spin text-base" />
                      {currentLang === 'bn'
                        ? 'আপলোড ও প্রক্রিয়াধীন...'
                        : 'Uploading & Processing...'}
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="text-base" />
                      {currentLang === 'bn'
                        ? 'ভেরিফিকেশনের জন্য সাবমিট করুন'
                        : 'Submit Application'}
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400 mt-4">
                  {currentLang === 'bn'
                    ? 'সাবমিট করার পূর্বে আমাদের'
                    : 'Before submitting your form read our'}{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
                  >
                    {currentLang === 'bn'
                      ? 'শর্তাবলী ও প্রাইভেসি পলিসি'
                      : 'Terms & Privacy Policy'}{' '}
                  </Link>
                  {currentLang === 'bn' ? 'ভালো করে পড়ে নিন' : 'carefully'}
                </p>
              </div>
            </div>
          </form>
        ) : (
          /* Submission Screen Success Callback Display Component */
          <div className="max-w-md mx-auto text-center">
            <div className="bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm rounded-2xl p-10 space-y-6 shadow-2xl shadow-black/60">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping opacity-40" />
                <div className="relative w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-emerald-400 text-4xl" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white mb-2">
                  {currentLang === 'bn'
                    ? 'আবেদন সফল!'
                    : 'Application Submitted!'}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
                  {currentLang === 'bn'
                    ? 'আপনার তথ্য রিভিউ প্যানেলে পাঠানো হয়েছে। অনুমোদন হলে SMS-এ জানানো হবে।'
                    : 'Your info has been sent for review. You will be notified via SMS upon approval.'}
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-8 py-5 inline-block w-full">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  {currentLang === 'bn'
                    ? 'আপনার মিস্ত্রি আইডি'
                    : 'Your Mistry ID'}
                </p>
                <p className="text-3xl font-mono font-black text-amber-400 tracking-widest">
                  {assignedMistriId}
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 py-3 px-8 bg-slate-900 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                {currentLang === 'bn' ? '← হোমপেজে ফিরে যান' : '← Back to Home'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinAsMistri;
