//**************************** Includes ****************************//
var $ = require('jquery');
var utils = require("./utilities.js");
var Snap = require('snapsvg');
var cdt2d = require('cdt2d');
var tinycolor = require("tinycolor2");

//**************************** Global Vars ****************************//
var colors = getColors();

//**************************** Run ****************************//
$(document).ready(function()  {

  // Init first Network
  var color = colors[utils.getRandomInt(0, colors.length - 1)];
  var mainNetwork = new Network("#svg", color);
});



//**************************** Network ****************************//
function Network(targetSelector, color)  {
  this.target = targetSelector;
  this.paper = Snap(targetSelector);
  this.height = $(this.target).outerHeight();
  this.width = $(this.target).outerWidth();

  this.color = color;

  // Setup drawing paper
  $(this.target).css({"background-color" : this.color.regular});
  this.paper.attr({"fill" : "", "stroke" : this.color.light, "stroke-width" : "3"});

  this.nodes = [];
  this.hole = [];

  // Create the boundaries
  this.boundaries = createBoundaries(this.width, this.height);
  this.nodes = this.nodes.concat(this.boundaries.nodes);
  this.hole = this.hole.concat(this.boundaries.hole);

  // Create the random nodes
  this.nodes = this.nodes.concat(createRandomNodes(this.width, this.height, 100));

  // Calculate the network
  this.network = calculateNetwork(this.nodes, this.hole);
  this.nodes = this.network.nodes;
  this.edges = this.network.edges;

  // Draw the network
  drawNetwork(this.nodes, this.edges, this.paper, this.color.regular);

  // Create lights
  this.lights = [];
  for (var i = 0; i < 13; i++) {
    var light = new Light(this.nodes, this.paper, this.color.verylight);
    this.lights.push(light);
  }

  //**************************** Create Boundaries ****************************//
  function createBoundaries(width, height)  {
    var nodes = [
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
    ];

    var hole = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0]
    ];

    return {
      nodes: nodes,
      hole: hole
    };
  }

  //**************************** Create Random Nodes ****************************//
  function createRandomNodes(width, height, nodesSpace) {
    var randomNodes = [];
    var nodesX = width / nodesSpace + 1;
    var nodesY = height / nodesSpace + 1;
    var nodesSpaceRandom = nodesSpace / 3;

    for (var x = 0; x < nodesX; x++)  {
      for (var y = 0; y < nodesY; y++)  {
        var node = {
          "pos" : [
            (x * nodesSpace) + utils.getRandomInt(-nodesSpaceRandom, nodesSpaceRandom),
            (y * nodesSpace) + utils.getRandomInt(-nodesSpaceRandom, nodesSpaceRandom)
          ],
          "connectedTo" : [],
          "edges" : []
        };

        randomNodes.push(node);
      }
    }
    return randomNodes;
  }

  //**************************** Calculate the network ****************************//
  function calculateNetwork(nodes, hole)  {
    // Create point array
    var points = [];

    for (var i = 0; i < nodes.length; i++) {
      var point = [
        nodes[i].pos[0],
        nodes[i].pos[1],
      ];

      points.push(point);
    }

    // Calculate triangles
    var result = cdt2d(points, hole, {exterior: false});

    // Parse the result

    var edges = [];

    for (var i = 0; i < result.length; i++)  {
      // Let each node know which nodes it is connected to
      nodes[result[i][0]].connectedTo.push(result[i][1]);
      nodes[result[i][1]].connectedTo.push(result[i][2]);
      nodes[result[i][2]].connectedTo.push(result[i][0]);

      // Create the edges
      var edge = [result[i][0], result[i][1]];
      edge.sort();
      edges.push(edge);

      edge = [result[i][1], result[i][2]];
      edge.sort();
      edges.push(edge);

      edge = [result[i][2], result[i][0]];
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

    // Tell each node which edges are connected to it
    for (var i = 0; i < edges.length; i++)  {
      nodes[edges[i][0]].edges.push(i);
      nodes[edges[i][1]].edges.push(i);
    }

    return {
      nodes: nodes,
      edges: edges
    };
  }

  //**************************** Draw the network ****************************//
  function drawNetwork(nodes, edges, paper, color) {

    // Draw edges
    for (var i = 0; i < edges.length; i++)  {

      var p = [
        "M",
        nodes[edges[i][0]].pos[0],
        nodes[edges[i][0]].pos[1],
        "L",
        nodes[edges[i][1]].pos[0],
        nodes[edges[i][1]].pos[1]
      ].join(' ');

        paper.path(p).attr({"edge" : i, "from" : edges[i][0], "to" : edges[i][1]});
    }

    // Draw nodes
    for (var i = 0; i < nodes.length; i++) {
      paper.circle(nodes[i].pos[0], nodes[i].pos[1], 8).attr({"fill" : color, "stroke" : "none"});
    }
  }

  //**************************** Draw lights ****************************//
  function Light(nodes, paper, color)  {
    var self = this;
    this.nodes = nodes;
    this.currentNode = Math.floor(utils.getRandom(0, nodes.length));
    this.nextEdge = 0;
    this.currentEdge = 1;
    this.lastEdge = 0;

     this.move = function() {
      // Finde a new edge from the node that is not the current one
      while (self.currentEdge == self.lastEdge)  {
        currentEdgePos = Math.floor(utils.getRandom(0, self.nodes[self.currentNode].edges.length));
        self.currentEdge = self.nodes[self.currentNode].edges[currentEdgePos];
      }

      // Light up current edge
      var e = Snap.select("[edge='" + self.currentEdge + "']");
      e.attr({"stroke" : color});

      // In a second light down the current edge
      setTimeout(function() {
        e.attr({"stroke" : ""});
      }, 1000);

      // Move to the next node (Make sure it is not already the current one)
      self.lastEdge = self.currentEdge;

      var from = e.attr("from");
      var to = e.attr("to");

      if (self.currentNode != from) {
        self.currentNode = from;
      } else {
        self.currentNode = to;
      }
    };

    this.interval = setInterval(this.move, 100, self);
  }
}

//**************************** Get the Colors ****************************//
function getColors()  {
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

  // Convert HSL to Hex
  for (var i = 0; i < colors.length; i++) {
    for (var shade in colors[i])  {
      colors[i][shade] = tinycolor(colors[i][shade]).toHexString();
    }
  }

  return colors;
}
