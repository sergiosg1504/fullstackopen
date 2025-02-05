
const Recommend = ({ show, user, books }) => {
  console.log('Recommend user:', user)
  console.log('Recommend books:', books)

  const favoriteGenre = user ? user.favoriteGenre : null

  if (!show) {
    return null
  }

  const filteredBook = books.filter(book => book.genres.includes(favoriteGenre))

  return (
    <div>
      <h2>Recommendations</h2>
      <p>books in your favorite genres <b>{favoriteGenre}</b> </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBook.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend