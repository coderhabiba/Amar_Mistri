import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiArrowLeft,
  FiStar,
  FiMessageSquare,
  FiCalendar,
  FiUser,
  FiMail,
} from 'react-icons/fi';

const MistriReviews = () => {
  const { mistriId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'bn';

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(0);

  const mistriName = state?.mistriName || 'মিস্ত্রি';
  const mistriPhoto = state?.mistriPhoto || '';
  const overallRating = state?.rating || 5.0;

  useEffect(() => {
    if (mistriId) {
      fetch(`${(process.env.NEXT_PUBLIC_API_URL || "/api")}/reviews?mistriId=${mistriId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setReviews(data);
        })
        .catch(err => console.error('Error fetching reviews:', err))
        .finally(() => setLoading(false));
    }
  }, [mistriId]);

  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(Number(r.rating)) === star).length,
  }));

  const filteredReviews =
    filterRating === 0
      ? reviews
      : reviews.filter(r => Math.round(Number(r.rating)) === filterRating);

  const liveRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
          reviews.length
        ).toFixed(1)
      : overallRating;

  return (
    <div className="bg-[#0c111d] min-h-screen text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <FiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>{currentLang === 'bn' ? 'পেছনে যান' : 'Go Back'}</span>
        </button>

        <div className="flex items-center gap-4 mb-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-5">
          {mistriPhoto && (
            <img
              src={mistriPhoto}
              alt={mistriName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
            />
          )}
          <div>
            <h1 className="text-2xl font-black text-white">{mistriName}</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {currentLang === 'bn'
                ? 'সকল রিভিউ ও রেটিং'
                : 'All Reviews & Ratings'}
            </p>
          </div>
        </div>

        {/* Breakdown Summary Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="text-center flex-shrink-0">
              <div className="text-6xl font-black text-white leading-none">
                {loading ? '...' : liveRating}
              </div>
              <div className="flex items-center justify-center gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <FiStar
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(Number(liveRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {reviews.length} {currentLang === 'bn' ? 'রিভিউ' : 'Reviews'}
              </p>
            </div>

            <div className="flex-1 w-full space-y-2">
              {ratingBreakdown.map(({ star, count }) => {
                const pct =
                  reviews.length > 0
                    ? Math.round((count / reviews.length) * 100)
                    : 0;
                return (
                  <button
                    key={star}
                    onClick={() =>
                      setFilterRating(filterRating === star ? 0 : star)
                    }
                    className="w-full flex items-center gap-2 opacity-80 hover:opacity-100"
                  >
                    <span className="text-xs text-slate-400 w-4 text-right">
                      {star}
                    </span>
                    <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500/60 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-yellow-500" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
            <FiMessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">
              {currentLang === 'bn'
                ? 'কোনো রিভিউ পাওয়া যায়নি।'
                : 'No reviews found.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((rev, index) => (
              <div
                key={rev._id || index}
                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">
                        {rev.reviewerName ||
                          (currentLang === 'bn' ? 'গ্রাহক' : 'Customer')}
                      </p>
                      {rev.reviewerEmail && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 font-mono mt-0.5">
                          <FiMail className="w-3 h-3 text-slate-600" />
                          <span>{rev.reviewerEmail}</span>
                        </p>
                      )}

                      {rev.createdAt && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                          <FiCalendar className="w-3 h-3" />
                          <span>
                            {new Date(rev.createdAt).toLocaleDateString(
                              currentLang === 'bn' ? 'bn-BD' : 'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              },
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <FiStar
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= Number(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed pl-1.5 border-l-2 border-slate-800 mt-2">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MistriReviews;
