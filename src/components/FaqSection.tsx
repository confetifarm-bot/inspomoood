import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ } from '../types';

interface FaqSectionProps {
  faqs: FAQ[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-[#FAFAF7] border-t border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 rounded-full text-xs font-semibold mb-2 border border-rose-100 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#D94E34]" />
            <span>Resolvemos tus dudas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
            Preguntas frecuentes
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Todo lo que necesitas saber sobre envíos en Lima y provincias, tallas de disfraces y pedidos
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3 animate-fade-in-up animation-delay-150">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden transition-all shadow-xs hover:border-stone-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-stone-900 font-display">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D94E34] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
