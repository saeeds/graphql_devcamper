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


const db = { users, posts, comments }

export { db as default }