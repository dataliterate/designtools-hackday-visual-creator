exports.getRandom = function(min, max) {
  return Math.random() * (max - min) + min;
};

exports.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.getDistance = function(x1, y1, x2, y2)  {
  return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
};
