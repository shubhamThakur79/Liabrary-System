"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Book } from "@/types/book"
import type { User } from "@/types/user"

interface ReturnBookFormProps {
  books: Book[]
  users: User[]
  onReturn: (bookId: string, userId: string) => void
}

export function ReturnBookForm({ books, users, onReturn }: ReturnBookFormProps) {
  const [selectedBookId, setSelectedBookId] = useState("")
  const [userId, setUserId] = useState("")

  useEffect(() => {
    if (selectedBookId) {
      const book = books.find((b) => b.id === selectedBookId)
      if (book && book.issuedTo) {
        setUserId(book.issuedTo)
      }
    } else {
      setUserId("")
    }
  }, [selectedBookId, books])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedBookId && userId) {
      onReturn(selectedBookId, userId)
      setSelectedBookId("")
    }
  }

  const getBookWithUserInfo = (book: Book) => {
    const user = users.find((u) => u.id === book.issuedTo)
    return {
      ...book,
      userName: user ? user.name : "Unknown User",
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="book">Select Book to Return</Label>
        <Select value={selectedBookId} onValueChange={setSelectedBookId} required>
          <SelectTrigger id="book">
            <SelectValue placeholder="Select a book" />
          </SelectTrigger>
          <SelectContent>
            {books.length === 0 ? (
              <SelectItem value="no-books" disabled>
                No issued books
              </SelectItem>
            ) : (
              books.map((book) => {
                const bookWithUser = getBookWithUserInfo(book)
                return (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title} (Issued to {bookWithUser.userName})
                  </SelectItem>
                )
              })
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedBookId && (
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm">
            <span className="font-medium">User: </span>
            {users.find((u) => u.id === userId)?.name || "Unknown User"}
          </p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={!selectedBookId || books.length === 0}>
        Return Book
      </Button>
    </form>
  )
}
