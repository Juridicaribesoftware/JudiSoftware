import { useState } from "react";
import Axios from '../hooks/useAxios'
import './comentarios.css'
const Comentarios = ({ caso, setCasos, setCaso }) => {
    const [comentarios, setComentarios] = useState(caso.comentarios || []);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [loading, setLoading] = useState(false);



    const handleAddComentario = async () => {
        if (nuevoComentario.trim() === '') return;

        try {
            const fechaActual = new Date();
            let horas = fechaActual.getHours();
            const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
            const segundos = fechaActual.getSeconds().toString().padStart(2, '0');
            const amPm = horas >= 12 ? 'PM' : 'AM';
            
            const dia = fechaActual.getDate().toString().padStart(2, '0');
            const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0
            const año = fechaActual.getFullYear();
            horas = horas % 12;
            horas = horas ? horas : 12; // El '0' se convierte en '12'

            const horaActual = `${horas}:${minutos}:${segundos} ${amPm}`;
            const fecha = `${dia}/${mes}/${año}`;
            
            const caseData = {
                comentarios: [
                    {
                        texto: nuevoComentario,
                        fecha: fecha,
                        usuario: localStorage.getItem('usuario'),
                        hora: horaActual
                    }
                ]
            }
            Axios('POST', `casos/actualizar/${caso._id}/`,caseData)
            .then(res => {
                console.log(res)
                setComentarios(res.data.caso.comentarios)
                setCaso(res.data.caso)
                setCasos(res.data.casos)
                

            })
            .catch(err => {
                console.log(err)
            })

        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComentario = async (id) => {
        try {
            Axios('DELETE', `casos/${caso._id}/comentarios/${id}`)
            .then(res => {
                console.log(res.data.casos)
                setCasos(res.data.casos)
                setComentarios(res.data.caso.comentarios)
                setCaso(res.data.caso)
            })
            .catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="comentarios-container">
            <h3 className="comentarios-header">Comentarios</h3>
            {loading ? <p>Cargando comentarios...</p> : (
                <>
                    <ul className="comentario-list">
                        {comentarios.map(comentario => (
                            <li className="comentario-item" key={comentario._id}>
                                <div className="comentario-header">
                                    <div className="comentario-date-time">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfd8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                        </svg> {comentario.usuario}


                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-week" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfd8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                                            <path d="M16 3v4" />
                                            <path d="M8 3v4" />
                                            <path d="M4 11h16" />
                                            <path d="M8 14v4" />
                                            <path d="M12 14v4" />
                                            <path d="M16 14v4" />
                                        </svg> {comentario.fecha}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-clock-hour-4" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfd8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                            <path d="M12 12l3 2" />
                                            <path d="M12 7v5" />
                                        </svg> {comentario.hora}
                                    </div>
                                </div>
                                <p className="comentario-text">{comentario.texto}</p>
                                <button className="comentario-button" onClick={() => handleDeleteComentario(comentario._id)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>

                    <div className="input-container ">
                        <textarea
                            type="text"
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            placeholder="Agregar un nuevo comentario"
                        ></textarea>
                        <button className="excel-button" onClick={handleAddComentario}>Agregar Comentario</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Comentarios;
