var rgb = function(r, g, b) {
  return 'rgb(' + r + ','+ g + ','+ b + ')';
}

var canvas = {};
var ctx = {};

var backgroundColor = rgb(255, 255, 0);

var lastUpdate = 0;

var polygons = [];
var lineSegments = [];
var intersect = {};

var init = function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  var dims = resize();
  var w = dims.w;
  var h = dims.h;

  window.onresize = resize;

  var poly = new Polygon(new Vector(w / 2, h / 2));
  poly.addPoint(new Vector( 20,  20));
  poly.addPoint(new Vector(-20,  20));
  poly.addPoint(new Vector(-20, -20));
  poly.addPoint(new Vector( 20, -20));
  polygons.push(poly);

  var lineSegment = new LineSegment(
    new Vector(w / 2 - 30, h / 2 - 30),
    new Vector(w / 2 + 10, h / 2 + 40));
  lineSegments.push(lineSegment);

  requestAnimationFrame(tick);
}

var tick = function() {
  var now = Date.now();
  if (lastUpdate == 0) {
    lastUpdate = now;
  }
  var dt = (now - lastUpdate) / 1000;
  lastUpdate = now;

  var w = canvas.width;
  var h = canvas.height;

  fillCanvas(backgroundColor);

  for (var i = 0; i < polygons.length; ++i) {
    var poly = polygons[i];
    poly.draw(ctx);
  }

  for (var i = 0; i < lineSegments.length; ++i) {
    var line = lineSegments[i];
    line.draw(ctx);
  }

  var intersects = [];
  for (var i = 0; i < lineSegments.length; ++i) {
    var line = lineSegments[i];
    var polyIntersects = [];
    for (var i = 0; i < polygons.length; ++i) {
      var poly = polygons[i];
      polyIntersects = poly.getIntersections(line);
    }
    intersects = intersects.concat(polyIntersects);
  }

  for (var i = 0; i < intersects.length; i++) {
    drawCircle(intersects[i]);
  };

  requestAnimationFrame(tick);
}

var resize = function() {
  var w = canvas.width = window.innerWidth / 2;
  var h = canvas.height = window.innerHeight / 2;

  fillCanvas(backgroundColor);

  var ret = {};
  ret.w = w;
  ret.h = h;

  return ret;
}

var fillCanvas = function(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

var drawCircle = function(point, radius, color) {
  //draw a circle
  var c = color  == undefined ? 'black' : color;
  var r = radius == undefined ? 2       : radius;
  ctx.beginPath();
  ctx.fillStyle = c;
  ctx.arc(point.x, point.y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

var shiftCanvas = function (dirX) {
  var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.putImageData(image, dirX, 0);
}

var getColor = function() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}