"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, BookOpen, Phone, Mail } from "lucide-react"
import type { User } from "@/types/user"
import storage from "@/lib/storage"
import type { Book } from "@/types/book"

interface UserListProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: string) => void
}

export function UserList({ users, onEdit, onDelete }: UserListProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [expandedUser, setExpandedUser] = useState<string | null>(null)

  useEffect(() => {
    const storedBooks = storage.get<Book[]>("books", [])
    setBooks(storedBooks)
  }, [])

  const toggleExpand = (id: string) => {
    setExpandedUser(expandedUser === id ? null : id)
  }

  const getUserBooks = (user: User) => {
    return user.issuedBooks.map((issuedBook) => {
      const book = books.find((b) => b.id === issuedBook.bookId)
      return {
        ...issuedBook,
        title: book?.title || "Unknown Book",
        author: book?.author || "Unknown Author",
      }
    })
  }

  if (users.length === 0) {
    return (
      <Card className="text-center p-6">
        <CardContent>
          <p className="text-muted-foreground py-4">No users found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => {
        const userBooks = getUserBooks(user)

        return (
          <Card key={user.id} className="overflow-hidden transition-all duration-200 hover:shadow-md card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                  <CardTitle className="line-clamp-1 text-base sm:text-lg">{user.name}</CardTitle>
                  <CardDescription className="line-clamp-1 text-xs sm:text-sm flex items-center">
                    <Mail className="h-3 w-3 mr-1 inline" />
                    {user.email}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user.id)}
                      className="text-destructive focus:text-destructive"
                      disabled={userBooks.length > 0}
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
                <Badge variant="outline">
                  {userBooks.length} {userBooks.length === 1 ? "Book" : "Books"} Issued
                </Badge>
              </div>
              {user.phone && (
                <p className="text-xs text-muted-foreground flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {user.phone}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-0">
              {expandedUser === user.id && (
                <div className="w-full mb-2 space-y-2">
                  {user.address && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Address:</span> {user.address}
                    </p>
                  )}

                  {userBooks.length > 0 && (
                    <>
                      <p className="text-xs font-medium">Issued Books:</p>
                      <ul className="text-xs space-y-1">
                        {userBooks.map((book, index) => (
                          <li key={index} className="flex items-center">
                            <BookOpen className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="line-clamp-1">{book.title}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start p-0 h-8 text-xs text-muted-foreground"
                onClick={() => toggleExpand(user.id)}
              >
                {expandedUser === user.id ? "Show less" : "Show more"}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
