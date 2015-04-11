function BoundingBox(poly) {
  var maxX = -99999;
  var maxY = -99999;
  var minX = 99999;
  var minY = 99999;

  for (var i = 0; i < poly.points.length; i++) {
    var pos = poly.position;
    var point = pos.add(poly.points[i]);

    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);

    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
  };

  this.min = new Vector(minX, minY);
  this.max = new Vector(maxX, maxY);
}

BoundingBox.prototype.Contains = function(boundingBox) {
	var contains =
		this.min.x <= boundingBox.min.x && this.max.x >= boundingBox.max.x &&
		this.min.y <= boundingBox.min.y && this.max.y >= boundingBox.max.y;
	return contains;
};

BoundingBox.prototype.ContainsPoint = function(point) {
  var poly = new Polygon(Vector.zero());
  poly.addPoint(point);
  poly.addPoint(point);
  poly.addPoint(point);
  return this.Contains(new BoundingBox(poly));
};