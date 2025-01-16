import axios from 'axios';
import QRCode from 'qrcode';

// This should be replaced with actual FBR API endpoint
const FBR_API_ENDPOINT = 'https://fbr.gov.pk/pos/api/invoice';

export interface FBRInvoiceData {
  uniqueId: string;
  securityToken: string;
  invoiceData: {
    totalAmount: number;
    tax: number;
    discount: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

export interface FBRResponse {
  trackingNumber: string;
  fbrInvoiceNumber: string;
}

export const sendInvoiceToFBR = async (invoiceData: FBRInvoiceData): Promise<FBRResponse> => {
  try {
    const response = await axios.post(FBR_API_ENDPOINT, invoiceData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      trackingNumber: response.data.trackingNumber,
      fbrInvoiceNumber: response.data.fbrInvoiceNumber,
    };
  } catch (error) {
    console.error('Error sending invoice to FBR:', error);
    throw error;
  }
};

export const generateQRCode = async (trackingNumber: string, fbrInvoiceNumber: string): Promise<string> => {
  const invoiceDetails = `Tracking Number: ${trackingNumber}, Invoice Number: ${fbrInvoiceNumber}`;
  try {
    const qrCodeData = await QRCode.toDataURL(invoiceDetails, {
      width: 200,
      margin: 2,
    });

    return qrCodeData;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

