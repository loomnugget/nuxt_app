import faker from 'faker'
// import typeDefs from './schema.gql'
import { makeExecutableSchema, MockList } from 'graphql-tools'
// GraphQL docs: https://graphql.org/learn/execution/

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    """
    the list of Posts by this author
    """
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    posts: [Post]
    author(id: Int!): Author
  }

  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;

const resolvers = {
  Query: {
    author: (root, args, context, info) => {
      return fetchAuthorById(args.id)
    }
  },
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export const mocks = ({ route }) => ({
  Author: () => ({
    date: faker.date.past(),
    id: faker.random.uuid(),
    summary: faker.lorem.words(4)
  }),
  Post: () => ({
    date: faker.date.past(),
    id: faker.random.uuid(),
    summary: faker.lorem.words(4)
  })
})
