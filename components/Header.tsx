"use client";

import { useFreighter } from "@/hooks/useFreighter";

export function Header() {
  const { connected, address, balance, loading, error, connect, disconnect, installed } =
    useFreighter();

  return (
    <header className="sticky top-0 z-50 bg-stellar-dark/90 backdrop-blur border-b border-stellar-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stellar-cyan to-stellar-blue flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            StellarRent
          </span>
          <span className="hidden sm:inline text-xs text-stellar-cyan bg-stellar-cyan/10 border border-stellar-cyan/20 px-2 py-0.5 rounded-full">
            Testnet
          </span>
        </div>

        <div className="flex items-center gap-3">
          {error && (
            <span className="hidden sm:inline text-xs text-red-400 max-w-xs truncate">
              {error}
            </span>
          )}

          {connected && address ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-gray-400">Bakiye</span>
                <span className="text-sm font-semibold text-stellar-cyan">
                  {balance} XLM
                </span>
              </div>
              <div className="flex items-center gap-2 bg-stellar-card border border-stellar-border rounded-lg px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-gray-300 font-mono">
                  {address.slice(0, 4)}...{address.slice(-4)}
                </span>
              </div>
              <button
                onClick={disconnect}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Cik
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={loading}
              className="flex items-center gap-2 bg-stellar-cyan hover:bg-stellar-cyan/90 disabled:opacity-60 text-stellar-dark font-semibold text-sm px-4 py-2 rounded-lg transition-all"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-stellar-dark/30 border-t-stellar-dark rounded-full animate-spin" />
                  Bağlanıyor...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {installed === false ? "Freighter Yükle" : "Cüzdan Bağla"}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
