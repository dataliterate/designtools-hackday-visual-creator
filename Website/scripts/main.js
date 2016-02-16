function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getDistance(x1, y1, x2, y2)  {
  return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}

$(document).ready(function()  {
  var h = $(".j__timetable--long").outerHeight();
  $(".j__timetable--short").css({"min-height": h });


//////////////////////////////////////////////////////////////////

  var diamondPoints = [
    {
      "x" : 0,
      "y" : 260
    },{
      "x" : 140,
      "y" : 100
    },{
      "x" : 330,
      "y" : 0
    },{
      "x" : 670,
      "y" : 0
    },{
      "x" : 860,
      "y" : 100
    },{
      "x" : 1000,
      "y" : 260
    },{
      "x" : 500,
      "y" : 960
    },{
      "x" : 330,
      "y" : 190
    },{
      "x" : 670,
      "y" : 190
    },{
      "x" : 200,
      "y" : 420
    },{
      "x" : 800,
      "y" : 420
    },
  ];

  var diamondLines = [
    [0, 1], // left
    [1, 2], // left top
    [2, 3], // top
    [3, 4], // right top
    [4, 5], // right
    [5, 6], // right bottom
    [6, 0], // left bottom
    [0, 9], // left lower center
    [1, 7], // left upper center
    [7, 8], // upper center
    [7, 9], // left upper center to left lower center
    [9, 10], // lower center
    [10, 5], // right lower center
    [10, 8], // right upper center to right lower center
    [8, 4], // right upper center
    [9, 6], // left lower center to bottom
    [10, 6] // right lower center to bottom
  ];

  for (var i = 0; i < diamondLines.length; i++) {
    var path = [
      "M",
      diamondPoints[diamondLines[i][0]].x,
      diamondPoints[diamondLines[i][0]].y,
      "L",
      diamondPoints[diamondLines[i][1]].x,
      diamondPoints[diamondLines[i][1]].y
    ].join(' ');

    Pablo("header svg").append("<path d='" + path + "'/>");
  }

  //
  //
  // var nodes = [];
  //
  // for (var x = 0; x < 20; x += 1)  {
  //   for (var y = 0; y < 20; y += 1)  {
  //
  //   var node = {
  //     "id": (x * 20) + y,
  //     "x": (x * 100) + getRandom(-50,50),
  //     "y": (y * 100) + getRandom(-50,50)
  //   };
  //
  //   nodes.push(node);
  //   }
  // }
  //
  // console.log(nodes);
  //
  //
  // var trangles = [];
  //
  // for (var x = 0; x < 19; x += 1)  {
  //   for (var y = 0; y < 19; y += 1)  {
  //
  //     var triangle = [
  //       "M",
  //       nodes[(x * 20) + y].x,
  //       nodes[(x * 20) + y].y,
  //       "L",
  //       nodes[((x+1) * 20) + y].x,
  //       nodes[((x+1) * 20) + y].y,
  //       "L",
  //       nodes[(x * 20) + (y+1)].x,
  //       nodes[(x * 20) + (y+1)].y,
  //       "L",
  //       nodes[(x * 20) + y].x,
  //       nodes[(x * 20) + y].y
  //     ].join(' ');
  //
  //     Pablo("header svg").append("<path d='" + triangle + "'/>");
  //
  //   }
  // }



});
