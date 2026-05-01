import * as StellarSdk from "@stellar/stellar-sdk";

export const NETWORK = "testnet";

export const config = {
  horizonUrl: "https://horizon-testnet.stellar.org",
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: StellarSdk.Networks.TESTNET,
  friendbotUrl: "https://friendbot.stellar.org",
};

export const horizon = new StellarSdk.Horizon.Server(config.horizonUrl);

export async function getXLMBalance(address: string): Promise<string> {
  try {
    const account = await horizon.loadAccount(address);
    const native = account.balances.find((b) => b.asset_type === "native");
    return native ? parseFloat(native.balance).toFixed(2) : "0.00";
  } catch {
    return "0.00";
  }
}
