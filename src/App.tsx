/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { SchoolSettings, SchoolCardItem, SweetAlertOptions } from './types';
import { DEFAULT_SETTINGS, DEFAULT_CARDS } from './constants/presets';
import { PortalHome } from './components/PortalHome';
import { AdminLayout } from './components/AdminLayout';
import { AdminCardsView } from './components/AdminCardsView';
import { AdminSettingsView } from './components/AdminSettingsView';
import { PinModal } from './components/PinModal';
import { CardModal } from './components/CardModal';
import { SweetAlertModal } from './components/SweetAlertModal';
import { SkeletonGrid } from './components/SkeletonLoader';
import { Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SETTINGS);
  const [cards, setCards] = useState<SchoolCardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOperating, setIsOperating] = useState<boolean>(false);

  // Admin states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'cards' | 'settings'>('cards');
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);
  const [cardToEdit, setCardToEdit] = useState<SchoolCardItem | null>(null);

  // SweetAlert Modal state
  const [alertOptions, setAlertOptions] = useState<SweetAlertOptions>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Helper to trigger SweetAlert
  const showAlert = (
    type: SweetAlertOptions['type'],
    title: string,
    message: string,
    options?: Partial<SweetAlertOptions>
  ) => {
    setAlertOptions({
      isOpen: true,
      type,
      title,
      message,
      confirmText: options?.confirmText || 'ตกลง',
      cancelText: options?.cancelText || 'ยกเลิก',
      onConfirm: options?.onConfirm || (() => closeAlert()),
      onCancel: options?.onCancel || (() => closeAlert()),
      isDestructive: options?.isDestructive || false,
    });
  };

  const closeAlert = () => {
    setAlertOptions((prev) => ({ ...prev, isOpen: false }));
  };

  // Sync settings and cards from Firestore with real-time onSnapshot
  useEffect(() => {
    let unsubSettings: (() => void) | undefined;
    let unsubCards: (() => void) | undefined;

    const initData = async () => {
      try {
        // Clean up any previously seeded sample cards (card-1 to card-8) from the database
        for (let i = 1; i <= 8; i++) {
          try {
            await deleteDoc(doc(db, 'cards', `card-${i}`));
          } catch (e) {
            // ignore if not exists
          }
        }

        // 1. Settings listener
        const settingsDocRef = doc(db, 'settings', 'general');
        unsubSettings = onSnapshot(
          settingsDocRef,
          async (snapshot) => {
            if (snapshot.exists()) {
              setSettings(snapshot.data() as SchoolSettings);
            } else {
              // Seed initial default settings if document doesn't exist yet
              try {
                await setDoc(settingsDocRef, DEFAULT_SETTINGS);
                setSettings(DEFAULT_SETTINGS);
              } catch (err) {
                console.warn('Could not auto-seed settings:', err);
              }
            }
          },
          (error) => {
            console.error('Settings onSnapshot error:', error);
            setIsLoading(false);
            handleFirestoreError(error, OperationType.GET, 'settings/general');
          }
        );

        // 2. Cards listener (loads only user cards, never seeds dummy cards)
        const cardsColRef = collection(db, 'cards');
        unsubCards = onSnapshot(
          cardsColRef,
          async (snapshot) => {
            if (!snapshot.empty) {
              const loadedCards: SchoolCardItem[] = [];
              snapshot.forEach((docItem) => {
                // If it's a sample card (card-1 to card-8), delete it from database
                if (/^card-[1-8]$/.test(docItem.id)) {
                  deleteDoc(doc(db, 'cards', docItem.id)).catch(() => {});
                  return;
                }
                const data = docItem.data();
                loadedCards.push({
                  id: docItem.id,
                  title: data.title || '',
                  imageUrl: data.imageUrl || '',
                  url: data.url || '',
                  order: data.order ?? 1,
                  category: data.category || 'วิชาการ',
                  isActive: data.isActive ?? true,
                  bgColor: data.bgColor || '#0C7C82',
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                });
              });
              setCards(loadedCards.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
            } else {
              setCards([]);
            }
            setIsLoading(false);
          },
          (error) => {
            console.error('Cards onSnapshot error:', error);
            setIsLoading(false);
            handleFirestoreError(error, OperationType.GET, 'cards');
          }
        );
      } catch (err) {
        console.error('Initialization error:', err);
        setIsLoading(false);
      }
    };

    initData();

    return () => {
      if (unsubSettings) unsubSettings();
      if (unsubCards) unsubCards();
    };
  }, []);

  // Save System Settings
  const handleSaveSettings = async (newSettings: SchoolSettings) => {
    setIsOperating(true);
    try {
      const settingsRef = doc(db, 'settings', 'general');
      await setDoc(settingsRef, newSettings);
      setSettings(newSettings);
      showAlert('success', 'บันทึกสำเร็จ!', 'การตั้งค่าระบบและรูปลักษณ์ได้รับการอัปเดตเรียบร้อยแล้ว');
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      } catch (e) {
        // ignore confetti errors
      }
    } catch (err: unknown) {
      console.error('Save settings error:', err);
      showAlert('error', 'เกิดข้อผิดพลาด', err instanceof Error ? err.message : 'ไม่สามารถบันทึกข้อมูลได้');
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    } finally {
      setIsOperating(false);
    }
  };

  // Add or Edit Card
  const handleSaveCard = async (cardData: Partial<SchoolCardItem>) => {
    setIsOperating(true);
    try {
      if (cardToEdit && cardToEdit.id) {
        // Update existing card
        const cardRef = doc(db, 'cards', cardToEdit.id);
        const updatePayload = {
          title: cardData.title,
          imageUrl: cardData.imageUrl,
          url: cardData.url,
          order: cardData.order,
          category: cardData.category,
          isActive: cardData.isActive,
          bgColor: cardData.bgColor,
          updatedAt: new Date().toISOString(),
        };
        await updateDoc(cardRef, updatePayload);
        showAlert('success', 'แก้ไขข้อมูลสำเร็จ', `อัปเดตระบบ "${cardData.title}" เรียบร้อยแล้ว`);
      } else {
        // Create new card
        const newCardId = `card-${Date.now()}`;
        const newCardRef = doc(db, 'cards', newCardId);
        const newCardPayload = {
          id: newCardId,
          title: cardData.title,
          imageUrl: cardData.imageUrl,
          url: cardData.url,
          order: cardData.order ?? cards.length + 1,
          category: cardData.category || 'วิชาการ',
          isActive: cardData.isActive ?? true,
          bgColor: cardData.bgColor || '#0C7C82',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(newCardRef, newCardPayload);
        showAlert('success', 'เพิ่มระบบสำเร็จ', `เพิ่มระบบ "${cardData.title}" ลงในหน้าแรกแล้ว`);
        try {
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        } catch (e) {
          // ignore
        }
      }
      setIsCardModalOpen(false);
      setCardToEdit(null);
    } catch (err: unknown) {
      console.error('Save card error:', err);
      showAlert('error', 'บันทึกไม่สำเร็จ', err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
      handleFirestoreError(err, OperationType.WRITE, 'cards');
    } finally {
      setIsOperating(false);
    }
  };

  // Delete Card with Sweet Confirm
  const handleConfirmDeleteCard = (card: SchoolCardItem) => {
    showAlert(
      'confirm',
      'ยืนยันการลบระบบ?',
      `คุณต้องการลบ "${card.title}" ออกจากหน้ารวมลิงค์ใช่หรือไม่? \n(การดำเนินการนี้ไม่สามารถยกเลิกได้)`,
      {
        confirmText: 'ลบทันที',
        cancelText: 'ยกเลิก',
        isDestructive: true,
        onConfirm: async () => {
          closeAlert();
          setIsOperating(true);
          try {
            await deleteDoc(doc(db, 'cards', card.id));
            showAlert('success', 'ลบข้อมูลสำเร็จ', `ลบระบบ "${card.title}" เรียบร้อยแล้ว`);
          } catch (err) {
            console.error('Delete error:', err);
            showAlert('error', 'ลบไม่สำเร็จ', 'เกิดข้อผิดพลาดในการลบข้อมูล');
            handleFirestoreError(err, OperationType.DELETE, `cards/${card.id}`);
          } finally {
            setIsOperating(false);
          }
        },
      }
    );
  };

  // Quick Reorder (Move Up/Down)
  const handleQuickReorder = async (cardId: string, direction: 'up' | 'down') => {
    const currentIndex = cards.findIndex((c) => c.id === cardId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    const currentCard = cards[currentIndex];
    const targetCard = cards[targetIndex];

    setIsOperating(true);
    try {
      const batch = writeBatch(db);
      const currentRef = doc(db, 'cards', currentCard.id);
      const targetRef = doc(db, 'cards', targetCard.id);

      const currentOrder = currentCard.order;
      const targetOrder = targetCard.order;

      // Swap orders
      batch.update(currentRef, { order: targetOrder, updatedAt: new Date().toISOString() });
      batch.update(targetRef, { order: currentOrder, updatedAt: new Date().toISOString() });

      await batch.commit();
    } catch (err) {
      console.error('Reorder error:', err);
      showAlert('error', 'จัดลำดับไม่สำเร็จ', 'ไม่สามารถสลับลำดับได้');
    } finally {
      setIsOperating(false);
    }
  };

  // Toggle Card Active Status
  const handleToggleActive = async (card: SchoolCardItem) => {
    setIsOperating(true);
    try {
      const cardRef = doc(db, 'cards', card.id);
      await updateDoc(cardRef, {
        isActive: !card.isActive,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Toggle active error:', err);
      showAlert('error', 'เปลี่ยนสถานะไม่สำเร็จ', 'เกิดข้อผิดพลาด');
    } finally {
      setIsOperating(false);
    }
  };

  // Clear all cards from database
  const handleClearAllCards = () => {
    showAlert(
      'confirm',
      'ลบการ์ดทั้งหมด?',
      'คุณต้องการลบข้อมูล Card ทั้งหมดออกจากระบบและฐานข้อมูลใช่หรือไม่? \n(การกระทำนี้จะลบรายการการ์ดทั้งหมดออกจากฐานข้อมูล)',
      {
        confirmText: 'ลบทั้งหมด',
        cancelText: 'ยกเลิก',
        isDestructive: true,
        onConfirm: async () => {
          closeAlert();
          setIsOperating(true);
          try {
            const snap = await getDocs(collection(db, 'cards'));
            const batch = writeBatch(db);
            snap.forEach((d) => {
              batch.delete(d.ref);
            });
            await batch.commit();
            setCards([]);
            showAlert('success', 'ลบการ์ดทั้งหมดเรียบร้อยแล้ว', 'ไม่มี Card ค้างอยู่ในระบบและฐานข้อมูล');
          } catch (err) {
            console.error('Clear all cards error:', err);
            showAlert('error', 'ลบไม่สำเร็จ', 'เกิดข้อผิดพลาดในการลบข้อมูล');
          } finally {
            setIsOperating(false);
          }
        },
      }
    );
  };

  // Logout with Sweet Confirm
  const handleLogout = () => {
    showAlert('confirm', 'ออกจากระบบผู้ดูแล?', 'คุณต้องการออกจากระบบและกลับสู่หน้าหลักใช่หรือไม่?', {
      confirmText: 'ออกจากระบบ',
      cancelText: 'อยู่ต่อ',
      isDestructive: false,
      onConfirm: () => {
        closeAlert();
        setIsAdminLoggedIn(false);
        showAlert('success', 'ออกจากระบบแล้ว', 'กลับสู่หน้ารวมลิงค์สำหรับผู้ใช้งานทั่วไป');
      },
    });
  };

  // Pin Success Login
  const handlePinSuccess = () => {
    setIsPinModalOpen(false);
    setIsAdminLoggedIn(true);
    showAlert('success', 'เข้าสู่ระบบสำเร็จ!', 'ยินดีต้อนรับสู่ระบบบริหารจัดการสถานศึกษา');
    try {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-800 antialiased selection:bg-[#35B4B0] selection:text-white">
      {/* Global Operation Loading Spinner Overlay */}
      {isOperating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs text-white animate-fade-in pointer-events-auto">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[#35B4B0] animate-spin" />
            <span className="text-sm font-semibold tracking-wide">กำลังประมวลผล...</span>
          </div>
        </div>
      )}

      {/* Main View Switcher: Admin Dashboard vs Public Portal */}
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0C7C82] via-[#26A69A] to-[#4A2C6D]">
          <SkeletonGrid columns={settings.columns || 4} count={8} />
        </div>
      ) : isAdminLoggedIn ? (
        /* Admin Dashboard View */
        <AdminLayout
          currentTab={adminTab}
          onChangeTab={setAdminTab}
          onBackToHome={() => setIsAdminLoggedIn(false)}
          onLogout={handleLogout}
          settings={settings}
        >
          {adminTab === 'cards' ? (
            <AdminCardsView
              cards={cards}
              onOpenAddModal={() => {
                setCardToEdit(null);
                setIsCardModalOpen(true);
              }}
              onOpenEditModal={(card) => {
                setCardToEdit(card);
                setIsCardModalOpen(true);
              }}
              onConfirmDelete={handleConfirmDeleteCard}
              onQuickReorder={handleQuickReorder}
              onToggleActive={handleToggleActive}
              onClearAllCards={handleClearAllCards}
            />
          ) : (
            <AdminSettingsView settings={settings} onSaveSettings={handleSaveSettings} />
          )}
        </AdminLayout>
      ) : (
        /* Public Portal Homepage (iPad tablet look) */
        <PortalHome
          settings={settings}
          cards={cards}
          onOpenPinModal={() => setIsPinModalOpen(true)}
          isLoading={isLoading}
        />
      )}

      {/* 4-digit PIN Authentication Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        correctPin={settings.adminPin || '1234'}
      />

      {/* Add / Edit Card Modal with Mandatory Image Preview */}
      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setCardToEdit(null);
        }}
        onSave={handleSaveCard}
        cardToEdit={cardToEdit}
        nextOrder={cards.length > 0 ? Math.max(...cards.map((c) => c.order ?? 0)) + 1 : 1}
      />

      {/* Sweet Alert / Sweet Confirm Modal */}
      <SweetAlertModal
        isOpen={alertOptions.isOpen}
        type={alertOptions.type}
        title={alertOptions.title}
        message={alertOptions.message}
        confirmText={alertOptions.confirmText}
        cancelText={alertOptions.cancelText}
        onConfirm={alertOptions.onConfirm}
        onCancel={alertOptions.onCancel}
        isDestructive={alertOptions.isDestructive}
      />
    </div>
  );
}
