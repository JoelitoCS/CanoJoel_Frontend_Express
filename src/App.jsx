import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CarritoProvider } from './context/CarritoContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import DetalleProducto from './pages/DetalleProducto'
import Carrito from './pages/Carrito'
import Perfil from './pages/Perfil'
import MisPedidos from './pages/MisPedidos'
import Admin from './pages/Admin'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CarritoProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/producto/:tipo/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CarritoProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
