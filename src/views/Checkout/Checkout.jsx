import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import {
  FiCheckCircle,
  FiLock,
  FiPhone,
  FiUser,
  FiMapPin,
  FiAlertTriangle,
} from 'react-icons/fi';

const Checkout = () => {
  const { mistryId } = useParams();
  const [searchParams] = useSearchParams();
  const [mistry, setMistry] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [unlockedPhone, setUnlockedPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentError, setPaymentError] = useState('');

  const currentLang = searchParams.get('lang') === 'en' ? 'en' : 'bn';
  const paymentQueryStatus = searchParams.get('status');

  const baseUrl =
    (process.env.NEXT_PUBLIC_API_URL || "/api") || 'https://amar-mistri-backend.vercel.app';

  useEffect(() => {
    const fetchMistryDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/mechanics/${mistryId}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMistry(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mistryId) fetchMistryDetails();
  }, [mistryId, baseUrl]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (paymentQueryStatus === 'success') {
        setIsPaid(true);
        try {
          const res = await fetch(`${baseUrl}/mechanics/${mistryId}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentStatus: 'success' }),
          });
          const data = await res.json();
          setUnlockedPhone(data.phone || data.telephone);
        } catch (error) {
          console.error('Error fetching contact number:', error);
        }
      } else if (
        paymentQueryStatus === 'cancel' ||
        paymentQueryStatus === 'failure'
      ) {
        setPaymentError(
          currentLang === 'en'
            ? 'Payment was not successful. Please try again.'
            : 'পেমেন্ট সফল হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
        );
      }
    };

    if (paymentQueryStatus && mistryId) {
      verifyPayment();
    }
  }, [paymentQueryStatus, mistryId, baseUrl, currentLang]);

  // bKash Payment Gateway Trigger Logic
  const handleBkashPayment = async () => {
    setPaymentError('');
    try {
      const response = await fetch(`${baseUrl}/api/bkash/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mistryId: mistryId,
          amount: mistry.charge || 100,
          callbackUrl:
            window.location.origin +
            window.location.pathname +
            `?lang=${currentLang}`,
        }),
      });

      const data = await response.json();

      if (data.bkashURL) {
        window.location.href = data.bkashURL;
      } else {
        throw new Error(data.message || 'Failed to generate bKash URL');
      }
    } catch (error) {
      console.error('bKash Initialization Error:', error);
      setPaymentError(
        currentLang === 'en'
          ? 'Could not connect to bKash. Try again later.'
          : 'বিকাশ গেটওয়ের সাথে সংযোগ করা যাচ্ছে না। পরে চেষ্টা করুন।',
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white py-20">Loading Checkout...</div>
    );
  }

  if (!mistry) {
    return (
      <div className="text-center text-rose-500 py-20">
        Expert details not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex justify-center items-center">
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-center text-white border-b border-slate-800 pb-4">
          {currentLang === 'en' ? 'Checkout Summary' : 'বুকিং সারাংশ'}
        </h2>

        <div className="flex gap-4 items-center mb-6 bg-slate-950/40 border border-slate-900 p-4 rounded-xl">
          <img
            src={mistry.faceImageUrl || 'https://via.placeholder.com/150'}
            alt={mistry.fullName}
            className="w-16 h-16 rounded-xl object-cover border border-slate-800"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-200 truncate flex items-center gap-1.5">
              <FiUser className="text-primary text-sm" /> {mistry.fullName}
            </h3>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
              <FiMapPin className="text-rose-500 text-sm" /> {mistry.address}
            </p>
          </div>
        </div>

        {paymentError && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold mb-6">
            <FiAlertTriangle className="text-lg flex-shrink-0" />
            <p>{paymentError}</p>
          </div>
        )}

        {/* Lock or Unlock view condition statement */}
        {!isPaid ? (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl flex items-center gap-3 text-xs md:text-sm font-medium mb-6">
            <FiLock className="text-lg flex-shrink-0" />
            <p>
              {currentLang === 'en'
                ? 'Contact number is locked. Please pay the service charge to get the phone number.'
                : 'যোগাযোগের নম্বরটি লক করা আছে। মোবাইল নম্বরটি দেখতে দয়া করে ভিজিটিং চার্জ প্রদান করুন।'}
            </p>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl space-y-2 mb-6">
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold">
              <FiCheckCircle className="text-lg" />{' '}
              {currentLang === 'en'
                ? 'Payment Successful!'
                : 'পেমেন্ট সফল হয়েছে!'}
            </div>
            <div className="pt-2 border-t border-green-500/20 flex items-center gap-2 text-lg font-mono tracking-wider font-bold">
              <FiPhone /> {unlockedPhone || '017XXXXXXXX'}
            </div>
          </div>
        )}

        {!isPaid && (
          <button
            onClick={handleBkashPayment}
            className="w-full py-4 bg-[#D12053] hover:bg-[#B01743] text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>
              {currentLang === 'en' ? 'Pay with bKash' : 'বিকাশ দিয়ে পে করুন'}
            </span>
            <span>(${mistry.charge || 100})</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;
