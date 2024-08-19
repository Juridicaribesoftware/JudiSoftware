
import Navigation from '../navigation'
import './dash.css';
import ExcelJS from 'exceljs'
import Axios from '../hooks/useAxios'
import { useState } from 'react';
export const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [loader, setLoader] = useState(false)
    const [porcentaje, setPorcentaje] = useState(0)
    const [totales, setTotales] = useState(0)
    const [valor, setValor] = useState(0)
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        e.target.value = null;
    };
    const handleImport = async () => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const buffer = e.target.result;
            const workbook = new ExcelJS.Workbook();
            if (!buffer) {
                console.error('Buffer is undefined or null');
                Swal.fire({
                    title: "¡Atención!",
                    text: "Verifique en el archivo que desea importar, contenga información y este bien estructurado",
                    icon: "warning"
                })
                setPorcentaje(0)
                setValor(0)
                setTotales(0)
                setFile(false)
                return;
            }
            try {
                await workbook.xlsx.load(buffer);
            } catch (error) {
                console.error('Error loading workbook:', error);
                Swal.fire({
                    title: "¡Atención!",
                    text: "No se pudo cargar el archivo. Verifica que sea un archivo Excel válido.",
                    icon: "warning"
                })
                setPorcentaje(0)
                setValor(0)
                setTotales(0)
                setFile(false)
                return;
            }

            await workbook.xlsx.load(buffer);

            const worksheet = workbook.getWorksheet('Procesos'); // Asegúrate que el nombre coincida con la hoja en Excel
            const rows = [];
            if (!worksheet) {
                console.error('Worksheet not found!');
                Swal.fire({
                    title: "¡Atención!",
                    text: "Verifique en el archivo que desea importar, la hoja de excel se llame Literelmante 'Procesos'",
                    icon: "warning"
                })
                setPorcentaje(0)
                setValor(0)
                setTotales(0)
                setFile(false)
                return;
            }
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Saltar la fila de encabezados

                const normalizeValue = (value) => {
                    if (value === "" || value === "N/A") return null; 
                    return value;
                };
                const rowData = {
                    numero: normalizeValue(row.getCell(1).value),
                    codigo: normalizeValue(row.getCell(2).value),
                    titulo: normalizeValue(row.getCell(3).value),
                    cliente: { nombre: normalizeValue(row.getCell(4).value) },
                    asunto: normalizeValue(row.getCell(5).value),
                    area: normalizeValue(row.getCell(6).value),
                    fechaDeAsignacion: normalizeValue(row.getCell(7).value),
                    centroDeTrabajo: normalizeValue(row.getCell(8).value),
                    directorACargo: { nombre: normalizeValue(row.getCell(9).value) },
                    abogadoACargo: { nombre: normalizeValue(row.getCell(10).value) },
                    abogadoInternoDeLaCompania: { nombre: normalizeValue(row.getCell(11).value) },
                    siniestro: { numero: normalizeValue(row.getCell(12).value) },
                    fechaSiniestro: normalizeValue(row.getCell(13).value),
                    poliza: normalizeValue(row.getCell(14).value),
                    ramo: normalizeValue(row.getCell(15).value),
                    amparo: normalizeValue(row.getCell(16).value),
                    numeroAplicativo: normalizeValue(row.getCell(17).value),
                    ciudad: normalizeValue(row.getCell(18).value),
                    juzgadoInt: { nombre: normalizeValue(row.getCell(19).value) },
                    radicado: normalizeValue(row.getCell(20).value),
                    parteActiva: normalizeValue(row.getCell(21).value),
                    partePasiva: normalizeValue(row.getCell(22).value),
                    tipoDeTramite: normalizeValue(row.getCell(23).value),
                    claseDeProceso: normalizeValue(row.getCell(24).value),
                    tipoDeVinculacionCliente: normalizeValue(row.getCell(25).value),
                    pretensionesEnDinero: normalizeValue(row.getCell(26).value),
                    calificacionInicialContingencia: normalizeValue(row.getCell(27).value),
                    calificacionActualContingencia: normalizeValue(row.getCell(28).value),
                    motivoDeLaCalificacion: normalizeValue(row.getCell(29).value),
                    fechaAdmisionVinculacion: normalizeValue(row.getCell(30).value),
                    fechaDeNotificacion: normalizeValue(row.getCell(31).value),
                    instancia: normalizeValue(row.getCell(32).value),
                    etapaProcesal: normalizeValue(row.getCell(33).value),
                    claseDeMedidaCautelar: normalizeValue(row.getCell(34).value),
                    honorariosAsignados: normalizeValue(row.getCell(35).value),
                    autoridadDeConocimiento: normalizeValue(row.getCell(36).value),
                    delito: normalizeValue(row.getCell(37).value),
                    placa: normalizeValue(row.getCell(38).value),
                    evento: normalizeValue(row.getCell(39).value),
                    probabilidadDeExito: normalizeValue(row.getCell(40).value),
                    valorIndemnizadoCliente: normalizeValue(row.getCell(41).value),
                    entidadAfectada: normalizeValue(row.getCell(42).value),
                    fechaDePagoCliente: normalizeValue(row.getCell(43).value),
                    tipoContragarantia: normalizeValue(row.getCell(44).value),
                    montoDeProvision: normalizeValue(row.getCell(45).value),
                    tipoDeMoneda: normalizeValue(row.getCell(46).value),
                    fechaDeTerminacion: normalizeValue(row.getCell(47).value),
                    motivoDeTerminacion: normalizeValue(row.getCell(48).value),
                    cliente2: { nombre: normalizeValue(row.getCell(49).value) },
                    fechaDeAsignacion2: normalizeValue(row.getCell(50).value),
                    abogadoInternoDeLaCompania2: { nombre: normalizeValue(row.getCell(51).value) },
                    siniestro2: { numero: normalizeValue(row.getCell(52).value) },
                    numeroDeAplicativo2: normalizeValue(row.getCell(53).value),
                    fechaDeNotificacion2: normalizeValue(row.getCell(54).value),
                    seInicioEjecutivoAContinuacionDeOrdinario: normalizeValue(row.getCell(55).value),
                    honorariosAsignados2: normalizeValue(row.getCell(56).value),
                    valorPagado: normalizeValue(row.getCell(57).value),
                    personaQueRealizoElPago: normalizeValue(row.getCell(58).value),
                    fechaDeRadicacionDeLaContestacion: normalizeValue(row.getCell(59).value),
                    fechaDeRadicacionDeLaContestacion2: normalizeValue(row.getCell(60).value),
                    departamento: normalizeValue(row.getCell(62).value),
                    asegurado: normalizeValue(row.getCell(63).value),
                    jurisdiccion: normalizeValue(row.getCell(64).value),
                    juzgado: { nombre: normalizeValue(row.getCell(64).value) },
                    fechaUltimaActuacion: new Date(row.getCell(65).value).toLocaleDateString('es-ES'),
                    tituloUltimaActuacion: normalizeValue(row.getCell(66).value)
                };
                rows.push(rowData);
            });

            const largo = rows.length - 1
            setTotales(rows.length)
            console.log(rows)
            if (rows.length < 1) {
                console.error('No data found in the worksheet!');
                Swal.fire({
                    title: "¡Atención!",
                    text: "El archivo Excel no contiene datos. Asegúrate de que la hoja de Excel llamada 'Procesos' tenga información.",
                    icon: "warning"
                });
                setPorcentaje(0);
                setValor(0);
                setTotales(0);
                setFile(false);
                return;
            }
            setLoader(true)
            for (let i = 0; i < rows.length; i++) {
                console.log(rows[i])
                try {
                    const res = await Axios('POST', 'casos/crear', rows[i]);
                    console.log(`Caso ${i + 1} agregado:`, res.data);
                    setPorcentaje(((i + 1) / (largo + 1)) * 100)
                    setValor(i + 1)
                    if (i == largo) {
                        Swal.fire({
                            title: "Importación Finalizada",
                            text: "Listo",
                            icon: "success"
                        })
                        setPorcentaje(0)
                        setValor(0)
                        setTotales(0)
                        setFile(false)


                    }
                    // Puedes mostrar una notificación por cada caso
                } catch (err) {
                    console.error(`Error al agregar caso ${i + 1}:`, err);
                    // Puedes manejar errores individuales aquí
                    Swal.fire({
                        title: `Error en el caso ${i + 1}`,
                        text: err.message,
                        icon: "error"
                    });
                }
                if (i == largo) setLoader(false)
            }
        };
        reader.readAsArrayBuffer(file);
    };
    return (
        <div className="dashboard-container">
            <Navigation />
            <div className="upload-container">
                <div className="upload-box">
                    <input id="file-upload" type="file" accept=".xlsx" onChange={handleFileChange} />
                    <label htmlFor="file-upload" className="upload-label">
                        <div className="upload-icon">⬆️</div>
                        {file ? (
                            <>
                                <p className="upload-text">Archivo Cargado</p>
                            </>
                        ) : (
                            <p className="upload-text">Arrastra y suelta archivos de excel</p>
                        )}
                        {file && (
                            <>
                                {loader ? (
                                    <div className="loader-container">
                                        <div className="loader"></div>
                                    </div>
                                ) : (
                                    <button onClick={handleImport} className='select-file-btn'>Importar</button>
                                )}
                            </>
                        )}
                    </label>

                </div>
            </div>
            {file && (
                <>
                    <progress id="file" max={totales} value={valor}></progress>
                    <div className="progress-text">{porcentaje}%</div>
                </>
            )}
        </div>
    );
};
