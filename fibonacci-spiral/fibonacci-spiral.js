'use strict';

const phi = (1 + Math.sqrt(5))/2
console.log("phi:", phi);

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

const getRandomPoints= (num = 1000, limit=100) => {
  let points = [];
  for(let i = 0; i < num; i++){
    points.unshift([Math.round(Math.random()*limit) -50, Math.round(Math.random()*limit)-50]);
  }
  return points;
}


const getSpiralPoints = (num = 1000) => {
  // let angleIncrement = 2 * Math.PI * (1 - 1 / phi);
  let angleIncrement = 2 * Math.PI * (1 - 1/phi);
  let points = [];
  for(let i = 1; i < num + 1; i++){
    let r = Math.sqrt(i) * 0.8;
    let angle = angleIncrement * i;
    let x = r * Math.cos(angleIncrement * i);
    let y = r * Math.sin(angleIncrement * i);
    points.push([x, y]);
  }
  return points.reverse();
}

const chart = chartFactory();
const randomPoints = getRandomPoints(2000);
const spiralPoints = getSpiralPoints(2000);

const scale = d3.scaleLinear()
.domain([-50, 50])
.range([0, chart.svg.attr('height')]);

const colorScale = d3.scaleSequential()
  .domain([0, spiralPoints.length])
  .interpolator(d3.interpolateRainbow);

d3.select('body').style('background-color', '#CCF');

let circles = d3.select("#chart")
  .append('g')
  .attr('id', 'circleContainer')
  .attr('transform', 'translate(500, 500)')
  .append('g')
  .attr('id', 'circles')
  .attr('x', -500)
  .attr('y', -500)
  .selectAll('circle')
  .data(randomPoints)
  .enter()
  .append('circle')
  .attr('cx', d => scale(d[0]))
  .attr('cy', d => scale(d[1]))
  .attr('r', 3)
  .style('fill', 'blue')
  .style('stroke', 'blue')
  .style('stroke-width', 0)
  .style('opacity', 0);

circles
  .transition()
  .duration(1000)
  .delay((d, i) => i * 5)
  .style('opacity', 1)

circles
  .data(spiralPoints)
  .transition("trans1")
  .delay((d, i) => 4000 + i * 5)
  .duration(8000)
  .ease(d3.easeExpInOut)
  .attr('cx', d => scale(d[0]));

circles
  .transition("trans2")
  .delay((d, i) => 4000 + i * 5)
  .duration(8000)
  .ease(d3.easeExpInOut)
  .attr('cy', d => scale(d[1]))
  .attr('r', (d, i) => 2 + (0.005 * i))
  .style('fill', (d, i) => colorScale(i))
  .style('stroke', 'black')
  .style('stroke-width', 2);

circles.attr('transform', 'translate(-500, -500)');

let rotation = (() => {
  let n = 0;
  return function(inc){
    n += inc;
    d3.select('#circles').attr('transform', `rotate(${n})`);
  }
})();

const t = d3.timer(()=>{
  rotation(0.1);
})

setTimeout(()=> {t.stop(); console.log('stopped')}, 18000);
