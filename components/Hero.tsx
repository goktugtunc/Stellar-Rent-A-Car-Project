"use client";

export function Hero() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-stellar-blue/20 via-transparent to-stellar-cyan/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stellar-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-stellar-cyan text-sm bg-stellar-cyan/10 border border-stellar-cyan/20 px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-stellar-cyan rounded-full animate-pulse" />
          Stellar Blockchain ile Güvenli Ödeme
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Arabanı Kirala,{" "}
          <span className="bg-gradient-to-r from-stellar-cyan to-blue-400 bg-clip-text text-transparent">
            XLM ile Öde
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Freighter cüzdanınızı bağlayın, premium araçlar arasından seçim yapın ve
          Stellar ağı üzerinde güvenli, hızlı ödeme yapın. Saniyeler içinde onay.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-stellar-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            3-5 saniyelik onay
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-stellar-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Blockchain güvencesi
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-stellar-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Şeffaf işlemler
          </div>
        </div>
      </div>
    </section>
  );
}
