import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiAward, FiPlus, FiTrash2, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || '/api';

const CertificatesHub = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    date: '',
    idCode: '',
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API}/mechanics/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.mechanic) {
        setCertificates(data.mechanic.certificates || []);
      }
    } catch (e) {
      toast.error('Failed to load certificates.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveCertificates = async (updatedCerts) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/mechanics/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificates: updatedCerts }),
      });
      const data = await res.json();
      if (data.success) {
        setCertificates(updatedCerts);
        toast.success(currentLang === 'bn' ? 'সার্টিফিকেট আপডেট হয়েছে!' : 'Certificates updated!');
        setShowAddForm(false);
        setNewCert({ title: '', issuer: '', date: '', idCode: '' });
      } else {
        toast.error(data.message || 'Update failed.');
      }
    } catch (e) {
      toast.error('Failed to save certificates.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCert.title || !newCert.issuer || !newCert.date) {
      toast.error(currentLang === 'bn' ? 'দয়া করে সব তথ্য দিন।' : 'Please fill all required fields.');
      return;
    }
    const certWithId = { ...newCert, id: Date.now().toString() };
    saveCertificates([...certificates, certWithId]);
  };

  const handleDelete = (id) => {
    if (!window.confirm(currentLang === 'bn' ? 'সার্টিফিকেটটি ডিলিট করতে চান?' : 'Delete this certificate?')) return;
    const updatedCerts = certificates.filter(c => c.id !== id);
    saveCertificates(updatedCerts);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-amber-400 text-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            {currentLang === 'bn' ? 'সার্টিফিকেট হাব' : 'Certificates Hub'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentLang === 'bn'
              ? 'আপনার অর্জিত প্রফেশনাল ট্রেনিং ও একাডেমিক সার্টিফিকেশন রেকর্ডসমূহ।'
              : 'Your professional achievements and verified course certifications.'}
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md"
          >
            <FiPlus />
            {currentLang === 'bn' ? 'নতুন যোগ করুন' : 'Add New'}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl animate-fade-in-up shadow-xl">
          <h2 className="text-sm font-bold text-white mb-4">
            {currentLang === 'bn' ? 'নতুন সার্টিফিকেট যুক্ত করুন' : 'Add New Certificate'}
          </h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">
                {currentLang === 'bn' ? 'সার্টিফিকেটের নাম *' : 'Certificate Title *'}
              </label>
              <input
                required
                type="text"
                value={newCert.title}
                onChange={e => setNewCert({ ...newCert, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none"
                placeholder="e.g. Plumbing Masterclass"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">
                {currentLang === 'bn' ? 'ইস্যুকারী প্রতিষ্ঠান *' : 'Issuing Organization *'}
              </label>
              <input
                required
                type="text"
                value={newCert.issuer}
                onChange={e => setNewCert({ ...newCert, issuer: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none"
                placeholder="e.g. Technical Board"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">
                {currentLang === 'bn' ? 'ইস্যুর তারিখ/মাস *' : 'Issue Date *'}
              </label>
              <input
                required
                type="text"
                value={newCert.date}
                onChange={e => setNewCert({ ...newCert, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none"
                placeholder="e.g. May 2025"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">
                {currentLang === 'bn' ? 'সার্টিফিকেট আইডি (অপশনাল)' : 'Certificate ID (Optional)'}
              </label>
              <input
                type="text"
                value={newCert.idCode}
                onChange={e => setNewCert({ ...newCert, idCode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none"
                placeholder="e.g. TB-2025-092"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                {currentLang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition-all"
              >
                {isSaving ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                {currentLang === 'bn' ? 'সংরক্ষণ করুন' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {certificates.length === 0 && !showAddForm ? (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-10 text-center">
          <FiAward className="text-slate-600 text-4xl mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            {currentLang === 'bn' ? 'আপনার কোনো সার্টিফিকেট যোগ করা নেই।' : 'No certificates added yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4 shadow-md transition-all hover:border-slate-700 group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl text-amber-400 shrink-0">
                <FiAward />
              </div>
              <div className="flex-1 space-y-2 overflow-hidden">
                <div>
                  <h3 className="text-xs font-bold text-white truncate pr-6" title={cert.title}>
                    {cert.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
                {cert.idCode && (
                  <p className="font-mono text-[10px] text-slate-500">
                    ID: {cert.idCode}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(cert.id)}
                disabled={isSaving}
                className="shrink-0 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 md:group-hover:opacity-100"
                title={currentLang === 'bn' ? 'ডিলিট করুন' : 'Delete'}
              >
                {isSaving ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesHub;
