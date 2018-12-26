const generate = R.curry((gen, size) => {
  const arr = [];
  for (let i = 0; i < size; i++) 
    arr.push(gen(i));
  return arr;
});

function getOrDefault(given, base) {
  return typeof given === "undefined" ? base : given
}

function randomInt(lo, hi) {
  return Math.floor(lo + (hi - lo) * Math.random());
}

function randomChoice(arr) {
  return arr[randomInt(0, arr.length)];
}

function randomImg(minX, maxX, minY, maxY) {
  minY = getOrDefault(minY, minX);
  maxY = getOrDefault(maxY, maxX);
  return "http://via.placeholder.com/" + randomInt(minX, maxX) + "x" + randomInt(minY, maxY);
}

function randomId(length) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=,./<>?;':\"[]\\|`~ \t\n\r";
  return generate(() => randomChoice(alphabet), length).join("");
}
