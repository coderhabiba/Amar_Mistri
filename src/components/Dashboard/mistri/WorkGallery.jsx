import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const WorkGallery = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const [images, setImages] = useState([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60',
      title: 'Asset Verse Dashboard',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&auto=format&fit=crop&q=60',
      title: 'Plate Share Logic Architecture',
    },
  ]);

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setImages([
        ...images,
        { id: Date.now(), url: localUrl, title: 'New Project Snap' },
      ]);
    }
  };

  const deleteImage = id => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">
            {currentLang === 'bn'
              ? 'কাজের পোর্টফোলিও গ্যালারি'
              : 'Work Portfolio Gallery'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentLang === 'bn'
              ? 'আপনার করা বিভিন্ন প্রজেক্টের কাজের ছবি এখানে আপলোড ও প্রদর্শন করুন।'
              : 'Upload and manage snapshots of your previous projects.'}
          </p>
        </div>

        <label className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0">
          <FiPlus className="text-sm stroke-[3]" />
          <span>
            {currentLang === 'bn' ? 'নতুন ছবি যোগ করুন' : 'Upload Image'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Gallery Frame Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map(img => (
          <div
            key={img.id}
            className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative shadow-lg aspect-video"
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end justify-between">
              <p className="text-xs font-bold text-white truncate max-w-[80%]">
                {img.title}
              </p>
              <button
                onClick={() => deleteImage(img.id)}
                className="p-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500 hover:text-white transition-all"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkGallery;
