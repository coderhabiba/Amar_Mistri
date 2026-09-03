import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import MistriCard from '../../components/MistriCard/MistriCard';

const CategoryMechanics = () => {
  const { categoryId } = useParams();
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'bn';

  useEffect(() => {
    axios
      .get(
        `${(process.env.NEXT_PUBLIC_API_URL || "/api")}/mechanics?specificService=${categoryId}`,
      )
      .then(res => {
        if (Array.isArray(res.data)) {
          setMechanics(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setMechanics(res.data.data);
        } else {
          setMechanics([]);
        }
      })
      .catch(err => {
        console.error('Error fetching mechanics:', err);
        setMechanics([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) {
    return (
      <div className="bg-[#0c111d] min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-yellow-500"></span>
      </div>
    );
  }

  return (
    <div className="bg-[#0c111d] min-h-screen text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <FiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>{currentLang === 'en' ? 'Go Back' : 'পেছনে যান'}</span>
        </button>

        {/* Dynamic Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-black capitalize tracking-tight">
            {currentLang === 'en'
              ? `${categoryId || 'Service'} Experts`
              : `${categoryId || 'সার্ভিস'} এক্সপার্ট মিস্ত্রিরা`}
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            {currentLang === 'en'
              ? `Found ${mechanics.length} verified professionals in this category.`
              : `এই ক্যাটাগরিতে ${mechanics.length} জন ভেরিফাইড এক্সপার্ট মিস্ত্রি পাওয়া গেছে।`}
          </p>
        </div>

        {/* Mechanics List Grid */}
        {mechanics.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {mechanics.map(mistri => (
              <MistriCard key={mistri._id} mistri={mistri} bookingInfo={null} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
            <p className="text-slate-400 text-lg">
              {currentLang === 'en'
                ? 'No mechanics found in this category.'
                : 'এই ক্যাটাগরিতে কোনো মিস্ত্রি পাওয়া যায়নি।'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMechanics;
