import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, HelpCircle, X, Loader2 } from 'lucide-react';
import { SweetAlertType } from '../types';

interface SweetAlertModalProps {
  isOpen: boolean;
  type: SweetAlertType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const SweetAlertModal: React.FC<SweetAlertModalProps> = ({
  isOpen,
  type,
  title,
  message,
  confirmText = 'ตกลง',
  cancelText = 'ยกเลิก',
  onConfirm,
  onCancel,
  isDestructive = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50 animate-bounce-short">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4 ring-8 ring-amber-50">
            <AlertTriangle className="w-9 h-9 stroke-[2.5]" />
          </div>
        );
      case 'error':
        return (
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4 ring-8 ring-rose-50">
            <AlertCircle className="w-9 h-9 stroke-[2.5]" />
          </div>
        );
      case 'confirm':
        return (
          <div className={`w-16 h-16 rounded-full ${isDestructive ? 'bg-red-100 text-red-600 ring-red-50' : 'bg-teal-100 text-teal-700 ring-teal-50'} flex items-center justify-center mb-4 ring-8`}>
            <HelpCircle className="w-9 h-9 stroke-[2.5]" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4 ring-8 ring-cyan-50">
            <Info className="w-9 h-9 stroke-[2.5]" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center transform transition-all duration-200 scale-100"
        role="dialog"
        aria-modal="true"
      >
        {getIcon()}

        <h3 className="text-xl font-bold text-slate-800 mb-2 leading-snug">{title}</h3>
        <p className="text-slate-600 text-sm whitespace-pre-line mb-6 font-normal leading-relaxed">{message}</p>

        <div className="flex gap-3 w-full">
          {type === 'confirm' && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer text-sm disabled:opacity-50"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm || onCancel}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-all shadow-md cursor-pointer text-sm flex items-center justify-center gap-2 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                : 'bg-[#0C7C82] hover:bg-[#095f64] shadow-teal-200'
            } disabled:opacity-50`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังทำงาน...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
