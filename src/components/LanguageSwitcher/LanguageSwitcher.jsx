import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // Update the HTML lang attribute whenever the language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2 p-4">
      <button
        onClick={() => changeLanguage('bn')}
        className={`px-4 py-2 rounded ${i18n.language === 'bn' ? 'bg-orange-500 text-white font-base' : 'bg-gray-200'}`}
      >
        বাংলা
      </button>

      <button
        onClick={() => changeLanguage('en')}
        className={`px-4 py-2 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white font-base' : 'bg-gray-200'}`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;
