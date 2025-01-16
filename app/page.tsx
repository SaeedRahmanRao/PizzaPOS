'use client'

import { useState, useCallback } from 'react'
import Menu from './components/Menu'
import Cart from './components/Cart'
import Receipt from './components/Receipt'
import TransactionRecords from './components/TransactionRecords'
import { OrderProvider } from './contexts/OrderContext'

export default function Home() {
  const [showReceipt, setShowReceipt] = useState(false)
  const [showTransactions, setShowTransactions] = useState(false)
  const [transactionUpdateTrigger, setTransactionUpdateTrigger] = useState(0)

  const handleTransactionSaved = useCallback(() => {
    setTransactionUpdateTrigger(prev => prev + 1)
  }, [])

  const handleTransactionDeleted = useCallback(() => {
    setTransactionUpdateTrigger(prev => prev + 1)
  }, [])

  return (
    <OrderProvider>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Dough Joe POS</h1>
        {showTransactions ? (
          <>
            <TransactionRecords 
              updateTrigger={transactionUpdateTrigger} 
              onTransactionDeleted={handleTransactionDeleted}
            />
            <button
              onClick={() => setShowTransactions(false)}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Menu
            </button>
          </>
        ) : showReceipt ? (
          <Receipt 
            onBack={() => setShowReceipt(false)} 
            onTransactionSaved={handleTransactionSaved}
          />
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-2/3">
                <Menu />
              </div>
              <div className="md:w-1/3">
                <Cart onViewReceipt={() => setShowReceipt(true)} />
              </div>
            </div>
            <button
              onClick={() => setShowTransactions(true)}
              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              View Transaction Records
            </button>
          </>
        )}
      </main>
    </OrderProvider>
  )
}

