import * as StellarSdk from "@stellar/stellar-sdk";
import { horizon, config } from "./stellar";

export async function buildRentalPaymentTx(
  sourceAddress: string,
  destinationAddress: string,
  amountXLM: number,
  carName: string
): Promise<string> {
  const account = await horizon.loadAccount(sourceAddress);

  // Stellar'da payment op, hedef hesap yoksa başarısız olur.
  // Hesap yoksa createAccount ile hem oluştur hem gönder.
  let destinationExists = true;
  try {
    await horizon.loadAccount(destinationAddress);
  } catch (e: unknown) {
    const err = e as { response?: { status?: number } };
    if (err.response?.status === 404) {
      destinationExists = false;
    } else {
      throw e;
    }
  }

  const memo = StellarSdk.Memo.text(`Kiralama: ${carName}`.slice(0, 28));

  const builder = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.networkPassphrase,
  });

  if (destinationExists) {
    builder.addOperation(
      StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: StellarSdk.Asset.native(),
        amount: amountXLM.toFixed(7),
      })
    );
  } else {
    builder.addOperation(
      StellarSdk.Operation.createAccount({
        destination: destinationAddress,
        startingBalance: amountXLM.toFixed(7),
      })
    );
  }

  return builder.addMemo(memo).setTimeout(180).build().toXDR();
}

export async function submitSignedTransaction(
  signedXdr: string
): Promise<{ hash: string; ledger: number }> {
  // SDK'nın yeniden parse etmesini atlayıp XDR'ı doğrudan gönder.
  const res = await fetch(`${config.horizonUrl}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `tx=${encodeURIComponent(signedXdr)}`,
  });

  const data = await res.json();

  if (!res.ok) {
    const codes = data?.extras?.result_codes;
    const opCodes: string[] | undefined = codes?.operations;
    const txCode: string | undefined = codes?.transaction;
    const detail = opCodes?.join(", ") || txCode || data?.title || "Bilinmeyen hata";
    throw new Error(detail);
  }

  return { hash: data.hash, ledger: data.ledger };
}
