"use client"

import { useState, useEffect } from "react"
import { BookList } from "@/components/book-list"
import { BookForm } from "@/components/book-form"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import storage from "@/lib/storage"
import type { Book } from "@/types/book"

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load books from localStorage on component mount
  useEffect(() => {
    const storedBooks = storage.get<Book[]>("books", [])
    setBooks(storedBooks)
    setIsLoaded(true)
  }, [])

  // Filter books based on search term and filter
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterBy === "all") return matchesSearch
    if (filterBy === "available") return matchesSearch && book.status === "Available"
    if (filterBy === "issued") return matchesSearch && book.status === "Issued"

    return matchesSearch
  })

  const handleAddBook = (book: Book) => {
    let updatedBooks: Book[]

    if (editingBook) {
      updatedBooks = books.map((b) => (b.id === book.id ? book : b))
      setEditingBook(null)
    } else {
      updatedBooks = [...books, { ...book, id: Date.now().toString() }]
    }

    setBooks(updatedBooks)
    storage.set("books", updatedBooks)
    setShowForm(false)
  }

  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setShowForm(true)
  }

  const handleDeleteBook = (id: string) => {
    const updatedBooks = books.filter((book) => book.id !== id)
    setBooks(updatedBooks)
    storage.set("books", updatedBooks)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Books Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Book
        </Button>
      </div>

      {showForm && (
        <BookForm
          onSubmit={handleAddBook}
          onCancel={() => {
            setShowForm(false)
            setEditingBook(null)
          }}
          initialData={editingBook}
        />
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, author or genre..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[180px]">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoaded ? (
        <BookList books={filteredBooks} onEdit={handleEditBook} onDelete={handleDeleteBook} />
      ) : (
        <div className="text-center p-6">Loading books...</div>
      )}
    </div>
  )
}
