import Navigation from '../navigation'
import './index.css'
import { useState, useEffect } from 'react'
import Axios from '../hooks/useAxios'
import CaseForm from '../components/caseForm'
import { useNavigate } from 'react-router-dom'
import useDebounce from '../hooks/useDebounce'
import FieldSelectorModal from '../components/modal'
import { saveAs } from 'file-saver'
import ExcelJS from 'exceljs'


export const Home = ({ unique }) => {

    //const arrys
    const [casos, setCasos] = useState([])

    //conts loader
    const [loader, setLoader] = useState(false)

    // const paginacion
    const [totalCasos, setTotalCasos] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const recordsPerPage = 5;

    //const para modals o fractmebtos ocultos
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [filtrar, setFiltrar] = useState(false)
    //CaseFrom props

    //Modal Pros
    const [cuantos, setCuantos] = useState(null)
    const [mostrar, setMostrar] = useState([])
    const [casoId, setCasoId] = useState({})


    const [user, setUser] = useState(localStorage.getItem('usuario'))
    //coincidencias
    const [proceso, setProceso] = useState('')

    //filtro avanzado
    const [cliente, setCliente] = useState('')
    const [area, setArea] = useState('')
    const [centroTrabajo, setCentroTrabajo] = useState('')
    const [abogado, setAbogado] = useState('')
    const [claseDeProceso, setClaseDeProceso] = useState('')
    const [ciudad, setCiudad] = useState('')
    const [fechaFin, setFechaFin] = useState('')

    //retraso paea la busqueda en la barra
    const debouncedProceso = useDebounce(proceso, 1000)
    const navigate = useNavigate()


    useEffect(() => {
        handleSearch(currentPage)
    }, [currentPage])

    //para la busqueda automatica
    useEffect(() => {
        if (debouncedProceso) {
            handleSearch(1)
            setCurrentPage(1)
        }
    }, [debouncedProceso]);

    //Abrir la seccion de filtrar
    const handleOpenFiltar = () => {
        setFiltrar(!filtrar)
    }

    const handleSearch = (currentPage) => {
        let data = {}
        if (filtrar) {
            setLoader(true)
            if (cliente) data.cliente = cliente;
            if (area) data.area = area;
            if (centroTrabajo) data.centroDeTrabajo = centroTrabajo;
            if (abogado) data.abogadoACargo = abogado;
            if (claseDeProceso) data.claseDeProceso = claseDeProceso;
            if (ciudad) data.ciudad = ciudad;
            if (fechaFin) data.fechaDeTerminacion = fechaFin;
            Axios('POST', `casos?page=${currentPage}&limit=${recordsPerPage}&coincidencias=${proceso}`, data)
                .then((res) => {

                    setCasos(res.data.data)
                    setTotalPages(res.data.totalPages)
                    setTotalCasos(res.data.totalCasos)
                    setLoader(false)
                })
                .catch((err) => {
                    console.log('Error al enviar:', err.response.data)
                    setLoader(false)
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
            setLoader(true)
            Axios('POST', `casos?page=${currentPage}&limit=${recordsPerPage}&coincidencias=${proceso}`, null)
                .then((res) => {

                    setCasos(res.data.data)
                    setTotalPages(res.data.totalPages)
                    setTotalCasos(res.data.totalCasos)
                    setLoader(false)
                })
                .catch((err) => {
                    console.log('Error al enviar:', err.response.data)
                    setLoader(false)
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
    const openForm = (casoId) => {
        setCasoId(casoId)
        setIsFormOpen(true)
    }

    const closeForm = () => {
        setIsFormOpen(false);
    }

    const exportToExcel = (data) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Procesos');
        const fieldMap = {
            "n°": "numero",
            "código": "codigo",
            "título": "titulo",
            "cliente": "cliente",
            "asunto": "asunto",
            "área": "area",
            "fecha de asignación": "fechaDeAsignacion",
            "centro de trabajo": "centroDeTrabajo",
            "director a cargo": "directorACargo",
            "abogado a cargo": "abogadoACargo",
            "abogado interno de la compañía": "abogadoInternoDeLaCompania",
            "número de siniestro": "siniestro",
            "fecha del siniestro": "fechaSiniestro",
            "póliza": "poliza",
            "ramo": "ramo",
            "amparo": "amparo",
            "número de aplicativo": "numeroAplicativo",
            "ciudad": "ciudad",
            "juzgado int": "juzgadoInt",
            "radicado": "radicado",
            "parte activa": "parteActiva",
            "parte pasiva": "partePasiva",
            "tipo de trámite": "tipoDeTramite",
            "clase de proceso": "claseDeProceso",
            "tipo de vinculación cliente": "tipoDeVinculacionCliente",
            "pretensiones en dinero": "pretensionesEnDinero",
            "calificación inicial contingencia": "calificacionInicialContingencia",
            "calificación actual contingencia": "calificacionActualContingencia",
            "motivo de la calificación": "motivoDeLaCalificacion",
            "fecha admisión/vinculación": "fechaAdmisionVinculacion",
            "fecha de notificación": "fechaDeNotificacion",
            "instancia": "instancia",
            "etapa procesal": "etapaProcesal",
            "clase de medida cautelar": "claseDeMedidaCautelar",
            "honorarios asignados": "honorariosAsignados",
            "autoridad de conocimiento": "autoridadDeConocimiento",
            "delito": "delito",
            "placa": "placa",
            "evento": "evento",
            "probabilidad de éxito": "probabilidadDeExito",
            "valor indemnizado cliente": "valorIndemnizadoCliente",
            "entidad afectada": "entidadAfectada",
            "fecha de pago cliente": "fechaDePagoCliente",
            "tipo contragarantía (pagaré/letra)": "tipoContragarantia",
            "monto de provisión": "montoDeProvision",
            "tipo de moneda": "tipoDeMoneda",
            "fecha de terminación": "fechaDeTerminacion",
            "motivo de terminación": "motivoDeTerminacion",
            "cliente 2": "cliente2",
            "fecha de asignación 2": "fechaDeAsignacion2",
            "abogado interno de la compañía 2": "abogadoInternoDeLaCompania2",
            "número de siniestro 2": "siniestro2",
            "número de aplicativo 2": "numeroDeAplicativo2",
            "fecha de notificación 2": "fechaDeNotificacion2",
            "se inició ejecutivo a continuación de ordinario": "seInicioEjecutivoAContinuacionDeOrdinario",
            "honorarios asignados 2": "honorariosAsignados2",
            "valor pagado": "valorPagado",
            "persona que realizó el pago": "personaQueRealizoElPago",
            "fecha de radicación de la contestación": "fechaDeRadicacionDeLaContestacion",
            "fecha de radicación de la contestación 2": "fechaDeRadicacionDeLaContestacion2",
            "departamento": "departamento",
            "asegurado": "asegurado",
            "jurisdicción": "jurisdiccion",
            "juzgado": "juzgado",
            "fecha última actuación": "fechaUltimaActuacion",
            "título última actuación": "tituloUltimaActuacion",
            "fecha que realizó el pago": "fechaQueRealizoElPago",
            "código interno": "codigoInterno"
        };

        const headers = Object.keys(fieldMap)
        const keys = Object.values(fieldMap)
        // Añadir encabezados
        const headerRow = worksheet.addRow(headers)
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF007BFF' }
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }, // Color blanco
                size: 12,
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.value = cell.value.toString().toUpperCase(); // Convertir a mayúsculas
        });
        // Añadir datos, excluyendo el _id
        data.forEach((row) => {
            // Crear un objeto que solo contiene los campos seleccionados sin el _id
            const rowData = keys.map(key => {
                // Verificar si el valor es un objeto y extraer el nombre si aplica
                const value = row[key];
                if (typeof value === 'object' && value !== null) {
                    if (key === 'cliente' || key === 'cliente2' || key === 'directorACargo' || key === 'abogadoACargo' || key === 'abogadoInternoDeLaCompania' || key === 'abogadoInternoDeLaCompania2' || key === 'juzgado' || key === 'juzgadoInt') {
                        return value.nombre || '';
                    }
                    if (key === 'siniestro' || key === 'siniestro2') {
                        return value.numero || '';
                    }
                }
                return value !== undefined ? value : '';
            });
            worksheet.addRow(rowData);
        });


        worksheet.columns.forEach((column) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const cellValueLength = cell.value ? cell.value.toString().length + 4 : 0;
                maxLength = Math.max(maxLength, cellValueLength);
            });
            column.width = maxLength + 2; // Añadir un margen de espacio
        });

        // Formatear como archivo Excel
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            saveAs(blob, 'casos.xlsx'); // Nombre del archivo que se descargará
        });
    };
    return (
        <>
            <div>
                <Navigation />
                {isFormOpen ? (
                    <CaseForm caseId={casoId} setCaso={setCasoId} cerrar={closeForm} user={user} casos={casos} setCasos={setCasos} />
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
                                    onChange={handleOpenFiltar}
                                />
                            </label>
                            <div>
                                <FieldSelectorModal
                                    isOpen={isModalOpen}
                                    onRequestClose={() => setIsModalOpen(false)}
                                    casos={casos}
                                    mostrar={mostrar}
                                    cuantos={cuantos}
                                    proceso={proceso}
                                    cliente={cliente}
                                    area={area}
                                    centroTrabajo={centroTrabajo}
                                    abogado={abogado}
                                    claseDeProceso={claseDeProceso}
                                    ciudad={ciudad}
                                    fechaFin={fechaFin}
                                    unique={unique}
                                />
                            </div>
                            <button className="search-button" onClick={() => {
                                setCurrentPage(1)
                                handleSearch(1)

                            }}>Buscar</button>
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
                                            {unique.clientes.map(client => (
                                                <option key={client._id} value={client._id}>{client.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Área:</label>
                                        <select value={area} onChange={(e) => setArea(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {unique.areas.map(are => (
                                                <option key={are} value={are}>{are}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Centro de trabajo:</label>
                                        <select value={centroTrabajo} onChange={(e) => setCentroTrabajo(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {unique.centrosDeTrabajo.map(are => (
                                                <option key={are} value={are}>{are}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Abogado a Cargo:</label>
                                        <select value={abogado} onChange={(e) => setAbogado(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {unique.abogadosACargo.map(usuario => (
                                                <option key={usuario._id} value={usuario._id}> {usuario.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Clase de Proceso:</label>
                                        <select value={claseDeProceso} onChange={(e) => setClaseDeProceso(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {unique.clasesDeProceso.map(are => (
                                                <option key={are} value={are}>{are}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Ciudad</label>
                                        <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {unique.ciudades.map(are => (
                                                <option key={are} value={are}>{are}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label>Fecha de terminacion:</label>
                                        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="table-wrapper">
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>N°</th>
                                            <th>Titulo</th>
                                            <th>Cliente</th>
                                            <th>Area</th>
                                            <th>Centro De Trabajo</th>
                                            <th>Abogado A Cargo</th>
                                            <th>Opciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            loader ? (
                                                <tr>
                                                    <td colSpan="7">
                                                        <div className="loader-container">
                                                            <span className="loader"></span>
                                                        </div>
                                                    </td>
                                                </tr>

                                            ) : (

                                                casos.map((caso, index) => (
                                                    <tr key={index}>
                                                        <td>{caso.numero ? caso.numero : 'No disponible'}</td>
                                                        <td>{caso.titulo ? caso.titulo : 'No disponible'}</td>
                                                        <td>{caso.cliente ? caso.cliente.nombre : 'No disponible'}</td>
                                                        <td>{caso.area ? caso.area : 'No disponible'}</td>
                                                        <td>{caso.centroDeTrabajo ? caso.centroDeTrabajo : 'No disponible'}</td>
                                                        <td>{caso.abogadoACargo ? caso.abogadoACargo.nombre : 'No disponible'}</td>
                                                        <td>
                                                            <div className='conten-btn'>
                                                                <button className='btn-g' onClick={() => openForm(caso)}><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfd8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                                    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                                                                </svg></button>
                                                                <button className='btn-g' onClick={() => {
                                                                    Swal.fire({
                                                                        title: 'Descargando...',
                                                                        text: 'Por favor espera mientras descargamos los datos.',
                                                                        icon: 'info',
                                                                        allowOutsideClick: false,
                                                                        showConfirmButton: false,
                                                                        didOpen: () => {
                                                                            Swal.showLoading(); // Muestra el spinner de carga
                                                                        },
                                                                    });
                                                                    Axios('GET', `casos/${caso._id}`, null)
                                                                        .then(res => {
                                                                            Swal.close();
                                                                            exportToExcel([res.data.caso])
                                                                            Swal.fire({
                                                                                title: 'Completado',
                                                                                text: 'La descarga se ha completado con éxito.',
                                                                                icon: 'success',
                                                                                confirmButtonText: 'Aceptar',
                                                                            });
                                                                        })
                                                                        .catch(err => {
                                                                            Swal.close();

                                                                            // Mostrar un mensaje de error
                                                                            Swal.fire({
                                                                                title: 'Error',
                                                                                text: 'Hubo un problema al descargar los datos.',
                                                                                icon: 'error',
                                                                                confirmButtonText: 'Aceptar',
                                                                            });

                                                                            console.log(err)
                                                                        })
                                                                }}><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-download" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfd8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                                                        <path d="M7 11l5 5l5 -5" />
                                                                        <path d="M12 4l0 12" />
                                                                    </svg></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))

                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination">
                                <button
                                    className={`page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                    &laquo; Anterior
                                </button>
                                <span className="page-item active">
                                    Página {currentPage} de {totalPages}
                                </span>
                                <span className="page-item active">
                                    {totalCasos}
                                </span>
                                <button
                                    className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                    Siguiente &raquo;
                                </button>
                            </div>

                        </div>




                    </div>
                )}

            </div>
        </>
    )
}
