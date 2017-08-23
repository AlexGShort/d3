const worldBarchart = chartFactory({target: "#bar-chart", height: `${window.innerHeight * 0.9}`, width: `${window.innerWidth * 0.98}`});

/* set chart component constants and create component svg container groups */

// y axis calculations
const yAxisWidthPercentage = 0.05;
const yAxisWidth = worldBarchart.container.attr('width') * yAxisWidthPercentage;
const yAxisHeight = worldBarchart.container.attr('height');
const yAxisXLocation = 0;
const yAxisYLocation = 0;

const yAxisContainer = worldBarchart.container.append('g')
  .attr('id', 'yAxisContainer')
  .attr('width', yAxisWidth)
  .attr('height', worldBarchart.container.attr('height'))
  .attr('transform', `translate(${yAxisXLocation}, ${yAxisYLocation})`);

// x axis calculations
const xAxisWidth = worldBarchart.container.attr('width') - yAxisWidth;
const xAxisHeightPercentage = 0.05;
const xAxisHeight = worldBarchart.container.attr('height') * xAxisHeightPercentage;
const xAxisXLocation = yAxisWidth;
const xAxisYLocation = worldBarchart.container.attr('height') - xAxisHeight;

const xAxisContainer = worldBarchart.container.append('g')
  .attr('id', 'xAxisContainer')
  .attr('width', worldBarchart.container.attr('width'))
  .attr('height', worldBarchart.container.attr('height') * xAxisHeightPercentage)
  .attr('transform', `translate(${xAxisXLocation}, ${xAxisYLocation})`);

// chart body calculations
const chartBodyWidth = worldBarchart.container.attr('width') - yAxisWidth;
const chartBodyHeight = worldBarchart.container.attr('height') - xAxisHeight;
const chartBodyXLocation = yAxisWidth;
const chartbodyYLocation = 0;

const chartBodyContainer = worldBarchart.container.append('g')
  .attr('id', 'chartBody')
  .attr('width', chartBodyWidth)
  .attr('height', chartBodyHeight)
  .attr('transform', `translate(${chartBodyXLocation}, ${chartbodyYLocation})`);


// create gradient definition

const defs = worldBarchart.svg
  .append('defs');
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
  .attr('stop-color', '#170bf7')
  .attr('stop-opacity', '1');



// // x axis test rectangle
// xAxisContainer
//   .append('rect')
//   .attr('width', xAxisWidth)
//   .attr('height', xAxisHeight)
//   .attr('x', 0)
//   .attr('y', 0)
//   .style('fill', 'grey')
//   .style('stroke', 'black')
//   .style('stroke-width', 2);
//
// // y axis test rectangle
// yAxisContainer
//   .append('rect')
//   .attr('width', yAxisWidth)
//   .attr('height', yAxisHeight)
//   .attr('x', 0)
//   .attr('y', 0)
//   .style('fill', 'grey')
//   .style('stroke', 'black')
//   .style('stroke-width', 2);
//
// // chartBody test rectangle
// chartBodyContainer
//   .append('rect')
//   .attr('width', chartBodyWidth)
//   .attr('height', chartBodyHeight)
//   .attr('x', 0)
//   .attr('y', 0)
//   .style('fill', 'grey')
//   .style('stroke', 'black')
//   .style('stroke-width', 2);
//



/* get the data and call chart creation function */
d3.text("http://localhost:8000/populationbycountry19802010millions.csv", function(error, rawtext){

  if(error){
    return `ERROR!!! - ${error}`;
  } else {

    /*  process raw csv text
        each region/country is an object containing a headers object and a data array
        {
          headers: [header1, header2 ...],
          data: [num1, num2 ...]
        }
    */
    var lines = rawtext.split("\n");

    // create the processed data array
    processedData = [];

    // put headers into headers object
    processedData.headers = (lines[0].split(",").slice(1));

    // put data into data array
    for(let k = 1; k < lines.length; k++){
      let fields = lines[k].split(",");
      let newObject = {};
      newObject.country = fields[0];
      newObject.data = [];
      for(let i = 1; i < fields.length; i++){
        newObject.data.push(+fields[i]);
      }
      processedData.push(newObject);
    }

    // return processedData;
  }

  // display the chart
  showBarChart(processedData[0].data, processedData.headers);

  const countries = processedData.map( d => d.country);

  initializeCountryForm(countries);

}); // end of d3.text function

function initializeCountryForm(countries){
  // initialize country selection form
  d3.select('#countrySelect')
    .selectAll('option')
    .data(countries)
    .enter()
    .append('option')
    .attr('value', (d, i) => i)
    .html( d => d);

  d3.select("#countrySelectButton").on('click', function(e) {
    let countryIndex = d3.select("#countrySelect").property('value');
    showBarChart(processedData[countryIndex].data, processedData.headers);
  })
}



/* creates the chart */
function showBarChart(data, labels){

  data = data.map(d => d * 1000);

  // create scales

  // xScale
  var xScale = d3.scaleBand()
    // .domain(d3.range(data.length))
    .domain(labels)
    .range([0, chartBodyWidth])
    .padding(0.1);

  // yScale
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data) + d3.max(data) * 0.05])
    .range([chartBodyHeight, 0]);

  // create chart body
  const bars = chartBodyContainer
    // .append('g')
    .selectAll('rect')
    .data(data);

  bars
    .enter()
      .append('rect')
    .merge(bars)
      .attr('y', chartBodyHeight)
      .attr('height', 0)
      .attr('x', (d, i) => xScale(labels[i]))
      .attr('width', xScale.bandwidth)
      .style('fill', 'url(#svgGradient)')
      .transition()
      .ease(d3.easeQuadOut)
      .delay( (d, i) => i * 50)
      .duration(1000)
      .attr('y', d => yScale(d))
      .attr('height', d => chartBodyHeight - yScale(d));

  // create y axis
  const yAxis = d3.axisLeft()
  .scale(yScale);
  yAxisContainer
    .data(data)
    .call(yAxis)
    .attr('transform', `translate(${yAxisWidth}, 0)`);

  // create x axis
  const xAxis = d3.axisBottom()
    .scale(xScale);

  xAxisContainer
    .call(xAxis);

  // add data labels
  const labelsText = chartBodyContainer
    .selectAll("text")
      .data(data);

  labelsText
    .enter()
      .append("text")
    .merge(labelsText)
      .text( d => d3.format(",.0f")(d))
      .attr('font-size', '0.7em')
      .attr('text-anchor', 'middle')
      .attr('visibility', 'hidden')
      .attr('x', (d, i) => xScale(labels[i]) + (xScale.bandwidth() / 2))
      .attr('y', (d, i) => yScale(d) - 5)
      .transition()
      .delay( (d, i) => (i * 50) + 1000)
      .attr('visibility', 'visible');

}
