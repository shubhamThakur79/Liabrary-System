"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/types/transaction"
import type { Book } from "@/types/book"
import type { User } from "@/types/user"
import { formatDate } from "@/lib/date-utils"
import { Calendar, UserIcon, BookOpen } from "lucide-react"

interface TransactionHistoryProps {
  transactions: Transaction[]
  books: Book[]
  users: User[]
}

export function TransactionHistory({ transactions, books, users }: TransactionHistoryProps) {
  const [enrichedTransactions, setEnrichedTransactions] = useState<
    Array<Transaction & { bookTitle: string; userName: string }>
  >([])

  useEffect(() => {
    if (!transactions || !books || !users) return

    const enriched = transactions
      .map((transaction) => {
        const book = books.find((b) => b.id === transaction.bookId)
        const user = users.find((u) => u.id === transaction.userId)

        return {
          ...transaction,
          bookTitle: book?.title || "Unknown Book",
          userName: user?.name || "Unknown User",
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setEnrichedTransactions(enriched)
  }, [transactions, books, users])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {enrichedTransactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No transaction history</p>
        ) : (
          <>
            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto -mx-6">
              <div className="inline-block min-w-full align-middle px-6">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Book</th>
                      <th className="text-left py-3 px-2 font-medium">User</th>
                      <th className="text-left py-3 px-2 font-medium">Type</th>
                      <th className="text-left py-3 px-2 font-medium">Date</th>
                      <th className="text-left py-3 px-2 font-medium">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="py-3 px-2">{transaction.bookTitle}</td>
                        <td className="py-3 px-2">{transaction.userName}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              transaction.type === "issue"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            }`}
                          >
                            {transaction.type === "issue" ? "Issued" : "Returned"}
                          </span>
                        </td>
                        <td className="py-3 px-2">{formatDate(new Date(transaction.date))}</td>
                        <td className="py-3 px-2">
                          {transaction.dueDate ? formatDate(new Date(transaction.dueDate)) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile view */}
            <div className="md:hidden space-y-4">
              {enrichedTransactions.map((transaction) => (
                <div key={transaction.id} className="border rounded-md p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium line-clamp-1">{transaction.bookTitle}</span>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        transaction.type === "issue"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      }`}
                    >
                      {transaction.type === "issue" ? "Issued" : "Returned"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <UserIcon className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">{transaction.userName}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">{formatDate(new Date(transaction.date))}</span>
                  </div>
                  {transaction.dueDate && (
                    <div className="flex items-center text-xs">
                      <span className="text-muted-foreground ml-5">
                        Due: {formatDate(new Date(transaction.dueDate))}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
