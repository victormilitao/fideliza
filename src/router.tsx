import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { Tickets } from './pages/tickets'
import { Login } from './pages/login'
import { LoginCustomer } from './pages/customer/login'

export const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />

      <Route path='/estabelecimento'>
        <Route path='login' element={<Login />} />
        <Route path='tickets' element={<Tickets />} />
      </Route>

      <Route path='/consumidor'>
        <Route path='login' element={<LoginCustomer />} />
      </Route>
    </Routes>
  )
}
