import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { Tickets } from './pages/tickets'
import { Login } from './pages/login'
import { LoginCustomer } from './pages/customer/login'
import { useAuthStore } from './store/useAuthStore'

const CustomerRoute = () => {
  const { isLoggedIn, profile } = useAuthStore()
  return isLoggedIn && profile?.role === 'customer' ? (
    <Outlet />
  ) : (
    <Navigate to='/usuario/login' />
  )
}

const BusinessOwnerRoute = () => {
  const { isLoggedIn, profile } = useAuthStore()
  return isLoggedIn && profile?.role === 'business_owner' ? (
    <Outlet />
  ) : (
    <Navigate to='/login' />
  )
}

export const Router = () => {
  return (
    <Routes>
      <Route element={<BusinessOwnerRoute />}>
        <Route path='/' element={<Home />} />
        <Route path='/estabelecimento/tickets' element={<Tickets />} />
      </Route>

      <Route element={<CustomerRoute />}>
        <Route path='/usuario' />
      </Route>

      <Route path='login' element={<Login />} />
      <Route path='/usuario/login' element={<LoginCustomer />} />
    </Routes>
  )
}
