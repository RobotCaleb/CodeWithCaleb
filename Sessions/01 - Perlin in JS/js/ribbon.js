function Ribbon(x, y, color, seed) {
  this.x     = x;
  this.y     = y;
  this.color = color;
  this.seed  = seed;

  this.points    = [];
  this.numPoints = 0;
  this.speed     = new Vector(-100, 0);
}

Ribbon.prototype.addPoint = function(x, y) {
  var point = new Vector(x, y);
  this.points.push(point);
};

Ribbon.prototype.getSeed = function() {
  return this.seed;
};

Ribbon.prototype.update = function(dt) {
  this.numPoints = this.points.length;

  if (this.numPoints < 2) {
    return;
  }

  for (var i = this.numPoints - 1; i >= 0; i--) {
    var point = this.points[i];

    if (point.x < 0) {
      // this.points.splice(0, 1);
      this.points = this.points.reverse();
      this.points.pop();
      this.points = this.points.reverse();
      this.numPoints--;
      continue;
    }

    point = point.add(this.speed.mul(dt));
    this.points[i] = point;
  };
};

Ribbon.prototype.draw = function(ctx, w, h) {
  if (this.numPoints < 2) {
    return;
  }

  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = '2';

  for (var i = 0; i < this.numPoints - 1; ++i) {
    var point  = this.points[i];
    var point2 = this.points[i + 1];

    // ctx.fillStyle = 'red';
    // ctx.fillRect(point.x, point.y, 5, 5);

    if (i == 0) {
      ctx.moveTo(point.x, point.y);
    }
    else {
      ctx.lineTo(point.x, point.y);
    }

    ctx.lineTo(point2.x, point2.y);
    ctx.moveTo(point2.x, point2.y);

    ctx.closePath();
    ctx.stroke();
  }
};