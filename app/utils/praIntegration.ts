import axios from 'axios';

const PRA_API_ENDPOINT = process.env.NEXT_PUBLIC_PRA_API_URL || ""; // API URL from environment variable
const QR_CODE_BASE_URL = process.env.NEXT_PUBLIC_QR_CODE_URL || ""; // QR code base URL from environment variable

export interface PRAInvoiceData {
  InvoiceNumber: string;
  POSID: number;
  USIN: string;
  DateTime: string;
  BuyerName: string;
  TotalBillAmount: number;
  TotalSaleValue: number;
  TotalTaxCharged: number;
  Discount: number;
  PaymentMode: number;
  Items: Array<{
    ItemCode: string;
    ItemName: string;
    Quantity: number;
    SaleValue: number;
    TaxCharged: number;
  }>;
}

export interface PRAResponse {
  fiscalInvoiceNumber: string;
  qrCodeUrl: string; // Full URL to retrieve the QR code
}

export const sendInvoiceToPRA = async (invoiceData: PRAInvoiceData): Promise<PRAResponse> => {
  try {
    const token = process.env.NEXT_PUBLIC_PRA_TOKEN; // Use the token from the environment variable

    const response = await axios.post(PRA_API_ENDPOINT, invoiceData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const fiscalInvoiceNumber = response.data.InvoiceNumber; // Extract the fiscal invoice number from PRA response
    const qrCodeUrl = `${QR_CODE_BASE_URL}${fiscalInvoiceNumber}`; // Generate the full URL for the QR code

    return {
      fiscalInvoiceNumber,
      qrCodeUrl, // Return the full QR code URL
    };
  } catch (error) {
    console.error('Error sending invoice to PRA:', error);
    throw error;
  }
};

// Optionally, if PRA provides a dedicated endpoint for retrieving QR codes
export const getQRCodeFromPRA = async (qrCodeToken: string): Promise<string> => {
  try {
    const token = process.env.NEXT_PUBLIC_PRA_TOKEN;
    const response = await axios.get(`${PRA_API_ENDPOINT}/qrcode/${qrCodeToken}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'arraybuffer',
    });

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${base64}`; // Convert response to base64 image URL
  } catch (error) {
    console.error('Error fetching QR code from PRA:', error);
    throw error;
  }
};
