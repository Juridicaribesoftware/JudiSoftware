
const globales = () => {
    return {
        URI_BACKEND: import.meta.env.VITE_URI_API,
        SECRECT: import.meta.env.VITE_ACCESS_TOKEN
    }   
}


export default globales
