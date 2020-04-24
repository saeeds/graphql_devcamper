const Query = {
  users: (parent, args, { db }, info) => {

    if (!args.query) {
      return db.users;
    }
    return db.users.filter(user => {
      return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
    })
  },
  posts: (parent, args, { db }, info) => {
    if (!args.query) {
      return db.posts;
    }

    return db.posts.filter(post => {
      const isTitleMatch = post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
      const isBodyMatch = post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
      return isTitleMatch || isBodyMatch
    })
  },
  comments: (parent, args, { db }, info) => {
    if (!args.query) {
      return db.comments;
    }
    return db.comments.filter(comment => {
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
}

export { Query as default }