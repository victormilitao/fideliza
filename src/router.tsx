import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import Login from './pages/login'
import { Tickets } from './pages/tickets'

export const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/tickets' element={<Tickets />} />
    </Routes>
  )
}
