"use client";

import { useEffect, useState } from "react";

export interface ToastData {
  carName: string;
  totalXLM: number;
  txHash: string;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  // Slide-in on mount, slide-out before dismiss
  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 6000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onDismiss]);

  const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${toast.txHash}`;

  return (
    <div
      className={`flex items-start gap-3 bg-gray-900 border border-green-500/30 rounded-2xl shadow-2xl shadow-black/50 p-4 w-80 transition-all duration-300 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      {/* Icon */}
      <div className="shrink-0 w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center mt-0.5">
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">Kiralama Onaylandı</p>
        <p className="text-gray-400 text-xs mt-0.5 truncate">{toast.carName}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-stellar-cyan text-xs font-medium">{toast.totalXLM} XLM ödendi</span>
          <span className="text-gray-700">·</span>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-stellar-cyan transition-colors truncate"
          >
            {toast.txHash.slice(0, 8)}...{toast.txHash.slice(-6)}
          </a>
        </div>
      </div>

      {/* Close */}
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 400); }}
        className="shrink-0 text-gray-600 hover:text-white transition-colors mt-0.5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
