import { useState, useEffect } from 'react'
import Modal from 'react-modal'
import './modal.css';  // Asegúrate de importar los estilos
import Axios from '../hooks/useAxios'
import { saveAs } from 'file-saver'
import ExcelJS from 'exceljs'

Modal.setAppElement('#root'); // Asegúrate de que el elemento raíz esté configurado

const FieldSelectorModal = ({ isOpen, onRequestClose, casos, mostrar, cuantos, proceso, cliente, area, centroTrabajo, abogado, claseDeProceso, ciudad, fechaFin, unique }) => {
    const [selectedFields, setSelectedFields] = useState([]);
    const [availableFields, setAvailableFields] = useState([]);
    const [filtroDescarga, setFiltroDescarga] = useState('')
    const [loader, setLoader] = useState(false)
    const [porcentaje, setPorcentaje] = useState(0)
    const [casosDescargados, setCasosDescargados] = useState(0)
    // Mapa de encabezados personalizados a las claves de los datos
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


    // Obtener los nombres de los encabezados personalizados (los que el usuario verá)
    useEffect(() => {
        const fields = Object.keys(fieldMap);
        setAvailableFields(fields);
        setSelectedFields(fields); // Inicializa con todos los campos seleccionados
    }, []);

    const handleFieldChange = (event) => {
        const field = event.target.value;
        setSelectedFields((prevFields) =>
            prevFields.includes(field)
                ? prevFields.filter((f) => f !== field) // Si ya está seleccionado, se quita
                : [...prevFields, field] // Si no está seleccionado, se añade
        );
    }

    const exportToExcel = (data, headers, keys) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Procesos');

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


    const handleSave = () => {
        // Convertir los encabezados seleccionados en las claves reales de los datos
        const selectedDataFields = selectedFields.map(field => fieldMap[field]);

        // Determinar qué datos exportar
        const dataToExport = cuantos ? casos : mostrar;

        // Validar los encabezados y los datos seleccionados antes de exportar
        console.log('Campos seleccionados (encabezados):', selectedFields);
        console.log('Campos seleccionados (claves reales):', selectedDataFields);
        //console.log('Datos a exportar:', dataToExport);
        if (filtroDescarga === '') {
            Swal.fire({
                title: "Oops...",
                text: "Seleccione Tipo de Descarga",
                icon: "question"
            });
        } else {
            Swal.fire({
                title: 'Por favor, revise y confirme que los detalles de la descarga sean correctos.',
                html: `
                    <p style='text-align: left;' ><strong>Tipo a descargar:</strong> ${filtroDescarga === '1' ? 'Coincidencias' : filtroDescarga === '2' ? 'Filtro Personalizado' : filtroDescarga === '3' ? 'Todos los casos' : 'No especificado'}</p>
                    ${filtroDescarga === '1' ?
                        '<p style="text-align: left;" ><strong>Buscar Coincidencias de: </strong>' + proceso + '</p>' :
                        filtroDescarga === '2' ?
                            '<p style="text-align: left;" ><strong>Buscar filtro personalizado: </strong><p/>' + '<ul style="text-align: left;" ><li><strong> Cliente: </strong>' + (unique.clientes.find(client => client._id === cliente)?.nombre || 'No especificado') + '</li><li><strong> Área: </strong>' + area + '</li><li><strong> Centro de Trabajo: </strong>' + centroTrabajo + '</li><li><strong> Abogado a Cargo: </strong>' + (unique.abogadosACargo.find(client => client._id === abogado)?.nombre || 'No especificado') + '</li><li><strong> Clase de Proceso: </strong>' + claseDeProceso + '</li><li><strong> Ciudad: </strong></li><li><strong> Fecha de terminacion: </strong></li></ul>' :
                            filtroDescarga === '3' ? '' : ''} 
    
                    <p style='text-align: left;'><strong>Columnas a Descargar:</strong></p>
                    <ul>
                    ${selectedFields.map(field => `<li style='text-align: left;'>${field}</li>`).join('')}
                    </ul>
                `,
                icon: "warning",
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonColor: "#3085d6",
                denyButtonColor: '#3085d6',
                cancelButtonColor: "#d33",
                confirmButtonText: "Descargar Consulta",
                denyButtonText: `Más Información`
            }).then(async (result) => {
                if (result.isConfirmed) {
                    if (filtroDescarga === '1') {
                        let page = 1;
                        const limit = 100;
                        let allCasos = [];
                        let moreDataAvailable = true;
                        setLoader(true)
                        while (moreDataAvailable) {
                            await Axios('POST', `casos/descargarcoincidencias?page=${page}&limit=${limit}&coincidencias=${proceso}`, {  selectedDataFields })
                                .then(res => {
                                    console.log(res)

                                    if (res.data.casos.length > 0) {
                                        allCasos = allCasos.concat(res.data.casos)
                                        page += 1
                                        setCasosDescargados(allCasos.length)
                                        setPorcentaje((allCasos.length / res.data.totalCasos) * 100)

                                    } else {
                                        moreDataAvailable = false
                                    }

                                })
                                .catch(err => {
                                    console.log(err)
                                    moreDataAvailable = false
                                })
                        }
                        console.log(allCasos)
                        setLoader(false)
                        exportToExcel(allCasos, selectedFields, selectedDataFields)
                        setCasosDescargados(0)
                        setPorcentaje(0)
                    } else if (filtroDescarga === '2') {
                        let data = {}
                        if (cliente) data.cliente = cliente;
                        if (area) data.area = area;
                        if (centroTrabajo) data.centroDeTrabajo = centroTrabajo;
                        if (abogado) data.abogadoACargo = abogado;
                        if (claseDeProceso) data.claseDeProceso = claseDeProceso;
                        if (ciudad) data.ciudad = ciudad;
                        if (fechaFin) data.fechaDeTerminacion = fechaFin;
                        console.log(data)
                        let page = 1;
                        const limit = 200;
                        let allCasos = [];
                        let moreDataAvailable = true;
                        setLoader(true)
                        while (moreDataAvailable) {
                            await Axios('POST', `casos/descargar?page=${page}&limit=${limit}`, { data, selectedDataFields })
                                .then(res => {
                                    console.log(res)

                                    if (res.data.casos.length > 0) {
                                        allCasos = allCasos.concat(res.data.casos)
                                        page += 1
                                        setCasosDescargados(allCasos.length)
                                        setPorcentaje((allCasos.length / res.data.total) * 100)

                                    } else {
                                        moreDataAvailable = false
                                    }

                                })
                                .catch(err => {
                                    console.log(err)
                                    moreDataAvailable = false
                                })
                        }

                        console.log(allCasos)
                        setLoader(false)
                        exportToExcel(allCasos, selectedFields, selectedDataFields)
                        setCasosDescargados(0)
                        setPorcentaje(0)
                    } else if (filtroDescarga === '3') {
                        const data = {}
                        let page = 1;
                        const limit = 200;
                        let allCasos = [];
                        let moreDataAvailable = true;
                        setLoader(true)
                        while (moreDataAvailable) {
                            await Axios('POST', `casos/descargar?page=${page}&limit=${limit}`, { data, selectedDataFields })
                                .then(res => {
                                    console.log(res)

                                    if (res.data.casos.length > 0) {
                                        allCasos = allCasos.concat(res.data.casos)
                                        page += 1
                                        setCasosDescargados(allCasos.length)
                                        setPorcentaje((allCasos.length / res.data.total) * 100)

                                    } else {
                                        moreDataAvailable = false
                                    }

                                })
                                .catch(err => {
                                    console.log(err)
                                    moreDataAvailable = false
                                })
                        }

                        console.log(allCasos)
                        setLoader(false)
                        exportToExcel(allCasos, selectedFields, selectedDataFields)
                        setCasosDescargados(0)
                        setPorcentaje(0)
                    }
                } else if (result.isDenied) {
                    window.location.href = '/mas-informacion-descarga.html'
                }
            })
        }



        // Aquí llamarías a la función exportToExcel
        // exportToExcel(dataToExport, selectedDataFields); // Descomentar cuando los datos sean correctos

        //onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Select Fields"
            className="modal"
            overlayClassName="overlay"
        >
            {

                loader ? (

                    <>
                        <div className="loader-container">
                            <span className="loader"></span>
                        </div>
                        <p className='center-text'>Descargando... </p>
                        <p className='center-text'>Casos descargados: {casosDescargados} ({porcentaje.toFixed(2)}%)</p>
                    </>

                ) : (
                    <>
                        <h2>Selectione Columnas a Descargar</h2>
                        <select name="filtro" value={filtroDescarga} onChange={(e) => setFiltroDescarga(e.target.value)} id="" className='excel-button'>
                            <option value="">Selecionar tipo de descarga</option>
                            <option value="1">Ultima consulta en la barra de coincidencias</option>
                            <option value="2">Ultima consulta en Filtro Personalizado</option>
                            <option value="3">Descargar Todos los Casos</option>
                        </select>
                        <br /><br />
                        <form>
                            {availableFields.map((field) => (
                                <div key={field}>
                                    <input
                                        type="checkbox"
                                        className='input-sele'
                                        id={field}
                                        value={field}
                                        checked={selectedFields.includes(field)} // Control del estado del checkbox
                                        onChange={handleFieldChange}
                                    />
                                    <label htmlFor={field}>{field}</label>
                                </div>
                            ))}

                        </form>
                        <br />

                        <button className="excel-button" onClick={handleSave}>
                            Descargar
                        </button>
                        <button className="excel-button" onClick={onRequestClose}>
                            Cancelar
                        </button>
                    </>
                )
            }

        </Modal>
    );
};

export default FieldSelectorModal;
