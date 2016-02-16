function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getDistance(x1, y1, x2, y2)  {
  return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}

$(document).ready(function()  {
  var h = $(".j__timetable--long").outerHeight();
  $(".j__timetable--short").css({"min-height": h });


  var nodes = [];

  for (var i = 0; i < 700; i++)  {
    var node = {
      "id": i,
      "x": getRandom(0, 500),
      "y": getRandom(0, 500),
      "closest": []
    };

    nodes.push(node);
  }

  for (var i = 0; i < nodes.length; i++)  {
    var closestDistance = [50000000, 50000000, 50000000];

    for (var j = 0; j < nodes.length; j++)  {
      if (nodes[j].id !== nodes[i].id)  {

        var d = getDistance(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);

        if (d <= closestDistance[0])  {
          closestDistance.splice(0, 0, d);
          nodes[i].closest.splice(0, 0, nodes[j].id);
        } else if (d <= closestDistance[1])  {
          closestDistance.splice(1, 0, d);
          nodes[i].closest.splice(1, 0, nodes[j].id);
        } else if (d <= closestDistance[2])  {
          closestDistance.splice(2, 0, d);
          nodes[i].closest.splice(2, 0, nodes[j].id);
        }
      }
    }
  }

  for (var i = 0; i < nodes.length; i++)  {
    for (var j = 0; j < 2; j++) {
      var path = [
        "M",
        nodes[i].x,
        nodes[i].y,
        "L",
        nodes[parseInt(nodes[i].closest[j])].x,
        nodes[parseInt(nodes[i].closest[j])].y,
        "Z"
      ].join(" ");

      Pablo("header svg").append("<path d='" + path + "'/>");
    }
  }


  console.log(nodes);

});
