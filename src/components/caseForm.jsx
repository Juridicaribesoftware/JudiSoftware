import { useState } from 'react';
import './caseForm.css'; // Estilos CSS externos
import Axios from '../hooks/useAxios'
import { useNavigate } from 'react-router-dom';
import Comentarios from './comentarios';
const CaseForm = ({ caseData, setCaso, cerrar, user, casos, setCasos }) => {
    const [formData, setFormData] = useState(caseData || {});
    const [userd, setUserd] = useState(user);
    const [mostrarComentarios, setMostrarComentarios] = useState(false)
    const navigate = useNavigate()

    // Función para obtener el valor del campo o un mensaje predeterminado
    const getFieldValue = (field) => {
        return formData[field] ? formData[field] : 'No disponible';
    };

    // Función para manejar la validación de campos anidados
    const getNestedFieldValue = (field, nestedField) => {
        return formData[field] && formData[field][nestedField] ? formData[field][nestedField] : 'No disponible';
    };

    const eliminarCaso = (casoId) => {
        try {
            Axios('DELETE', `casos/eliminar/${casoId}`)
                .then(res => {
                    console.log('caso eliminado', res)
                    Swal.fire({
                        title: "Caso Eliminado Con Exito",
                        text: res.data._id,
                        icon: "success"
                    })
                    const casosActualizados = casos.filter(caso => caso._id !== casoId)
                    setCasos(casosActualizados)
                    cerrar()
                })
                .catch(err => {
                    console.log(err, 'problemas')
                    if (err.response.data.message == 'Acceso Denegado') {
                        navigate('/')
                        Swal.fire({
                            title: "Acceso Restringido (Token Vencido - Invalido), Inicie Sesión",
                            text: err.response.data.message,
                            icon: "warning"
                        })
                    } else {
                        Swal.fire({
                            title: "Caso No Eliminado",
                            text: '',
                            icon: "error"
                        })
                    }

                })
        } catch (error) {
            console.log(error, 'problemas al eliminar el caso')
            Swal.fire({
                title: "Caso No Eliminado",
                text: error,
                icon: "error"
            })
        }


    }

    return (
        <div className='conte'>
            <div className="form-container">
                <div>
                    <button className='cerrar' onClick={() => cerrar()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-left" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00abfb" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 12l14 0" />
                            <path d="M5 12l6 6" />
                            <path d="M5 12l6 -6" />
                        </svg>
                    </button>
                    {user === 'admin' && (
                        <>
                            <button onClick={() => eliminarCaso(formData._id)} className='cerrar'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfd8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M4 7l16 0" />
                                    <path d="M10 11l0 6" />
                                    <path d="M14 11l0 6" />
                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                </svg>
                            </button>
                            {
                                mostrarComentarios ? (
                                    <button onClick={() => setMostrarComentarios(false)} className='cerrar'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-arrow-up" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfd8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                            <path d="M12 8l-4 4" />
                                            <path d="M12 8v8" />
                                            <path d="M16 12l-4 -4" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button onClick={() => setMostrarComentarios(true)} className='cerrar'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-arrow-down" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00bfd8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                            <path d="M8 12l4 4" />
                                            <path d="M12 8v8" />
                                            <path d="M16 12l-4 4" />
                                        </svg>
                                    </button>
                                )
                            }

                        </>
                    )}
                </div>
                {

                    mostrarComentarios && (<Comentarios caso={caseData} setCaso = {setCaso} setCasos={setCasos} />)
                }
                <h1 className="form-title">INFORMACION DEL CASO</h1>
                <br />
                <br />
                <br />
                <br />
                <form className="case-form">
                    <div className="form-group">
                        <label htmlFor="numero">NUMERO</label>
                        <label htmlFor="numero">{getFieldValue('numero')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="codigo">CODIGO</label>
                        <label htmlFor="codigo">{getFieldValue('codigo')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="titulo">TITULO</label>
                        <label htmlFor="titulo">{getFieldValue('titulo')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cliente">CLIENTE</label>
                        <label htmlFor="cliente">{getNestedFieldValue('cliente', 'nombre')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="asunto">ASUNTO</label>
                        <label htmlFor="asunto">{getFieldValue('asunto')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="area">AREA</label>
                        <label htmlFor="area">{getFieldValue('area')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaDeAsignacion">FECHA DE ASIGNACION</label>
                        <label htmlFor="fechaDeAsignacion">{getFieldValue('fechaDeAsignacion')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="centroDeTrabajo">CENTRO DE TRABAJO</label>
                        <label htmlFor="centroDeTrabajo">{getFieldValue('centroDeTrabajo')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="directorACargo">DIRECTOR A CARGO</label>
                        <label htmlFor="directorACargo">{getNestedFieldValue('directorACargo', 'nombre')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="abogadoACargo">ABOGADO A CARGO</label>
                        <label htmlFor="abogadoACargo">{getNestedFieldValue('abogadoACargo', 'nombre')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="abogadoInternoDeLaCompania">ABOGADO INTERNO DE LA COMPAÑIA</label>
                        <label htmlFor="abogadoInternoDeLaCompania">{getNestedFieldValue('abogadoInternoDeLaCompania', 'nombre')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="siniestro">SINIESTRO</label>
                        <label htmlFor="siniestro">{getNestedFieldValue('siniestro', 'numero')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaSiniestro">FECHA DE SINIESTRO</label>
                        <label htmlFor="fechaSiniestro">{getFieldValue('fechaSiniestro')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="poliza">POLIZA</label>
                        <label htmlFor="poliza">{getFieldValue('poliza')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ramo">RAMO</label>
                        <label htmlFor="ramo">{getFieldValue('ramo')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="amparo">AMPARO</label>
                        <label htmlFor="amparo">{getFieldValue('amparo')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="numeroAplicativo">NUMERO DE APLICATIVO</label>
                        <label htmlFor="numeroAplicativo">{getFieldValue('numeroAplicativo')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ciudad">CIUDAD</label>
                        <label htmlFor="ciudad">{getFieldValue('ciudad')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="juzgadoInt">JUZGADO INT</label>
                        <label htmlFor="juzgadoInt">{getNestedFieldValue('juzgadoInt', 'nombre')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="radicado">RADICADO</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="parteActiva">PARTE ACTIVA</label>
                        <label htmlFor="parteActiva">{getFieldValue('parteActiva')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipoDeTramite">TIPO DE TRÁMITE</label>
                        <label htmlFor="tipoDeTramite">{getFieldValue('tipoDeTramite')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor=" claseDeProceso">CLASE DE PROCESO</label>
                        <label htmlFor=" claseDeProceso">{getFieldValue(' claseDeProceso')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipoDeVinculacionCliente">TIPO DE VINCULACIÓN CLIENTE</label>
                        <label htmlFor="tipoDeVinculacionCliente">{getFieldValue('tipoDeVinculacionCliente')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor=" pretensionesEnDinero">PRETENSIONES EN DINERO</label>
                        <label htmlFor=" pretensionesEnDinero">{getFieldValue(' pretensionesEnDinero')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="calificacionInicialContingencia">CALIFICACIÓN INICIAL CONTINGENCIA</label>
                        <label htmlFor="calificacionInicialContingencia">{getFieldValue('calificacionInicialContingencia')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="calificacionActualContingencia">CALIFICACIÓN ACTUAL CONTINGENCIA</label>
                        <label htmlFor="calificacionActualContingencia">{getFieldValue('calificacionActualContingencia')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="motivoDeLaCalificacion">MOTIVO DE LA CALIFICACIÓN</label>
                        <label htmlFor="motivoDeLaCalificacion">{getFieldValue('motivoDeLaCalificacion')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaAdmisionVinculacion">FECHA ADMISIÓN/VINCULACIÓN</label>
                        <label htmlFor="fechaAdmisionVinculacion">{getFieldValue('fechaAdmisionVinculacion')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaDeNotificacion">FECHA DE NOTIFICACIÓN</label>
                        <label htmlFor="fechaDeNotificacion">{getFieldValue('fechaDeNotificacion')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="instancia">INSTANCIA</label>
                        <label htmlFor="instancia">{getFieldValue('instancia')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="etapaProcesal">ETAPA PROCESAL</label>
                        <label htmlFor="etapaProcesal">{getFieldValue('etapaProcesal')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="claseDeMedidaCautelar">CLASE DE MEDIDA CAUTELAR</label>
                        <label htmlFor="claseDeMedidaCautelar">{getFieldValue('claseDeMedidaCautelar')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="honorariosAsignados">HONORARIOS ASIGNADOS</label>
                        <label htmlFor="honorariosAsignados">{getFieldValue('honorariosAsignados')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="autoridadDeConocimiento">AUTORIDAD DE CONOCIMIENTO</label>
                        <label htmlFor="autoridadDeConocimiento">{getFieldValue('autoridadDeConocimiento')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="delito">DELITO</label>
                        <label htmlFor="delito">{getFieldValue('delito')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="placa">PLACA</label>
                        <label htmlFor="placa">{getFieldValue('placa')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="evento">EVENTO</label>
                        <label htmlFor="evento">{getFieldValue('evento')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="probabilidadDeExito">PROBABILIDAD DE ÉXITO</label>
                        <label htmlFor="probabilidadDeExito">{getFieldValue('probabilidadDeExito')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="valorIndemnizadoCliente">VALOR INDEMNIZADO CLIENTE</label>
                        <label htmlFor="valorIndemnizadoCliente">{getFieldValue('valorIndemnizadoCliente')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="entidadAfectada">ENTIDAD AFECTADA</label>
                        <label htmlFor="entidadAfectada">{getFieldValue('entidadAfectada')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaDePagoCliente">FECHA DE PAGO CLIENTE</label>
                        <label htmlFor="fechaDePagoCliente">{getFieldValue('fechaDePagoCliente')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipoContragarantia">TIPO CONTRAGARANTIA</label>
                        <label htmlFor="tipoContragarantia">{getFieldValue('tipoContragarantia')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="montoDeProvision">MONTO DE PROVISIÓN</label>
                        <label htmlFor="montoDeProvision">{getFieldValue('montoDeProvision')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipoDeMoneda">TIPO DE MONEDA</label>
                        <label htmlFor="tipoDeMoneda">{getFieldValue('tipoDeMoneda')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaDeTerminacion">FECHA DE TERMINACIÓN</label>
                        <label htmlFor="fechaDeTerminacion">{getFieldValue('fechaDeTerminacion')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="motivoDeTerminacion">MOTIVO DE TERMINACIÓN</label>
                        <label htmlFor="motivoDeTerminacion">{getFieldValue('motivoDeTerminacion')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cliente2">CLIENTE 2</label>
                        <label htmlFor="cliente2">{getNestedFieldValue('cliente2', 'nombre')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaDeAsignacion2">FECHA DE ASIGNACIÓN 2</label>
                        <label htmlFor="fechaDeAsignacion2">{getFieldValue('fechaDeAsignacion2')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="abogadoInternoDeLaCompania2">ABOGADO INTERNO DE LA COMPAÑIA 2</label>
                        <label htmlFor="abogadoInternoDeLaCompania2">{getNestedFieldValue('abogadoInternoDeLaCompania2', 'nombre')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="siniestro2">NÚMERO DE SINIESTRO 2</label>
                        <label htmlFor="siniestro2">{getNestedFieldValue('siniestro2', 'numero')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="numeroDeAplicativo2">NÚMERO DE APLICATIVO 2</label>
                        <label htmlFor="numeroDeAplicativo2">{getFieldValue('numeroDeAplicativo2')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaDeNotificacion2">FECHA DE NOTIFICACIÓN 2</label>
                        <label htmlFor="fechaDeNotificacion2">{getFieldValue('fechaDeNotificacion2')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="seInicioEjecutivoAContinuacionDeOrdinario">SE INICIÓ EJECUTIVO A CONTINUACIÓN DE ORDINARIO</label>
                        <label htmlFor="seInicioEjecutivoAContinuacionDeOrdinario">{getFieldValue('seInicioEjecutivoAContinuacionDeOrdinario')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="honorariosAsignados2">HONORARIOS ASIGNADOS 2</label>
                        <label htmlFor="honorariosAsignados2">{getFieldValue('honorariosAsignados2')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="valorPagado">VALOR PAGADO</label>
                        <label htmlFor="valorPagado">{getFieldValue('valorPagado')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="personaQueRealizoElPago">PERSONA QUE REALIZÓ EL PAGO</label>
                        <label htmlFor="personaQueRealizoElPago">{getFieldValue('personaQueRealizoElPago')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaDeRadicacionDeLaContestacion">FECHA DE RADICACIÓN DE LA CONTESTACIÓN</label>
                        <label htmlFor="fechaDeRadicacionDeLaContestacion">{getFieldValue('fechaDeRadicacionDeLaContestacion')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaDeRadicacionDeLaContestacion2">FECHA DE RADICACIÓN DE LA CONTESTACIÓN 2</label>
                        <label htmlFor="fechaDeRadicacionDeLaContestacion2">{getFieldValue('fechaDeRadicacionDeLaContestacion2')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="departamento">DEPARTAMENTO</label>
                        <label htmlFor="departamento">{getFieldValue('departamento')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="asegurado">ASEGURADO</label>
                        <label htmlFor="asegurado">{getFieldValue('asegurado')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="jurisdiccion0">Jurisdicción</label>
                        <label htmlFor="jurisdiccion0">{getFieldValue('jurisdiccion0')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="juzgado">Juzgado</label>
                        <label htmlFor="juzgado">{getNestedFieldValue('juzgado', 'nombre')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fechaUltimaActuacion">Fecha Última Actuación</label>
                        <label htmlFor="fechaUltimaActuacion">{getFieldValue('fechaUltimaActuacion')}</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor=" tituloUltimaActuacion">Título Última Actuación</label>
                        <label htmlFor=" tituloUltimaActuacion">{getFieldValue('tituloUltimaActuacion')}</label>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default CaseForm;
