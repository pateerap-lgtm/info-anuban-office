import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Loader2, Sparkles, Check, AlertCircle } from 'lucide-react';
import { SchoolCardItem } from '../types';
import { SYSTEM_PRESETS, THEME_COLORS } from '../constants/presets';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Partial<SchoolCardItem>) => Promise<void>;
  cardToEdit?: SchoolCardItem | null;
  nextOrder: number;
}

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  cardToEdit,
  nextOrder,
}) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [order, setOrder] = useState<number>(nextOrder);
  const [category, setCategory] = useState('วิชาการ');
  const [isActive, setIsActive] = useState(true);
  const [bgColor, setBgColor] = useState('#0C7C82');
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [validationError, setValidationError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (cardToEdit) {
      setTitle(cardToEdit.title || '');
      setImageUrl(cardToEdit.imageUrl || '');
      setUrl(cardToEdit.url || '');
      setOrder(cardToEdit.order ?? nextOrder);
      setCategory(cardToEdit.category || 'วิชาการ');
      setIsActive(cardToEdit.isActive ?? true);
      setBgColor(cardToEdit.bgColor || '#0C7C82');
      setImgError(false);
      setValidationError('');
    } else {
      setTitle('');
      setImageUrl('');
      setUrl('https://');
      setOrder(nextOrder);
      setCategory('วิชาการ');
      setIsActive(true);
      setBgColor('#0C7C82');
      setImgError(false);
      setValidationError('');
    }
  }, [cardToEdit, isOpen, nextOrder]);

  if (!isOpen) return null;

  // Handle image upload from file with client-side canvas compression for snappy Firestore storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress to max 400x400 square for fast loading and Firestore limit safety
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setImageUrl(dataUrl);
          setImgError(false);
          setValidationError('');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof SYSTEM_PRESETS[0]) => {
    setTitle(preset.name);
    setUrl(preset.defaultUrl);
    setImageUrl(preset.imageUrl);
    setCategory(preset.category);
    setBgColor(preset.color);
    setImgError(false);
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('กรุณาระบุชื่อระบบ');
      return;
    }

    if (!url.trim() || url === 'https://') {
      setValidationError('กรุณาระบุลิงค์ URL ให้ถูกต้อง (เช่น https://example.com)');
      return;
    }

    // "preview บังคับ" - image must be provided and not broken
    if (!imageUrl.trim()) {
      setValidationError('บังคับอัพโหลดหรือเลือกรูปภาพระบบ (Preview บังคับ)');
      return;
    }

    if (imgError) {
      setValidationError('รูปภาพไม่สามารถแสดงผลได้ กรุณาตรวจสอบ URL หรืออัพโหลดรูปใหม่');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        url: url.trim(),
        order: Number(order) || 1,
        category: category.trim(),
        isActive,
        bgColor,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      setValidationError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0C7C82] to-[#35B4B0] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-200" />
            <h3 className="text-lg font-bold">
              {cardToEdit ? 'แก้ไข Card ระบบ' : 'เพิ่ม Card ระบบใหม่'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Validation Alert */}
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Quick Preset Selector */}
          {!cardToEdit && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                ⚡ เลือกเทมเพลตระบบการศึกษาด่วน (คลิกเพื่อใส่ข้อมูลทันที):
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {SYSTEM_PRESETS.slice(0, 6).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="shrink-0 px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-400 rounded-lg text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
                  >
                    {preset.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Display Order */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ลำดับแสดง <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C7C82]/30 focus:border-[#0C7C82]"
                required
              />
            </div>

            {/* Title / System Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อระบบ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น SGS ระบบวัดผลและประเมินผล"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C7C82]/30 focus:border-[#0C7C82]"
                required
              />
            </div>
          </div>

          {/* URL Destination */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ลิงค์ URL (กดแล้วเปิดระบบนี้) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C7C82]/30 focus:border-[#0C7C82]"
                required
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">หมวดหมู่</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C7C82]/30 focus:border-[#0C7C82] bg-white"
              >
                <option value="วิชาการ">วิชาการ</option>
                <option value="บริหารทั่วไป">บริหารทั่วไป</option>
                <option value="บุคคล">บุคคล</option>
                <option value="งบประมาณ">งบประมาณ</option>
                <option value="กิจการนักเรียน">กิจการนักเรียน</option>
                <option value="สารสนเทศ">สารสนเทศ</option>
                <option value="แหล่งเรียนรู้">แหล่งเรียนรู้</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#0C7C82] rounded border-slate-300 focus:ring-[#0C7C82]"
                />
                <span className="text-xs font-medium text-slate-700">เปิดแสดงในหน้าแรก</span>
              </label>
            </div>
          </div>

          {/* Image Upload & Mandatory Preview Section */}
          <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#0C7C82] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>อัพโหลดรูปภาพ / ลิงค์ภาพ (Preview บังคับ) *</span>
              </label>
              <span className="text-[10px] px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full font-medium">
                จำเป็น
              </span>
            </div>

            {/* Input choices: Upload file OR paste URL */}
            <div className="space-y-2 mb-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="วาง URL รูปภาพ หรือ กดปุ่มอัพโหลดรูปภาพ..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImgError(false);
                  }}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0C7C82]/30 focus:border-[#0C7C82]"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-[#0C7C82] text-white rounded-xl text-xs font-medium hover:bg-[#095f64] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>เลือกรูป</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* MANDATORY PREVIEW BOX */}
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 mb-2">
                ตัวอย่างการแสดงผลบนปุ่ม Card หน้าแรก (Square Preview)
              </span>

              {imageUrl && !imgError ? (
                <div className="relative group">
                  <div className="w-28 h-28 aspect-square rounded-2xl shadow-md overflow-hidden border-2 border-[#0C7C82] bg-slate-100 flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt={title || 'Preview'}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full shadow">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              ) : (
                <div className="w-28 h-28 aspect-square rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/50 flex flex-col items-center justify-center text-center p-2 text-rose-500">
                  <ImageIcon className="w-6 h-6 mb-1 text-rose-400" />
                  <span className="text-[10px] font-medium leading-tight">
                    {imgError ? 'โหลดรูปภาพไม่สำเร็จ' : 'ยังไม่มีรูปภาพ (กรุณาอัพโหลดหรือใส่ URL)'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Theme Color selector for card accent */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              สีแถบเน้นหรือสีพื้นหลังสำรอง
            </label>
            <div className="flex gap-2 flex-wrap">
              {THEME_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBgColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                    bgColor === c ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-[#0C7C82] hover:bg-[#095f64] text-white rounded-xl text-xs font-medium shadow-md shadow-teal-700/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <span>{cardToEdit ? 'บันทึกการแก้ไข' : 'เพิ่มระบบใหม่'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
