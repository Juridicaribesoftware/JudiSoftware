import Navigation from '../navigation'
import './index.css'
import { useState, useEffect } from 'react'
import Axios from '../hooks/useAxios'
import CaseForm from '../components/caseForm'
import { useNavigate } from 'react-router-dom'
import exportToExcel from '../hooks/useDescargarExcel'
import useDebounce from '../hooks/useDebounce'
import FieldSelectorModal from '../components/modal'
export const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFields, setSelectedFields] = useState([]);
    const allFields = [
        'numero', 'codigo', 'titulo', 'cliente.nombre', 'asunto', 'area', 'fechaDeAsignacion',
        'centroDeTrabajo', 'directorACargo.nombre', 'abogadoACargo.nombre', 'abogadoInternoDeLaCompania.nombre',
        'siniestro.numero', 'fechaSiniestro', 'poliza', 'ramo', 'amparo', 'numeroAplicativo', 'ciudad',
        'juzgadoInt.nombre', 'radicado', 'parteActiva', 'partePasiva', 'tipoDeTramite', 'claseDeProceso',
        'tipoDeVinculacionCliente', 'pretensionesEnDinero', 'calificacionInicialContingencia',
        'calificacionActualContingencia', 'motivoDeLaCalificacion', 'fechaAdmisionVinculacion',
        'fechaDeNotificacion', 'instancia', 'etapaProcesal', 'claseDeMedidaCautelar', 'honorariosAsignados',
        'autoridadDeConocimiento', 'delito', 'placa', 'evento', 'probabilidadDeExito', 'valorIndemnizadoCliente',
        'entidadAfectada', 'fechaDePagoCliente', 'tipoContragarantia', 'montoDeProvision', 'tipoDeMoneda',
        'fechaDeTerminacion', 'motivoDeTerminacion', 'cliente2', 'fechaDeAsignacion2',
        'abogadoInternoDeLaCompania2', 'siniestro2.numero', 'numeroDeAplicativo2', 'fechaDeNotificacion2',
        'seInicioEjecutivoAContinuacionDeOrdinario', 'honorariosAsignados2', 'valorPagado',
        'personaQueRealizoElPago', 'fechaDeRadicacionDeLaContestacion', 'fechaDeRadicacionDeLaContestacion2',
        'departamento', 'asegurado', 'jurisdiccion', 'juzgado.nombre', 'fechaUltimaActuacion',
        'tituloUltimaActuacion'
    ];
    const [user, setUser] = useState(localStorage.getItem('usuario'))
    const [casos, setCasos] = useState([])
    const [filtrar, setFiltrar] = useState(false)
    const [proceso, setProceso] = useState('')
    const [cliente, setCliente] = useState('')
    const [area, setArea] = useState('')
    const [centroTrabajo, setCentroTrabajo] = useState('')
    const [centroTrabajos, setCentroTrabajos] = useState('')
    const [abogado, setAbogado] = useState('')
    const [abogadocs, setAbogadocs] = useState('')
    const [claseDeProceso, setClaseDeProceso] = useState('')
    const [claseDeProcesos, setClaseDeProcesos] = useState('')
    const [ciudad, setCiudad] = useState('')
    const [ciudades, setCiudades] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const [clientes, setClientes] = useState('')
    const [areas, setAreas] = useState([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [caso, setCaso] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const casesPerPage = 5
    const [loader, setLoader] = useState(true)
    const debouncedProceso = useDebounce(proceso, 600)
    const [cuantos, setCuantos] = useState(null)
    const [mostrar , setMostrar]= useState([])
    const navigate = useNavigate()
    useEffect(() => {
        Axios('GET', 'casos/', null)
            .then((res) => {
                const casosInverted = res.data.reverse(); // Invierte los datos aquí
                setCasos(casosInverted);
                setAreas(getUnique(res.data, 'area'))
                setCentroTrabajos(getUnique(res.data, 'centroDeTrabajo'))
                setClientes(getUnique(res.data, 'cliente'))
                setAbogadocs(getUnique(res.data, 'abogadoACargo'))
                setClaseDeProcesos(getUnique(res.data, 'claseDeProceso'))
                setCiudades(getUnique(res.data, 'ciudad'))
                setLoader(false)
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])
    useEffect(() => {
        if (debouncedProceso) {
            handleSearch();
        }
    }, [debouncedProceso]);
    const getUnique = (array, key) => {
        return array.reduce((acc, item) => {
            const value = item[key];

            // Si el valor es un objeto, compara por _id
            if (typeof value === 'object' && value !== null) {
                if (!acc.find(obj => obj._id === value._id)) {
                    acc.push(value);
                }
            }
            // Si el valor es una cadena, verifica directamente
            else if (typeof value === 'string') {
                if (!acc.includes(value)) {
                    acc.push(value);
                }
            }

            return acc;
        }, []);
    }
    const indexOfLastCase = currentPage * casesPerPage
    const indexOfFirstCase = indexOfLastCase - casesPerPage
    const currentCases = casos.slice(indexOfFirstCase, indexOfLastCase)

    const totalPages = Math.ceil(casos.length / casesPerPage)

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleCheckboxChange = (e) => {
        setFiltrar(e.target.checked)
    }
    const handleSearch = () => {
        setLoader(true)
        let data = {}


        if (filtrar) {
            if (cliente) data.cliente = cliente;
            if (area) data.area = area;
            if (centroTrabajo) data.centroTrabajo = centroTrabajo;
            if (abogado) data.abogadoACargo = abogado;
            if (claseDeProceso) data.claseDeProceso = claseDeProceso;
            if (ciudad) data.ciudad = ciudad;
            if (fechaFin) data.fechaDeTerminacion = fechaFin;

            Axios('POST', 'casos/caso', data)
                .then((res) => {
                    setCasos(res.data)
                    setLoader(false)
                })
                .catch((err) => {
                    console.log('Error al enviar:', err.response.data)
                    if (err.response.data.message == 'Acceso Denegado') {
                        navigate('/')
                        Swal.fire({
                            title: "Acceso Restringido (Token Vencido - Invalido), Inicie Sesión",
                            text: err.response.data.message,
                            icon: "warning"
                        })
                    }
                })
        } else {

            Axios('POST', 'casos/casoAll', proceso)
                .then((res) => {
                    
                    setCasos(res.data)
                    setLoader(false)
                })
                .catch((err) => {
                    console.log('Error al enviar:', err.response.data)
                    if (err.response.data.message == 'Acceso Denegado') {
                        navigate('/')
                        Swal.fire({
                            title: "Acceso Restringido (Token Vencido - Invalido), Inicie Sesión",
                            text: err.response.data.message,
                            icon: "warning"
                        })
                    }
                })

        }

    }
    const openForm = (casoV) => {
        setCaso(casoV)
        setIsFormOpen(true)
    }

    const closeForm = () => {
        setIsFormOpen(false);
    }
    return (
        <>
            <div>
                <Navigation />
                {isFormOpen ? (
                    <CaseForm caseData={caso}  setCaso = {setCaso} cerrar={closeForm} user={user}  casos ={casos}  setCasos = {setCasos}/>
                ) : (
                    <div className="containerp">

                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Buscar coincidencias..."
                                className="search-bar"
                                value={proceso}
                                onChange={(e) => setProceso(e.target.value)}
                            />
                            <label>
                                Filtro personalizado
                                <input
                                    type="checkbox"
                                    checked={filtrar}
                                    onChange={handleCheckboxChange}
                                />
                            </label>
                            <div>
                                <FieldSelectorModal
                                    isOpen={isModalOpen}
                                    onRequestClose={() => setIsModalOpen(false)}
                                    fields={allFields}
                                    onSelectFields={setSelectedFields}
                                    casos={casos}
                                    mostrar = {mostrar}
                                    cuantos={cuantos}
                                />
                            </div>
                            <button className="search-button" onClick={handleSearch}>Buscar</button>
                            <button onClick={() => {
                                setIsModalOpen(true)
                                setCuantos(true)
                            }} className="excel-button">Descargar Excel</button>
                        </div>
                        {filtrar && (
                            <div id="custom-filter-container" className="custom-filter-container">
                                <div className="filter-form">
                                    <h2>Filtro personalizado</h2>
                                    <div className="form-row">
                                        <label>Cliente:</label>
                                        <select value={cliente} onChange={(e) => setCliente(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {clientes.map(client => (
                                                <option key={client._id} value={client._id}>{client.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Área:</label>
                                        <select value={area} onChange={(e) => setArea(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {areas.map(are => (
                                                <option key={are} value={are}>{are}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Centro de trabajo:</label>
                                        <select value={centroTrabajo} onChange={(e) => setCentroTrabajo(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {centroTrabajos.map(are => (
                                                <option key={are} value={are}>{are}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Abogado a Cargo:</label>
                                        <select value={abogado} onChange={(e) => setAbogado(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {abogadocs.map(usuario => (
                                                <option key={usuario._id} value={usuario._id}> {usuario.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Clase de Proceso:</label>
                                        <select value={claseDeProceso} onChange={(e) => setClaseDeProceso(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {claseDeProcesos.map(are => (
                                                <option key={are} value={are}>{are}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Ciudad</label>
                                        <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {ciudades.map(are => (
                                                <option key={are} value={are}>{are}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Fecha de terminación:</label>
                                        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {loader ? (
                            <div className="loader-container"><div className="loader"></div></div>

                        ) : (
                            <div className="table-wrapper">
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th>TÍtulo</th>
                                                <th>Cliente</th>
                                                <th>Área</th>
                                                <th>Centro De Trabajo</th>
                                                <th>Abogado A Cargo</th>
                                                <th>Opciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentCases.map((caso, index) => (
                                                <tr key={index}>
                                                    <td>{caso.numero ? caso.numero : 'No disponible'}</td>
                                                    <td>{caso.titulo ? caso.titulo : 'No disponible'}</td>
                                                    <td>{caso.cliente.nombre ? caso.cliente.nombre : 'No disponible'}</td>
                                                    <td>{caso.area ? caso.area : 'No disponible'}</td>
                                                    <td>{caso.centroDeTrabajo ? caso.centroDeTrabajo : 'No disponible'}</td>
                                                    <td>{caso.abogadoACargo.nombre ? caso.abogadoACargo.nombre : 'No disponible'}</td>
                                                    <td>
                                                        <div className='conten-btn'>
                                                            <button className='btn-g' onClick={() => openForm(caso)}><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfd8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                                                            </svg></button>
                                                            <button className='btn-g' onClick={() => {
                                                                setIsModalOpen(true)
                                                                setCuantos(false)
                                                                setMostrar([caso])
                                                            }}><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-download" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfd8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                                                    <path d="M7 11l5 5l5 -5" />
                                                                    <path d="M12 4l0 12" />
                                                                </svg></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="pagination">
                                    <button
                                        onClick={handlePrevious}
                                        className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        &laquo; Anterior
                                    </button>
                                    <span className="page-item active">
                                        {currentPage}
                                    </span>
                                    <button
                                        onClick={handleNext}
                                        className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        Siguiente &raquo;
                                    </button>
                                </div>
                            </div>
                        )
                        }

                    </div>
                )}

            </div>
        </>
    )
}
