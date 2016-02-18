var $ = require('jquery');
var utils = require("./utilities.js");
var Snap = require('snapsvg');
var Delaunay = require("delaunay-fast");
var cdt2d = require('cdt2d');

$(document).ready(function()  {
  //////////////////////////// VERTICAL ALGIN ////////////////////////////

  // Align timetables
  var ht1 = $(".j__timetable--long").outerHeight();
  var ht2 = $(".j__timetable--short").outerHeight();
  var ht = Math.max(ht1, ht2);
  $(".j__timetable--short").css({"min-height": ht });
  $(".j__timetable--long").css({"min-height": ht });

  // Align button
  var ht1 = $(".j__text--long").outerHeight();
  var ht2 = $(".j__text--short").outerHeight();
  var ht = Math.max(ht1, ht2);

  $(".j__text--short").css({"min-height": ht });
  $(".j__text--long").css({"min-height": ht });

  //////////////////////////// HEADER ////////////////////////////

  var svg = Snap("#svg");

  var width = $(window).width();
  var height = $("#svg").height();

  var outerPoints = [
    [-1000, -1000],
    [width + 1000, -1000],
    [width + 1000, height + 1000],
    [-1000, height + 1000]
  ];

  var diamondPoints = [
    [0, 26],
    [12, 10],
    [33, 0],
    [67, 0],
    [86, 10],
    [100, 26],
    [50, 96],

    // Inner
    [33, 19],
    [67, 19],
    [20, 42],
    [80, 42]
  ];

  // Create random nodes
  var nodes = [];

  var nodesX = width / 100;
  var nodesY = height / 100;

  for (var x = 0; x < nodesX; x += 1)  {
    for (var y = 0; y < nodesY; y += 1)  {
      var node = [
        x + utils.getRandom(-0.3, 0.3),
        y + utils.getRandom(-0.3, 0.3)
      ];
      nodes.push(node);
    }
  }

  // Transfrom points
  var diamondPointsMapped = diamondPoints.map(function(point) {
    var pointNew = [];
    pointNew[0] = point[0] * (height / 200) + (width / 5) * 3;
    pointNew[1] = point[1] * (height / 200) + (height / 5);

    return pointNew;
  });

  var diamondPointsMappedBig = diamondPoints.map(function(point) {
    var pointNew = [];
    pointNew[0] = point[0] * (height / 160) + (width / 5) * 3 - (height / 170)*10;
    pointNew[1] = point[1] * (height / 160) + (height / 5) - (height / 170)*8;

    return pointNew;
  });

  var nodesMapped = nodes.map(function(point) {
    var pointNew = [];
    pointNew[0] = point[0] * (width / (nodesX - 2)) - (width / (nodesX - 2));
    pointNew[1] = point[1] * (height / (nodesY - 2)) - (height / (nodesY - 2));
    return pointNew;
  });

  // Create the svg shape of the diamond
  var diamondShapePath = ["M"];
  for (var i = 0; i < 7; i++) {
    diamondShapePath.push(diamondPointsMapped[i][0]);
    diamondShapePath.push(diamondPointsMapped[i][1]);
    diamondShapePath.push("L");
  }
  diamondShapePath.push(diamondPointsMapped[0][0]);
  diamondShapePath.push(diamondPointsMapped[0][1]);

  var diamondShapePathBig = ["M"];
  for (var i = 0; i < 7; i++) {
    diamondShapePathBig.push(diamondPointsMappedBig[i][0]);
    diamondShapePathBig.push(diamondPointsMappedBig[i][1]);
    diamondShapePathBig.push("L");
  }
  diamondShapePathBig.push(diamondPointsMappedBig[0][0]);
  diamondShapePathBig.push(diamondPointsMappedBig[0][1]);

  var diamondShapeInner1 = [
    "M",
    diamondPointsMapped[1][0],
    diamondPointsMapped[1][1],
    "L",
    diamondPointsMapped[7][0],
    diamondPointsMapped[7][1],
    "L",
    diamondPointsMapped[8][0],
    diamondPointsMapped[8][1],
    "L",
    diamondPointsMapped[4][0],
    diamondPointsMapped[4][1]
  ];

  var diamondShapeInner1 = [
    "M",
    diamondPointsMapped[1][0],
    diamondPointsMapped[1][1],
    "L",
    diamondPointsMapped[7][0],
    diamondPointsMapped[7][1],
    "L",
    diamondPointsMapped[8][0],
    diamondPointsMapped[8][1],
    "L",
    diamondPointsMapped[4][0],
    diamondPointsMapped[4][1]
  ];

  var diamondShapeInner2 = [
    "M",
    diamondPointsMapped[5][0],
    diamondPointsMapped[5][1],
    "L",
    diamondPointsMapped[10][0],
    diamondPointsMapped[10][1],
    "L",
    diamondPointsMapped[9][0],
    diamondPointsMapped[9][1],
    "L",
    diamondPointsMapped[0][0],
    diamondPointsMapped[0][1]
  ];

  var diamondShapeInner3 = [
    "M",
    diamondPointsMapped[6][0],
    diamondPointsMapped[6][1],
    "L",
    diamondPointsMapped[10][0],
    diamondPointsMapped[10][1],
    "L",
    diamondPointsMapped[8][0],
    diamondPointsMapped[8][1]
  ];

  var diamondShapeInner4 = [
    "M",
    diamondPointsMapped[6][0],
    diamondPointsMapped[6][1],
    "L",
    diamondPointsMapped[9][0],
    diamondPointsMapped[9][1],
    "L",
    diamondPointsMapped[7][0],
    diamondPointsMapped[7][1]
  ];

  var diamondShapeSVG = svg.path(diamondShapePath.join(' '));

  var diamondShapeBigSVG = svg.path(diamondShapePathBig.join(' ')).attr({"fill" : "red"});

  // Delete nodes that are inside the diamond
  var i = nodes.length;

  while (i--)  {
    if (Snap.path.isPointInside(diamondShapeSVG, nodesMapped[i][0], nodesMapped[i][1])) {
      nodesMapped.splice(i, 1);
    } else if (Snap.path.isPointInside(diamondShapeBigSVG, nodesMapped[i][0], nodesMapped[i][1])) {
      nodesMapped.splice(i, 1);
    }
  }

  diamondShapeBigSVG.remove();
  diamondShapeSVG.remove();

  // Definde edges/holes
  var borders = outerPoints.concat(diamondPointsMapped.slice(0, 7));
  var hole = [
    //Outer Shape
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],

    // Diamond
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 4]
  ];

  nodesMapped = borders.concat(nodesMapped);

  // Calculate triangles
  var result = cdt2d(nodesMapped, hole, {exterior: false});

  // Draw triangles
  for (var i = 0; i < result.length; i++)  {
    var path = [
      "M",
      (nodesMapped[result[i][0]][0]),
      (nodesMapped[result[i][0]][1]),
      "L",
      (nodesMapped[result[i][1]][0]),
      (nodesMapped[result[i][1]][1]),
      "L",
      (nodesMapped[result[i][2]][0]),
      (nodesMapped[result[i][2]][1])
    ].join(' ');

    svg.path(path);
  }

  // Draw diamond

  var diamonShapeAttribute = {"stroke" : "hsl(170,97,47)", "stroke-width" : "3.5"};

  var diamondShapeSVG = svg.path(diamondShapePath.join(' ')).attr(diamonShapeAttribute);

  var diamondShapeInner1SVG = svg.path(diamondShapeInner1.join(' ')).attr(diamonShapeAttribute);
  var diamondShapeInner2SVG = svg.path(diamondShapeInner2.join(' ')).attr(diamonShapeAttribute);
  var diamondShapeInner3SVG = svg.path(diamondShapeInner3.join(' ')).attr(diamonShapeAttribute);
  var diamondShapeInner4SVG = svg.path(diamondShapeInner4.join(' ')).attr(diamonShapeAttribute);

  // Draw circles on itnersections
  for (var i = 0; i < nodesMapped.length; i++) {
    svg.circle(nodesMapped[i][0], nodesMapped[i][1], 7).attr({"fill" :"#03d8b5", "stroke" : "none"});
   }

  for (var i = 0; i < diamondPointsMapped.length; i++) {
    svg.circle(diamondPointsMapped[i][0], diamondPointsMapped[i][1],7).attr({"fill" : "#03d8b5", "stroke" : "none"});
  }

});
