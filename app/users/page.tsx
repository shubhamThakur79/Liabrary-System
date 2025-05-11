"use client"

import { useState, useEffect } from "react"
import { UserList } from "@/components/user-list"
import { UserForm } from "@/components/user-form"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import storage from "@/lib/storage"
import type { User } from "@/types/user"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = storage.get<User[]>("users", [])
    setUsers(storedUsers)
    setIsLoaded(true)
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = (user: User) => {
    let updatedUsers: User[]

    if (editingUser) {
      updatedUsers = users.map((u) => (u.id === user.id ? user : u))
      setEditingUser(null)
    } else {
      updatedUsers = [...users, { ...user, id: Date.now().toString(), issuedBooks: [] }]
    }

    setUsers(updatedUsers)
    storage.set("users", updatedUsers)
    setShowForm(false)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleDeleteUser = (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id)
    setUsers(updatedUsers)
    storage.set("users", updatedUsers)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      {showForm && (
        <UserForm
          onSubmit={handleAddUser}
          onCancel={() => {
            setShowForm(false)
            setEditingUser(null)
          }}
          initialData={editingUser}
        />
      )}

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoaded ? (
        <UserList users={filteredUsers} onEdit={handleEditUser} onDelete={handleDeleteUser} />
      ) : (
        <div className="text-center p-6">Loading users...</div>
      )}
    </div>
  )
}
