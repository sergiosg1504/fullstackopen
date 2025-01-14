import React, { useState } from 'react'
import { useField, useCountry } from './hooks'

const Country = ({ country }) => {
  console.log(country)
  if (!country || !country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }


  return (
    <div>
      <h3>{country.name.common} </h3>
      <div>capital {country.capital} </div>
      <div>population {country.population}</div>
      <img src={country.flags.png} height='100' alt={`flag of ${country.name.common}`} />
    </div>
  )
}

const App = () => {
  const { reset: resetNameInput, ...nameInput } = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>
      {name !== '' &&
        <Country country={country} />
      }
    </div>
  )
}

export default App