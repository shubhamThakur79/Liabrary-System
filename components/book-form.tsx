"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Book } from "@/types/book"

interface BookFormProps {
  onSubmit: (book: Book) => void
  onCancel: () => void
  initialData?: Book | null
}

const genres = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Romance",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Children",
  "Young Adult",
  "Poetry",
  "Other",
]

export function BookForm({ onSubmit, onCancel, initialData }: BookFormProps) {
  const [formData, setFormData] = useState<Book>({
    id: initialData?.id || "",
    title: initialData?.title || "",
    author: initialData?.author || "",
    genre: initialData?.genre || "",
    status: initialData?.status || "Available",
    issuedTo: initialData?.issuedTo || null,
  })

  const handleChange = (field: keyof Book, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Book title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Author name"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => handleChange("genre", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
                disabled={initialData?.status === "Issued"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Issued" disabled={!initialData?.issuedTo}>
                    Issued
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? "Update Book" : "Add Book"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
