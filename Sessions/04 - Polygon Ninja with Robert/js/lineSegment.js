function LineSegment(start, end, color) {
  this.start = start;
  this.end   = end;
  this.color = color == undefined ? 'blue' : color;
}

LineSegment.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = '2';

  ctx.moveTo(this.start.x, this.start.y);
  ctx.lineTo(this.start.x, this.start.y);

  ctx.lineTo(this.end.x, this.end.y);
  ctx.moveTo(this.end.x, this.end.y);

  ctx.closePath();
  ctx.stroke();
}

LineSegment.getIntersect = function (seg1, seg2) {
  var start1 = seg1.start;
  var end1   = seg1.end;

  var start2 = seg2.start;
  var end2   = seg2.end;

  var a1 = end1.y - start1.y;
  var b1 = start1.x - end1.x;
  var c1 = a1 * start1.x + b1 * start1.y;

  var a2 = end2.y - start2.y;
  var b2 = start2.x - end2.x;
  var c2 = a2 * start2.x + b2 * start2.y;

  var det = a1 * b2 - a2 * b1;
  if (det == 0) { // lines are parallel
      return undefined;
  }

  var x = (b2 * c1 - b1 * c2) / det;
  var y = (a1 * c2 - a2 * c1) / det;

  return new Vector(x, y);
}
