import React, { useState } from 'react';
import {
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  MoveUp,
  MoveDown,
  LayoutGrid,
  Table as TableIcon,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';
import { SchoolCardItem } from '../types';

interface AdminCardsViewProps {
  cards: SchoolCardItem[];
  onOpenAddModal: () => void;
  onOpenEditModal: (card: SchoolCardItem) => void;
  onConfirmDelete: (card: SchoolCardItem) => void;
  onQuickReorder: (cardId: string, direction: 'up' | 'down') => Promise<void>;
  onToggleActive: (card: SchoolCardItem) => Promise<void>;
  onClearAllCards?: () => void;
}

export const AdminCardsView: React.FC<AdminCardsViewProps> = ({
  cards,
  onOpenAddModal,
  onOpenEditModal,
  onConfirmDelete,
  onQuickReorder,
  onToggleActive,
  onClearAllCards,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Categories list
  const categories = ['all', ...Array.from(new Set(cards.map((c) => c.category || 'วิชาการ')))];

  // Filter cards
  const filteredCards = cards
    .filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.category && c.category.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory = selectedCategory === 'all' || c.category === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>จัดการ Card หน้าแรก</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-[#0C7C82] font-semibold">
              {cards.length} รายการ
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            เพิ่ม ลบ แก้ไข และจัดลำดับการแสดงผลปุ่มระบบบริหารสถานศึกษา
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {cards.length > 0 && onClearAllCards && (
            <button
              type="button"
              onClick={onClearAllCards}
              className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-2xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ลบการ์ดทั้งหมด</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-5 py-2.5 bg-gradient-to-r from-[#0C7C82] to-[#35B4B0] hover:from-[#095f64] hover:to-[#2ba39f] text-white rounded-2xl font-bold text-sm shadow-md shadow-teal-700/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>เพิ่มระบบใหม่</span>
          </button>
        </div>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="ค้นหาชื่อระบบ, URL หรือหมวดหมู่..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0C7C82]/30 focus:border-[#0C7C82]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0C7C82]/30 text-slate-700"
            >
              <option value="all">ทุกหมวดหมู่ ({cards.length})</option>
              {categories
                .filter((c) => c !== 'all')
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* View Mode Toggle: Table or Grid */}
        <div className="flex items-center gap-1 self-end md:self-auto bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-[#0C7C82] shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
            title="มุมมองตาราง"
          >
            <TableIcon className="w-4 h-4" />
            <span className="hidden sm:inline">ตาราง</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-[#0C7C82] shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
            title="มุมมองการ์ดจำลอง"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">การ์ด</span>
          </button>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0C7C82] flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">ไม่พบข้อมูลระบบ</h3>
          <p className="text-xs text-slate-500 mb-4">
            ลองปรับเปลี่ยนคำค้นหา หรือกดปุ่ม &quot;เพิ่มระบบใหม่&quot; เพื่อเริ่มต้น
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-[#0C7C82] text-white rounded-xl text-xs font-medium hover:bg-[#095f64] transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มระบบใหม่</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Responsive Table with overflow */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs font-bold text-slate-700 uppercase border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center w-16">
                    ลำดับ
                  </th>
                  <th scope="col" className="px-4 py-3 w-20 text-center">
                    รูปภาพ (Preview)
                  </th>
                  <th scope="col" className="px-4 py-3">
                    ชื่อระบบ
                  </th>
                  <th scope="col" className="px-4 py-3 hidden md:table-cell">
                    หมวดหมู่
                  </th>
                  <th scope="col" className="px-4 py-3 hidden lg:table-cell">
                    ลิงค์ URL
                  </th>
                  <th scope="col" className="px-4 py-3 text-center w-24">
                    สถานะ
                  </th>
                  <th scope="col" className="px-4 py-3 text-center w-36">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCards.map((card, idx) => (
                  <tr key={card.id || idx} className="hover:bg-teal-50/30 transition-colors">
                    {/* Order & Reorder arrows */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-slate-800 text-xs px-2 py-0.5 bg-slate-100 rounded-md">
                          #{card.order ?? idx + 1}
                        </span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => onQuickReorder(card.id, 'up')}
                            disabled={idx === 0}
                            title="เลื่อนขึ้น"
                            className="p-0.5 text-slate-400 hover:text-[#0C7C82] disabled:opacity-30 cursor-pointer"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onQuickReorder(card.id, 'down')}
                            disabled={idx === filteredCards.length - 1}
                            title="เลื่อนลง"
                            className="p-0.5 text-slate-400 hover:text-[#0C7C82] disabled:opacity-30 cursor-pointer"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Image Preview (Square Thumbnail) */}
                    <td className="px-4 py-3 text-center">
                      <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden mx-auto bg-slate-100 shadow-2xs flex items-center justify-center">
                        {card.imageUrl ? (
                          <img
                            src={card.imageUrl}
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">ไม่มีรูป</span>
                        )}
                      </div>
                    </td>

                    {/* System Name */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800 text-xs sm:text-sm">
                        {card.title}
                      </div>
                      <a
                        href={card.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#0C7C82] hover:underline flex items-center gap-1 mt-0.5 max-w-[220px] truncate"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{card.url}</span>
                      </a>
                    </td>

                    {/* Category Badge */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {card.category || 'วิชาการ'}
                      </span>
                    </td>

                    {/* URL */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-slate-500 font-mono truncate block max-w-xs">
                        {card.url}
                      </span>
                    </td>

                    {/* Active toggle badge */}
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleActive(card)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                          card.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {card.isActive !== false ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>เปิด</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>ปิด</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(card)}
                          title="แก้ไขข้อมูล"
                          className="p-1.5 text-slate-600 hover:text-[#0C7C82] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onConfirmDelete(card)}
                          title="ลบระบบ"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Preview Mode (looks like homepage icons) */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredCards.map((card, idx) => (
            <div
              key={card.id || idx}
              className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center relative group"
            >
              <div className="absolute top-2 left-2 z-10">
                <span className="px-1.5 py-0.5 rounded-md bg-slate-800/70 text-white text-[10px] font-bold">
                  #{card.order ?? idx + 1}
                </span>
              </div>

              {/* Square Image preview */}
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-slate-100 border border-slate-200 flex items-center justify-center">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-slate-700 p-2">{card.title}</span>
                )}
              </div>

              <div className="w-full font-semibold text-slate-800 text-xs truncate mb-1">
                {card.title}
              </div>

              <div className="flex items-center justify-between w-full pt-2 border-t border-slate-100 mt-auto">
                <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                  {card.category || 'ทั่วไป'}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => onOpenEditModal(card)}
                    className="p-1 text-slate-500 hover:text-[#0C7C82] rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onConfirmDelete(card)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
