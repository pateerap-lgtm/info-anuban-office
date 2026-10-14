export interface SchoolSettings {
  schoolName: string;
  affiliation: string;
  logoUrl: string;
  bgUrl: string;
  columns: number; // e.g. 2, 3, 4, 5, 6
  adminPin: string; // 4-digit PIN
  updatedAt?: string;
}

export interface SchoolCardItem {
  id: string;
  title: string;
  imageUrl: string;
  url: string;
  order: number;
  category?: string;
  isActive: boolean;
  bgColor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SweetAlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface SweetAlertOptions {
  isOpen: boolean;
  type: SweetAlertType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}
