/* define world map
    worldMap.svg (id='chart') is the containing svg Object
      includes:
        worldMap.svg.width
        worldMap.svg.height
    worldMap.container is the svg group (id='container') that will contain the chart
      includes:
        worldMap.container.width
        worldMap.container.height
        worldMap.container.transform
*/

var worldMap = chartFactory({target:"#world-map", margin: {top:50, bottom:50, left:50, right:50}});

/* get .container dimensions, calculate video location */

var containerWidth = d3.select('.container').node().offsetWidth;
var containerHeight = d3.select('.container').node().offsetHeight;


// var projection = d3.geoEquirectangular().fitSize([worldMap.container.attr('width'), worldMap.container.attr('height')], {type: "Sphere"});
var projection = d3.geoArmadillo()
  // .center([8, 56])
  .parallel([30])
  .fitSize([worldMap.container.attr('width'), worldMap.container.attr('height')], {type: "Sphere"});

var graticule = d3.geoGraticule()
.step([10,10]);

/* create clipping path to clip graticule lines */
var defs = worldMap.svg.insert("defs", "#container");

defs.append("clipPath")
  .attr("id", "clip")
  .append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", d3.geoPath().projection(projection));

// console.log("graticule:", graticule());

var pathGenerator = d3.geoPath().projection(projection);

/* show video */
var videoRatio = 315 / 560;

var videoWidth = worldMap.container.width;
var videoHeight = videoWidth * videoRatio;
var videoLeft = worldMap.margin.left;
var videoTop = worldMap.margin.top;

d3.select('.container')
  .insert('div', '#world-map')
    .attr('id', 'bg-video')
    .style('clip-path', 'url(#clip)')
    .attr('z-index', 1)
    .attr('opacity', 0.5)
    .style('width', videoWidth + 'px')
    .style('height', videoHeight + 'px')
    .style('top', '80px')
    .style('left', '50px')
    .style('position', 'absolute')
    // .style('background-color', 'blue')
    .append('video')
      .attr('src', 'assets/HLD-sequence.mp4')
      .attr('type', 'video/mp4')
      .attr('width', videoWidth)
      .attr('height', videoHeight)
      .attr('autoplay', true)
      .attr('loop', true)
;


d3.json("assets/land-simplified.json", function(json){
  // console.log("world json:", json);

  var worldData = json;

  draw(worldData);

})

var draw = function(worldData) {
  // var [sea, land, cultural] = worldData;
  // console.log("worldData:", worldData);
  var land = worldData;

  // addToMap(sea, 'water').classed('water', true);
  addToMap(land, 'land').classed('land', true);
  // addToMap(cultural, 'ne_50m_admin_0_boundary_lines_land').classed('boundary', true);
  // addToMap(cultural, 'ne_50m_urban_areas').classed('urban', true);

  /* generate graticule data and display */

  worldMap.container
    .append("path")
    .attr("id", "graticule")
    .attr('d', pathGenerator(graticule()))
  ;

  var cityData = getPerformances(projection);
  addCitiesToMap(worldMap.container, cityData);
}; // end draw function

var addToMap = function(collection, key) {
  return worldMap.container.append('g')
    .attr("id", "map")
    .selectAll('path')
    // .data(topojson.feature(collection, collection.objects[key]).features)
    // .data(topojson.feature(this.worlddata, this.worlddata.objects.land).features)
    // .data(worldData.features)
    .data(collection.features)
    .enter()
    .append('path')
    .attr('d', d3.geoPath().projection(projection))
    ;
}

function getPerformances(projection) {
  var coordParis = [2.3513, 48.8565];
  var coordLondon = [-0.1277, 51.5073];
  var coordPrague = [14.4212, 50.0874];
  var cities = [
    {city: "Paris", coordinates: coordParis, collaborator: "Mary", year: '2011'},
    {city: "London", coordinates: coordLondon, collaborator: "John", year: '2012'},
    {city: "Prague", coordinates: coordPrague, collaborator: "Peter", year: '2013'}
  ];
  return cities;
}

function addCitiesToMap(map, cities) {
  var circleRadius = 6;
  map.append('g')
  .attr('id', "cities")
  .selectAll('circle')
  .data(cities)
  .enter()
  .append('circle')
  .attr('class', 'circle')
  .attr('cx', function(d){ return projection(d.coordinates)[0]})
  .attr('cy', function(d){ return projection(d.coordinates)[1]})
  .attr('r', circleRadius)
  .on("mouseover", handleMouseover)
  .on("mouseout", handleMouseout)
  ;
}

function handleMouseover(e){
  mapRotationStop = true;
  worldMap.container.append('foreignObject')
  .attr('x', d3.mouse(this)[0] - 10)
  .attr('y', d3.mouse(this)[1] - 10)
  .attr('width', 150)
  .attr('height', 30)
  .append('xhtml:div')
  .append('div')
  .classed('tooltip-text', true)
  .html('"' + e.city + ', ' + e.year + '"')
  .on("mouseover", function(e){ mapRotationStop = true;})
  .on("mouseout", function(e){ mapRotationStop = false; d3.select('.tooltip-text').remove();});

  console.log("this:", this);
  console.log('d3.mouse:', d3.mouse(this));
}

function handleMouseout(){
  mapRotationStop = false;
}

// draw(worldData);

var mapRotation = 0;
var mapRotationStop = false;

var mapRotate = function(){
  if (!mapRotationStop){
    projection.rotate([mapRotation, 0, 0]);
    d3.select("#map")
    .selectAll('path')
    .attr('d', d3.geoPath().projection(projection));
    d3.select("#graticule")
    .attr('d', pathGenerator(graticule()));
    d3.select("#cities")
    .selectAll('circle')
    .attr('cx', function(d){ return projection(d.coordinates)[0]})
    .attr('cy', function(d){ return projection(d.coordinates)[1]});

    mapRotation += 0.5;
  }
}

/* use d3.timer, not setInterval */
d3.timer(mapRotate);
// setInterval(mapRotate, 500);
