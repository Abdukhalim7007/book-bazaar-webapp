import type { Book, Category } from '@/types'

export const featuredBooks: Book[] = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, coverImageUrl: 'https://placehold.co/200x280/e5e7eb/6b7280?text=Cover+1', rating: 4.8 },
  { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 14.5, coverImageUrl: 'https://placehold.co/200x280/e5e7eb/6b7280?text=Cover+2', rating: 5.0 },
  { id: '3', title: '1984', author: 'George Orwell', price: 11.99, coverImageUrl: 'https://placehold.co/200x280/e5e7eb/6b7280?text=Cover+3', rating: 4.6 },
  { id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', price: 9.99, coverImageUrl: 'https://placehold.co/200x280/e5e7eb/6b7280?text=Cover+4', rating: 4.9 },
  { id: '5', title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 13.25, coverImageUrl: 'https://placehold.co/200x280/e5e7eb/6b7280?text=Cover+5', rating: 4.5 },
  { id: '6', title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling', price: 15.0, coverImageUrl: 'https://placehold.co/200x280/e5e7eb/6b7280?text=Cover+6', rating: 5.0 },
]

export const bestSellers: Book[] = [
  { id: '7', title: 'Short Summer Read', author: 'Jane Doe', price: 680, coverImageUrl: 'https://placehold.co/200x280/e5e7eb/6b7280?text=Sale', rating: 5.0, sale: true },
  { id: '8', title: 'Bluetooth Speaker', author: 'Tech Author', price: 80, coverImageUrl: 'https://placehold.co/200x280/e5e7eb/6b7280?text=Book+8', rating: 4.6 },
  { id: '9', title: 'Classic Novel', author: 'Classic Author', price: 24.99, coverImageUrl: 'https://placehold.co/200x280/e5e7eb/6b7280?text=Book+9', rating: 4.7 },
  { id: '10', title: 'Modern Fiction', author: 'New Writer', price: 18.5, coverImageUrl: 'https://placehold.co/200x280/e5e7eb/6b7280?text=Book+10', rating: 4.4 },
]

export const newArrivals: Book[] = [
  { id: '11', title: 'Fire-Boltt Phoenix Smart Watch Guide', author: 'Tech Writer', price: 150, coverImageUrl: 'https://placehold.co/120x160/e5e7eb/6b7280?text=New+1', rating: 4.8 },
  { id: '12', title: 'All-in-One PC 12th Gen Intel Core i5', author: 'Hardware Co', price: 850, coverImageUrl: 'https://placehold.co/120x160/e5e7eb/6b7280?text=New+2', rating: 4.6 },
  { id: '13', title: 'Western Dresses for Women', author: 'Fashion Author', price: 80, coverImageUrl: 'https://placehold.co/120x160/e5e7eb/6b7280?text=New+3', rating: 4.9 },
  { id: '14', title: "Girl's Alloy Rose Gold Pendant", author: 'Gift Author', price: 450, coverImageUrl: 'https://placehold.co/120x160/e5e7eb/6b7280?text=New+4', rating: 5.0 },
]

export const categories: Category[] = [
  { id: '1', name: 'Fantastika', slug: 'fantastika', itemCount: 0, imageUrl: '' },
  { id: '2', name: 'Romantika', slug: 'romantika', itemCount: 0, imageUrl: '' },
  { id: '3', name: 'Detektiv', slug: 'detektiv', itemCount: 0, imageUrl: '' },
  { id: '4', name: 'Ilmiy', slug: 'ilmiy', itemCount: 0, imageUrl: '' },
  { id: '5', name: "O'z-o'zini rivojlantirish", slug: 'rivojlantirish', itemCount: 0, imageUrl: '' },
  { id: '6', name: 'Tarix', slug: 'tarix', itemCount: 0, imageUrl: '' },
]
