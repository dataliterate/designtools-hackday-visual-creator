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
  var height = $("#svg").height() + 100;


  //**************************** Create Nodes ****************************//
  var nodes = [];

  var nodesX = width / 100;
  var nodesY = height / 100;

  // Setup boundaries
  nodes = nodes.concat([
    {
      "pos" : [-100, -100],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [width + 100, -100],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [width + 100, height + 100],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [-100, height + 100],
      "connectedTo" : [],
      "edges" : []
    }
  ]);

  // Create random nodes
  for (var x = 0; x < nodesX; x++)  {
    for (var y = 0; y < nodesY; y++)  {
      var node = {
        "pos" : [
          (x * 100) + utils.getRandom(-30, 30),
          (y * 100) + utils.getRandom(-30, 30)
        ],
        "connectedTo" : [],
        "edges" : []
      };

      nodes.push(node);
    }
  }

  //**************************** Do the Math ****************************//

  // Create point array
  var points = [];

  for (var i = 0; i < nodes.length; i++) {
    var point = [
      nodes[i].pos[0],
      nodes[i].pos[1],
    ];

    points.push(point);
  }

  // Create hole array
  var hole = [
    // Boundaries
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0]
  ];

  // Calculate triangles
  var result = cdt2d(points, hole, {exterior: false});

  var edges = [];


  //**************************** Parse the info  ****************************//

  for (var i = 0; i < result.length; i++)  {
    var connections = result[i];

    // Let each node know who it is connected to
    nodes[result[i][0]].connectedTo.push(result[i][1]);
    nodes[result[i][1]].connectedTo.push(result[i][2]);
    nodes[result[i][2]].connectedTo.push(result[i][0]);

    // Create the edges
    var edge = [result[i][0], result[i][1]];
    edge.sort();
    edges.push(edge);
    var edge = [result[i][1], result[i][2]];
    edge.sort();
    edges.push(edge);
    var edge = [result[i][2], result[i][0]];
    edge.sort();
    edges.push(edge);
  }

  // Throw out duplicate edges
  edges.sort();
  var i = edges.length;
  while(i-- && i > 0)  {
    if (edges[i][0] === edges[i-1][0] && edges[i][1] === edges[i-1][1]) {
      edges.splice(i, 1);
    }
  }

  for (var i = 0; i < edges.length; i++)  {
    nodes[edges[i][0]].edges.push(i);
    nodes[edges[i][1]].edges.push(i);
  }

  //**************************** Draw the mess ****************************//
  for (var i = 0; i < edges.length; i++)  {

    var p = [
      "M",
      nodes[edges[i][0]].pos[0],
      nodes[edges[i][0]].pos[1],
      "L",
      nodes[edges[i][1]].pos[0],
      nodes[edges[i][1]].pos[1]
    ].join(' ');

      svg.path(p).attr({"edge" : i, "from" : edges[i][0], "to" : edges[i][1]});
  }
});
