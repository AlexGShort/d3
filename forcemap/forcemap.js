var w = 1280, h = 800, r = 4.5,
  nodes = [],
  force = d3.forceSimulation()
            .velocityDecay(0.7)
            .alphaDecay(0)
            .force("collision", d3.forceCollide(r + 0.5).strength(1));

var svg = d3.select("body")
  .append("svg")
    .attr("width", w)
    .attr("height", h);

force.on("tick", function(){
  svg.selectAll("circle")
    .attr("cx", function(d){ return d.x; })
    .attr("cy", function(d){ return d.y; });
});

svg.on("mousemove", function(){
  var point = d3.mouse(this),
    node = {x: point[0], y: point[1]};

  svg.append("circle")
    .data([node])
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 1e-6)
    .transition()
      .attr("r", r)
    .transition()
      .delay(20000)
      .attr("r", 1e-6)
      .on("end", function(){
        nodes.shift();
        force.nodes(nodes);
      })
      .remove();

    nodes.push(node);
    force.nodes(nodes);
});

function noForce(){
  force.force("charge", null);
  d3.select("#force").html("No Force");
  force.force("x", null);
  force.force("y", null);
  force.restart();
}

function repulsion(){
  force.force("charge", d3.forceManyBody().strength(-10));
  d3.select("#force").html("Repulsion");
  force.force("x", null);
  force.force("y", null);
  force.restart();
}

function gravity(){
  force.force("charge", d3.forceManyBody().strength(-10));
  force.force("radial", d3.forceRadial(100, w / 2, h / 2).strength(0.1));
  d3.select("#force").html("Gravity");
  // force.force("x", null);
  // force.force("y", null);
  force.restart();
}

function positioningWithGravity(){
  force.force("charge", d3.forceManyBody().strength(0.5));
  d3.select("#force").html("positions with gravity");
  force.force("x", d3.forceX( w / 2 ));
  force.force("y", d3.forceY( h / 2 ));
  force.restart();
}

function positioningWithRepulsion(){
  force.force("charge", d3.forceManyBody().strength(-20));
  d3.select("#force").html("positioning with repulsion");
  force.force("x", d3.forceX( w / 2 ));
  force.force("y", d3.forceY( h / 2 ));
  force.restart();
}
