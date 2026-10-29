import React, { useState } from 'react';
import { Shield, ExternalLink, Sparkles, School } from 'lucide-react';
import { SchoolSettings, SchoolCardItem } from '../types';
import { CanvasBackground } from './CanvasBackground';

interface PortalHomeProps {
  settings: SchoolSettings;
  cards: SchoolCardItem[];
  onOpenPinModal: () => void;
  isLoading?: boolean;
}

export const PortalHome: React.FC<PortalHomeProps> = ({
  settings,
  cards,
  onOpenPinModal,
  isLoading = false,
}) => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Filter only active cards, sorted by order
  const activeCards = cards
    .filter((c) => c.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Columns per device: PC, Tablet, Mobile
  const pcCols = settings.columnsPC ?? settings.columns ?? 4;
  const tabletCols = settings.columnsTablet ?? 3;
  const mobileCols = settings.columnsMobile ?? 2;

  const getMobileColClass = (cols: number) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      default: return 'grid-cols-2';
    }
  };

  const getTabletColClass = (cols: number) => {
    switch (cols) {
      case 2: return 'sm:grid-cols-2 md:grid-cols-2';
      case 3: return 'sm:grid-cols-3 md:grid-cols-3';
      case 4: return 'sm:grid-cols-4 md:grid-cols-4';
      case 5: return 'sm:grid-cols-5 md:grid-cols-5';
      case 6: return 'sm:grid-cols-6 md:grid-cols-6';
      default: return 'sm:grid-cols-3 md:grid-cols-3';
    }
  };

  const getPCColClass = (cols: number) => {
    switch (cols) {
      case 2: return 'lg:grid-cols-2';
      case 3: return 'lg:grid-cols-3';
      case 4: return 'lg:grid-cols-4';
      case 5: return 'lg:grid-cols-5';
      case 6: return 'lg:grid-cols-6';
      case 7: return 'lg:grid-cols-7';
      case 8: return 'lg:grid-cols-8';
      default: return 'lg:grid-cols-4';
    }
  };

  const getMaxWidthClass = (cols: number) => {
    switch (cols) {
      case 2: return 'max-w-xl';
      case 3: return 'max-w-3xl';
      case 4: return 'max-w-5xl';
      case 5: return 'max-w-6xl';
      case 6: return 'max-w-7xl';
      case 7: return 'max-w-7xl';
      case 8: return 'max-w-[96rem]';
      default: return 'max-w-5xl';
    }
  };

  const handleCardClick = (url: string) => {
    if (!url) return;
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#35B4B0] selection:text-white">
      {/* Background Image Layer (Behind cards, retrieved from settings) */}
      {settings.bgUrl ? (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 filter brightness-95"
          style={{ backgroundImage: `url(${settings.bgUrl})` }}
        >
          {/* Subtle translucent gradient overlay for maximum readability and iPad glassmorphism look */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-teal-950/30 to-slate-950/60 backdrop-blur-[2px]" />
        </div>
      ) : (
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0C7C82] via-[#26A69A] to-[#4A2C6D]" />
      )}

      {/* Dynamic Ambient Canvas Bokeh / Particle Background */}
      <CanvasBackground opacity={0.45} />

      {/* Main Container simulating an iPad Tablet Screen */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-between px-4 sm:px-6 py-8 md:py-12 w-full">
        {/* Header Section */}
        <header className="w-full max-w-4xl mx-auto flex flex-col items-center text-center animate-fade-in mb-8 md:mb-12">
          {/* School Logo */}
          <div className="relative mb-4 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-2 bg-white/85 backdrop-blur-xl shadow-2xl border-2 border-white/60 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.schoolName}
                  className="w-full h-full object-contain rounded-2xl"
                  loading="lazy"
                />
              ) : (
                <School className="w-12 h-12 text-[#0C7C82]" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#0C7C82] to-[#35B4B0] text-white p-1 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Title: รวมลิงค์ระบบบริหารสถานศึกษา */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 shadow-sm">
            รวมลิงค์ระบบบริหารสถานศึกษา
          </div>

          {/* School Name & Affiliation */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md tracking-tight mb-2">
            {settings.schoolName || 'โรงเรียนอนุบาลศรีสุทโธ'}
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 font-medium max-w-xl drop-shadow">
            {settings.affiliation || 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาประถมศึกษาอุดรธานี เขต 3'}
          </p>
        </header>

        {/* iPad/Tablet/PC App Cards Grid */}
        <main className={`w-full mx-auto ${getMaxWidthClass(pcCols)}`}>
          <div
            className={`grid ${getMobileColClass(mobileCols)} ${getTabletColClass(tabletCols)} ${getPCColClass(pcCols)} gap-4 sm:gap-6 md:gap-8 justify-center`}
          >
            {activeCards.map((card) => {
              const isHovered = hoveredCardId === card.id;
              return (
                <div
                  key={card.id}
                  className="flex flex-col items-center"
                  onMouseEnter={() => setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                >
                  {/* Square Card Button (Like iPad iOS app icon) */}
                  <button
                    type="button"
                    onClick={() => handleCardClick(card.url)}
                    className="relative w-full aspect-square rounded-3xl sm:rounded-4xl p-0 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-teal-400/30 transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] active:scale-95 cursor-pointer border border-white/40 bg-white/20 backdrop-blur-md group"
                    aria-label={card.title}
                  >
                    {/* Gloss / Shine effect overlay simulating iOS glass icon */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/40 opacity-70 group-hover:opacity-90 pointer-events-none transition-opacity z-10" />

                    {/* Condition: Show image only if available; else show system name */}
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-white"
                        style={{
                          backgroundColor: card.bgColor || '#0C7C82',
                        }}
                      >
                        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xs sm:text-sm leading-tight drop-shadow-sm line-clamp-3">
                          {card.title}
                        </span>
                      </div>
                    )}

                    {/* Interactive External Link indicator badge on hover */}
                    <div
                      className={`absolute bottom-2 right-2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* System title below or tooltip: user specified card displays image only, so we put title subtly below like iOS app label */}
                  <div className="mt-2 text-center max-w-[120px] sm:max-w-[140px]">
                    <span className="text-xs sm:text-sm font-medium text-white drop-shadow-md line-clamp-1 group-hover:line-clamp-none transition-all">
                      {card.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {activeCards.length === 0 && !isLoading && (
            <div className="text-center py-12 px-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-white max-w-md mx-auto">
              <p className="font-medium text-sm">ยังไม่มีรายการ Card ในระบบ</p>
              <p className="text-xs text-white/70 mt-1">
                คลิกไอคอนกุญแจมุมขวาล่างเพื่อเข้าสู่ระบบผู้ดูแลและเพิ่มการ์ดระบบ
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full max-w-4xl mx-auto mt-12 pt-6 border-t border-white/20 text-center animate-fade-in">
          <p className="text-xs sm:text-sm text-white/90 drop-shadow-sm font-normal">
            รวมลิงค์ระบบบริหารสถานศึกษา {settings.schoolName || ''}
          </p>
          <p className="text-[11px] text-white/60 mt-1">
            รองรับการใช้งานบน iPad, แท็บเล็ต, สมาร์ทโฟน และคอมพิวเตอร์
          </p>
        </footer>
      </div>

      {/* Floating Admin Button at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={onOpenPinModal}
          title="เข้าระบบผู้ดูแลระบบ (Admin)"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#0C7C82] to-[#35B4B0] text-white shadow-2xl shadow-teal-900/50 hover:shadow-teal-400/50 border-2 border-white/80 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="เข้าระบบผู้ดูแลระบบด้วย PIN 4 หลัก"
        >
          <Shield className="w-6 h-6 stroke-[2.2] transition-transform group-hover:rotate-12" />

          {/* Tooltip on Hover */}
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-slate-700">
            ระบบผู้ดูแล (PIN 4 หลัก)
          </span>
        </button>
      </div>
    </div>
  );
};
