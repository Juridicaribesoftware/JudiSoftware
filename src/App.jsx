import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from './pages'
import { Landing } from "./pages/landing"
import { Dashboard } from "./pages/dashboard"
import ProtectedRoute from './components/ProtectedRoute'

import Ayuda from "./pages/ayuda"
import { useEffect, useState } from "react"
import Axios from "./hooks/useAxios"
function App() {
  const [unique, setUnique] = useState([])
  const [loader, setLoader] = useState(false)
  useEffect(() => {
    setLoader(true)
    Axios('GET', 'casos/unique', null)
      .then(res => {
        setUnique(res.data)
        setLoader(false)
      })
  }, [])
  return (
    <>
      <BrowserRouter>
        {
          loader ? (
            <>
              <div className="loader-container"><p>Cargando Recursos</p><div className="loader"></div></div>
              
            </>
          ) : (
            <div className="contenedor">
              <Routes>
                <Route index element={<Landing />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/ayuda" element={<Ayuda />} />
                <Route element={<ProtectedRoute />} >
                  <Route path="/home" element={<Home  unique = {unique}/>} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
              </Routes>
            </div>
          )
        }



      </BrowserRouter>
    </>
  )
}




export default App