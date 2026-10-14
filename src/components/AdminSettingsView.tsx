import React, { useState, useRef } from 'react';
import {
  School,
  Building,
  Image as ImageIcon,
  Columns3,
  KeyRound,
  Upload,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
} from 'lucide-react';
import { SchoolSettings } from '../types';

interface AdminSettingsViewProps {
  settings: SchoolSettings;
  onSaveSettings: (newSettings: SchoolSettings) => Promise<void>;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [schoolName, setSchoolName] = useState(settings.schoolName || '');
  const [affiliation, setAffiliation] = useState(settings.affiliation || '');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [bgUrl, setBgUrl] = useState(settings.bgUrl || '');
  const [columns, setColumns] = useState<number>(settings.columns || 4);

  // PIN settings
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [changePinEnabled, setChangePinEnabled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const logoFileRef = useRef<HTMLInputElement | null>(null);
  const bgFileRef = useRef<HTMLInputElement | null>(null);

  // Compress & set image for Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setLogoUrl(canvas.toDataURL('image/png'));
          setLogoError(false);
          setErrorMsg('');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Compress & set image for Background
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_W = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_W) {
          height = Math.round((height * MAX_W) / width);
          width = MAX_W;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setBgUrl(canvas.toDataURL('image/jpeg', 0.8));
          setBgError(false);
          setErrorMsg('');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!schoolName.trim()) {
      setErrorMsg('กรุณากรอกชื่อโรงเรียน');
      return;
    }

    if (!affiliation.trim()) {
      setErrorMsg('กรุณากรอกชื่อสังกัด');
      return;
    }

    // Mandatory previews
    if (!logoUrl.trim() || logoError) {
      setErrorMsg('กรุณาอัพโหลดหรือระบุรูปภาพโลโก้โรงเรียน (Preview บังคับ)');
      return;
    }

    if (!bgUrl.trim() || bgError) {
      setErrorMsg('กรุณาอัพโหลดหรือระบุรูปภาพพื้นหลังหน้าแรก (Preview บังคับ)');
      return;
    }

    let finalPin = settings.adminPin || '1234';

    if (changePinEnabled) {
      if (!currentPin) {
        setErrorMsg('กรุณาระบุรหัส PIN ปัจจุบัน');
        return;
      }
      if (currentPin !== settings.adminPin) {
        setErrorMsg('รหัส PIN ปัจจุบันไม่ถูกต้อง');
        return;
      }
      if (!/^\d{4}$/.test(newPin)) {
        setErrorMsg('รหัส PIN ใหม่ต้องเป็นตัวเลข 4 หลักเท่านั้น');
        return;
      }
      if (newPin !== confirmPin) {
        setErrorMsg('รหัส PIN ใหม่และการยืนยันไม่ตรงกัน');
        return;
      }
      finalPin = newPin;
    }

    setIsLoading(true);
    try {
      const updated: SchoolSettings = {
        schoolName: schoolName.trim(),
        affiliation: affiliation.trim(),
        logoUrl: logoUrl.trim(),
        bgUrl: bgUrl.trim(),
        columns: Number(columns),
        adminPin: finalPin,
        updatedAt: new Date().toISOString(),
      };
      await onSaveSettings(updated);
      setSuccessMsg('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว');
      if (changePinEnabled) {
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
        setChangePinEnabled(false);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <School className="w-7 h-7 text-[#0C7C82]" />
            <span>ตั้งค่าระบบบริหารสถานศึกษา</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            ปรับแต่งข้อมูลสถานศึกษา รูปภาพโลโก้ ภาพพื้นหลัง คอลัมน์หน้าแรก และรหัสผ่าน PIN
          </p>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: School Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-5 h-5 text-[#0C7C82]" />
            <span>ข้อมูลพื้นฐานสถานศึกษา</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ชื่อโรงเรียน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="เช่น โรงเรียนอนุบาลศึกษาพัฒนา"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C7C82]/30 focus:border-[#0C7C82]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ชื่อสังกัด <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="เช่น สำนักงานเขตพื้นที่การศึกษาประถมศึกษา"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C7C82]/30 focus:border-[#0C7C82]"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Columns Setting for Homepage Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Columns3 className="w-5 h-5 text-[#0C7C82]" />
              <span>ตั้งค่าจำนวนคอลัมน์การแสดง Card ในหน้าแรก</span>
            </h3>
            <span className="px-3 py-1 bg-teal-50 text-[#0C7C82] text-xs font-bold rounded-full border border-teal-100">
              ปัจจุบัน: {columns} คอลัมน์
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            กำหนดจำนวนคอลัมน์การ์ดสี่เหลี่ยมจัตุรัสบนหน้าจอ iPad / Desktop เพื่อความสวยงามสมดุล
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[2, 3, 4, 5, 6].map((cols) => (
              <button
                key={cols}
                type="button"
                onClick={() => setColumns(cols)}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  columns === cols
                    ? 'border-[#0C7C82] bg-teal-50/50 shadow-md shadow-teal-500/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-xl font-bold text-slate-800 mb-1">{cols}</span>
                <span className="text-xs font-medium text-slate-500">คอลัมน์</span>
                {/* Visual miniature representation */}
                <div
                  className="mt-2 grid gap-1 w-full max-w-[60px]"
                  style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: cols }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-xs ${
                        columns === cols ? 'bg-[#0C7C82]' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: School Logo & Background Uploads (Mandatory Previews) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#0C7C82]" />
            <span>รูปภาพโลโก้และภาพพื้นหลังหน้าแรก (Preview บังคับ)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload & Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>โลโก้โรงเรียน (Preview บังคับ)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full font-medium">
                  บังคับแสดง
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="วาง URL โลโก้ หรือ เลือกไฟล์..."
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    setLogoError(false);
                  }}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0C7C82]/30"
                />
                <button
                  type="button"
                  onClick={() => logoFileRef.current?.click()}
                  className="px-3 py-1.5 bg-[#0C7C82] text-white rounded-xl text-xs font-medium hover:bg-[#095f64] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>เลือกรูป</span>
                </button>
              </div>

              <input
                ref={logoFileRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />

              {/* Mandatory Logo Preview Box */}
              <div className="flex-1 min-h-[160px] bg-white rounded-xl border-2 border-slate-200 p-4 flex flex-col items-center justify-center">
                <span className="text-[11px] font-semibold text-slate-400 mb-2">
                  ตัวอย่างการแสดงผลโลโก้
                </span>
                {logoUrl && !logoError ? (
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full p-2 bg-white shadow-md border border-teal-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={logoUrl}
                        alt="Logo Preview"
                        onError={() => setLogoError(true)}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-rose-300 bg-rose-50 flex items-center justify-center text-rose-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>

            {/* Background Upload & Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>ภาพพื้นหลังหน้าแรก (Preview บังคับ)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full font-medium">
                  บังคับแสดง
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="วาง URL ภาพพื้นหลัง หรือ เลือกไฟล์..."
                  value={bgUrl}
                  onChange={(e) => {
                    setBgUrl(e.target.value);
                    setBgError(false);
                  }}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0C7C82]/30"
                />
                <button
                  type="button"
                  onClick={() => bgFileRef.current?.click()}
                  className="px-3 py-1.5 bg-[#0C7C82] text-white rounded-xl text-xs font-medium hover:bg-[#095f64] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>เลือกรูป</span>
                </button>
              </div>

              <input
                ref={bgFileRef}
                type="file"
                accept="image/*"
                onChange={handleBgUpload}
                className="hidden"
              />

              {/* Mandatory Background Preview Box */}
              <div className="flex-1 min-h-[160px] bg-white rounded-xl border-2 border-slate-200 p-2 flex flex-col items-center justify-center overflow-hidden">
                <span className="text-[11px] font-semibold text-slate-400 mb-2">
                  ตัวอย่างการแสดงผลภาพพื้นหลัง
                </span>
                {bgUrl && !bgError ? (
                  <div className="w-full h-32 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative">
                    <img
                      src={bgUrl}
                      alt="Background Preview"
                      onError={() => setBgError(true)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded text-[10px] font-semibold text-slate-800 shadow">
                        จำลองหน้าแรก
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-lg border-2 border-dashed border-rose-300 bg-rose-50 flex items-center justify-center text-rose-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: PIN Security Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#0C7C82]" />
              <span>ความปลอดภัย: PIN ผู้ดูแลระบบ (4 หลัก)</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                setChangePinEnabled(!changePinEnabled);
                setCurrentPin('');
                setNewPin('');
                setConfirmPin('');
              }}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                changePinEnabled
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-teal-50 text-[#0C7C82] border border-teal-200 hover:bg-teal-100'
              }`}
            >
              {changePinEnabled ? 'ยกเลิกการเปลี่ยน PIN' : 'แก้ไขรหัส PIN'}
            </button>
          </div>

          {!changePinEnabled ? (
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-[#0C7C82] flex items-center justify-center font-bold">
                PIN
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">รหัส PIN ปัจจุบันเปิดใช้งานอยู่</p>
                <p className="text-[11px] text-slate-500">
                  ใช้สำหรับเปิดหน้าต่างจัดการระบบผู้ดูแลจากปุ่มลอยมุมขวาล่าง
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-4 animate-fade-in">
              <p className="text-xs text-amber-800 font-medium">
                🔒 กรุณาระบุ PIN ปัจจุบัน และตั้ง PIN ใหม่เป็นตัวเลข 4 หลัก
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN ปัจจุบัน
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0C7C82]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN ใหม่ (4 หลัก)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0C7C82]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ยืนยัน PIN ใหม่
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0C7C82]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 bg-[#0C7C82] hover:bg-[#095f64] text-white rounded-2xl font-bold shadow-lg shadow-teal-700/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>กำลังบันทึกการตั้งค่า...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>บันทึกการตั้งค่าระบบ</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
