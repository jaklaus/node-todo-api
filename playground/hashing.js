// const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10,
  name: 'joel',
  email: 'joel@test.com',
  password: 'testpassword'
};

var secret = 'allyse'


var token = jwt.sign(data, secret);
console.log(`Token:`, token);

var decoded = jwt.verify(token, secret);
console.log(`Decoded:`, decoded);

// var message = 'I am user number 3';
//
// var hash = SHA256(message).toString();
// //
// // console.log(`Message: ${message}`);
// // console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
// //
// // console.log(token.data.id)
// // console.log(token.hash)
// // console.log(resultHash)
//
// if(resultHash === token.hash){
//   console.log(`Data was not changed:`);
//   console.log(`${resultHash}`);
//   console.log(`${token.hash}`);
// } else {
//   console.log(`Data was changed, don't trust!`)
//   console.log(`${resultHash}`);
//   console.log(`${token.hash}`);
// }
