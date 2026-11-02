import QRCode from 'qrcode';

export interface UPIPaymentDetails {
  pa: string; // Payee VPA / UPI ID
  pn: string; // Payee Name
  am: number; // Amount in INR
  tn?: string; // Transaction Note
  cu?: string; // Currency (default: INR)
}

/**
 * Builds standard NPCI-compliant UPI payment intent URI
 * Note: NPCI UPI app scanners (Google Pay, PhonePe, Paytm, BHIM) require '@' in the
 * VPA to remain unescaped (e.g. pa=name@oksbi instead of pa=name%40oksbi), or they flag "UPI ID not registered".
 */
export function buildUpiUri(details: UPIPaymentDetails): string {
  const vpa = details.pa.trim();
  const name = details.pn.trim() || 'Payee';
  const amount = details.am > 0 ? details.am.toFixed(2) : '1.00';
  const note = (details.tn || 'PaySafe Transfer').trim();
  const currency = details.cu || 'INR';

  // Ensure '@' is preserved and not turned into '%40' for QR and deep link parsing
  const safeVpa = encodeURIComponent(vpa).replace(/%40/g, '@');
  const safeName = encodeURIComponent(name);
  const safeNote = encodeURIComponent(note);

  return `upi://pay?pa=${safeVpa}&pn=${safeName}&am=${amount}&cu=${currency}&tn=${safeNote}`;
}

/**
 * App-specific deep link URIs for Android / iOS UPI apps
 */
export function getAppSpecificUpiUri(app: 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred' | 'any', details: UPIPaymentDetails): string {
  const baseUri = buildUpiUri(details);
  const params = baseUri.replace('upi://pay?', '');

  switch (app) {
    case 'gpay':
      return `tez://upi/pay?${params}`;
    case 'phonepe':
      return `phonepe://pay?${params}`;
    case 'paytm':
      return `paytmmp://pay?${params}`;
    case 'cred':
      return `cred://upi/pay?${params}`;
    case 'bhim':
    case 'any':
    default:
      return baseUri;
  }
}

/**
 * Generates high-quality QR code data URL from UPI URI
 */
export async function generateUpiQrCode(details: UPIPaymentDetails): Promise<string> {
  const uri = buildUpiUri(details);
  try {
    return await QRCode.toDataURL(uri, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 320,
      color: {
        dark: '#020617', // Slate 950
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Failed to generate UPI QR Code:', err);
    return '';
  }
}
