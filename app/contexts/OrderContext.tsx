'use client'

import React, { createContext, useContext, useState } from 'react'

type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
}

type OrderContextType = {
  order: OrderItem[]
  addToOrder: (item: OrderItem) => void
  removeFromOrder: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateSize: (id: string, size: string) => void
  clearOrder: () => void
  discount: number
  setDiscount: (discount: number) => void
  taxRate: number
  setTaxRate: (taxRate: number) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [order, setOrder] = useState<OrderItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(0.05)

  const addToOrder = (item: OrderItem) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.find((i) => i.id === item.id && i.size === item.size)
      if (existingItem) {
        return prevOrder.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prevOrder, item]
    })
  }

  const removeFromOrder = (id: string) => {
    setOrder((prevOrder) => prevOrder.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setOrder((prevOrder) =>
      prevOrder.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const updateSize = (id: string, size: string) => {
    setOrder((prevOrder) =>
      prevOrder.map((item) => (item.id === id ? { ...item, size } : item))
    )
  }

  const clearOrder = () => {
    setOrder([])
    setDiscount(0)
    setTaxRate(0.05)
  }

  return (
    <OrderContext.Provider
      value={{
        order,
        addToOrder,
        removeFromOrder,
        updateQuantity,
        updateSize,
        clearOrder,
        discount,
        setDiscount,
        taxRate,
        setTaxRate,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

