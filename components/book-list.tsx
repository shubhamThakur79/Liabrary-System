"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Info } from "lucide-react"
import type { Book } from "@/types/book"

interface BookListProps {
  books: Book[]
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
}

export function BookList({ books, onEdit, onDelete }: BookListProps) {
  const [expandedBook, setExpandedBook] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedBook(expandedBook === id ? null : id)
  }

  if (books.length === 0) {
    return (
      <Card className="text-center p-6">
        <CardContent>
          <p className="text-muted-foreground py-4">No books found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden transition-all duration-200 hover:shadow-md card">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-2">
                <CardTitle className="line-clamp-1 text-base sm:text-lg">{book.title}</CardTitle>
                <CardDescription className="line-clamp-1 text-xs sm:text-sm">{book.author}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(book)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(book.id)}
                    className="text-destructive focus:text-destructive"
                    disabled={book.status === "Issued"}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={book.status === "Available" ? "outline" : "secondary"}>{book.status}</Badge>
              <Badge variant="outline">{book.genre}</Badge>
            </div>
            {book.status === "Issued" && <p className="text-xs text-muted-foreground">Currently issued to a user</p>}
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start p-0 h-8 text-xs text-muted-foreground"
              onClick={() => toggleExpand(book.id)}
            >
              <Info className="h-3 w-3 mr-1" />
              {expandedBook === book.id ? "Show less" : "Show more"}
            </Button>
          </CardFooter>
          {expandedBook === book.id && (
            <div className="px-6 pb-4 text-xs">
              <p className="text-muted-foreground mb-1">
                <span className="font-medium">ID:</span> {book.id}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Full Title:</span> {book.title}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
