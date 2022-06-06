import { useState, useEffect } from "react";


const useLocalStorage = (key, initValue) => {               

    const [value, setValue] = useState(() => { 
        if (JSON.parse(localStorage.getItem(key))) return JSON.parse(localStorage.getItem(key)) 
        return initValue                                                                       
    })


    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));  
    }, [key, value])                                        


    return [value, setValue];                              
}


export default useLocalStorage 

