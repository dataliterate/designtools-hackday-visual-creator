var $ = require('jquery');
var utils = require("./utilities.js");
var Snap = require('snapsvg');
//var Delaunay = require("delaunay-fast");
var cdt2d = require('cdt2d');
var tinycolor = require("tinycolor2");

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


  var colors = [
    {
      // Teal
      verylight: "hsl(170,97,75)",
      light: "hsl(170,97,43)",
      regular: "hsl(170,97,40)",
      dark: "hsl(170,97,37)",
      //erydark: "hsl(170,92,37)"
    }, {
      // Blue
      verylight: "hsl(212,70,94)",
      light: "hsl(212,70,74)",
      regular: "hsl(212,70,68)",
      dark: "hsl(212,54,60)",
      //verydark: "hsl(212,65,60)"
    }, {
      // Fuchsia
      verylight: "hsl(357,100,95)",
      light: "hsl(357,100,75)",
      regular: "hsl(357,100,71)",
      dark: "hsl(357,85,65)",
      //verydark: "hsl(357,90,63)"
    }, {
      // Orange
      verylight: "hsl(43,74,92)",
      light: "hsl(43,74,67)",
      regular: "hsl(43,75,60)",
      dark: "hsl(43,65,53)",
      //verydark: "hsl(43,70,48)"
    }
  ];

  color = colors[utils.getRandomInt(0, colors.length - 1)];
  //color = colors[3];

  var colorHex = tinycolor(color.regular).toHexString();
  $(".solid--primary").css({"background-color" : colorHex});
  $(".text--primary").css({"color" : colorHex});
  $("h1").css({"color" : colorHex});
  $("h2").css({"color" : colorHex});
  $(".button").css({"background-color" : colorHex});

  var colorHexDark = tinycolor(color.dark).toHexString();
  $(".solid--primary--dark").css({"background-color" : colorHexDark});
  $(".button").hover(function() { $(this).css({"background-color" : colorHexDark}) }, function() { $(this).css({"background-color" : colorHex}) });


  console.log(color);



  //////////////////////////// HEADER ////////////////////////////

  var svg = Snap("#svg").attr({"stroke" : color.light});
  var svgMap = Snap("#svg-map");

  var width = $(window).width();
  var height = $("#svg").height() + 100;

  //**************************** Diamond ****************************//

  var diamond = [
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

  var diamondScaled = diamond.map(function(point) {
    var pointNew = [];
    pointNew[0] = point[0] * (height / 200) + (width / 5) * 3;
    pointNew[1] = point[1] * (height / 200) + (height / 6);

    return pointNew;
  });

  var diamondScaledBig = diamond.map(function(point) {
    var pointNew = [];
    pointNew[0] = point[0] * (height / 170) + (width / 5) * 3 - (height / 170)*7.5;
    pointNew[1] = point[1] * (height / 170) + (height / 5) - (height / 170)*10;

    return pointNew;
  });

  //**************************** Create Nodes ****************************//
  nodes = [];

  var nodesX = width / 100 + 1;
  var nodesY = height / 100 + 1;

  // Setup boundaries
  nodes = nodes.concat([
    {
      "pos" : [-200, -200],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [width + 200, -200],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [width + 200, height + 200],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [-200, height + 200],
      "connectedTo" : [],
      "edges" : []
    }
  ]);

  // Add (outer) diamond points to nodes
  nodes = nodes.concat([
    {
      "pos" : [diamondScaled[0][0], diamondScaled[0][1]],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [diamondScaled[1][0], diamondScaled[1][1]],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [diamondScaled[2][0], diamondScaled[2][1]],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [diamondScaled[3][0], diamondScaled[3][1]],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [diamondScaled[4][0], diamondScaled[4][1]],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [diamondScaled[5][0], diamondScaled[5][1]],
      "connectedTo" : [],
      "edges" : []
    }, {
      "pos" : [diamondScaled[6][0], diamondScaled[6][1]],
      "connectedTo" : [],
      "edges" : []
    }
  ]);

  // Create random nodes

  var randomNodes = [];

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

      randomNodes.push(node);
    }
  }

  // Throughout random nodes that are close to or inside the diamond

  var diamondShapeBig = [
    "M",
    diamondScaledBig[0][0],
    diamondScaledBig[0][1],
    "L",
    diamondScaledBig[1][0],
    diamondScaledBig[1][1],
    "L",
    diamondScaledBig[2][0],
    diamondScaledBig[2][1],
    "L",
    diamondScaledBig[3][0],
    diamondScaledBig[3][1],
    "L",
    diamondScaledBig[4][0],
    diamondScaledBig[4][1],
    "L",
    diamondScaledBig[5][0],
    diamondScaledBig[5][1],
    "L",
    diamondScaledBig[6][0],
    diamondScaledBig[6][1],
    "L",
    diamondScaledBig[0][0],
    diamondScaledBig[0][1],
  ].join(' ');

  var diamondShapeBigSVG = svg.path(diamondShapeBig);

  // Delete nodes that are inside the diamond
  var i = randomNodes.length;

  while (i--)  {
    if (Snap.path.isPointInside(diamondShapeBigSVG, randomNodes[i].pos[0], randomNodes[i].pos[1])) {
      randomNodes.splice(i, 1);
    }
  }

  diamondShapeBigSVG.remove();
  nodes = nodes.concat(randomNodes);

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

  // Calculate triangles
  var result = cdt2d(points, hole, {exterior: false});

  edges = [];

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
      svgMap.path(p).attr({"edge" : i, "from" : edges[i][0], "to" : edges[i][1]});
  }

  // Draw the diamond

    var diamondShape = [
      "M",
      diamondScaled[0][0],
      diamondScaled[0][1],
      "L",
      diamondScaled[1][0],
      diamondScaled[1][1],
      "L",
      diamondScaled[2][0],
      diamondScaled[2][1],
      "L",
      diamondScaled[3][0],
      diamondScaled[3][1],
      "L",
      diamondScaled[4][0],
      diamondScaled[4][1],
      "L",
      diamondScaled[5][0],
      diamondScaled[5][1],
      "L",
      diamondScaled[6][0],
      diamondScaled[6][1],
      "L",
      diamondScaled[0][0],
      diamondScaled[0][1],
      "M",
      diamondScaled[1][0],
      diamondScaled[1][1],
      "L",
      diamondScaled[7][0],
      diamondScaled[7][1],
      "L",
      diamondScaled[8][0],
      diamondScaled[8][1],
      "L",
      diamondScaled[4][0],
      diamondScaled[4][1],
      "M",
      diamondScaled[5][0],
      diamondScaled[5][1],
      "L",
      diamondScaled[10][0],
      diamondScaled[10][1],
      "L",
      diamondScaled[9][0],
      diamondScaled[9][1],
      "L",
      diamondScaled[0][0],
      diamondScaled[0][1],
      "M",
      diamondScaled[6][0],
      diamondScaled[6][1],
      "L",
      diamondScaled[10][0],
      diamondScaled[10][1],
      "L",
      diamondScaled[8][0],
      diamondScaled[8][1],
      "M",
      diamondScaled[6][0],
      diamondScaled[6][1],
      "L",
      diamondScaled[9][0],
      diamondScaled[9][1],
      "L",
      diamondScaled[7][0],
      diamondScaled[7][1]
    ].join(' ');

    svg.path(diamondShape).attr({"stroke" : color.verylight, "stroke-width" : "3.5"});

    // Draw the nodes
    for (var i = 0; i < nodes.length; i++) {
      svg.circle(nodes[i].pos[0], nodes[i].pos[1], 8).attr({"fill" : color.regular, "stroke" : "none"});
    }

    for (var i = 0; i < nodes.length; i++) {
      svgMap.circle(nodes[i].pos[0], nodes[i].pos[1], 8).attr({"fill" :"#f2f2f2", "stroke" : "none"});
    }

    for (var i = 0; i < diamondScaled.length; i++) {
      svg.circle(diamondScaled[i][0], diamondScaled[i][1], 7).attr({"fill" : color.regular, "stroke" : "none"});
    }


  currentNode = Math.floor(utils.getRandom(0, nodes.length));
  lastEdge = 0;
  currentEdge = 0;
  thisEdge = 0;

  currentNode2 = Math.floor(utils.getRandom(0, nodes.length));
  lastEdge2 = 0;
  currentEdge2 = 0;
  thisEdge2 = 0;

  currentNode3 = Math.floor(utils.getRandom(0, nodes.length));
  lastEdge3 = 0;
  currentEdge3 = 0;
  thisEdge3 = 0;
  setInterval(tick, 100);

});


function tick() {

  while (thisEdge == lastEdge)  {
    currentEdge = Math.floor(utils.getRandom(0, nodes[currentNode].edges.length));
    thisEdge = nodes[currentNode].edges[currentEdge];
  }

  var e = Snap.select("[edge='" + thisEdge + "']");
  e.attr({"stroke" : color.verylight});

  var from = e.attr("from");
  var to = e.attr("to");

  setTimeout(function() {
    e.attr({"stroke" : ""});
  }, 1000);


  lastEdge = thisEdge;

  if (currentNode != from) {
    currentNode = from;
  } else {
    currentNode = to;
  }


  while (thisEdge2 == lastEdge2)  {
    currentEdge2 = Math.floor(utils.getRandom(0, nodes[currentNode2].edges.length));
    thisEdge2 = nodes[currentNode2].edges[currentEdge2];
  }

  var e2 = Snap.select("[edge='" + thisEdge2 + "']");
  e2.attr({"stroke" : color.verylight});

  var from2 = e2.attr("from");
  var to2 = e2.attr("to");

  setTimeout(function() {
    e2.attr({"stroke" : ""});
  }, 1000);


  lastEdge2 = thisEdge2;

  if (currentNode2 != from2) {
    currentNode2 = from2;
  } else {
    currentNode2 = to2;
  }


  while (thisEdge3 == lastEdge3)  {
    currentEdge3 = Math.floor(utils.getRandom(0, nodes[currentNode3].edges.length));
    thisEdge3 = nodes[currentNode3].edges[currentEdge3];
  }

  var e3 = Snap.select("[edge='" + thisEdge3 + "']");
  e3.attr({"stroke" : color.verylight});

  var from3 = e3.attr("from");
  var to3 = e3.attr("to");

  setTimeout(function() {
    e3.attr({"stroke" : ""});
  }, 1000);


  lastEdge3 = thisEdge3;

  if (currentNode3 != from3) {
    currentNode3 = from3;
  } else {
    currentNode3 = to3;
  }
};
