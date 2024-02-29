require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('dev'))

morgan.token('req-body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

// let persons = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook app!</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(persons => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  ` )
  })
})

app.get('/api/persons', (request, response) => {
  //response.json(persons)
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


// Without Mongoose
// app.get('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const person = persons.find(person => person.id === id)
//   if (person) response.json(person)
//   else response.status(404).end()
// })

// app.get('/api/persons/:id', (request, response) => {
//   Person.findById(request.params.id)
//     .then(person => {
//       if (person) response.json(person)
//       else response.status(404).end()
//     })
//     .catch(error => {
//       console.log(error)
//       response.status(400).send({ error: 'malformatted id' })
//     })
// })

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Without Mongoose
// app.post('/api/persons', (request, response) => {
//   const body = request.body

//   if (!body.name || !body.number) {
//     return response.status(400).json({
//       error: 'content missing'
//     })
//   }

//   if (persons.find(person => person.name === body.name)) {
//     return response.status(400).json({
//       error: 'name already exists in phonebook'
//     })
//   }

//   const person = {
//     id: generateId(),
//     name: body.name,
//     number: body.number,
//   }

//   persons = persons.concat(person)

//   response.json(person)
// })

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: name,
    number: number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = {
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// Without Mongoose
// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter(persons => persons.id !== id)

//   response.status(204).end()
// })

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// ERROR HANDLING
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler) // this has to be the last loaded middleware, also all the routes should be registered before this!

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})