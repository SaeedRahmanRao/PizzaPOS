'use client'

import { useState, useEffect, useMemo } from 'react'

type Transaction = {
  id: string
  date: string
  total: number
  items: { name: string; quantity: number; price: number }[]
}

type TransactionRecordsProps = {
  updateTrigger: number
  onTransactionDeleted: () => void
}

export default function TransactionRecords({ updateTrigger, onTransactionDeleted }: TransactionRecordsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [updateTrigger])

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id)
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions))
    setTransactions(updatedTransactions)
    onTransactionDeleted()
  }

  const totalSaleOfDay = useMemo(() => {
    const today = new Date().toLocaleDateString()
    return transactions
      .filter(transaction => new Date(transaction.date).toLocaleDateString() === today)
      .reduce((sum, transaction) => sum + transaction.total, 0)
  }, [transactions])

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Transaction Records</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Transaction ID</th>
              <th className="p-2 text-right">Total</th>
              <th className="p-2 text-left">Items</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="p-2">{transaction.date}</td>
                <td className="p-2">{transaction.id}</td>
                <td className="p-2 text-right">Rs. {transaction.total.toFixed(2)}</td>
                <td className="p-2">
                  <ul>
                    {transaction.items.map((item, index) => (
                      <li key={index}>
                        {item.name} x{item.quantity} - Rs. {item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-right">
        <p className="text-xl font-bold">Total Sale of the Day: Rs. {totalSaleOfDay.toFixed(2)}</p>
      </div>
    </div>
  )
}

