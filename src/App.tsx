import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './router'
import { Toaster } from './components/ui/sonner'
import { useHotjar } from './utils/useHotjar'

function App() {
  useHotjar()
  return (
    <BrowserRouter>
      <Router />
      <Toaster />
    </BrowserRouter>
  )
}

export default App
