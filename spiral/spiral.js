'use strict';
// Archimedes' spiral equation is r = a * theta + b
// logarithmic spiral equation is r = a * e^(b*theta)

//generate Archimedes' spiral points

function getArchimedesSpiralPoints(numberOfPoints, multiplier=1, offset=0){
  let xCoords = [];
  let yCoords = [];
  let points = [];
  for( let i=0; i < numberOfPoints; i++){
    let theta = i * Math.PI / 180;
    let x = Math.cos(multiplier * theta) * (multiplier * theta + offset * Math.PI);
    let y = Math.sin(multiplier * theta) * (multiplier * theta + offset * Math.PI);
    xCoords.push(x);
    yCoords.push(y);
    points.push([x, y]);
  }
  var xExtent = d3.extent(xCoords);
  var yExtent = d3.extent(yCoords);
  return {
    points: points,
    xExtent: xExtent,
    yExtent: yExtent
  };
}

function getLogSpiralPoints(numberOfPoints, multiplier1=1, multiplier2 = 1){
  let xCoords = [];
  let yCoords = [];
  let points = [];
  for( let i=0; i < numberOfPoints; i++){
    let theta = i * Math.PI / 180;
    let x = Math.cos(multiplier1 * theta) * (multiplier1 * Math.pow(Math.E, (multiplier2 * theta)));
    let y = Math.sin(multiplier1 * theta) * (multiplier1 * Math.pow(Math.E, (multiplier2 * theta)));
    xCoords.push(x);
    yCoords.push(y);
    points.push([x, y]);
  }
  var xExtent = d3.extent(xCoords);
  var yExtent = d3.extent(yCoords);
  return {
    points: points,
    xExtent: xExtent,
    yExtent: yExtent
  };
}

const logPoints = getLogSpiralPoints(200, 5, 1);

console.log("log points:", logPoints);




// set up Archimedes spiral chart
const archimedesSpiralChart = chartFactory({target: "#archimedes-spiral", height: `${window.innerHeight * 0.5}`, width: `${window.innerHeight * 0.5}`, margin: {top:10, right: 10, bottom: 10, left: 10}});

const defs = archimedesSpiralChart.svg
.append('defs');

// create gradient definition
const gradient = defs.append('linearGradient')
.attr('id', 'svgGradient')
.attr('x1', '0%')
.attr('x2', '100%')
.attr('y1', '0%')
.attr('y2', '0%');

gradient.append("stop")
.attr('class', 'start')
.attr('offset', '0%')
.attr('stop-color', '#2783fc')
.attr('stop-opacity', '1');

gradient.append("stop")
.attr('class', 'end')
.attr('offset', '100%')
.attr('stop-color', '#c90000')
.attr('stop-opacity', '1');

const archimedesSpiralGroup = archimedesSpiralChart.container
  .append('g');
const archimedesSpiralPath = archimedesSpiralGroup
  .append('path');

// render Archimedes spiral
const renderArchimedesSpiral = function(){
  const numberOfPoints = d3.select("#archimedesNumberOfPoints").property("value");
  const multiplier = d3.select("#archimedesMultiplier").property("value");
  const offset = d3.select("#archimedesOffset").property("value");

  const archimedesPoints = getArchimedesSpiralPoints(numberOfPoints, multiplier, offset);
  // console.log("archimedes points:", archimedesPoints);

  d3.select("#archPointsValue").html(numberOfPoints);
  d3.select("#archMultiplierValue").html(multiplier);
  d3.select("#archOffsetValue").html(offset);


  const archXScale = d3.scaleLinear()
  .domain(archimedesPoints.xExtent)
  .range([0, archimedesSpiralChart.container.attr('width')]);

  const archYScale = d3.scaleLinear()
  .domain(archimedesPoints.yExtent)
  .range([0, archimedesSpiralChart.container.attr('height')]);

  const archimedesSpiralLine = d3.line()
  .x(d => archXScale(d[0]))
  .y(d => archYScale(d[1]));

  archimedesSpiralPath
    .datum(archimedesPoints.points)
    .transition()
    .duration(50)
    .attr("opacity", 0)
    .transition()
    .duration(50)
    .attr('d', archimedesSpiralLine.curve(d3.curveBasisOpen))
    .attr('stroke', 'url(#svgGradient)')
    .attr('stroke-width', 4)
    .style('fill', 'none')
    .transition()
    .duration(50)
    .attr('opacity', 1);

  // const archimedesSpiralDots = archimedesSpiralGroup
  //   .selectAll('circle')
  //   .data(archimedesPoints.points);
  //
  // archimedesSpiralDots
  //   .enter()
  //   .append('circle')
  //   .attr('opacity', 0)
  //   .attr('cx', d => archXScale(d[0]))
  //   .attr('cy', d => archYScale(d[1]))
  //   .attr('r', 4)
  //   .transition()
  //   .duration(2000)
  //   .style('opacity', 1);
  //
  // archimedesSpiralDots
  //   .transition()
  //   .duration(2000)
  //   .attr('cx', d => archXScale(d[0]))
  //   .attr('cy', d => archYScale(d[1]));
  //
  // archimedesSpiralDots
  //   .exit()
  //   .transition()
  //   .duration(2000)
  //   .style('opacity', 0)
  //   .remove();
}

renderArchimedesSpiral();


const archNumberOfPoits = d3.select("#archimedesNumberOfPoints")
  .on("change", function(){
    renderArchimedesSpiral();
  })

const archMultiplier = d3.select("#archimedesMultiplier")
  .on("change", function(){
  // let multiplierValue = d3.select(this).property("value");
  // console.log("multiplier value:", multiplierValue);
  // d3.select("#archMultiplierValue").html(multiplierValue);
  // let newData = getArchimedesSpiralPoints(200, multiplierValue);
  // archimedesSpiralPath
  // .datum(newData.points)
  // .attr('d', archimedesSpiralLine.curve(d3.curveNatural));
  renderArchimedesSpiral();
})

const archOffset = d3.select("#archimedesOffset")
  .on("change", function(){
    renderArchimedesSpiral();
  })

const ArchimedesForm = d3.select("#archimedesForm")
  .on("reset", function(){
    setTimeout(function(){
      console.log("reset ran");
      renderArchimedesSpiral();
    });
  })

console.log("arch multiplier:", archMultiplier.property("value"));


// generat logarithmic spiral
const logSpiralChart = chartFactory({target: "#log-spiral", height: `${window.innerHeight * 0.5}`, width: `${window.innerHeight * 0.5}`});

const logXScale = d3.scaleLinear()
  .domain(logPoints.xExtent)
  .range([0, logSpiralChart.container.attr('width')]);

const logYScale = d3.scaleLinear()
  .domain(logPoints.yExtent)
  .range([0, logSpiralChart.container.attr('height')]);

logSpiralChart.container
  .selectAll('circle')
  .data(logPoints.points)
  .enter()
  .append('circle')
  .attr('cx', d => logXScale(d[0]))
  .attr('cy', d => logYScale(d[1]))
  .attr('r', 2)
  .style('fill', 'black');
