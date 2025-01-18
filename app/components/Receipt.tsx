"use client";

import { useState, useEffect } from "react";
import { useOrder } from "../contexts/OrderContext";
import Image from "next/image";
import axios from "axios";
import QRCode from "qrcode";

type ReceiptProps = {
  onBack: () => void;
  onTransactionSaved: () => void;
};

export default function Receipt({ onBack, onTransactionSaved }: ReceiptProps) {
  const { order, clearOrder, discount, taxRate } = useOrder();
  const [fiscalInvoiceNumber, setFiscalInvoiceNumber] = useState<string | null>(
    null
  );
  const [qrCode, setQrCode] = useState<string | null>(null);

  const subtotal = order.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * taxRate;
  const total = taxableAmount + taxAmount;

  useEffect(() => {
    const getFiscalInvoiceNumber = async () => {
      try {
        const invoiceData = {
          InvoiceNumber: `INV-${Date.now()}`,
          POSID: "123456", //Number(process.env.NEXT_PUBLIC_PRA_POS_ID),
          USIN: "USIN0", //process.env.NEXT_PUBLIC_PRA_USIN || '',
          DateTime: new Date().toISOString(),
          BuyerPNTN: "1234567-8",
          BuyerCNIC: "12345-1234567-8",
          BuyerName: "Customer",
          BuyerPhoneNumber: "555-1234567",
          TotalBillAmount: total,
          TotalQuantity: order.reduce((sum, item) => sum + item.quantity, 0),
          TotalSaleValue: subtotal,
          TotalTaxCharged: taxAmount,
          Discount: discountAmount,
          FurtherTax: 0.0,
          PaymentMode: 1, // Cash payment
          InvoiceType: 1,
          Items: order.map((item, index) => ({
            ItemCode: `ITEM-${index + 1}`,
            ItemName: item.name,
            Quantity: item.quantity,
            PCTCode: "00000000",
            TaxRate: taxRate * 100,
            SaleValue: item.price * item.quantity,
            TotalAmount: item.price * item.quantity,
            TaxCharged: item.price * item.quantity * taxRate,
            Discount: 0.0,
            FurtherTax: 0.0,
            InvoiceType: 1,
            RefUSIN: null,
          })),
        };

        // Send the invoice data to the API endpoint
        const response = await axios.post(
          "http://localhost:8524/api/IMSFiscal/GetInvoiceNumberByModel",
          invoiceData
        );

        if (response.data && response.data.Code === "100") {
          setFiscalInvoiceNumber(response.data.InvoiceNumber);

          // Generate a QR code of the invoice number
          const qrCodeData = await QRCode.toDataURL(
            response.data.InvoiceNumber
          );
          setQrCode(qrCodeData);
        } else {
          console.error(
            "Error generating fiscal invoice:",
            response.data.Errors
          );
        }
      } catch (error) {
        console.error("Error fetching fiscal invoice number:", error);
      }
    };

    getFiscalInvoiceNumber();
  }, [order, total, subtotal, taxAmount, discountAmount, taxRate]);

  const saveTransaction = () => {
    const transaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toLocaleString(),
      total,
      items: order.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      fiscalInvoiceNumber,
    };

    const savedTransactions = localStorage.getItem("transactions");
    const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    onTransactionSaved();
  };

  const handlePrint = () => {
    saveTransaction();
    window.print();
  };

  const handleSaveAndClear = () => {
    saveTransaction();
    clearOrder();
    onBack();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto receipt">
      <div className="flex justify-center mb-4">
        <Image
          src="/assets/djlogo.png"
          alt="Pizza Shop Logo"
          width={200}
          height={100}
          className="object-contain"
        />
      </div>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Dough Joe&apos;s Pizza</h2>
        <p className="text-sm">Mall 1 Gullberg 3 , Lahore</p>
        <p className="text-sm">Phone: 0310 1234567</p>
        <p className="text-sm font-semibold">NTN: 12345678</p>
      </div>
      <h3 className="text-xl font-bold mb-4 text-center">Receipt</h3>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="text-left">Item</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Price</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.map((item) => (
            <tr key={item.id}>
              <td>
                {item.name} {item.size && `(${item.size})`}
              </td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">Rs. {item.price.toFixed(2)}</td>
              <td className="text-right">
                Rs. {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>Rs. {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount ({discount}%):</span>
          <span>Rs. {discountAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({(taxRate * 100).toFixed(0)}%):</span>
          <span>Rs. {taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold mt-2">
          <span>Total:</span>
          <span>Rs. {total.toFixed(2)}</span>
        </div>
      </div>
      {fiscalInvoiceNumber && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-bold mb-2">Fiscal Invoice Number</h3>
          <p>{fiscalInvoiceNumber}</p>
        </div>
      )}
      <div className="mt-8 flex justify-between items-center">
        <div className="flex-1">
          {qrCode && (
            <Image
              src={qrCode}
              alt="Fiscal Invoice QR Code"
              width={150}
              height={150}
            />
          )}
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Image
            src="/assets/pralogo.png"
            alt="PRA Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-between">
  <button
    onClick={onBack}
    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded no-print"
  >
    Back to Menu
  </button>
  <button
    onClick={handlePrint}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-print"
  >
    Print Receipt
  </button>
  <button
    onClick={handleSaveAndClear}
    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded no-print"
  >
    Save & Clear
  </button>
</div>

      <div className="absolute bottom-2 right-2">
        <p className="text-xs text-gray-500">Powered by SamSpace</p>
      </div>
    </div>
  );
}
