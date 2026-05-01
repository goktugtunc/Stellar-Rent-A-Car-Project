"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Car, RENTAL_WALLET } from "@/data/cars";
import { buildRentalPaymentTx, submitSignedTransaction } from "@/lib/transactions";

type Step = "confirm" | "signing" | "submitting" | "success" | "error";

interface RentModalProps {
  car: Car;
  walletAddress: string | null;
  balance: string;
  sign: (xdr: string) => Promise<string>;
  onConnect: () => Promise<unknown>;
  onClose: () => void;
  onSuccess: (txHash: string, totalXLM: number) => void;
}

export function RentModal({
  car,
  walletAddress,
  balance,
  sign,
  onConnect,
  onClose,
  onSuccess,
}: RentModalProps) {
  const [step, setStep] = useState<Step>("confirm");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [days, setDays] = useState(1);

  const totalXLM = car.priceXLM * days;
  const hasEnoughBalance = parseFloat(balance) >= totalXLM + 1;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleRent = async () => {
    if (!walletAddress) {
      await onConnect();
      return;
    }

    try {
      setStep("signing");
      const xdr = await buildRentalPaymentTx(
        walletAddress,
        RENTAL_WALLET,
        totalXLM,
        `${car.brand} ${car.name}`
      );

      const signedXdr = await sign(xdr);

      setStep("submitting");
      const result = await submitSignedTransaction(signedXdr);

      setTxHash(result.hash);
      setStep("success");
      onSuccess(result.hash, totalXLM);
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err);
      let display = raw;
      if (raw.includes("rejected") || raw.includes("User declined") || raw.includes("cancel")) {
        display = "İmzalama iptal edildi.";
      } else if (raw.includes("op_underfunded")) {
        display = "Yetersiz bakiye (op_underfunded).";
      } else if (raw.includes("op_low_reserve")) {
        display = "Hesap rezervi için yeterli XLM yok (op_low_reserve).";
      } else if (raw.includes("tx_bad_seq")) {
        display = "İşlem sırası hatası, lütfen sayfayı yenileyip tekrar deneyin.";
      }
      setErrorMsg(display);
      setStep("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative bg-stellar-card border border-stellar-border rounded-2xl w-full max-w-md shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {step === "confirm" && (
          <ConfirmStep
            car={car}
            days={days}
            setDays={setDays}
            totalXLM={totalXLM}
            walletAddress={walletAddress}
            balance={balance}
            hasEnoughBalance={hasEnoughBalance}
            onRent={handleRent}
          />
        )}

        {step === "signing" && (
          <StatusStep
            icon="wallet"
            title="Cüzdanınızı Onaylayın"
            description="Freighter'da işlemi imzalayın..."
          />
        )}

        {step === "submitting" && (
          <StatusStep
            icon="loading"
            title="Blockchain'e Gönderiliyor"
            description="Stellar ağında onaylanıyor..."
          />
        )}

        {step === "success" && txHash && (
          <SuccessStep
            car={car}
            totalXLM={totalXLM}
            days={days}
            txHash={txHash}
            onClose={onClose}
          />
        )}

        {step === "error" && (
          <ErrorStep
            message={errorMsg || "Bilinmeyen hata"}
            onRetry={() => setStep("confirm")}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

function ConfirmStep({
  car,
  days,
  setDays,
  totalXLM,
  walletAddress,
  balance,
  hasEnoughBalance,
  onRent,
}: {
  car: Car;
  days: number;
  setDays: (d: number) => void;
  totalXLM: number;
  walletAddress: string | null;
  balance: string;
  hasEnoughBalance: boolean;
  onRent: () => void;
}) {
  return (
    <div className="p-6">
      <div className="relative h-40 rounded-xl overflow-hidden mb-5">
        <Image src={car.image} alt={car.name} fill className="object-cover" sizes="448px" />
        <div className="absolute inset-0 bg-gradient-to-t from-stellar-card/80 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <p className="text-xs text-stellar-cyan">{car.brand}</p>
          <h2 className="text-white text-xl font-bold">{car.name}</h2>
        </div>
      </div>

      <div className="mb-5">
        <label className="text-sm text-gray-400 mb-2 block">Kiralama Süresi</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDays(Math.max(1, days - 1))}
            className="w-9 h-9 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center justify-center text-lg"
          >
            −
          </button>
          <span className="text-white font-semibold w-20 text-center">
            {days} {days === 1 ? "Gün" : "Gün"}
          </span>
          <button
            onClick={() => setDays(Math.min(30, days + 1))}
            className="w-9 h-9 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center justify-center text-lg"
          >
            +
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4 mb-5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Günlük Fiyat</span>
          <span className="text-white">{car.priceXLM} XLM</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Gün Sayısı</span>
          <span className="text-white">× {days}</span>
        </div>
        <div className="border-t border-gray-700 pt-2 flex justify-between">
          <span className="text-gray-300 font-medium">Toplam</span>
          <span className="text-stellar-cyan font-bold text-lg">{totalXLM} XLM</span>
        </div>
      </div>

      {walletAddress && (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-xl flex justify-between text-sm">
          <span className="text-gray-400">Cüzdan Bakiyesi</span>
          <span className={hasEnoughBalance ? "text-green-400" : "text-red-400"}>
            {balance} XLM
          </span>
        </div>
      )}

      {walletAddress && !hasEnoughBalance && (
        <p className="text-red-400 text-xs mb-4 text-center">
          Yetersiz bakiye. En az {totalXLM + 1} XLM gerekli.
        </p>
      )}

      <button
        onClick={onRent}
        disabled={walletAddress !== null && !hasEnoughBalance}
        className="w-full py-3 rounded-xl font-semibold transition-all bg-stellar-cyan hover:bg-stellar-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed text-stellar-dark"
      >
        {walletAddress ? `${totalXLM} XLM Öde & Kirala` : "Cüzdan Bağla"}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Testnet — gerçek para kullanılmaz
      </p>
    </div>
  );
}

function StatusStep({
  icon,
  title,
  description,
}: {
  icon: "wallet" | "loading";
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 flex flex-col items-center text-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-stellar-cyan/10 border border-stellar-cyan/20 flex items-center justify-center">
        {icon === "loading" ? (
          <div className="w-8 h-8 border-2 border-stellar-cyan/30 border-t-stellar-cyan rounded-full animate-spin" />
        ) : (
          <svg className="w-8 h-8 text-stellar-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
      </div>
      <div>
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}

function SuccessStep({
  car,
  totalXLM,
  days,
  txHash,
  onClose,
}: {
  car: Car;
  totalXLM: number;
  days: number;
  txHash: string;
  onClose: () => void;
}) {
  const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${txHash}`;

  return (
    <div className="p-6 flex flex-col items-center text-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h3 className="text-white font-bold text-xl">Kiralama Başarılı!</h3>
        <p className="text-gray-400 text-sm mt-1">
          {car.brand} {car.name} — {days} gün
        </p>
      </div>

      <div className="w-full bg-gray-800/50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Ödenen</span>
          <span className="text-stellar-cyan font-semibold">{totalXLM} XLM</span>
        </div>
        <div className="flex justify-between text-sm items-center gap-2">
          <span className="text-gray-400 shrink-0">TX Hash</span>
          <span className="text-gray-300 font-mono text-xs truncate">
            {txHash.slice(0, 12)}...{txHash.slice(-8)}
          </span>
        </div>
      </div>

      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-stellar-cyan text-sm hover:underline"
      >
        Stellar Expert'te Görüntüle →
      </a>

      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-colors"
      >
        Kapat
      </button>
    </div>
  );
}

function ErrorStep({
  message,
  onRetry,
  onClose,
}: {
  message: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div className="p-6 flex flex-col items-center text-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div>
        <h3 className="text-white font-bold text-lg">İşlem Başarısız</h3>
        <p className="text-red-400 text-sm mt-1">{message}</p>
      </div>
      <div className="flex gap-3 w-full">
        <button
          onClick={onRetry}
          className="flex-1 py-2.5 rounded-xl bg-stellar-cyan text-stellar-dark font-semibold hover:bg-stellar-cyan/90 transition-colors"
        >
          Tekrar Dene
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-colors"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}
