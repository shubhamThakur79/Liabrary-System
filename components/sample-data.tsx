"use client"

import { useEffect } from "react"
import storage from "@/lib/storage"
import type { Book } from "@/types/book"
import type { User } from "@/types/user"
import type { Transaction } from "@/types/transaction"

// Sample CS books
const sampleBooks: Book[] = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    genre: "Computer Science",
    status: "Available",
    issuedTo: null,
  },
  {
    id: "2",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    genre: "Computer Science",
    status: "Available",
    issuedTo: null,
  },
  {
    id: "3",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    genre: "Computer Science",
    status: "Available",
    issuedTo: null,
  },
  {
    id: "4",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    genre: "Computer Science",
    status: "Available",
    issuedTo: null,
  },
  {
    id: "5",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    genre: "Computer Science",
    status: "Available",
    issuedTo: null,
  },
  {
    id: "6",
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum, David J. Wetherall",
    genre: "Computer Science",
    status: "Available",
    issuedTo: null,
  },
  {
    id: "7",
    title: "Operating System Concepts",
    author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
    genre: "Computer Science",
    status: "Available",
    issuedTo: null,
  },
  {
    id: "8",
    title: "Database System Concepts",
    author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
    genre: "Computer Science",
    status: "Available",
    issuedTo: null,
  },
  {
    id: "9",
    title: "Computer Organization and Design",
    author: "David A. Patterson, John L. Hennessy",
    genre: "Computer Science",
    status: "Available",
    issuedTo: null,
  },
  {
    id: "10",
    title: "Data Structures and Algorithms in Java",
    author: "Robert Lafore",
    genre: "Computer Science",
    status: "Available",
    issuedTo: null,
  },
]

// Sample Indian users
const sampleUsers: User[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "9876543210",
    address: "123 MG Road, Bangalore",
    issuedBooks: [],
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "8765432109",
    address: "456 Park Street, Mumbai",
    issuedBooks: [],
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit.patel@example.com",
    phone: "7654321098",
    address: "789 Gandhi Road, Ahmedabad",
    issuedBooks: [],
  },
  {
    id: "4",
    name: "Sunita Verma",
    email: "sunita.verma@example.com",
    phone: "6543210987",
    address: "234 Nehru Place, Delhi",
    issuedBooks: [],
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "5432109876",
    address: "567 Civil Lines, Jaipur",
    issuedBooks: [],
  },
  {
    id: "6",
    name: "Ananya Desai",
    email: "ananya.desai@example.com",
    phone: "4321098765",
    address: "890 Lake Road, Pune",
    issuedBooks: [],
  },
  {
    id: "7",
    name: "Rahul Gupta",
    email: "rahul.gupta@example.com",
    phone: "3210987654",
    address: "123 Sector 17, Chandigarh",
    issuedBooks: [],
  },
]

// Sample transactions
const sampleTransactions: Transaction[] = []

export function SampleDataLoader() {
  useEffect(() => {
    // Only load sample data if no data exists
    const existingBooks = storage.get<Book[]>("books", [])
    const existingUsers = storage.get<User[]>("users", [])
    const existingTransactions = storage.get<Transaction[]>("transactions", [])

    if (existingBooks.length === 0) {
      storage.set("books", sampleBooks)
    }

    if (existingUsers.length === 0) {
      storage.set("users", sampleUsers)
    }

    if (existingTransactions.length === 0) {
      storage.set("transactions", sampleTransactions)
    }
  }, [])

  return null
}
