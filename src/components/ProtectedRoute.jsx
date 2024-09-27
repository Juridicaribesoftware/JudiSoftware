import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Axios from '../hooks/useAxios'
import Swal from "sweetalert2"
import globales from '../hooks/useGlobales'
import CryptoJS from 'crypto-js'
const ProtectedRoute = () => {
    const navigate = useNavigate()
    useEffect(()=>{
        tokenA()
      },[])
    const tokenA = () => {
        Axios('POST', 'login/validacion', null)
            .then((res) => {
                navigate('/home')
                document.cookie = `token-accses = ${CryptoJS.AES.encrypt(res.data.usuario, globales().SECRECT).toString()}; max-age=${60 * 1440}; path=/; samesite=strict`

            })
            .catch(err => {
                navigate('/')
                Swal.fire({
                    title: "Acceso Restringido (Token Vencido - Invalido), Inicie Sesión",
                    text: err.response.data.message,
                    icon: "warning"
                })
            })
    }
    return <Outlet />
}


export default ProtectedRoute