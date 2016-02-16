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

  for (var x = 0; x < 20; x += 1)  {
    for (var y = 0; y < 20; y += 1)  {

    var node = {
      "id": (x * 20) + y,
      "x": (x * 100) + getRandom(-50,50),
      "y": (y * 100) + getRandom(-50,50)
    };

    nodes.push(node);
    }
  }

  console.log(nodes);


  var trangles = [];

  for (var x = 0; x < 19; x += 1)  {
    for (var y = 0; y < 19; y += 1)  {

      var triangle = [
        "M",
        nodes[(x * 20) + y].x,
        nodes[(x * 20) + y].y,
        "L",
        nodes[((x+1) * 20) + y].x,
        nodes[((x+1) * 20) + y].y,
        "L",
        nodes[(x * 20) + (y+1)].x,
        nodes[(x * 20) + (y+1)].y,
        "L",
        nodes[(x * 20) + y].x,
        nodes[(x * 20) + y].y
      ].join(' ');

      Pablo("header svg").append("<path d='" + triangle + "'/>");

    }
  }



});
