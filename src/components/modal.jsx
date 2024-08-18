import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './modal.css';  // Asegúrate de importar los estilos
import exportToExcel from '../hooks/useDescargarExcel';

Modal.setAppElement('#root'); // Asegúrate de que el elemento raíz esté configurado

const FieldSelectorModal = ({ isOpen, onRequestClose, fields, onSelectFields, casos, mostrar, cuantos }) => {
    const [selectedFields, setSelectedFields] = useState([]);

    // Inicializar selectedFields con todos los campos seleccionados
    useEffect(() => {
        setSelectedFields(fields);
    }, [fields]);

    const handleFieldChange = (event) => {
        const field = event.target.value;
        setSelectedFields(prevFields =>
            prevFields.includes(field)
                ? prevFields.filter(f => f !== field) // Si ya está seleccionado, se quita
                : [...prevFields, field] // Si no está seleccionado, se añade
        );
    };

    const handleSave = () => {
        if (cuantos) {
            exportToExcel(casos, selectedFields)
            console.log(selectedFields)
        }else{
            exportToExcel(mostrar, selectedFields)
        }
        
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Select Fields"
            className="modal"
            overlayClassName="overlay"
        >
            <h2>Select Fields</h2>
            <form>
                {fields.map(field => (
                    <div key={field}>
                        <input
                            type="checkbox"
                            id={field}
                            value={field}
                            checked={selectedFields.includes(field)} // Se controla el estado del checkbox
                            onChange={handleFieldChange}
                        />
                        <label htmlFor={field}>{field}</label>
                    </div>
                ))}
            </form>
            <br />
            <button className="excel-button" onClick={handleSave}>Descargar</button>
            <button className="excel-button" onClick={onRequestClose}>Cancelar</button>
        </Modal>
    );
};

export default FieldSelectorModal;
