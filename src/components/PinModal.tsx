import React, { useState } from 'react';
import { Lock, X, Delete, RefreshCw, KeyRound, Loader2, ShieldCheck } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess, correctPin }) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (isVerifying || pin.length >= 4) return;
    setErrorMsg('');
    const nextPin = pin + num;
    setPin(nextPin);

    if (nextPin.length === 4) {
      verifyPin(nextPin);
    }
  };

  const handleBackspace = () => {
    if (isVerifying || pin.length === 0) return;
    setErrorMsg('');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isVerifying) return;
    setErrorMsg('');
    setPin('');
  };

  const verifyPin = (inputPin: string) => {
    setIsVerifying(true);
    // Loading spin process
    setTimeout(() => {
      setIsVerifying(false);
      if (inputPin === correctPin) {
        setPin('');
        setErrorMsg('');
        onSuccess();
      } else {
        setShake(true);
        setErrorMsg('รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
        setTimeout(() => setShake(false), 500);
        setPin('');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/40 flex flex-col items-center relative ${
          shake ? 'animate-shake' : ''
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setPin('');
            setErrorMsg('');
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0C7C82] to-[#35B4B0] text-white flex items-center justify-center shadow-lg shadow-teal-500/20 mb-3">
          <KeyRound className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-1">เข้าสู่ระบบผู้ดูแล</h3>
        <p className="text-xs text-slate-500 mb-4 text-center">
          กรุณากดรหัส PIN 4 หลัก เพื่อเข้าสู่เมนูจัดการระบบ
        </p>

        {/* PIN Indicators (4 Dots) */}
        <div className="flex justify-center items-center gap-4 my-3">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-[#0C7C82] scale-110 shadow-md shadow-teal-400/50'
                    : 'bg-slate-200 border border-slate-300'
                }`}
              />
            );
          })}
        </div>

        {/* Status or Error Message */}
        <div className="h-6 flex items-center justify-center mb-3">
          {isVerifying ? (
            <div className="flex items-center gap-2 text-teal-700 text-xs font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>กำลังตรวจสอบรหัส PIN...</span>
            </div>
          ) : errorMsg ? (
            <span className="text-xs font-medium text-rose-500">{errorMsg}</span>
          ) : (
            <span className="text-[11px] text-slate-400">PIN เริ่มต้น: 1234</span>
          )}
        </div>

        {/* Numeric Keypad (เหมือน iPad Lock Screen) */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mb-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              disabled={isVerifying}
              className="aspect-square rounded-2xl bg-slate-50 hover:bg-teal-50 active:bg-teal-100 text-slate-800 hover:text-[#0C7C82] font-semibold text-2xl flex items-center justify-center border border-slate-200/80 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {digit}
            </button>
          ))}

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            disabled={isVerifying || pin.length === 0}
            className="aspect-square rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-500 text-xs font-medium flex flex-col items-center justify-center border border-slate-200/80 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className="w-5 h-5 mb-0.5" />
            <span>ล้าง</span>
          </button>

          {/* 0 Button */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            disabled={isVerifying}
            className="aspect-square rounded-2xl bg-slate-50 hover:bg-teal-50 active:bg-teal-100 text-slate-800 hover:text-[#0C7C82] font-semibold text-2xl flex items-center justify-center border border-slate-200/80 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            onClick={handleBackspace}
            disabled={isVerifying || pin.length === 0}
            className="aspect-square rounded-2xl bg-slate-50 hover:bg-rose-50 active:bg-rose-100 text-slate-600 hover:text-rose-600 flex flex-col items-center justify-center border border-slate-200/80 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-40"
          >
            <Delete className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-medium">ลบ</span>
          </button>
        </div>

        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-[11px] text-[#0C7C82]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ระบบความปลอดภัยผู้ดูแลระบบ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
