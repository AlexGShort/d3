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

        chart.svg.append('rect')
        .attr('width', chart.svg.attr('width'))
        .attr('height', chart.svg.attr('height'))
        .attr('stroke-width', 5)
        .attr('stroke', 'red')
        .attr('fill', 'none');

    return chart;
}


const limit = 200;
const num = 20;

const getRandomData= (num, limit=100) => {
  let data = [];
  for(let i = 0; i < num; i++){
    data.push(Math.round(Math.random()*limit));
  }
  return data;
}
// const data = getRandomData(num, limit);
let data = [];
d3.text('http://localhost:8000/data.csv')
  .get((err, res) => {
    data = res.split(",");
    data = data.map(function(d){ return +d});

  let chart = new chartFactory({width: 900, height: 800, margin: {left: 40, right: 20, top: 50, bottom: 50}});

  let xScale = d3.scaleBand()
    .domain(data)
    .range([0, chart.container.attr('width')])
    .paddingInner(0.05)
    .paddingOuter(0.05);

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([chart.container.attr('height'), 0]);

  let radiusScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, chart.container.attr('height')]);

  let colorScale = d3.scaleSequential()
    .domain([0, data.length])
    .interpolator(d3.interpolateCool);

  chart.container.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
    .attr('x', d => xScale(d))
    .attr('y', d => chart.container.attr('height') - radiusScale(d))
    .attr('height', d => radiusScale(d))
    .attr('width', xScale.bandwidth())
    .style('fill', (d, i) => colorScale(i));

  chart.container.append('g')
    .attr('id', 'xaxis')
    .attr('transform', `translate(0, ${chart.container.attr('height')})`)
    .call(d3.axisBottom(xScale));

  let yaxis = chart.container.append('g')
    .attr('id', 'yaxis')
    .attr('transform', 'translate(0, 0)')
    .call(d3.axisLeft(yScale));

  console.log("yaxis bbox:", yaxis.node().getBBox());

});
