import { useState } from "react";
import LoginForm from "./components/LoginForm";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend";
import { useQuery, useApolloClient } from "@apollo/client";
import { ME, ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);

  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(ALL_BOOKS);
  const user = useQuery(ME);
  const client = useApolloClient()

  if (authors.loading || books.loading || user.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {
          token ?
            <>
              <button onClick={() => setPage("add")}>add book</button>
              <button onClick={() => setPage("recommend")}>recommend</button>
              <button onClick={logout}>logout</button>
            </>
            :
            <button onClick={() => setPage("login")}>login</button>
        }

      </div>

      <LoginForm show={page === "login"} setToken={setToken} setError={notify} />

      <Authors show={page === "authors"} authors={authors.data.allAuthors} setError={notify} />

      <Books show={page === "books"} books={books.data.allBooks} />

      <NewBook show={page === "add"} setError={notify} />

      <Recommend show={page === "recommend"} user={user.data.me} books={books.data.allBooks} />

    </div>
  );
};

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  )
}

export default App;
