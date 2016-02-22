var $ = require("jquery");
var utils = require("./utilities.js");
var Snap = require("snapsvg");
var cdt2d = require("cdt2d");

//**************************** Network ****************************//
module.exports = function(targetSelector, color)  {
  this.target = targetSelector;
  this.paper = Snap(targetSelector);
  this.height = $(this.target).outerHeight();
  this.width = $(this.target).outerWidth();

  this.color = color;

  // Setup drawing paper
  $(this.target).css({"background-color" : this.color.regular});
  this.paper.attr({"fill" : "none", "stroke" : this.color.light, "stroke-width" : "3"});


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
    var nodesX = this.width / nodesSpace + 1;
    var nodesY = this.height / nodesSpace + 1;
    var nodesSpaceRandom = nodesSpace / 3;

    for (var x = 0; x < nodesX; x++)  {
      for (var y = 0; y < nodesY; y++)  {

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
  this.throwOutRandomNodesInDiamond = function(randomNodes, diamondPointsBig) {
    var diamondPathBig = [
      "M",
      diamondPointsBig[0][0],
      diamondPointsBig[0][1],
      "L",
      diamondPointsBig[1][0],
      diamondPointsBig[1][1],
      "L",
      diamondPointsBig[2][0],
      diamondPointsBig[2][1],
      "L",
      diamondPointsBig[3][0],
      diamondPointsBig[3][1],
      "L",
      diamondPointsBig[4][0],
      diamondPointsBig[4][1],
      "L",
      diamondPointsBig[5][0],
      diamondPointsBig[5][1],
      "L",
      diamondPointsBig[6][0],
      diamondPointsBig[6][1],
      "L",
      diamondPointsBig[0][0],
      diamondPointsBig[0][1]
    ].join(" ");

    var diamondSVGBig = this.paper.path(diamondPathBig).attr({"stroke" : "black"});

    // Delete nodes that are inside the diamond
    var i = randomNodes.length;

    while (i--)  {
      if (Snap.path.isPointInside(diamondSVGBig, randomNodes[i].pos[0],    randomNodes[i].pos[1])) {
        randomNodes.splice(i, 1);
      }
    }

    diamondSVGBig.remove();
    return randomNodes;
  };

  //**************************** Calculate the network ****************************//
  this.calculateNetwork = function(nodes, hole)  {
    // Create point array
    var points = [];

    for (var i = 0; i < nodes.length; i++) {
      var point = [
        nodes[i].pos[0],
        nodes[i].pos[1]
      ];

      points.push(point);
    }

    // Calculate triangles
    var result = cdt2d(points, hole, {exterior: false});

    // Parse the result

    var edges = [];

    for (i = 0; i < result.length; i++)  {
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
    i = edges.length;
    while(i-- && i > 0)  {
      if (edges[i][0] === edges[i-1][0] && edges[i][1] === edges[i-1][1]) {
        edges.splice(i, 1);
      }
    }

    // Tell each node which edges are connected to it
    for (i = 0; i < edges.length; i++)  {
      nodes[edges[i][0]].edges.push(i);
      nodes[edges[i][1]].edges.push(i);
    }

    return {
      nodes: nodes,
      edges: edges
    };
  };

  //**************************** Draw the network ****************************//
  this.drawNetwork = function(nodes, edges, color) {

    // Draw edges
    for (var i = 0; i < edges.length; i++)  {

      var p = [
        "M",
        nodes[edges[i][0]].pos[0],
        nodes[edges[i][0]].pos[1],
        "L",
        nodes[edges[i][1]].pos[0],
        nodes[edges[i][1]].pos[1]
      ].join(" ");

      this.paper.path(p).attr({"edge" : i, "from" : edges[i][0], "to" : edges[i][1], "class" : "edge"});
    }

    // Draw nodes
    for (i = 0; i < nodes.length; i++) {
      this.paper.circle(nodes[i].pos[0], nodes[i].pos[1], 8).attr({"fill" : color, "stroke" : "none", "class" : "node", "node" : i});
    }
  };

  //**************************** Draw the diamond ****************************//
  this.drawDiamond = function(diamondPoints, colorRegular) {
    var diamondPath = [
      "M",
      diamondPoints[0][0],
      diamondPoints[0][1],
      "L",
      diamondPoints[1][0],
      diamondPoints[1][1],
      "L",
      diamondPoints[2][0],
      diamondPoints[2][1],
      "L",
      diamondPoints[3][0],
      diamondPoints[3][1],
      "L",
      diamondPoints[4][0],
      diamondPoints[4][1],
      "L",
      diamondPoints[5][0],
      diamondPoints[5][1],
      "L",
      diamondPoints[6][0],
      diamondPoints[6][1],
      "L",
      diamondPoints[0][0],
      diamondPoints[0][1],
      "M",
      diamondPoints[1][0],
      diamondPoints[1][1],
      "L",
      diamondPoints[7][0],
      diamondPoints[7][1],
      "L",
      diamondPoints[8][0],
      diamondPoints[8][1],
      "L",
      diamondPoints[4][0],
      diamondPoints[4][1],
      "M",
      diamondPoints[5][0],
      diamondPoints[5][1],
      "L",
      diamondPoints[10][0],
      diamondPoints[10][1],
      "L",
      diamondPoints[9][0],
      diamondPoints[9][1],
      "L",
      diamondPoints[0][0],
      diamondPoints[0][1],
      "M",
      diamondPoints[6][0],
      diamondPoints[6][1],
      "L",
      diamondPoints[10][0],
      diamondPoints[10][1],
      "L",
      diamondPoints[8][0],
      diamondPoints[8][1],
      "M",
      diamondPoints[6][0],
      diamondPoints[6][1],
      "L",
      diamondPoints[9][0],
      diamondPoints[9][1],
      "L",
      diamondPoints[7][0],
      diamondPoints[7][1]
    ].join(" ");

    this.paper.path(diamondPath).attr({"stroke" : "white", "class" : "diamond"});

    for (var i = 0; i < diamondPoints.length; i++) {
      this.paper.circle(diamondPoints[i][0], diamondPoints[i][1], 7).attr({"fill" : colorRegular, "stroke" : "none", "class" : "node"});
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

  //**************************** Change Color ****************************//
  this.changeColor = function(color) {
    $(this.target).css({"background-color" : color.regular});
    Snap.selectAll(this.target + " .node").attr({"fill" : color.regular});
    this.paper.attr({"stroke" : color.light});
  };

  //**************************** Move nodes to updated position ****************************//
  this.moveNodes = function() {
    for (var i = 0; i < this.edges.length; i++)  {
      var p = [
        "M",
        this.nodes[this.edges[i][0]].pos[0],
        this.nodes[this.edges[i][0]].pos[1],
        "L",
        this.nodes[this.edges[i][1]].pos[0],
        this.nodes[this.edges[i][1]].pos[1]
      ].join(" ");

      Snap.select(".edge[edge='" + i + "']").attr({"path" : p });
    }

    for (i = 0; i < this.nodes.length; i++) {
      Snap.select(".node[node='" + i + "']").attr({"cx" : this.nodes[i].pos[0], "cy" : this.nodes[i].pos[1] });
    }
  };


  //**************************** RUN FOR IT ****************************//
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
  this.randomNodes = this.createRandomNodes(100);
  this.randomNodes = this.throwOutRandomNodesInDiamond(this.randomNodes, this.diamondPointsBig);
  this.nodes = this.nodes.concat(this.randomNodes);

  // Calculate the network
  this.network = this.calculateNetwork(this.nodes, this.hole);
  this.nodes = this.network.nodes;
  this.edges = this.network.edges;

  // Draw the network
  this.drawNetwork(this.nodes, this.edges, this.color.regular);

  // Draw the diamond
  this.drawDiamond(this.diamondPoints, this.color.regular);

  // Create lights
  this.lights = [];
  for (var i = 0; i < 8; i++) {
    var light = new this.Light(this.nodes, this.paper, this.target, this.color.verylight);
    this.lights.push(light);
  }
};
