//*****************************************************************//
//*                                                               *//
//*                            Network                            *//
//*                                                               *//
//*****************************************************************//

var $ = require("jquery");
var utils = require("./utilities.js");
var Snap = require("snapsvg");
var cdt2d = require("cdt2d");

module.exports = function(targetSelector, color)  {
  this.target = targetSelector;
  this.paper = Snap(targetSelector);
  this.height = $(this.target).outerHeight();
  this.width = $(this.target).outerWidth();

  this.color = color;
  this.gap = 12;
  this.diamondGap = 8;
  this.nodeSpacing = 100;

  // Setup drawing paper
  $(this.target).css({"background-color" : this.color.regular});
  this.paper.attr({"fill" : "none", "stroke" : this.color.light, "stroke-width" : "3", "stroke-linecap" : "round"});


  //**************************** Create Boundaries ****************************//
  this.createBoundaries = function()  {
    var nodes = [
      {
        "pos" : [-200, -200],
        "center" : [-200, -200],
        "connectedTo" : [],
        "edges" : [],
        "moveable" : false
      }, {
        "pos" : [this.width + 200, -200],
        "center" : [this.width + 200, -200],
        "connectedTo" : [],
        "edges" : [],
        "moveable" : false
      }, {
        "pos" : [this.width + 200, this.height + 200],
        "center" : [this.width + 200, this.height + 200],
        "connectedTo" : [],
        "edges" : [],
        "moveable" : false
      }, {
        "pos" : [-200, this.height + 200],
        "center" : [-200, this.height + 200],
        "connectedTo" : [],
        "edges" : [],
        "moveable" : false
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
  };

  //**************************** Create Boundaries ****************************//
  this.createDiamond = function() {
    var diamond = [
      [0, 0.26],
      [0.12, 0.1],
      [0.33, 0],
      [0.67, 0],
      [0.86, 0.1],
      [1, 0.26],
      [0.5, 0.96],

      // Inner
      [0.33, 0.19],
      [0.67, 0.19],
      [0.20, 0.42],
      [0.80, 0.42]
    ];

    var width = this.width;
    var height = this.height;

    var diamondScaled = diamond.map(function(point) {
      var size = Math.min(width/3, height/2);
      size = Math.min(size, 800);
      var positionX = width / 2 - size/2;
      var positionY = height / 2 - size/2 - size/8;

      var pointNew = [];
      pointNew[0] = point[0] * size + positionX;
      pointNew[1] = point[1] * size + positionY;

      return pointNew;
    });

    var diamondScaledBig = diamond.map(function(point) {
      var size = Math.min(width/2.3, height/1.7);
      size = Math.min(size, 1000);
      var positionX = width / 2 - size/2;
      var positionY = height / 2 - size/2 - size/8 + size/22;

      var pointNew = [];
      pointNew[0] = point[0] * size + positionX;
      pointNew[1] = point[1] * size + positionY;

      return pointNew;
    });

    // Add (outer) diamond points to nodes
    var nodes = [
      {
        "pos" : [diamondScaled[0][0], diamondScaled[0][1]],
        "center" : [diamondScaled[0][0], diamondScaled[0][1]],
        "connectedTo" : [],
        "edges" : [],
        "moveable" : false
      }, {
        "pos" : [diamondScaled[1][0], diamondScaled[1][1]],
        "center" : [diamondScaled[1][0], diamondScaled[1][1]],
        "connectedTo" : [],
        "edges" : [],
        "moveable" : false
      }, {
        "pos" : [diamondScaled[2][0], diamondScaled[2][1]],
        "center" : [diamondScaled[2][0], diamondScaled[2][1]],
        "connectedTo" : [],
        "edges" : [],
        "moveable" : false
      }, {
        "pos" : [diamondScaled[3][0], diamondScaled[3][1]],
        "center" : [diamondScaled[3][0], diamondScaled[3][1]],
        "connectedTo" : [],
        "edges" : [],
        "moveable" : false
      }, {
        "pos" : [diamondScaled[4][0], diamondScaled[4][1]],
        "center" : [diamondScaled[4][0], diamondScaled[4][1]],
        "connectedTo" : [],
        "edges" : [],
        "moveable" : false
      }, {
        "pos" : [diamondScaled[5][0], diamondScaled[5][1]],
        "center" : [diamondScaled[5][0], diamondScaled[5][1]],
        "connectedTo" : [],
        "edges" : [],
        "moveable" : false
      }, {
        "pos" : [diamondScaled[6][0], diamondScaled[6][1]],
        "center" : [diamondScaled[6][0], diamondScaled[6][1]],
        "connectedTo" : [],
        "edges" : [],
        "moveable" : false
      }
    ];

    var hole = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 0]
    ];

    return {
      nodes: nodes,
      hole: hole,
      diamondPoints: diamondScaled,
      diamondPointsBig: diamondScaledBig
    };
  };

  //**************************** Create Random Nodes ****************************//
  this.createRandomNodes = function(nodesSpace) {
    var randomNodes = [];
    var nodesX = this.width / nodesSpace + 2;
    var nodesY = this.height / nodesSpace + 2;
    var nodesSpaceRandom = nodesSpace / 4;

    for (var x = -1; x < nodesX; x++)  {
      for (var y = -1; y < nodesY; y++)  {

        var node = {
          "pos" : [
            (x * nodesSpace) + utils.getRandomInt(-nodesSpaceRandom, nodesSpaceRandom),
            (y * nodesSpace) + utils.getRandomInt(-nodesSpaceRandom, nodesSpaceRandom)
          ],
          "center" : [
            (x * nodesSpace) + utils.getRandomInt(-nodesSpaceRandom, nodesSpaceRandom),
            (y * nodesSpace) + utils.getRandomInt(-nodesSpaceRandom, nodesSpaceRandom)
          ],
          "connectedTo" : [],
          "edges" : [],
          "moveable" : true
        };

        randomNodes.push(node);
      }
    }
    return randomNodes;
  };

  //**************************** Delete the random nodes that are to close to the diamond ****************************//
  this.throwOutRandomNodesInDiamond = function() {
    var diamondPathBig = [
      "M",
      this.diamondPointsBig[0][0],
      this.diamondPointsBig[0][1],
      "L",
      this.diamondPointsBig[1][0],
      this.diamondPointsBig[1][1],
      "L",
      this.diamondPointsBig[2][0],
      this.diamondPointsBig[2][1],
      "L",
      this.diamondPointsBig[3][0],
      this.diamondPointsBig[3][1],
      "L",
      this.diamondPointsBig[4][0],
      this.diamondPointsBig[4][1],
      "L",
      this.diamondPointsBig[5][0],
      this.diamondPointsBig[5][1],
      "L",
      this.diamondPointsBig[6][0],
      this.diamondPointsBig[6][1],
      "L",
      this.diamondPointsBig[0][0],
      this.diamondPointsBig[0][1]
    ].join(" ");

    var diamondSVGBig = this.paper.path(diamondPathBig).attr({"stroke" : "black"});

    // Delete nodes that are inside the diamond
    var i = this.randomNodes.length;

    while (i--)  {
      if (Snap.path.isPointInside(diamondSVGBig, this.randomNodes[i].pos[0],    this.randomNodes[i].pos[1])) {
        this.randomNodes.splice(i, 1);
      }
    }

    diamondSVGBig.remove();
    return this.randomNodes;
  };

  //**************************** Calculate the network ****************************//
  this.calculateNetwork = function()  {
    // Create point array
    var points = [];

    for (var i = 0; i < this.nodes.length; i++) {
      var point = [
        this.nodes[i].pos[0],
        this.nodes[i].pos[1]
      ];

      points.push(point);
    }

    // Calculate triangles
    var result = cdt2d(points, this.hole, {exterior: false});

    // Parse the result

    var edges = [];

    for (i = 0; i < result.length; i++)  {
      // Let each node know which nodes it is connected to
      this.nodes[result[i][0]].connectedTo.push(result[i][1]);
      this.nodes[result[i][1]].connectedTo.push(result[i][2]);
      this.nodes[result[i][2]].connectedTo.push(result[i][0]);

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
    i = edges.length;
    while(i-- && i > 0)  {
      if (edges[i][0] === edges[i-1][0] && edges[i][1] === edges[i-1][1]) {
        edges.splice(i, 1);
      }
    }

    // Tell each node which edges are connected to it
    for (i = 0; i < edges.length; i++)  {
      this.nodes[edges[i][0]].edges.push(i);
      this.nodes[edges[i][1]].edges.push(i);
    }

    return {
      nodes: this.nodes,
      edges: edges
    };
  };

  //**************************** Draw the network ****************************//
  this.drawNetwork = function() {

    // Draw edges
    for (var i = 0; i < this.edges.length; i++)  {

      // Get the end and start point of the edge
      var start = [this.nodes[this.edges[i][0]].pos[0], this.nodes[this.edges[i][0]].pos[1]];
      var end = [this.nodes[this.edges[i][1]].pos[0],
              this.nodes[this.edges[i][1]].pos[1]];

      // Express the edge as a vector and normalize it
      var vector = [end[0] - start[0], end[1] - start[1]];
      var length = utils.getDistance(start[0], start[1], end[0], end[1]);
      var normalizedVector = [vector[0]/length, vector[1]/length];
      var gap = [normalizedVector[0] * this.gap, normalizedVector[1] * this.gap];

      // Add / subtract it from the start and end position to create a gap
      start[0] += gap[0];
      start[1] += gap[1];
      end[0] -= gap[0];
      end[1] -= gap[1];

      var p = [
        "M",
        start[0],
        start[1],
        "L",
        end[0],
        end[1]
      ].join(" ");

      // If it exists move it if it doesn't create it
      if (Snap.select(this.target + " .edge[edge='" + i + "']"))  {
        Snap.select(this.target + " .edge[edge='" + i + "']").attr({"path" : p });
      } else {
        this.paper.path(p).attr({"edge" : i, "from" : this.edges[i][0], "to" : this.edges[i][1], "class" : "edge"});
      }
    }
  };

  //**************************** Draw the diamond ****************************//
  this.drawDiamond = function() {
    var diamondEdges = [
      [this.diamondPoints[0], this.diamondPoints[1]],
      [this.diamondPoints[1], this.diamondPoints[2]],
      [this.diamondPoints[2], this.diamondPoints[3]],
      [this.diamondPoints[3], this.diamondPoints[4]],
      [this.diamondPoints[4], this.diamondPoints[5]],
      [this.diamondPoints[5], this.diamondPoints[6]],
      [this.diamondPoints[6], this.diamondPoints[0]],
      [this.diamondPoints[1], this.diamondPoints[7]],
      [this.diamondPoints[7], this.diamondPoints[8]],
      [this.diamondPoints[8], this.diamondPoints[4]],
      [this.diamondPoints[5], this.diamondPoints[10]],
      [this.diamondPoints[10], this.diamondPoints[9]],
      [this.diamondPoints[9], this.diamondPoints[0]],
      [this.diamondPoints[6], this.diamondPoints[10]],
      [this.diamondPoints[10], this.diamondPoints[8]],
      [this.diamondPoints[6], this.diamondPoints[9]],
      [this.diamondPoints[9], this.diamondPoints[7]]
    ];

    // Draw edges
    for (var i = 0; i < diamondEdges.length; i++)  {

      // Get the end and start point of the edge
      var start = [diamondEdges[i][0][0], diamondEdges[i][0][1]];
      var end = [diamondEdges[i][1][0], diamondEdges[i][1][1]];

      // Express the edge as a vector and normalize it
      var vector = [end[0] - start[0], end[1] - start[1]];
      var length = utils.getDistance(start[0], start[1], end[0], end[1]);
      var normalizedVector = [vector[0]/length, vector[1]/length];
      var gap = [normalizedVector[0] * this.diamondGap, normalizedVector[1] * this.diamondGap];

      // Add / subtract it from the start and end position to create a gap
      start[0] += gap[0];
      start[1] += gap[1];
      end[0] -= gap[0];
      end[1] -= gap[1];

      var p = [
        "M",
        start[0],
        start[1],
        "L",
        end[0],
        end[1]
      ].join(" ");

      this.paper.path(p).attr({"stroke" : "white"});
    }

  };

  //**************************** Create Lights ****************************//
  this.Light = function(nodes, paper, target)  {
    var self = this;
    this.nodes = nodes;
    this.currentNode = Math.floor(utils.getRandom(0, nodes.length));
    this.nextEdge = 0;
    this.currentEdge = 1;
    this.lastEdge = 0;

    this.move = function() {
      // Finde a new edge from the node that is not the current one
      while (self.currentEdge == self.lastEdge)  {
        var currentEdgePos = Math.floor(utils.getRandom(0, self.nodes[self.currentNode].edges.length));
        self.currentEdge = self.nodes[self.currentNode].edges[currentEdgePos];
      }

      // Light up current edge
      var e = Snap.select(target + " [edge='" + self.currentEdge + "']");
      e.attr({"stroke" : "white"});

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
  };

  //**************************** Change color ****************************//
  this.changeColor = function(color) {
    $(this.target).css({"background-color" : color.regular});
    this.paper.attr({"stroke" : color.light});
  };

  //**************************** React to mouse ****************************//
  this.reactToMouse = function(network) {
    for (var i = 0; i < network.nodes.length; i++)  {
      var n = network.nodes[i];

      if (n.moveable)  {

        // Get the velocity towards the center
        var velocity = [n.center[0] - n.pos[0], n.center[1] - n.pos[1]];
        velocity[0] *= 0.1;
        velocity[1] *= 0.1;

        var velocityFromMouse = [];

        if (window.mouseX && window.mouseY) {

          // Map the distance to the mouse to a multiplier (the closer the bigger)
          var distanceFromMouse = utils.getDistance(n.pos[0], n.pos[1], window.mouseX, window.mouseY);
          distanceFromMouse = Math.min(distanceFromMouse, 150);
          var multiplier = utils.map(distanceFromMouse, 0, 150, -0.9, 0);

          // Get the velocity from the mouse
          velocityFromMouse = [window.mouseX - n.center[0], window.mouseY - n.center[1]];

          // Add it to the usual velocity
          velocity[0] += velocityFromMouse[0] * multiplier;
          velocity[1] += velocityFromMouse[1] * multiplier;
        }

        // Give the node a new position
        n.pos[0] += velocity[0];
        n.pos[1] += velocity[1];
      }
    }

    // Move nodes to their new position
    network.drawNetwork();
  };

  //**************************** Init the reaction to mouse ****************************//
  this.initReactToMouse = function() {
    setInterval(this.reactToMouse, 80, this);
  };


  //********************************************************************//
  //**************************** RUN FOR IT ****************************//
  //********************************************************************//

  this.nodes = [];
  this.hole = [];

  // Create the boundaries
  this.boundaries = this.createBoundaries();
  this.nodes = this.nodes.concat(this.boundaries.nodes);
  this.hole = this.hole.concat(this.boundaries.hole);

  // Create the Diamond
  this.diamond = this.createDiamond();
  this.diamondPoints = this.diamond.diamondPoints;
  this.diamondPointsBig = this.diamond.diamondPointsBig;

  this.nodes = this.nodes.concat(this.diamond.nodes);
  this.hole = this.hole.concat(this.diamond.hole.map(function(point) {
    point[0] += 4;
    point[1] += 4;
    return point;
  }));

  // Create the random nodes (and make sure they are not withing the diamond)
  this.randomNodes = this.createRandomNodes(this.nodeSpacing);
  this.randomNodes = this.throwOutRandomNodesInDiamond();
  this.nodes = this.nodes.concat(this.randomNodes);

  // Calculate the network
  this.network = this.calculateNetwork();
  this.nodes = this.network.nodes;
  this.edges = this.network.edges;

  // Draw the network
  this.drawNetwork();

  // Draw the diamond
  this.drawDiamond();

  // Create lights
  this.lights = [];
  for (var i = 0; i < 8; i++) {
    var light = new this.Light(this.nodes, this.paper, this.target, this.color.verylight);
    this.lights.push(light);
  }

  this.initReactToMouse();
};
