import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

//Scalr Types: String, Boolean, Int, Float, ID

//Deom User Data
const users = [{
  id: '1',
  name: 'said alsharqawi',
  email: 'saed@s.com',
  age: 27
},
{
  id: '2',
  name: 'sara alsharqawi',
  email: 'sara@s.com',
  age: 40
},
{
  id: '3',
  name: 'leen alsharqawi',
  email: 'leeen@s.com',
  age: 11
}];

const posts = [{
  id: '1',
  title: 'Post Number One',
  body: 'Post Number One Body',
  published: true,
  author: '1'
},
{
  id: '2',
  title: 'Post Number two',
  body: 'Post Number two Body',
  published: true,
  author: '1'
},
{
  id: '3',
  title: 'Post Number three',
  body: 'Post Number three Body',
  published: false,
  author: '2'
}]

const comments = [{
  id: '1',
  text: 'Fisrt Comment',
  author: '1',
  post: '1'
}, {
  id: '2',
  text: 'Second Comment',
  author: '1',
  post: '1'
}, {
  id: '3',
  text: 'Third Comment',
  author: '2',
  post: '2'
}, {
  id: '4',
  text: 'Fourth Comment',
  author: '3',
  post: '1'
}]

//Type Definitions (schema)
const typeDefs = `
  type Query {
     add(numbers: [Float!]!) : Float!
     greeting(name: String, position: String): String!
     grades: [Int!]!
     users(query: String): [User!]!
     posts(query: String): [Post!]!
     comments(query: String): [Comment!]!
     me: User!
     post:Post!
  }
  
  type Mutation {
     cerateUser(data: CreateUserInput) : User!
     deleteUser(data: CreateUserInput) : User!
     createPost(data: CreatePostInput): Post!
     createComment(data: CreateCommentInput) :Comment!
  }
  
  input CreateUserInput {
    name: String!,
    email: String!,
    age: Int
  }

  input CreatePostInput {
    title: String!, 
    body: String! ,
    published: Boolean!,
    author: ID!
  }

  input CreateCommentInput {
    text: String!,
    author: ID! , 
    post:ID!
  }

  type User  {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`
//Resolvers
const resolvers = {
  Query: {
    add: (parent, args, ctx, info) => {
      if (args.numbers.length === 0) {
        return 0
      }
      return args.numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      })
    },
    greeting: (parent, args, ctx, info) => {
      if (args.name && args.position) {
        return `Hello, ${args.name}! You are my favoriate Position !${args.position}`
      } else {
        return 'Hello'
      }
    },
    grades: (parent, args, ctx, info) => {
      return [99, 88, 33]
    },
    users: (parent, args, ctx, info) => {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
      })
    },
    posts: (parent, args, ctx, info) => {
      if (!args.query) {
        return posts;
      }

      return posts.filter(post => {
        const isTitleMatch = post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
        const isBodyMatch = post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
        return isTitleMatch || isBodyMatch
      })
    },
    comments: (parent, args, ctx, info) => {
      if (!args.query) {
        return comments;
      }
      return comments.filter(comment => {
        const isIdMatch = comment.id.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
        const isTextMatch = comment.text.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
        return isIdMatch || isTextMatch
      })
    },
    me: () => {
      return {
        id: "123456777",
        name: "Said Alsharqawi",
        email: "saed@gmail.com"
      }
    },
    post: () => {
      return {
        id: "123456777",
        title: "First Post",
        body: "post body",
        published: true
      }
    }
  },
  Mutation: {
    cerateUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('Email taken.')
      }

      const user = {
        id: uuidv4(),
        ...args.data
      }

      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error("User not Found")
      }

      const post = {
        id: uuidv4(),
        ...args.data
      }

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      const postExists = posts.some((post) => post.id === args.data.post && post.published);

      if (!userExists || !postExists) {
        throw new Error("unable to find the user and post");
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      comments.push(comment);

      return comment;
    }
  },
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find(user => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id
      })
    },
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return users.find(user => {
        return user.id === parent.author
      })
    },
    post: (parent, args, ctx, info) => {
      return posts.find(post => {
        return post.id === parent.author
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.post
      })
    }
  },

}


const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))











































// import myCurrentLocation, { getGreeting, message, name } from './myModule';
// import myAddFunction, { subtract } from './math';

// console.log(message);

// console.log(name);

// console.log(myCurrentLocation);

// console.log(getGreeting(name));

// console.log(myAddFunction(1, 2));

// console.log(subtract(2, 1));

