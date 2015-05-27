// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomString(n) {
  var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  var name = '';
  for (var i = 0; i < n; i++) {
    name += alphabet.charAt(getRandomInt(alphabet.length));
  }

  return name;
}

module.exports = {
  getRandomInt: getRandomInt,
  randomString: randomString
};
