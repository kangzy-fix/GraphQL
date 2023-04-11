const express = require('express')
const {
    graphqlHTTP
} = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    RootQueryType
} = require('graphql')
const app = express()

const authors = [{
        id: 1,
        name: 'J. K. Rowling'
    },
    {
        id: 2,
        name: 'J. R. Tolkien'
    },
    {
        id: 3,
        name: 'Brent Weeks'
    },
]

const books = [{
        id: 1,
        name: 'Harry Potter and the chamber of secrets',
        authorId: 1
    },
    {
        id: 2,
        name: 'Harry Potter and the prisoner of Azkaban',
        authorId: 1
    },
    {
        id: 3,
        name: 'Harry Potter and the Goblet of fire',
        authorId: 1
    },
    {
        id: 4,
        name: 'The Fellowship of the king',
        authorId: 2
    },
    {
        id: 5,
        name: 'The two towers',
        authorId: 2
    },
    {
        id: 6,
        name: 'The Return of the king',
        authorId: 2
    },
    {
        id: 7,
        name: 'The way of Shadows',
        authorId: 3
    },
    {
        id: 8,
        name: 'Beyond the Shadows',
        authorId: 3
    },
]

const BookTYpe = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book is written by an author',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt)
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        },
        authorId: {
            type: GraphQLNonNull(GraphQLInt)
        },
        authors: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        },
    })

})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt)
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        },
        books: {
            type: new GraphQLList(BookTYpe),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            },
        }
    })

})


const RootQuery = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookTYpe,
            description: 'A single Book',
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
        books: {
            type: new GraphQLList(BookTYpe),
            description: 'List of All books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'Single Author',
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
      addBook: {
        type: BookType,
        description: 'Add a book',
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          authorId: { type: GraphQLNonNull(GraphQLInt) }
        },
        resolve: (parent, args) => {
          const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
          books.push(book)
          return book
            }
        }
    }),
    fields: () => ({
        addAuthor: {
          type: AuthorType,
          description: 'Add an author',
          args: {
            name: { type: GraphQLNonNull(GraphQLString) },
          },
          resolve: (parent, args) => {
            const author = { id: authors.length + 1, name: args.name }
            authors.push(author)
            return author
              }
          }
      })
})


const schema = new GraphQLSchema({
    query: RootQuery,
    Mutation: RootMutationType
})


app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
    schema: schema,
    graphiql: true
}))
app.listen(5000., () => console.log('Server Running '))