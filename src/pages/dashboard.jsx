import Axios from '../hooks/useAxios';
import Navigation from '../navigation';
import './dash.css';
import { useState } from 'react';

export const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [loader, setLoader] = useState(false);
    const [dragging, setDragging] = useState(false); // Nuevo estado para manejar el arrastre
    const [totales, setTotales] = useState(0); // Ejemplo de progreso total
    const [valor, setValor] = useState(0); // Ejemplo de progreso actual
    const [porcentaje, setPorcentaje] = useState(0); // Ejemplo de porcentaje
    const [correctos, setCorrectos] = useState(0)
    const [incorrectos, setIncorrectos] = useState(0)

    // Maneja el archivo seleccionado o arrastrado
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        e.target.value = null; // Limpiar el input después de seleccionar el archivo
    };

    // Simula la importación de archivos
    const handleImport = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        console.log('entrando')
        setLoader(true)
        setCorrectos(0)
        setIncorrectos(0)
        setValor(0)
        setPorcentaje(0)
        Axios('POSTFILE', 'casos/agregarexcel', formData)
            .then(res => {
                let numeroCasos = ''
                for (let index = 0; index < res.data.casos.length; index++) {
                    numeroCasos = numeroCasos + ' | ' + (res.data.casos[index].numero ? res.data.casos[index].numero : 'N/A')
                }
                Swal.fire({
                    title: res.data.message,
                    text: 'Casos Mapeados validos para el ingreso a la base datos Judisoftware ' + 'Casos Totales Entontrados: ' + res.data.casos.length + ' \n----->\n' + numeroCasos,
                    icon: "warning",
                    showCancelButton: true,
                    showDenyButton: true,
                    confirmButtonColor: "#3085d6",
                    denyButtonColor: '#3085d6',
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Ingresas Casos",
                    denyButtonText: `Mas Información`
                }).then(async (result) => {
                    let casoGuardado = ''
                    if (result.isConfirmed) {
                        setTotales(res.data.casos.length);
                        setLoader(true);

                        // Usamos un bucle for..of con async/await para manejar las promesas secuencialmente
                        for (let index = 0; index < res.data.casos.length; index++) {
                            try {


                                // Espera a que la llamada Axios se complete antes de continuar
                                const response = await Axios('POST', 'casos/crear', res.data.casos[index]);
                                casoGuardado += ' | ' + response.data.numero;
                                console.log(response.data);
                                setValor(index + 1);
                                setPorcentaje(((index + 1) / res.data.casos.length) * 100);
                                // Actualiza el estado de correctos
                                setCorrectos((prevCorrectos) => prevCorrectos + 1);
                            } catch (err) {
                                console.log(err);

                                // Actualiza el estado de incorrectos
                                setIncorrectos((prevIncorrectos) => prevIncorrectos + 1);
                            }
                        }

                        // Desactiva el loader después de que todas las operaciones hayan terminado
                        setLoader(false);

                    } else if (result.isDenied) {
                        window.location.href = '/mas-informacion.html'

                    }
                })
                setLoader(false)
            })
            .catch(err => {
                console.log(err)
                setLoader(false)
                Swal.fire({
                    title: "<strong>Verifica la hoja de Excel</strong>",
                    icon: "warning",
                    html: `
                        <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
                            <p style="font-size: 16px; color: #333; text-align: center;">
                                
                                ${err.response.data.message}
                            </p>
                            <img src="/errorProcesosEcxel.png" alt="Imagen de error" width='500px' style="margin-bottom: 20px;" />
                            <a href="/mas-informacion.html" style="text-decoration: none;">
                                <button style="
                                    background-color: #007bff; 
                                    color: white; 
                                    border: none; 
                                    border-radius: 4px; 
                                    padding: 10px 20px; 
                                    font-size: 16px; 
                                    cursor: pointer; 
                                    margin-top: 10px;
                                ">
                                    Más Información
                                </button>
                            </a>
                        </div>
                    `,
                    showCloseButton: true,
                    showCancelButton: false,
                    focusConfirm: false,
                    confirmButtonText: 'Entendido',
                });

            })
    };

    // Maneja el arrastre del archivo sobre el contenedor
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    // Cuando el archivo sale del área de arrastre
    const handleDragLeave = () => {
        setDragging(false);
    };

    // Maneja el evento cuando se suelta el archivo en el contenedor
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
    };

    return (
        <div className="dashboard-container">
            <Navigation />
            <div
                className={`upload-container ${dragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="upload-box">
                    <label htmlFor="file-upload" className="upload-label">
                        <input
                            id="file-upload"
                            type="file"
                            accept=".xlsx"
                            onChange={handleFileChange}
                        />
                        <div className="upload-icon">⬆️</div>
                        {file ? (
                            <p className="upload-text">Archivo Cargado: {file.name}</p>
                        ) : (
                            <p className="upload-text">
                                Arrastra y suelta archivos de excel
                            </p>
                        )}
                        {file && (
                            <>
                                {loader ? (
                                    <>
                                        <div className="loader-container">
                                            <div className="loader"></div>
                                        </div>
                                        <h5>
                                            Total de Casos: <strong className='total'>{totales} </strong>
                                            Correctos: <strong className='corectos'>{correctos} </strong>
                                            Incorrectos: <strong className='incorrectos'>{incorrectos} </strong>
                                        </h5>
                                    </>
                                ) : (
                                    <button
                                        onClick={(e) => handleImport(e)}
                                        className="select-file-btn"
                                    >
                                        Importar
                                    </button>
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
