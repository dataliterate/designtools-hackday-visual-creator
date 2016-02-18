var $ = require('jquery');
var utils = require("./utilities.js");
var Snap = require('snapsvg');
var Delaunay = require("delaunay-fast");

var cdt2d = require('cdt2d');

$(document).ready(function()  {
  var h = $(".j__timetable--long").outerHeight();
  $(".j__timetable--short").css({"min-height": h });

  //////////////////////////////////////////////////////////////////

  var svg = Snap("#svg");

  var diamondPoints = [
    [-1000, -1000],
    [5000, -1000],
    [5000, 1000],
    [-1000, 1000],
    [1100 + 0.6 * 0, 0.6 * 120 + 100],
    [1100 + 0.6 * 60, 0.6 * 50 + 100],
    [1100 + 0.6 * 165, 0.6 * 0 + 100],
    [1100 + 0.6 * 353, 0.6 * 0 + 100],
    [1100 + 0.6 * 430, 0.6 * 50 + 100],
    [1100 + 0.6 * 500, 0.6 * 130 + 100],
    [1100 + 0.6 * 250, 0.6 * 480 + 100]
  ];

  var diamondShape = [
    // Outer Loop
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],

    // Inner Loop
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 4]
  ];

  // Create the svg shape of the diamond
  var diamondShapePath = ["M"];
  for (var i = 4; i < diamondPoints.length; i++) {
    diamondShapePath.push(diamondPoints[i][0]);
    diamondShapePath.push(diamondPoints[i][1]);
    diamondShapePath.push("L");
  }
  diamondShapePath.splice(-1, 1);
  diamondShapePath.push("Z");

  var diamondShapeSVG = svg.path(diamondShapePath.join(' '));

   // Create random nodes
  var nodes = [];

  for (var x = 0; x < 20; x += 1)  {
    for (var y = 0; y < 10; y += 1)  {
      var node = [
        (x * 150) + utils.getRandom(-40,40),
        (y * 150) + utils.getRandom(-40,40)
      ];
      nodes.push(node);
     }
  }

  // Delete nodes that are inside the diamond
  var i = nodes.length;

  while (i--)  {
    if (Snap.path.isPointInside(diamondShapeSVG, nodes[i][0], nodes[i][1])) {
      nodes.splice(i, 1);
    }
  }

  diamondShapeSVG.remove();

  nodes = diamondPoints.concat(nodes);

  var result = cdt2d(nodes, diamondShape, {exterior: true});

 for (var i = 0; i < result.length; i++)  {
  var path = [
    "M",
    (nodes[result[i][0]][0]+2),
    (nodes[result[i][0]][1]+2),
    "L",
    (nodes[result[i][1]][0]+2),
    (nodes[result[i][1]][1]+2),
    "L",
    (nodes[result[i][2]][0]+2),
    (nodes[result[i][2]][1]+2)
  ].join(' ');

  svg.path(path);
 }

 for (var i = 0; i < nodes.length; i++) {
   svg.circle(nodes[i][0] + 4, nodes[i][1] + 4, 8).attr({"fill": "#03d8b5", "stroke" : "none"});
 }









  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // var diamondPoints = [
  //   {
  //     "x" : 0,
  //     "y" : 120
  //   },{
  //     "x" : 60,
  //     "y" : 50
  //   },{
  //     "x" : 165,
  //     "y" : 0
  //   },{
  //     "x" : 353,
  //     "y" : 0
  //   },{
  //     "x" : 430,
  //     "y" : 50
  //   },{
  //     "x" : 500,
  //     "y" : 130
  //   },{
  //     "x" : 250,
  //     "y" : 480
  //   },{
  //     "x" : 165,
  //     "y" : 95
  //   },{
  //     "x" : 335,
  //     "y" : 95
  //   },{
  //     "x" : 100,
  //     "y" : 210
  //   },{
  //     "x" : 400,
  //     "y" : 210
  //   },
  // ];
  //
  // var diamondLines = [
  //   [0, 1], // left
  //   [1, 2], // left top
  //   [2, 3], // top
  //   [3, 4], // right top
  //   [4, 5], // right
  //   [5, 6], // right bottom
  //   [6, 0], // left bottom
  //   [0, 9], // left lower center
  //   [1, 7], // left upper center
  //   [7, 8], // upper center
  //   [7, 9], // left upper center to left lower center
  //   [9, 10], // lower center
  //   [10, 5], // right lower center
  //   [10, 8], // right upper center to right lower center
  //   [8, 4], // right upper center
  //   [9, 6], // left lower center to bottom
  //   [10, 6] // right lower center to bottom
  // ];
  //
  // var diamondOuterPoints = [
  //   diamondPoints[0],
  //   diamondPoints[1],
  //   diamondPoints[2],
  //   diamondPoints[3],
  //   diamondPoints[4],
  //   diamondPoints[5],
  //   diamondPoints[6],
  // ];
  //
  // // Creater outer diamond shape
  // var diamondOuterPath= [
  //   "M",
  //   diamondPoints[0].x,
  //   diamondPoints[0].y,
  //   "L",
  //   diamondPoints[1].x,
  //   diamondPoints[1].y,
  //   "L",
  //   diamondPoints[2].x,
  //   diamondPoints[2].y,
  //   "L",
  //   diamondPoints[3].x,
  //   diamondPoints[3].y,
  //   "L",
  //   diamondPoints[4].x,
  //   diamondPoints[4].y,
  //   "L",
  //   diamondPoints[5].x,
  //   diamondPoints[5].y,
  //   "L",
  //   diamondPoints[6].x,
  //   diamondPoints[6].y,
  //   "Z"
  // ];
  //
  // var diamondOuter = svg.path(diamondOuterPath.join(' '));
  //
  // // Create random nodes
  // var nodes = [];
  //
  // for (var x = 0; x < 20; x += 1)  {
  //   for (var y = 0; y < 10; y += 1)  {
  //     var node = {
  //       "id": (x * 20) + y,
  //       "x": (x * 50) + utils.getRandom(-30,30),
  //       "y": (y * 50) + utils.getRandom(-30,30)
  //     };
  //
  //     nodes.push(node);
  //   }
  // }
  //
  // // Delete nodes that are inside the diamond
  // var i = nodes.length;
  //
  // while (i--)  {
  //   if (Snap.path.isPointInside(diamondOuter, nodes[i].x, nodes[i].y)) {
  //     nodes.splice(i, 1);
  //   }
  // }
  //
  // // Add outer diamond points to the network
  // nodes = nodes.concat(diamondOuterPoints);
  //
  // // Get Delaunay Triangles
  // var points = [];
  // for (var i = 0; i < nodes.length; i++){
  //   points.push([nodes[i].x, nodes[i].y]);
  // }
  // var triangles = Delaunay.triangulate(points);
  //
  // // Draw triangles
  // for (var i = 0; i < triangles.length - 3; i += 3)  {
  //   var side1 = [
  //     "M",
  //     nodes[triangles[i]].x,
  //     nodes[triangles[i]].y,
  //     "L",
  //     nodes[triangles[i+1]].x,
  //     nodes[triangles[i+1]].y
  //   ].join(' ');
  //
  //   var side2 = [
  //     "M",
  //     nodes[triangles[i+1]].x,
  //     nodes[triangles[i+1]].y,
  //     "L",
  //     nodes[triangles[i+2]].x,
  //     nodes[triangles[i+2]].y
  //   ].join(' ');
  //
  //   var side3 = [
  //     "M",
  //     nodes[triangles[i+2]].x,
  //     nodes[triangles[i+2]].y,
  //     "L",
  //     nodes[triangles[i]].x,
  //     nodes[triangles[i]].y
  //   ].join(' ');
  //
  //   var triangle = [svg.path(side1), svg.path(side2), svg.path(side3)];
  //
  //   for (var j = 0; j < triangle.length; j++) {
  //     var intersects = Snap.path.intersection(diamondOuter, triangle[j]);
  //
  //     var deleteMe = false;
  //
  //     if (intersects.length > 0)  {
  //     //  deleteMe = true;
  //     }
  //
  //     for (var k = 0; k < intersects.length; k++) {
  //       for (var l = 0; l < diamondOuterPoints.length; l++) {
  //         var dist = utils.getDistance(intersects[k].x, intersects[k].y, diamondOuterPoints[l].x, diamondOuterPoints[l].y);
  //
  //         if (dist > 20)  {
  //           deleteMe = true;
  //         }
  //       }
  //     }
  //
  //     if (deleteMe) {
  //       triangle[j].remove();
  //     }
  //   }
  // }
});
