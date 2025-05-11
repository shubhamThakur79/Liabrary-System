export interface Book {
  id: string
  title: string
  author: string
  genre: string
  status: "Available" | "Issued"
  issuedTo: string | null
}
