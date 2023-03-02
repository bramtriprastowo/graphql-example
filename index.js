const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");

const helloSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "helloWorld",
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve: () => "Hello World"
            }
        })
    })
})

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
app.use("/graphql", graphqlHTTP({
    schema: helloSchema,
    graphiql: true,
  })
);

app.listen(3000, () =>
  console.log("Server running successfully at http://localhost:3000")
);
