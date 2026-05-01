"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CarCard } from "@/components/CarCard";
import { RentModal } from "@/components/RentModal";
import { Toast, type ToastData } from "@/components/Toast";
import { useFreighter } from "@/hooks/useFreighter";
import { cars, type Car } from "@/data/cars";

const CATEGORIES = ["Tümü", "Elektrikli", "SUV", "Spor", "Sedan"];

export default function HomePage() {
  const freighter = useFreighter();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [filter, setFilter] = useState("Tümü");
  const [rentedIds, setRentedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<ToastData | null>(null);

  const filtered = filter === "Tümü" ? cars : cars.filter((c) => c.category === filter);

  const handleRent = (car: Car) => {
    setSelectedCar(car);
  };

  const handleSuccess = (txHash: string, totalXLM: number) => {
    if (selectedCar) {
      setRentedIds((prev) => new Set([...prev, selectedCar.id]));
      setToast({
        carName: `${selectedCar.brand} ${selectedCar.name}`,
        totalXLM,
        txHash,
      });
    }
    freighter.refreshBalance();
  };

  const displayedCars = filtered.map((car) =>
    rentedIds.has(car.id) ? { ...car, available: false } : car
  );

  return (
    <div className="min-h-screen bg-stellar-dark">
      <Header />

      <main>
        <Hero />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-white text-2xl font-bold">Araç Filosu</h2>
              <p className="text-gray-400 text-sm mt-1">
                {displayedCars.filter((c) => c.available).length} araç müsait
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === cat
                      ? "bg-stellar-cyan text-stellar-dark"
                      : "bg-stellar-card border border-stellar-border text-gray-400 hover:border-stellar-cyan/40 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {!freighter.connected && (
            <div className="mb-8 p-4 bg-stellar-cyan/10 border border-stellar-cyan/20 rounded-xl flex items-center gap-4">
              <svg className="w-5 h-5 text-stellar-cyan shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-stellar-cyan text-sm">
                Araç kiralamak için sağ üstten Freighter cüzdanınızı bağlayın.{" "}
                {freighter.installed === false && (
                  <a
                    href="https://freighter.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    Freighter&apos;ı buradan yükleyin →
                  </a>
                )}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onRent={handleRent}
                walletConnected={freighter.connected}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-stellar-border py-8 text-center text-gray-600 text-sm">
        <p>
          StellarRent — Stellar Testnet üzerinde çalışır. Gerçek para kullanılmaz.
        </p>
        <p className="mt-1">
          Powered by{" "}
          <span className="text-stellar-cyan">Stellar Network</span> &{" "}
          <span className="text-stellar-cyan">Freighter Wallet</span>
        </p>
      </footer>

      {selectedCar && (
        <RentModal
          car={selectedCar}
          walletAddress={freighter.address}
          balance={freighter.balance}
          sign={freighter.sign}
          onConnect={freighter.connect}
          onClose={() => setSelectedCar(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Sağ üst köşe toast bildirimi */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {toast && (
          <div className="pointer-events-auto">
            <Toast toast={toast} onDismiss={() => setToast(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
