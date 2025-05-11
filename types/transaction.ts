export interface Transaction {
  id: string
  bookId: string
  userId: string
  type: "issue" | "return"
  date: string
  dueDate?: string
}
