const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require("graphql");

// const helloSchema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: "helloWorld",
//         fields: () => ({
//             message: {
//                 type: GraphQLString,
//                 resolve: () => "Hello World"
//             }
//         })
//     })
// })

const authors = [
    {id: 1, name: "J.K. Rowling"},
    {id: 2, name: "J.R.R. Tolkien"},
    {id: 3, name: "Brent Weeks"}
];

const books = [
    {id: 1, name: "Harry Potter 1", authorId: 1},
    {id: 2, name: "Harry Potter 2", authorId: 1},
    {id: 3, name: "Harry Potter 3", authorId: 1},
    {id: 4, name: "The Fellowship", authorId: 2},
    {id: 5, name: "The Two Towers", authorId: 2},
    {id: 6, name: "The Return", authorId: 2},
    {id: 7, name: "The Way of Shadows", authorId: 3},
    {id: 8, name: "Beyond The Shadows", authorId: 3},
]

const BookType = new GraphQLObjectType({
    name: "Book",
    description: "This represents a book written by an author",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represents an author of a book",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

// Query is similar to Get
const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root query",
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: "List of books",
            resolve: () => books
        },
        book: {
            type: BookType,
            description: "A single book",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => {
                return books.find(book => book.id === args.id)
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of authors",
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: "A book author",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => {
                return authors.find(author => author.id == args.id)
            }
        }
    })
})

// Mutation is similar to Post, Update, Delete
const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addBook: {
            type: BookType,
            description: "Add a book",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                };
                books.push(book)
                return book
            }
        },
        updateBook: {
            type: BookType,
            description: "Update a book",
            args: {
                id: {type: GraphQLNonNull(GraphQLInt)},
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const book = {
                    id: args.id,
                    name: args.name,
                    authorId: args.authorId
                };
                //Find and update book's name and authorId
                const selectedBook = books.findIndex(item => item.id === book.id)
                books[selectedBook].name = book.name
                books[selectedBook].authorId = book.authorId
                return book
            }
        },
        deleteBook: {
            type: BookType,
            description: "Delete a book",
            args: {
                id: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const selectedBook = books.findIndex(item => item.id === args.id)
                const book = books[selectedBook];
                const bookCount = book ? 1 : 0;
                books.splice(selectedBook, bookCount);
                return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: "Add an author",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const author = {
                    id: authors.length + 1,
                    name: args.name,
                };
                authors.push(author)
                return author
            }
        }
    })
})

const BooksSchema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use("/graphql", graphqlHTTP({
    schema: BooksSchema,
    graphiql: true,
  })
);

app.listen(3000, () =>
  console.log("Server running successfully at http://localhost:3000")
);
