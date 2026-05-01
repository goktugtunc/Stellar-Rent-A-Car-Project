"use client";

import { useState, useEffect, useCallback } from "react";
import { config } from "@/lib/stellar";

type FreighterState = {
  installed: boolean;
  connected: boolean;
  address: string | null;
  network: string | null;
  balance: string;
};

export function useFreighter() {
  const [state, setState] = useState<FreighterState>({
    installed: false,
    connected: false,
    address: null,
    network: null,
    balance: "0.00",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkInitialState();
  }, []);

  const checkInitialState = async () => {
    try {
      const freighter = await import("@stellar/freighter-api");

      const { isConnected: inst } = await freighter.isConnected();
      if (!inst) {
        setState((s) => ({ ...s, installed: false }));
        return;
      }

      setState((s) => ({ ...s, installed: true }));

      const { isAllowed: allowed } = await freighter.isAllowed();
      if (!allowed) return;

      const { address } = await freighter.getAddress();
      const { network } = await freighter.getNetwork();

      if (address) {
        const bal = await fetchBalance(address);
        setState({
          installed: true,
          connected: true,
          address,
          network,
          balance: bal,
        });
      }
    } catch {
      // Freighter not available in this environment
    }
  };

  const fetchBalance = async (address: string): Promise<string> => {
    const { getXLMBalance } = await import("@/lib/stellar");
    return getXLMBalance(address);
  };

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const freighter = await import("@stellar/freighter-api");

      const { isConnected: inst } = await freighter.isConnected();
      if (!inst) {
        throw new Error(
          "Freighter eklentisi yüklü değil. Lütfen tarayıcınıza yükleyin."
        );
      }

      await freighter.setAllowed();
      const { address, error: addrErr } = await freighter.getAddress();
      if (addrErr) throw new Error(addrErr);
      if (!address) throw new Error("Cüzdan adresi alınamadı.");

      const { network } = await freighter.getNetwork();
      const bal = await fetchBalance(address);

      setState({
        installed: true,
        connected: true,
        address,
        network,
        balance: bal,
      });

      return address;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bağlantı hatası";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setState((s) => ({
      ...s,
      connected: false,
      address: null,
      network: null,
      balance: "0.00",
    }));
  }, []);

  const sign = useCallback(
    async (xdr: string): Promise<string> => {
      if (!state.connected) throw new Error("Cüzdan bağlı değil");
      const freighter = await import("@stellar/freighter-api");
      const result = await freighter.signTransaction(xdr, {
        networkPassphrase: config.networkPassphrase,
      });
      if (result.error) throw new Error(result.error);
      return result.signedTxXdr;
    },
    [state.connected]
  );

  const refreshBalance = useCallback(async () => {
    if (!state.address) return;
    const bal = await fetchBalance(state.address);
    setState((s) => ({ ...s, balance: bal }));
  }, [state.address]);

  return {
    ...state,
    loading,
    error,
    connect,
    disconnect,
    sign,
    refreshBalance,
  };
}
