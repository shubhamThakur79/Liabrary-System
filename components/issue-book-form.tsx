"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Book } from "@/types/book"
import type { User } from "@/types/user"

interface IssueBookFormProps {
  books: Book[]
  users: User[]
  onIssue: (bookId: string, userId: string) => void
}

export function IssueBookForm({ books, users, onIssue }: IssueBookFormProps) {
  const [selectedBookId, setSelectedBookId] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedBookId && selectedUserId) {
      onIssue(selectedBookId, selectedUserId)
      setSelectedBookId("")
      setSelectedUserId("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="book">Select Book</Label>
        <Select value={selectedBookId} onValueChange={setSelectedBookId} required>
          <SelectTrigger id="book">
            <SelectValue placeholder="Select a book" />
          </SelectTrigger>
          <SelectContent>
            {books.length === 0 ? (
              <SelectItem value="no-books" disabled>
                No available books
              </SelectItem>
            ) : (
              books.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title} by {book.author}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="user">Select User</Label>
        <Select value={selectedUserId} onValueChange={setSelectedUserId} required>
          <SelectTrigger id="user">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users.length === 0 ? (
              <SelectItem value="no-users" disabled>
                No users available
              </SelectItem>
            ) : (
              users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!selectedBookId || !selectedUserId || books.length === 0 || users.length === 0}
      >
        Issue Book
      </Button>
    </form>
  )
}
