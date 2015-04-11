function Polygon(position) {
  this.position = position;

  this.points = [];
  this.color = 'red';
  this.numPoints = 0;
}

Polygon.prototype.addPoint = function (point) {
  ++this.numPoints;
  this.points.push(point);
}

Polygon.prototype.getLineSegments = function () {
  var segments = [];

  if (this.numPoints < 3) {
    return segments;
  }

  for (var i = 0; i < this.numPoints - 1; ++i) {
    var point  = this.points[i + 0];
    var point2 = this.points[i + 1];

    var wPoint  = point.add(this.position);
    var wPoint2 = point2.add(this.position);

    var segment = new LineSegment(wPoint, wPoint2, this.color);
    segments.push(segment);
  }

  point  = this.points[0];
  point2 = this.points[this.numPoints - 1];

  wPoint  = point.add(this.position);
  wPoint2 = point2.add(this.position);

  segment = new LineSegment(wPoint, wPoint2, this.color);
  segments.push(segment);

  return segments;
}

Polygon.prototype.draw = function (ctx) {
  if (this.numPoints < 3) {
    return;
  }

  var segments = this.getLineSegments();

  for (var i = 0; i < segments.length; ++i) {
    var segment = segments[i];
    segment.draw(ctx);
  }
}

Polygon.prototype.getIntersections = function(lineSegment) {
    var segments = this.getLineSegments();
    var intersections = [];
    
    for (var i = 0; i < segments.length; ++i) {
      var intersect = LineSegment.getIntersect(segments[i], lineSegment);
      if (intersect != undefined)
        intersections.push(intersect);
    }

    return intersections;
}