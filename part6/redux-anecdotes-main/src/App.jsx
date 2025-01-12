import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAncedotes } from "./reducers/anecdoteReducer";
import Notification from "./components/Notification";
import AnecdoteList from "./components/AnecdoteList";
import AnecdoteForm from "./components/AnecdoteForm";

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAncedotes());
  }, [dispatch]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App