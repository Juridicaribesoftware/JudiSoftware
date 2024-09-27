import { useState, useEffect } from "react"
import './landing.css'
import Axios from "../hooks/useAxios"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import globales from '../hooks/useGlobales'
import CryptoJS from 'crypto-js'

export const Landing = () => {
    const [usuario, setUsuario] = useState(null)
    const [contraseña, setContraseña] = useState(null)
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        Axios('POST', 'login/validacion', null)
            .then((res) => {
                navigate('/home')
                document.cookie = `token-accses = ${CryptoJS.AES.encrypt(res.data.usuario, globales().SECRECT).toString()}; max-age=${60 * 1440}; path=/; samesite=strict`
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Ya estas Logueado con Usuario: " + res.data.user.usuario,
                    showConfirmButton: false,
                    timer: 3000
                })
            })
            .catch(err => {
                console.log(err.response)
            })
    },[navigate])


    const login = () => {
        setLoader(true)
        Axios('POST', 'login/autenticacion', { user: { usuario: usuario, contraseña: contraseña } })
            .then((res) => {
                console.log(res)
                Swal.fire({
                    title: "Acceso Valido",
                    text: "Usted a Ingresado Correctamente",
                    icon: "success"
                })
                document.cookie = `iv = ${res.data.resp.iv}; max-age=${60 * 1440}; path=/; samesite=strict`
                document.cookie = `encripted = ${res.data.resp.encripted}; max-age=${60 * 1440}; path=/; samesite=strict`
                navigate('/Home')
                setLoader(false)
            })
            .catch((err) => {
                console.log(err)
                Swal.fire({
                    title: err.response.data.message,
                    text: err.response.data.error,
                    icon: "warning"
                })
                setLoader(false)
            })

    }

    return (
        <div className="container">
            <section>
                <div className="signin">
                    <div className="content2">
                        <h2>Iniciar Sesión</h2>
                        <div className="form">
                            <div className="inputBox">
                                <input
                                    type="text"
                                    value={usuario || ''}
                                    onChange={(e) => setUsuario(e.target.value)}
                                    required
                                />
                                <i>Usuario</i>
                            </div>
                            <div className="inputBox">
                                <input
                                    type="password"
                                    value={contraseña || ''}
                                    onChange={(e) => setContraseña(e.target.value)}
                                    required
                                />
                                <i>Contraseña</i>
                            </div>
                            <div className="links">
                                <a href="/ayuda">¿Nesecitas Ayuda?</a>
                                <a href="#">Signup</a>
                            </div>
                            <div className="inputBox">
                                {loader ? (
                                    <div className="loader-container"><div className="loader"></div></div>

                                ) : (
                                    <input type="submit" value="Login" onClick={login} />

                                )
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
} 