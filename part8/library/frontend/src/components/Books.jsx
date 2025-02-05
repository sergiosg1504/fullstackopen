import { useState } from 'react'

const Books = ({ show, books }) => {
  const [filter, setFilter] = useState('all genres')

  const duplicateArray = books.map(book => book.genres).flat()

  const genres = [...new Set(duplicateArray)]
  genres.push('all genres')

  const filteredBooks = books.filter((book) => {
    if (filter === 'all genres') {
      return true
    }
    return book.genres.includes(filter)
  })

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre, index) => (
          <button key={index} onClick={() => setFilter(genre)}>{genre}</button>
        ))}
      </div>
    </div>
  )
}

export default Books
