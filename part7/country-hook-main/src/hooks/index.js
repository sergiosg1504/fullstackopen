import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export const useCountry = (name) => {

  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (name) {
      axios.get(`https://restcountries.com/v3.1/name/${name}?fullText=true`).then(response => { setCountry(response.data[0]) })
        .catch((error) => {
          setCountry({ found: false })
        })
    }
  }, [name])

  return country
}