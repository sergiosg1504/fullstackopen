const Persons = ({ personsToShow, remove, removeLabel }) => {
  return (
    <div>
      <ul>
        {personsToShow.map(person =>
          <li key={person.name}>{person.name} {person.number}  <button onClick={() => remove(person.id)}>{removeLabel}</button></li>
        )}
      </ul>      
    </div>
  )
}

export default Persons