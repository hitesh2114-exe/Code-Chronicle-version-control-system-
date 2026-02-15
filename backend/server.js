const path = require('path');
console.log(path.resolve(process.cwd(), '.vcsGit'));

console.log(path.join(path.resolve(process.cwd(), '.vcsGit'), 'staging'));