"use client";

import Image from "next/image";
import { Car } from "@/data/cars";

interface CarCardProps {
  car: Car;
  onRent: (car: Car) => void;
  walletConnected: boolean;
}

const categoryColors: Record<string, string> = {
  Elektrikli: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  SUV: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Spor: "text-red-400 bg-red-400/10 border-red-400/20",
  Sedan: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export function CarCard({ car, onRent, walletConnected }: CarCardProps) {
  const catColor = categoryColors[car.category] || "text-gray-400 bg-gray-400/10 border-gray-400/20";

  return (
    <div
      className={`bg-stellar-card border border-stellar-border rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-stellar-cyan/40 hover:shadow-lg hover:shadow-stellar-cyan/5 ${
        !car.available ? "opacity-60" : ""
      }`}
    >
      <div className="relative h-48 bg-gray-900">
        <Image
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-medium border px-2 py-0.5 rounded-full ${catColor}`}
          >
            {car.category}
          </span>
        </div>
        {!car.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-500/80 px-3 py-1 rounded-full">
              Müsait Değil
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <p className="text-xs text-stellar-cyan font-medium uppercase tracking-wider">
            {car.brand}
          </p>
          <h3 className="text-white font-bold text-xl mt-0.5">{car.name}</h3>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <Spec icon="users" label={`${car.seats} Kişi`} />
          <Spec icon="cog" label={car.transmission} />
          <Spec icon="fuel" label={car.fuelType} />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {car.features.map((f) => (
            <span
              key={f}
              className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-md"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-white">{car.priceXLM}</span>
            <span className="text-stellar-cyan font-semibold ml-1">XLM</span>
            <span className="text-gray-500 text-xs ml-1">/ gün</span>
          </div>

          <button
            onClick={() => onRent(car)}
            disabled={!car.available}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              car.available
                ? walletConnected
                  ? "bg-stellar-cyan hover:bg-stellar-cyan/90 text-stellar-dark"
                  : "bg-stellar-cyan/20 hover:bg-stellar-cyan/30 text-stellar-cyan border border-stellar-cyan/30"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            {car.available
              ? walletConnected
                ? "Kirala"
                : "Kirala"
              : "Dolu"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label }: { icon: string; label: string }) {
  const icons: Record<string, React.ReactNode> = {
    users: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      </svg>
    ),
    cog: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    fuel: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-col items-center gap-1 bg-gray-800/50 rounded-lg py-2">
      <span className="text-gray-400">{icons[icon]}</span>
      <span className="text-xs text-gray-400 text-center leading-tight">{label}</span>
    </div>
  );
}
