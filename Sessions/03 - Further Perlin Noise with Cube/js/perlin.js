var rgb = function(r, g, b) {
  return 'rgb(' + r + ','+ g + ','+ b + ')';
}

var canvas = {};
var ctx = {};

var pixelsX = 50;
var pixelsY = 50;

var pixelSizeX = 10;
var pixelSizeY = 10;

var perlinCycle          = 0;
var perlinCycleIncrement = 0.025;

var pixels    = [];
var numPixels = 256;

var ribbons = [];
var numRibbons = 5;
var ribbonYDeviation = 200;

var backgroundColor = rgb(0, 0, 0);

var lastUpdate = 0;

var palettes = [];

var init = function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  var dims = resize();
  var w = dims.w;
  var h = dims.h;

  window.onresize = resize;

  noise.seed(Math.random());

  while (ribbons.length < numRibbons) {
    var color = getColor();
    var seedX = Math.random() * 2;
    var seedY = Math.random() * 2;
    var seed = new Vector(seedX, seedY);
    var ribbon = new Ribbon(w / 2, h / 2, color, seed);
    ribbons.push(ribbon);
  }

  var palette = [];
  palette.push([255,65, 202]);
  palette.push([95, 0,  127]);
  palette.push([35, 53, 190]);
  palette.push([195,33, 165]);
  palette.push([42, 245,255]);

  palettes.push(palette);

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

  //perlinRibbon(dt, w, h);
  perlinPlot(dt, w, h);
  //perlinRibbons(dt, w, h);

  perlinCycle += perlinCycleIncrement;

  requestAnimationFrame(tick);
}

var perlinRibbons = function(dt, w, h) {

  for (var i = 0; i < numRibbons; ++i) {
    var ribbon = ribbons[i];
    var seed = ribbon.getSeed();

    var position = noise.perlin3(seed.x, seed.y, perlinCycle);
    position *= ribbonYDeviation;
    ribbon.addPoint(w * .8, h / 2 + position);

    ribbon.update(dt);
  }

  for (var i = 0; i < numRibbons; ++i) {
    var ribbon = ribbons[i];

    ribbon.draw(ctx, w, h);
  }
}

var perlinRibbon = function(dt, w, h) {
  fillCanvas(backgroundColor);

  var pixelIndex = noise.perlin3(0, 0, perlinCycle);
  pixelIndex = Math.floor(scaleNoise(pixelIndex) * 255);

  var position = noise.perlin3(0.5, 0.5, perlinCycle);
  position *= 200;

  var w = canvas.width;
  var h = canvas.height;

  var pixel = pixels[pixelIndex];
  ctx.putImageData(pixel, w / 2, h / 2 + position);

  //shiftCanvas(-5);
}

var getColorFromPalette = function(noiseValue) {
  var palette = palettes[0];

  var c = assignColor(noiseValue, 3, 2, 3);
  var palColor = palette[c];
  var newColor =
    [Math.round(palColor[0] * noiseValue / 255),
     Math.round(palColor[1] * noiseValue / 255),
     Math.round(palColor[2] * noiseValue / 255)];
 // return rgb(palColor[0], palColor[1], palColor[2]);
  return rgb(newColor[0], newColor[1], newColor[2]);
}

var assignColor = function(noiseValue, lowWeight, midWeight, highWeight) {
  var totalWeight = lowWeight + midWeight + highWeight;

  if (noiseValue < 255 * lowWeight / totalWeight)
  {
    return 0;
  }
  else if (noiseValue < 255 * (lowWeight + midWeight) / totalWeight)
  {
    return 1;
  }
  else
  {
    return 2;
  }

}

var perlinPlot = function(dt, w, h) {
  for (var x = 0; x < pixelsX; ++x) {
    for (var y = 0; y < pixelsY; ++y) {
      var noiseValue = noise.perlin3(x * 0.1, y * 0.1, perlinCycle);
      noiseValue = Math.floor(scaleNoise(noiseValue) * 255);

      ctx.fillStyle = getColorFromPalette(noiseValue, 3, 2, 3);
      ctx.fillRect(x * (pixelSizeX + 1), y * (pixelSizeY + 1), pixelSizeX, pixelSizeY);
    }
  }
}

var scaleNoise = function(val) {
  return (val + 1) / 2;
}

var resize = function() {
  var w = canvas.width = window.innerWidth / 2;
  var h = canvas.height = window.innerHeight / 2;

  for (var i = 0; i < numPixels; ++i) {
    ctx.fillStyle = rgb(i, i, i);
    ctx.fillRect(0, 0, pixelSizeX, pixelSizeY);
    var pixel = ctx.getImageData(0, 0, pixelSizeX, pixelSizeY);
    pixels.push(pixel);
  }

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

var shiftCanvas = function (dirX) {
  var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.putImageData(image, dirX, 0);
}

var getColor = function() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}