'use client';

import React, { useState } from 'react';
import { Download, Upload, Shield, X, Check, AlertCircle, Database, RefreshCw } from 'lucide-react';
import { exportAllData, importAllData } from '@/lib/backup';

interface BackupSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export default function BackupSyncModal({ isOpen, onClose, onDataRestored }: BackupSyncModalProps) {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleExport = () => {
    exportAllData();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllData(content);
        if (success) {
          setImportStatus('success');
          setTimeout(() => {
            onDataRestored();
            onClose();
          }, 1500);
        } else {
          setImportStatus('error');
          setErrorMessage('Tệp sao lưu không hợp lệ hoặc dữ liệu bị lỗi định dạng.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-black text-white">Sao Lưu & Đồng Bộ Dữ Liệu</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Ứng dụng lưu trữ dữ liệu an toàn trên thiết bị của bạn. Hãy xuất file sao lưu định kỳ để không lo mất dữ liệu khi đổi điện thoại hoặc xóa bộ nhớ duyệt web.
        </p>

        {/* Status Messages */}
        {importStatus === 'success' && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-2 text-xs text-emerald-400 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>Đã khôi phục dữ liệu thành công! Đang tải lại...</span>
          </div>
        )}

        {importStatus === 'error' && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center space-x-2 text-xs text-red-400 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            className="w-full py-3 rounded-2xl bg-zinc-900 border border-emerald-500/40 hover:border-emerald-500 text-white font-bold text-xs transition flex items-center justify-center space-x-2 active:scale-95 group shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
            <span>Xuất File Sao Lưu (.JSON)</span>
          </button>

          {/* Import Button */}
          <label className="w-full py-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95">
            <Upload className="w-4 h-4 text-teal-400" />
            <span>Khôi Phục Từ File Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="text-[10px] text-zinc-500 flex items-center justify-center space-x-1.5 pt-1">
          <Shield className="w-3.5 h-3.5 text-emerald-400/80" />
          <span>Bảo mật 100% — Không gửi dữ liệu lên máy chủ lạ</span>
        </div>
      </div>
    </div>
  );
}
