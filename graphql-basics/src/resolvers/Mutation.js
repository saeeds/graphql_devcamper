import uuidv4 from 'uuid/v4'

const Mutation = {
  cerateUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error('Email taken.')
    }

    const user = {
      id: uuidv4(),
      ...args.data
    }

    db.users.push(user);

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error("User not Found")
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        comments = db.comments.filter((comment) => comment.post !== post.id)
      };

      return !match;
    });

    comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUsers[0];

  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id)

    if (!user) {
      throw new Error("User not Found")
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.user.some((user) => user.email === data.email)

      if (emailTaken) {
        throw new Error("email taken")
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);

    if (!userExists) {
      throw new Error("User not Found")
    }

    const post = {
      id: uuidv4(),
      ...args.data
    }

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publishe('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post not Found")
    }

    const [post] = db.posts.splice(postIndex, 1);

    comments = db.comments.filter((comment) => comment.post !== args.id);

    if (post.published) {
      pubsub.publishe('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      });
    }

    return post;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id)
    const originalPost = [...post];

    if (!post) {
      throw new Error("Post not Found")
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        //deleted
        pubsub.publishe('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        //created
        pubsub.publishe('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      } else if (post.published) {
        //updated
        pubsub.publishe('post', {
          post: {
            mutation: 'UPDATED',
            data: post
          }
        });
      }
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some((post) => post.id === args.data.post && post.published);

    if (!userExists || !postExists) {
      throw new Error("unable to find the user and post");
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(comment);

    pubsub.publishe(`comment ${args.data.post}`, {
      post: {
        mutation: 'CREATED',
        data: comment
      }
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error("Comment not Found")
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publishe(`comment ${deletedComment.post}`, {
      post: {
        mutation: 'DELETED',
        data: deletedComment
      }
    });

    return deletedComment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id)

    if (!comment) {
      throw new Error("Comment not Found")
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    pubsub.publishe(`comment ${comment.post}`, {
      post: {
        mutation: 'UPDATED',
        data: comment
      }
    });

    return comment;
  }
}

export { Mutation as default }