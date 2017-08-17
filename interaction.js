'use strict';

const protoChart = {
    width: window.innerWidth,
    height: window.innerHeight,
    margin: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 10,
    },
};

function chartFactory(opts, proto = protoChart) {
    const chart = Object.assign({}, proto, opts);

    chart.svg = d3.select('body')
        .append('svg')
        .attr('id', chart.id || 'chart')
        .attr('width', chart.width)
        .attr('height', chart.height);

    chart.svg.width = chart.svg.attr('width');
    chart.svg.height = chart.svg.attr('height');

    chart.container = chart.svg.append('g')
        .attr('id', 'container')
        .attr('width', chart.width - chart.margin.left - chart.margin.right)
        .attr('height', chart.height - chart.margin.top - chart.margin.bottom)
        .attr('transform', `translate(${chart.margin.left}, ${chart.margin.top})`);

    return chart;
}

const chart = chartFactory();

const squareGroup = chart.svg.append('g').attr('transform', 'translate(400, 400)');

var defs = chart.svg.append("defs");

var gradient = defs.append("linearGradient")
   .attr("id", "svgGradient")
   .attr("x1", "0%")
   .attr("x2", "100%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradient.append("stop")
   .attr('class', 'start')
   .attr("offset", "0%")
   .attr("stop-color", "red")
   .attr("stop-opacity", 1);

gradient.append("stop")
   .attr('class', 'end')
   .attr("offset", "100%")
   .attr("stop-color", "blue")
   .attr("stop-opacity", 1);

squareGroup
  .append('rect')
  .attr('height', 100)
  .attr('width', 100)
  // .attr('x', 400)
  // .attr('y', 400)
  .style('stroke', 'black')
  .style('fill', 'blue');

const diamond = squareGroup
  .append('g')
  .attr('transform', 'rotate(-90)')
  .append('g')
  .attr('transform', 'scale(0.5,1)')
  .append('g')
  .attr('transform', 'rotate(45)')
  .append('rect')
  .attr('height', 100)
  .attr('width', 100)
  .style('stroke', 'black')
  .style('fill', 'url(#svgGradient)');


const rect = chart.container.append('rect')
  .datum(4)
  .attr('width', 100)
  .attr('height', 150)
  .style('stroke', 'red')
  .style('stroke-width', 5)
  .style('fill', 'pink');
console.log('rect', rect.node());

// chart.container.append(()=>rect.node()).attr('transform', 'translate(200,0)');
// chart.container.append(()=>rect.node()).attr('transform', 'translate(200,50)');

rect.on('click', function(d) {
  let caller = d3.select(this);
  if(caller.style('fill') == 'grey'){
    caller.style('fill', 'pink');
  } else {
    caller.style('fill', 'grey')
  }
})


function move(d){
  var x = d3.event.x,
      y = d3.event.y;

  d3.select(this).attr('transform', function(d) {
    return `translate(${x}, ${y})`;
  })
}

rect.call(d3.drag().on('drag', move));
diamond.call(d3.drag().on('drag', move));
chart.svg.call(d3.drag().on('drag',move));
