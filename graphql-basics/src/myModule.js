const message = 'some message from myModule.js';

const name = "Said alsharqawi";

const location = 'Sadui Arabia';

const getGreeting = (name) => { return `Welcome to the DevCamp ${name}` }

export { message, name, getGreeting, location as default }