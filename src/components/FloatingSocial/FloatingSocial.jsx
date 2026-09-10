import React from 'react';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';

const FloatingSocial = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/8801893014004"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-3xl" />
      </a>
      
      {/* Messenger Button */}
      <a
        href="https://m.me/amarmistrybd"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#0084FF] hover:bg-[#0074e0] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#0084FF]/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
        title="Chat on Messenger"
      >
        <FaFacebookMessenger className="text-2xl" />
      </a>
    </div>
  );
};

export default FloatingSocial;
