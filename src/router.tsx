import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { Home as HomeCustomer } from './pages/customer/home'
import { Tickets } from './pages/business/tickets/tickets'
import { Tickets as TicketsCustomer } from './pages/customer/tickets'
import { Dashboard } from './pages/business/dashboard'
import { Login } from './pages/login'
import { LoginCustomer } from './pages/customer/login'
import { useAuthStore } from './store/useAuthStore'
import { BUSINESS_OWNER, CUSTOMER } from './types/profile'
import { LoginByToken } from './pages/customer/login-by-token'
import { Landing } from './pages/landing/landing'

const CustomerRoute = () => {
  const { isLoggedIn, profile } = useAuthStore()
  return isLoggedIn && profile?.role === CUSTOMER ? (
    <Outlet />
  ) : (
    <Navigate to='/usuario/login' />
  )
}

const BusinessOwnerRoute = () => {
  const { isLoggedIn, profile } = useAuthStore()
  return isLoggedIn && profile?.role === BUSINESS_OWNER ? (
    <Outlet />
  ) : (
    <Navigate to='/login' />
  )
}

const RootRedirect = () => {
  const { isLoggedIn, profile } = useAuthStore()
  if (!isLoggedIn) return <Landing />
  if (profile?.role === BUSINESS_OWNER)
    return <Navigate to='/estabelecimento' />
  if (profile?.role === CUSTOMER) return <Navigate to='/usuario' />
  return <Navigate to='/login' />
}

export const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<RootRedirect />} />
      <Route element={<BusinessOwnerRoute />}>
        <Route path='/estabelecimento' element={<Home />} />
        <Route path='/estabelecimento/dashboard' element={<Dashboard />} />
        <Route path='/estabelecimento/tickets' element={<Tickets />} />
      </Route>
      <Route element={<CustomerRoute />}>
        <Route path='/usuario' element={<HomeCustomer />} />
        <Route path='/usuario/tickets' element={<TicketsCustomer />} />
      </Route>
      <Route path='login' element={<Login />} />
      <Route path='/usuario/login' element={<LoginCustomer />} />
      <Route path='/usuario/login/token/:token' element={<LoginByToken />} />
    </Routes>
  )
}
