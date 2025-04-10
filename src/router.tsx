import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { Tickets } from './pages/tickets'
import { Login } from './pages/login'
import { LoginCustomer } from './pages/customer/login'
import { useAuthStore } from './store/useAuthStore'

export const PrivateRoute = () => {
  const { isLoggedIn } = useAuthStore()

  return isLoggedIn ? <Outlet /> : <Navigate to='/login' />
}

export const Router = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path='/' element={<Home />} />
      </Route>

      <Route path='login' element={<Login />} />
      <Route path='/estabelecimento' element={<PrivateRoute />}>
        <Route path='tickets' element={<Tickets />} />
      </Route>

      <Route path='/usuario/login' element={<LoginCustomer />} />
      <Route path='/usuario'></Route>
    </Routes>
  )
}
