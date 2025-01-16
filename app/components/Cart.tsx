'use client'

import { useState } from 'react'
import { useOrder } from '../contexts/OrderContext'

type CartProps = {
  onViewReceipt: () => void
}

export default function Cart({ onViewReceipt }: CartProps) {
  const { order, removeFromOrder, updateQuantity, setDiscount, setTaxRate } = useOrder()
  const [localDiscount, setLocalDiscount] = useState(0)
  const [localTaxRate, setLocalTaxRate] = useState(0.05)

  const subtotal = order.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleDiscountChange = (value: number) => {
    setLocalDiscount(value)
    setDiscount(value)
  }

  const handleTaxRateChange = (value: number) => {
    setLocalTaxRate(value)
    setTaxRate(value)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Cart</h2>
      {order.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {order.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <div>
                <p>{item.name} {item.size && `(${item.size})`}</p>
                <p className="text-sm text-gray-500">Rs. {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="px-2 py-1 bg-gray-200 rounded-l"
                >
                  -
                </button>
                <span className="px-2 py-1 bg-gray-100">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded-r"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromOrder(item.id)}
                  className="ml-2 text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t">
            <div className="mb-2">
              <label className="mr-2">Discount %:</label>
              <input
                type="number"
                min="0"
                max="100"
                value={localDiscount}
                onChange={(e) => handleDiscountChange(Number(e.target.value))}
                className="border rounded p-1 w-16"
              />
            </div>
            <div className="mb-2">
              <label className="mr-2">Tax Rate:</label>
              <select
                value={localTaxRate}
                onChange={(e) => handleTaxRateChange(Number(e.target.value))}
                className="border rounded p-1"
              >
                <option value={0.05}>5%</option>
                <option value={0.16}>16%</option>
              </select>
            </div>
            <p className="font-bold">Subtotal: Rs. {subtotal.toFixed(2)}</p>
          </div>
          <button
            onClick={onViewReceipt}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Receipt
          </button>
        </>
      )}
    </div>
  )
}

