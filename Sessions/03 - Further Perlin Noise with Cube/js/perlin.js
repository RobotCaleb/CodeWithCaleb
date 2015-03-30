var rgb = function(r, g, b) {
  return 'rgb(' + r + ','+ g + ','+ b + ')';
};

var canvas = {};
var ctx = {};

var pixelsX = 50;
var pixelsY = 50;

var pixelSizeX = 10;
var pixelSizeY = 10;

var perlinCycle          = 0;
var perlinCycleIncrement = 0.0125;

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

  var palette = [
    [255, 65,  202],
    [95,  0,   127],
    [35,  53,  190],
    [195, 33,  165],
    [42,  245, 255],
  ];
  palettes.push(palette);

  palette = [
    [238, 200, 43],
    [214, 150, 28],
    [169, 98,  50],
    [154, 37,  17],
    [86,  0,   0],
  ];
  palettes.push(palette);

  palette = [
    [255, 255, 255],
    [181, 216, 246],
    [84,  173, 234],
    [74,  159, 219],
    [59,  129, 178],
  ];
  palettes.push(palette);

  requestAnimationFrame(tick);
};

var tick = function() {
  var now = Date.now();
  if (lastUpdate === 0) {
    lastUpdate = now;
  }
  var dt = (now - lastUpdate) / 1000;
  lastUpdate = now;

  var w = canvas.width;
  var h = canvas.height;

  fillCanvas(backgroundColor);

  perlinPlot(dt, w, h);

  perlinCycle += perlinCycleIncrement;

  requestAnimationFrame(tick);
};

var getColorFromPalette = function(noiseValue) {
  var palette = palettes[1];

  var c              = assignColor(noiseValue, [4, 3, 2, 3, 4]);
  var palColorResult = palette[c[0]];
  var palColor       = palColorResult;

  // Example:
  // noiseValue = 128
  // weightBegin = 7
  // weightEnd = 9
  // weightSum = 16
  // 2/16 of total range used... that is, only 111 to 143 can be in this range.
  // We want to scale this to 255
  // so, 111 => 0, 143 => 255
  // Range = 32
  //
  // Test case: 128:
  //  128 - 111 = (17 / 32) * 255 = 135

  var weightBegin = c[1]; // 7
  var weightEnd   = c[2]; // 9
  var weightTotal = c[3]; // 16

  var rangeBegin = weightBegin / weightTotal * 255; // 111
  var rangeEnd   = weightEnd / weightTotal * 255;   // 143
  var range      = rangeEnd - rangeBegin;           // 32

  var rangeMultiplier = (noiseValue - rangeBegin) / range;
  rangeMultiplier = Math.max(rangeMultiplier, 0.4);

  var r = palColor[0] * rangeMultiplier;
  var g = palColor[1] * rangeMultiplier;
  var b = palColor[2] * rangeMultiplier;

  var newColor = [
    Math.round(r),
    Math.round(g),
    Math.round(b)
  ];
  return rgb(newColor[0], newColor[1], newColor[2]);
};

// Color Talk
// 0-25    [middle = 12]    Red
// 26-200  [middle = 113]   Green
// 201-255 [middle = 228]   Blue   |---|----------------|---+-|
//                                 |--------------------+---+-|
// 113 => [0,255] = 127
//
//
// |---|---+------------|-----|
// 25% between Green bottom & Green top.
// Full intensity Green = 50%
// 25% Red + 75% Green
//
// |---|+---------------|-----|
// 50% Red + 50% Green


var assignColor = function(noiseValue, weights) {
  var totalWeight = 0;
  for (var n = 0; n < weights.length; ++n) {
    totalWeight += weights[n];
  }

  var weightSum = 0;
  for (var i = 0; i < weights.length; ++i) {
    var weightBegin = weightSum;
    var weightEnd   = weightBegin + weights[i];
    weightSum       = weightEnd;
    if (noiseValue < 255 * weightSum / totalWeight)
    {
      return [i, weightBegin, weightEnd, totalWeight];
    }
  }
};

var perlinPlot = function(dt, w, h) {
  var pixelGap = 0;
  for (var x = 0; x < pixelsX; ++x) {
    for (var y = 0; y < pixelsY; ++y) {
      var noiseValue = noise.perlin3(x * 0.1, y * 0.1, perlinCycle);
      noiseValue = Math.floor(scaleNoise(noiseValue) * 255);

      ctx.fillStyle = getColorFromPalette(noiseValue, 3, 2, 3);
      ctx.fillRect(x * (pixelSizeX + pixelGap), y * (pixelSizeY + pixelGap), pixelSizeX, pixelSizeY);
    }
  }
};

var scaleNoise = function(val) {
  return (val + 1) / 2;
};

var resize = function() {
  var w = canvas.width  = window.innerWidth / 2;
  var h = canvas.height = window.innerHeight / 2;

  fillCanvas(backgroundColor);

  var ret = {};
  ret.w = w;
  ret.h = h;

  return ret;
};

var fillCanvas = function(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};