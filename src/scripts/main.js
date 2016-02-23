//**************************** Includes ****************************//
var $ = require("jquery");
var utils = require("./utilities.js");
var Network = require("./Network.js");

//**************************** Global Vars ****************************//
var colors = getColors();
var hue = 0;
var sat = 0;
var light = 0;

var mainNetwork;

//**************************** Run ****************************//
$(document).ready(function()  {

  $(".hide .button").click(function() {
    $(".content").toggleClass("is-hidden");

    if ($(this).text() == "Hide Sliders")  {
      $(this).text("Show Sliders");
    } else {
      $(this).text("Hide Sliders");
    }
  });

  // Init first Network
  var color = colors[utils.getRandomInt(0, colors.length - 1)];

  hue = color.regular.split(",")[0].split("(")[1];
  sat = color.regular.split(",")[1];
  light = color.regular.split(",")[2].split(")")[0];

  color = utils.hslToHex([color])[0];
  mainNetwork = new Network("#svg", color);

  changeColor(hue, sat, light);
  $(".hue-value").text(hue + "°");
  $(".sat-value").text(sat + "%");
  $(".light-value").text(light + "%");

  $("#hue").val(hue);
  $("#sat").val(sat);
  $("#light").val(light);

  $("#hue").on("input", function () {
    hue = $(this).val();
    changeColor(hue, sat, light);
    $(".hue-value").text(hue + "°");
  });

  $("#sat").on("input", function () {
    sat = $(this).val();
    changeColor(hue, sat, light);
    $(".sat-value").text(sat + "%");
  });

  $("#light").on("input", function () {
    light = $(this).val();
    changeColor(hue, sat, light);
    $(".light-value").text(light + "%");
  });

});

function changeColor(hue, sat, light) {
  var litLight = parseInt(light) + 8;
  var color = utils.hslToHex([
    {
      light: "hsl(" + hue + "," + sat + "," + (litLight) + ")",
      regular: "hsl(" + hue + "," + sat + "," + (light) + ")"
    }
  ]);

  $("#svg path").css({"transition" : "none"});
  mainNetwork.changeColor(color[0]);
  setTimeout(function(){
    $("#svg path").css({"transition" : ""});
  },100);
}

//**************************** Get the Colors ****************************//
function getColors()  {
  var colors = [
    {
      // Teal
      light: "hsl(170,97,45)",
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
    var eventDoc, doc, body;

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

    window.mouseX = event.pageX;
    window.mouseY = event.pageY;
  }
})();
