"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IssueBookForm } from "@/components/issue-book-form"
import { ReturnBookForm } from "@/components/return-book-form"
import { TransactionHistory } from "@/components/transaction-history"
import storage from "@/lib/storage"
import type { Book } from "@/types/book"
import type { User } from "@/types/user"
import type { Transaction } from "@/types/transaction"

export default function IssueReturnPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState("issue")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedBooks = storage.get<Book[]>("books", [])
    const storedUsers = storage.get<User[]>("users", [])
    const storedTransactions = storage.get<Transaction[]>("transactions", [])

    setBooks(storedBooks)
    setUsers(storedUsers)
    setTransactions(storedTransactions)
    setIsLoaded(true)
  }, [])

  const handleIssueBook = (bookId: string, userId: string) => {
    const date = new Date()
    const dueDate = new Date()
    dueDate.setDate(date.getDate() + 14) // 2 weeks from now

    // Update book status
    const updatedBooks = books.map((book) => {
      if (book.id === bookId) {
        return { ...book, status: "Issued", issuedTo: userId }
      }
      return book
    })

    // Update user's issued books
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          issuedBooks: [
            ...user.issuedBooks,
            {
              bookId,
              issueDate: date.toISOString(),
              dueDate: dueDate.toISOString(),
            },
          ],
        }
      }
      return user
    })

    // Add transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      bookId,
      userId,
      type: "issue",
      date: date.toISOString(),
      dueDate: dueDate.toISOString(),
    }

    const updatedTransactions = [...transactions, newTransaction]

    // Update state and localStorage
    setBooks(updatedBooks)
    setUsers(updatedUsers)
    setTransactions(updatedTransactions)

    storage.set("books", updatedBooks)
    storage.set("users", updatedUsers)
    storage.set("transactions", updatedTransactions)
  }

  const handleReturnBook = (bookId: string, userId: string) => {
    const date = new Date()

    // Update book status
    const updatedBooks = books.map((book) => {
      if (book.id === bookId) {
        return { ...book, status: "Available", issuedTo: null }
      }
      return book
    })

    // Update user's issued books
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          issuedBooks: user.issuedBooks.filter((item) => item.bookId !== bookId),
        }
      }
      return user
    })

    // Add transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      bookId,
      userId,
      type: "return",
      date: date.toISOString(),
    }

    const updatedTransactions = [...transactions, newTransaction]

    // Update state and localStorage
    setBooks(updatedBooks)
    setUsers(updatedUsers)
    setTransactions(updatedTransactions)

    storage.set("books", updatedBooks)
    storage.set("users", updatedUsers)
    storage.set("transactions", updatedTransactions)
  }

  if (!isLoaded) {
    return <div className="text-center p-6">Loading data...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Issue & Return Books</h1>

      <Tabs defaultValue="issue" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="issue" className="text-sm">
            Issue Book
          </TabsTrigger>
          <TabsTrigger value="return" className="text-sm">
            Return Book
          </TabsTrigger>
        </TabsList>
        <TabsContent value="issue">
          <Card>
            <CardHeader>
              <CardTitle>Issue a Book</CardTitle>
              <CardDescription>Select a book and a user to issue the book.</CardDescription>
            </CardHeader>
            <CardContent>
              <IssueBookForm
                books={books.filter((book) => book.status === "Available")}
                users={users}
                onIssue={handleIssueBook}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="return">
          <Card>
            <CardHeader>
              <CardTitle>Return a Book</CardTitle>
              <CardDescription>Select a book to return.</CardDescription>
            </CardHeader>
            <CardContent>
              <ReturnBookForm
                books={books.filter((book) => book.status === "Issued")}
                users={users}
                onReturn={handleReturnBook}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TransactionHistory transactions={transactions} books={books} users={users} />
    </div>
  )
}
