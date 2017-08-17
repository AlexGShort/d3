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
.attr('x', yAxisXLocation)
.attr('y', yAxisYLocation);

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

// x axis test rectangle
xAxisContainer
  .append('rect')
  .attr('width', xAxisWidth)
  .attr('height', xAxisHeight)
  .attr('x', 0)
  .attr('y', 0)
  .style('fill', 'grey')
  .style('stroke', 'black')
  .style('stroke-width', 2);

// y axis test rectangle
yAxisContainer
  .append('rect')
  .attr('width', yAxisWidth)
  .attr('height', yAxisHeight)
  .attr('x', 0)
  .attr('y', 0)
  .style('fill', 'grey')
  .style('stroke', 'black')
  .style('stroke-width', 2);

// chartBody test rectangle
chartBodyContainer
  .append('rect')
  .attr('width', chartBodyWidth)
  .attr('height', chartBodyHeight)
  .attr('x', 0)
  .attr('y', 0)
  .style('fill', 'grey')
  .style('stroke', 'black')
  .style('stroke-width', 2);




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

    console.log("processedData:", processedData);
    // return processedData;
  }

  // display the chart
  console.log("data inside:", processedData);
  showBarChart(processedData[1].data, processedData.headers);

}); // d3.text

/* creates the chart */
function showBarChart(data, labels){
  console.log("data in showbar:", data);
  console.log("labels in showbar:", labels);

  console.log('worldBarchart.container.width', worldBarchart.container.attr('width'));
  var bands = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0, chartBodyWidth])
    .padding(0.1);
  console.log("bands.bandwidth", bands.bandwidth);
  console.log("test band:", bands(2));
  var yscale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, chartBodyHeight]);


  chartBodyContainer
    .append('g')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => bands(i))
    .attr('y', d => chartBodyHeight - yscale(d))
    .attr('width', bands.bandwidth)
    .attr('height', d => yscale(d))
    .style('fill', 'blue');
}
