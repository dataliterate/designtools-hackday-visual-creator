//**************************** Includes ****************************//
var $ = require('jquery');
var utils = require("./utilities.js");
var Network = require("./Network.js");

//**************************** Global Vars ****************************//
var colors = getColors();
var hue = 0;
var sat = 0;
var lit = 0;

var mouseX = undefined;
var mouseY = undefined;

//**************************** Run ****************************//
$(document).ready(function()  {

  // Init first Network
  var color = colors[utils.getRandomInt(0, colors.length - 1)];

  hue = color.regular.split(",")[0].split("(")[1];
  sat = color.regular.split(",")[1];
  lit = color.regular.split(",")[2].split(")")[0];

  color = utils.hslToHex([color])[0];
  mainNetwork = new Network("#svg", color);

  changeColor(hue, sat, lit);
  $(".hue-num").text(hue + "°");
  $(".sat-num").text(sat + "%");
  $(".lit-num").text(lit + "%");

  $("#hue").val(hue);
  $("#sat").val(sat);
  $("#lit").val(lit);

  $("#hue").on('input', function () {
    hue = $(this).val();
    changeColor(hue, sat, lit);
    $(".hue-num").text(hue + "°");
  });

  $("#sat").on('input', function () {
    sat = $(this).val();
    changeColor(hue, sat, lit);
    $(".sat-num").text(sat + "%");
  });

  $("#lit").on('input', function () {
    lit = $(this).val();
    changeColor(hue, sat, lit);
    $(".lit-num").text(lit + "%");
  });


  setInterval(tick, 40, mainNetwork);

});

function changeColor(hue, sat, lit) {
  var litLight = parseInt(lit) + 10;
  var color = utils.hslToHex([
    {
      light: "hsl(" + hue + "," + sat + "," + (litLight) + ")",
      regular: "hsl(" + hue + "," + sat + "," + (lit) + ")",
    }
  ]);

  $("#svg path").css({"transition" : "none"});
  mainNetwork.changeColor(color[0]);
  setTimeout(function(){
    $("#svg path").css({"transition" : ""});
  },100);
}

//**************************** TICK ****************************//
function tick(network) {
  for (var i = 0; i < network.nodes.length; i++)  {
    n = network.nodes[i];

    if (n.moveable)  {

      // Get the velocity towards the center
      var velocity = [n.center[0] - n.pos[0], n.center[1] - n.pos[1]];
      velocity[0] *= 0.1;
      velocity[1] *= 0.1;

      var velocityFromMouse = [];

      if (mouseX && mouseY) {

        // Map the distance to the mouse to a multiplier (the closer the bigger)
        var distanceFromMouse = utils.getDistance(n.pos[0], n.pos[1], mouseX, mouseY);
        distanceFromMouse = Math.min(distanceFromMouse, 150);
        var multiplier = utils.map(distanceFromMouse, 0, 150, -0.9, 0);

        // Get the velocity from the mouse
        velocityFromMouse = [mouseX - n.center[0], mouseY - n.center[1]];

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
  network.moveNodes();
}

//**************************** Get the Colors ****************************//
function getColors()  {
  var colors = [
    {
      // Teal
      light: "hsl(170,97,50)",
      regular: "hsl(170,97,40)"
    }, {
      // Blue
      light: "hsl(212,70,75)",
      regular: "hsl(212,70,65)"
    }, {
      // Fuchsia
      light: "hsl(357,100,80)",
      regular: "hsl(357,100,70)"
    }, {
      // Orange
      light: "hsl(43,74,70)",
      regular: "hsl(43,75,60)"
    }
  ];

  return colors;
}

//**************************** Get Mouse Position ****************************//
(function() {
  document.onmousemove = handleMouseMove;
  function handleMouseMove(event) {
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX === null && event.clientX !== null) {
      eventDoc = (event.target && event.target.ownerDocument) || document;
      doc = eventDoc.documentElement;
      body = eventDoc.body;

      event.pageX = event.clientX +
      (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
      (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY +
      (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
      (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    mouseX = event.pageX;
    mouseY = event.pageY;
  }
})();
