"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import storage from "@/lib/storage"
import type { Book } from "@/types/book"
import type { User } from "@/types/user"
import type { Transaction } from "@/types/transaction"
import { formatDistanceToNow } from "@/lib/date-utils"
import { SampleDataLoader } from "@/components/sample-data"

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedBooks = storage.get<Book[]>("books", [])
    const storedUsers = storage.get<User[]>("users", [])
    const storedTransactions = storage.get<Transaction[]>("transactions", [])

    setBooks(storedBooks)
    setUsers(storedUsers)
    setTransactions(storedTransactions)
    setIsLoaded(true)
  }, [])

  const stats = {
    totalBooks: books.length,
    availableBooks: books.filter((book) => book.status === "Available").length,
    issuedBooks: books.filter((book) => book.status === "Issued").length,
    totalUsers: users.length,
  }

  const recentActivities = transactions
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
    .slice(0, 5)

  if (!isLoaded) {
    return <div className="text-center p-6">Loading dashboard data...</div>
  }

  return (
    <>
      <SampleDataLoader />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Books</CardTitle>
              <span className="text-purple-600 dark:text-purple-400">📚</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalBooks}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Books</CardTitle>
              <span className="text-green-600 dark:text-green-400">📗</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.availableBooks}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Issued Books</CardTitle>
              <span className="text-orange-600 dark:text-orange-400">📙</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.issuedBooks}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <span className="text-blue-600 dark:text-blue-400">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent activities</p>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div
                      className={`rounded-full p-2 ${activity.type === "issue" ? "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300" : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"}`}
                    >
                      <span className="text-xs font-bold uppercase">{activity.type === "issue" ? "ISS" : "RET"}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.type === "issue"
                          ? `${activity.userName} borrowed "${activity.bookTitle}"`
                          : `${activity.userName} returned "${activity.bookTitle}"`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.date))} ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
