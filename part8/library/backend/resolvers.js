const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate('author')
      } else if (args.author && !args.genre) {
        const autorId = Author.findOne({ name: args.author }).id
        return Book.find({ author: autorId }).populate('author')
      } else if (!args.author && args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate('author')
      } else {
        const authorId = Author.findOne({ name: args.author }).id
        return Book.find({ author: authorId, genres: { $in: [args.genre] } }).populate('author')
      }
    },
    allAuthors: async () => {
      return Author.find({}).populate('books')
    },
    me: async (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      var author = await Author.findOne({ name: args.author })
      if (!author) {
        console.log('Author not found, creating new author')
        const newAuthor = new Author({ name: args.author })
        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_AUTHOR_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      console.log('Author fetched', author)
      const newBook = new Book({ ...args, author: author })
      try {
        console.log('Saving book', newBook)
        const savedBook = await newBook.save()
        console.log('Saved book', savedBook)
        author.books = author.books.concat(newBook)
        console.log('Saving author', author)
        await author.save()

        pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })

        return savedBook
      } catch (error) {
        console.error('Saving book failed', error)
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_BOOK_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      console.log('Current user', currentUser)
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      console.log('Author fetched', author)
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      console.log('Saving author', author)
      try {
        return author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_AUTHOR_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Saving user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      console.log('User found', user)
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      const ret = { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      console.log('Token', ret)
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers