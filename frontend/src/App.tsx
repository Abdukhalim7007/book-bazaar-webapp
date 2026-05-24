import { Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/contexts/CartContext'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import BookList from '@/pages/BookList'
import BookDetail from '@/pages/BookDetail'
import { CartPage } from '@/pages/CartPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SearchPage } from '@/pages/SearchPage'
import { WishlistPage } from '@/pages/WishlistPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { OrderDetailPage } from '@/pages/OrderDetailPage'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="books" element={<BookList />} />
          <Route path="books/:id" element={<BookDetail />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default App
