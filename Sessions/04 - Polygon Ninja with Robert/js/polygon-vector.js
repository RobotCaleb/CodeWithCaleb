function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.zero = function() {
  return new Vector(0, 0);
}

Vector.prototype.mul = function(scalar) {
  return new Vector(this.x * scalar, this.y * scalar);
};

Vector.prototype.add = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

Vector.prototype.lengthSquared = function() {
  return this.x * this.x + this.y * this.y;
};

Vector.prototype.length = function() {
  return Math.sqrt(this.lengthSquared());
};

