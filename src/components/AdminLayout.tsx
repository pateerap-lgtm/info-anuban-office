import React, { useState } from 'react';
import {
  LayoutDashboard,
  Settings,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  School,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import { SchoolSettings } from '../types';

interface AdminLayoutProps {
  currentTab: 'cards' | 'settings';
  onChangeTab: (tab: 'cards' | 'settings') => void;
  onBackToHome: () => void;
  onLogout: () => void;
  settings: SchoolSettings;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onChangeTab,
  onBackToHome,
  onLogout,
  settings,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'cards' as const,
      label: 'จัดการ Card หน้าแรก',
      icon: Layers,
      description: 'เพิ่ม ลบ แก้ไข ลำดับปุ่ม',
    },
    {
      id: 'settings' as const,
      label: 'ตั้งค่าระบบ',
      icon: Settings,
      description: 'ชื่อ รหัส PIN ภาพ และคอลัมน์',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-gradient-to-r from-[#0C7C82] to-[#35B4B0] text-white px-4 py-3.5 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="เปิดเมนูผู้ดูแล"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-teal-200" />
            <span className="font-bold text-sm tracking-wide">ระบบจัดการสถานศึกษา</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>หน้าแรก</span>
        </button>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar (Desktop fixed, Mobile Slide-out Drawer) */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:shadow-none'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-b from-teal-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0C7C82] to-[#35B4B0] p-0.5 shadow-md shadow-teal-700/20 flex items-center justify-center">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.schoolName}
                  className="w-full h-full object-contain rounded-2xl bg-white p-1"
                />
              ) : (
                <School className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm text-slate-800 truncate">
                {settings.schoolName || 'ระบบบริหารสถานศึกษา'}
              </h1>
              <p className="text-[11px] text-[#0C7C82] font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>ผู้ดูแลระบบ (Admin)</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            เมนูการจัดการ
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChangeTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0C7C82] text-white shadow-md shadow-teal-700/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm">{item.label}</div>
                  <div
                    className={`text-[10px] ${
                      isActive ? 'text-teal-100 font-normal' : 'text-slate-400'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center gap-3 text-slate-600 hover:bg-teal-50 hover:text-[#0C7C82] transition-colors cursor-pointer text-sm font-medium"
            >
              <div className="p-2 rounded-xl bg-slate-100 text-slate-500">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span>กลับสู่หน้าแรก</span>
            </button>
          </div>
        </nav>

        {/* Bottom User & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-[#0C7C82] flex items-center justify-center font-bold text-xs">
                AD
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-800">ผู้ดูแลระบบ</p>
                <p className="text-[10px] text-slate-400">PIN 4 หลัก</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="ออกจากระบบ"
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
