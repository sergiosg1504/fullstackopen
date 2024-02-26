import Part from "./Part"

const Content = ({ parts }) => {
  console.log(parts)
  const sum = parts.reduce((s, p) => s + p.exercises, 0)
  console.log(sum)
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part} />)}
      <strong>total of {sum} exercises</strong>
    </div>
  )
}

export default Content