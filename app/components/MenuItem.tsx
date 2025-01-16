'use client'

import { useState } from 'react'
import { useOrder } from '../contexts/OrderContext'

type MenuItemProps = {
  item: {
    id: string
    name: string
    price: number | { [key: string]: number }
    details: string
    isPizza?: boolean
  }
}

export default function MenuItem({ item }: MenuItemProps) {
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState('Medium')
  const [showDetails, setShowDetails] = useState(false)
  const { addToOrder } = useOrder()

  const handleAddToOrder = () => {
    const itemPrice = typeof item.price === 'number' ? item.price : item.price[size]
    addToOrder({
      id: item.id,
      name: item.name,
      price: itemPrice,
      quantity,
      size: item.isPizza ? size : undefined,
    })
    setQuantity(1)
    setSize('Medium')
  }

  return (
    <div className="border p-4 rounded">
      <h3 className="font-bold">{item.name}</h3>
      {typeof item.price === 'number' ? (
        <p>Rs. {item.price}</p>
      ) : (
        <div>
          {Object.entries(item.price).map(([itemSize, price]) => (
            <p key={itemSize}>
              {itemSize}: Rs. {price}
            </p>
          ))}
        </div>
      )}
      <div className="mt-2">
        <label className="mr-2">Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded p-1 w-16"
        />
      </div>
      {item.isPizza && (
        <div className="mt-2">
          <label className="mr-2">Size:</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border rounded p-1"
          >
            {Object.keys(item.price as { [key: string]: number }).map((itemSize) => (
              <option key={itemSize} value={itemSize}>
                {itemSize}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-2 text-blue-500 underline"
      >
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>
      {showDetails && <p className="mt-2 text-sm">{item.details}</p>}
      <button
        onClick={handleAddToOrder}
        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add to Order
      </button>
    </div>
  )
}

