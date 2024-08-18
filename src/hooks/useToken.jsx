const useToken = (nombreToken) => {
    const cookies = document.cookie.split('; ')
    for (let i = 0; i < cookies.length; i++) {
      const cookieParts = cookies[i].split('=')
      const cookieName = cookieParts[0]
      const cookieValue = cookieParts[1]
      if (cookieName === nombreToken) {
        return cookieValue
      }
    }
  }
    
export default useToken