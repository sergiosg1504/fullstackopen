import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR } from '../queries'

const Authors = ({ show, authors, setError }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [changeAuthor, result] = useMutation(EDIT_AUTHOR)

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError('author not found')
    }
  }, [result.data])

  if (!show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()

    changeAuthor({ variables: { name, setBornTo: parseInt(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <label>
          Select an author
          <br />
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map(a =>
              <option value={a.name} key={a.name}>
                {a.name}
              </option>
            )}
          </select>
        </label>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
