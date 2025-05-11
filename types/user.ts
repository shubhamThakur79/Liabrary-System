export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  issuedBooks: Array<{
    bookId: string
    issueDate: string
    dueDate: string
  }>
}
