var $ = require('jquery');
var utils = require("./utilities.js");
var Snap = require('snapsvg');
var Delaunay = require("delaunay-fast");

var cdt2d = require('cdt2d');

$(document).ready(function()  {
  var ht1 = $(".j__timetable--long").outerHeight();
  var ht2 = $(".j__timetable--short").outerHeight();
  var ht = Math.max(ht1, ht2);
  $(".j__timetable--short").css({"min-height": ht });
  $(".j__timetable--long").css({"min-height": ht });

  var ht1 = $(".j__text--long").outerHeight();
  var ht2 = $(".j__text--short").outerHeight();
  var ht = Math.max(ht1, ht2);
  
  $(".j__text--short").css({"min-height": ht });
  $(".j__text--long").css({"min-height": ht });

  //////////////////////////////////////////////////////////////////

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


  // Move points
  var diamondPointsMapped = diamondPoints.map(function(point) {
    point[0] = point[0] * (height / 160) + (width / 3) * 2;
    point[1] = point[1] * (height / 160) + (height / 6);

    return point;
  });

  var nodesMapped = nodes.map(function(point) {
    point[0] = point[0] * (width / nodesX);
    point[1] = point[1] * (height / nodesY);
    return point;
  });

  for (var i = 0; i < nodesMapped.length; i++) {
    svg.circle(nodesMapped[i][0], nodesMapped[i][1], 10);
  }


  for (var i = 0; i < diamondPointsMapped.length; i++) {
    svg.circle(diamondPointsMapped[i][0], diamondPointsMapped[i][1], 10);
  }

  var borders = outerPoints.concat(diamondPoints.slice(0, 7))


});
