function Polygon(position) {
  this.position = position;

  this.points = [];
  this.color = 'red';
}

Polygon.prototype.addPoint = function (point) {
  this.points.push(point);
}

Polygon.prototype.draw = function (ctx) {
  var numPoints = this.points.length;

  if (numPoints < 3) {
    return;
  }

  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = '2';

  for (var i = 0; i < numPoints - 1; ++i) {
    var point  = this.points[i + 0];
    var point2 = this.points[i + 1];

    var wPoint  = point.add(this.position);
    var wPoint2 = point2.add(this.position);

    if (i == 0) {
      ctx.moveTo(wPoint.x, wPoint.y);
    }
    else {
      ctx.lineTo(wPoint.x, wPoint.y);
    }

    ctx.lineTo(wPoint2.x, wPoint2.y);
    ctx.moveTo(wPoint2.x, wPoint2.y);

    ctx.closePath();
    ctx.stroke();
  }

  var point  = this.points[0];
  var point2 = this.points[numPoints - 1];

  var wPoint  = point.add(this.position);
  var wPoint2 = point2.add(this.position);

  ctx.lineTo(wPoint.x, wPoint.y);

  ctx.lineTo(wPoint2.x, wPoint2.y);
  ctx.moveTo(wPoint2.x, wPoint2.y);

  ctx.closePath();
  ctx.stroke();
}
