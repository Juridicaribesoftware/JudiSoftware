import axios from "axios"
import globales from "./useGlobales"
import useToken from "./useToken"
const useAxios = (metodo, url, data) => {
    const token = {
        iv: useToken('iv'),
        encripted: useToken('encripted')
    }
    return new Promise((resolve, reject) => {
        const API_REST = globales().URI_BACKEND + url
        
        if (metodo === 'GET') {
          axios.get(API_REST, {
            headers: {
              'authorization': JSON.stringify(token)
            }
          })
            .then(doc => resolve(doc))
            .catch(err => reject(err))
        }
        if (metodo === 'POST') {
          axios.post(API_REST, { data }, {
            headers: {
              'authorization': JSON.stringify(token)
            }
          })
            .then(doc => resolve(doc))
            .catch(err =>  reject(err))
        }
        if (metodo === 'DELETE') {
          axios.delete(API_REST, {
            headers: {
              'authorization': JSON.stringify(token)
            }
          })
            .then(doc => resolve(doc))
            .catch(err =>  reject(err))
        }
        if (metodo === 'PUT') {
          axios.put(API_REST, {data} , {
            headers: {
              'authorization': JSON.stringify(token)
            }
          })
            .then(doc => resolve(doc))
            .catch(err =>  reject(err))
        }
      })
}


export default useAxios