import React from 'react';
import {
  ArrowRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WhatsAppIntegration: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="pb-4 border-b border-cardBorder mb-6">
          <h2 className="text-xl font-bold font-display tracking-wide text-fgApp uppercase">{t("Order via WhatsApp")}</h2>
          <p className="text-xs text-mutedApp">{t("Connect directly and place your delivery requests straight from your phone.")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Direct Booking Info & WhatsApp Button */}
          <div className="md:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-cardBorder space-y-5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/25 px-2.5 py-1 rounded">
                <Sparkles className="w-3 h-3 animate-pulse" /> {t("Direct Chat Booking")}
              </span>

              <h3 className="text-lg font-bold font-display leading-snug">
                {t("No App Installs. Just WhatsApp.")}
              </h3>

              <p className="text-xs text-mutedApp leading-relaxed">
                {t("Save time and bypass complex setups. With SetuHub, rural retailers and customers can dispatch goods by simply texting our AI business account from their daily WhatsApp application.")}
              </p>

              <a
                href="https://wa.me/919999988888?text=Namaste!%20I%20want%2520to%2520place%2520a%2520SetuHub%2520order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba56] active:scale-[0.98] text-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/20 transition-all cursor-pointer select-none"
              >
                <MessageSquare className="w-4 h-4 text-black animate-pulse" />
                <span>{t("Open WhatsApp to Order")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </a>
            </div>
          </div>

          {/* Right Column: Instructions steps */}
          <div className="md:col-span-7">
            <div className="glass-panel p-6 rounded-3xl border border-cardBorder space-y-5">
              <h4 className="text-[10px] font-bold text-mutedApp uppercase tracking-widest">{t("How it works")}</h4>

              <div className="space-y-4">
                <div className="flex gap-3 text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 shrink-0 font-bold text-xs">1</div>
                  <div>
                    <h4 className="font-bold text-fgApp text-xs sm:text-sm">{t("Start the Chat")}</h4>
                    <p className="text-mutedApp mt-0.5 text-xs">{t("Click the button or message +91 99999 88888 to open your chat.")}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 shrink-0 font-bold text-xs">2</div>
                  <div>
                    <h4 className="font-bold text-fgApp text-xs sm:text-sm">{t("Text Your Request")}</h4>
                    <p className="text-mutedApp mt-0.5 text-xs">{t("Describe your delivery in natural language (e.g. 'Send sweets from Shop A to Location B'). Our NLP engine processes it instantly.")}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 shrink-0 font-bold text-xs">3</div>
                  <div>
                    <h4 className="font-bold text-fgApp text-xs sm:text-sm">{t("Matched & Dispatched")}</h4>
                    <p className="text-mutedApp mt-0.5 text-xs">{t("A traveler on the route accepts, OTPs are exchanged, and your cargo departs!")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
