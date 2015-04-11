function LineSegment(point1, point2, color) {
  this.point1 = point1;
  this.point2 = point2;
  this.color  = color == undefined ? 'blue' : color;
}

LineSegment.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = '2';

  ctx.moveTo(this.point1.x, this.point1.y);
  ctx.lineTo(this.point1.x, this.point1.y);

  ctx.lineTo(this.point2.x, this.point2.y);
  ctx.moveTo(this.point2.x, this.point2.y);

  ctx.closePath();
  ctx.stroke();
}
