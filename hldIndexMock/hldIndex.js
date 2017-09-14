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

const worldMap = chartFactory({target:"#world-map", margin: {top:50, bottom:50, left:50, right:50}});

/* get .container dimensions, calculate video location */

const containerWidth = d3.select('.container').node().offsetWidth;
const containerHeight = d3.select('.container').node().offsetHeight;


// const projection = d3.geoEquirectangular().fitSize([worldMap.container.attr('width'), worldMap.container.attr('height')], {type: "Sphere"});
const projection = d3.geoArmadillo()
  .fitSize([worldMap.container.attr('width'), worldMap.container.attr('height')], {type: "Sphere"});
  // .center([8, 56])
  // .parallel([30])
  // .scale(200);

const graticule = d3.geoGraticule()
.step([10,10]);

/* create clipping path to clip graticule lines */
let defs = worldMap.container.append("defs");

defs.append("path")
.datum({type: "Sphere"})
.attr("id", "sphere")
.attr("d", d3.geoPath().projection(projection));

defs.append("clipPath")
.attr("id", "clip")
.append("use")
.attr("href", "#sphere");

// console.log("graticule:", graticule());

const pathGenerator = d3.geoPath().projection(projection);
// console.log("graticule path string:", pathGenerator(graticule()));

/* show video */
const videoRatio = 315 / 560;

const videoWidth = worldMap.container.width;
const videoHeight = videoWidth * videoRatio;
const videoLeft = worldMap.margin.left;
const videoTop = worldMap.margin.top;

d3.select('.container')
.insert('div', '#world-map')
.attr('id', 'bg-video')
.style('clip-path', 'url(#clip)')
.attr('z-index', 1)
.attr('opacity', 0.5)
.style('width', `${videoWidth}px`)
.style('height', `${videoHeight}px`)
.style('top', `50px`)
.style('left', `50px`)
.style('position', 'absolute')
// .style('background-color', 'blue')
.append('iframe')
.attr('frameBorder', 0)
.attr('width', videoWidth)
.attr('height', videoHeight)
.attr('src', "https://www.youtube.com/embed/my6oanzuArg?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1&amp;modestbranding=1&amp;wmode=transparent");


d3.json("http://localhost:8000/assets/land.json", function(json){
  // console.log("world json:", json);
  const worldData = json;

  const draw = (worldData) => {
    // const [sea, land, cultural] = worldData;
    // console.log("worldData:", worldData);
    const land = worldData;

    // addToMap(sea, 'water').classed('water', true);
    addToMap(land, 'land').classed('land', true);
    // addToMap(cultural, 'ne_50m_admin_0_boundary_lines_land').classed('boundary', true);
    // addToMap(cultural, 'ne_50m_urban_areas').classed('urban', true);

    /* generate graticule data and display */

    worldMap.container
      .append("path")
      .attr("id", "graticule")
      .attr('d', pathGenerator(graticule()))
      .attr('stroke', '#999')
      .attr('stroke-width', 0.5)
      .attr('fill', 'none')
      .attr('opacity', 0.5)
      .attr('clip-path', "url(#clip)");

    console.log("map translate:", projection.translate());
    console.log("map translate", projection.translate());

    const cityData = getPerformances(projection);
    addCitiesToMap(worldMap.container, cityData);
  }; // end draw function

  const addToMap = (collection, key) => worldMap.container.append('g')
  .attr("id", "map")
  .selectAll('path')
  // .data(topojson.feature(collection, collection.objects[key]).features)
  // .data(topojson.feature(this.worlddata, this.worlddata.objects.land).features)
  .data(worldData.features)
  .enter()
  .append('path')
  .attr('d', d3.geoPath().projection(projection))
  .attr("clip-path", "url(#clip)");

  function getPerformances(projection) {
    // const coordParis = projection([2.3513, 48.8565]);
    // const coordLondon = projection([-0.1277, 51.5073]);
    // const coordPrague = projection([14.4212, 50.0874]);
    const coordParis = [2.3513, 48.8565];
    const coordLondon = [-0.1277, 51.5073];
    const coordPrague = [14.4212, 50.0874];
    const cities = [
      {city: "Paris", coordinates: coordParis, collaborator: "Mary", year: '2011'},
      {city: "London", coordinates: coordLondon, collaborator: "John", year: '2012'},
      {city: "Prague", coordinates: coordPrague, collaborator: "Peter", year: '2013'}
    ];
    return cities;
  }

  function addCitiesToMap(map, cities) {
    const circleRadius = 6;
    map.append('g')
      .attr('id', "cities")
      .selectAll('circle')
      .data(cities)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('cx', d => projection(d.coordinates)[0])
      .attr('cy', d => projection(d.coordinates)[1])
      .attr('r', circleRadius)
      .on("mouseover", handleMouseover)
      .on("mouseout", handleMouseout);
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
      .html(`${e.city}, ${e.year}`)
      .on("mouseover", e => { mapRotationStop = true;})
      .on("mouseout", e => { mapRotationStop = false; d3.select('.tooltip-text').remove();});

    console.log("this:", this);
    console.log('d3.mouse:', d3.mouse(this));
  }

  function handleMouseout(){
    mapRotationStop = false;
  }

  draw(worldData);

  var mapRotation = 0;
  var mapRotationStop = false;

  const mapRotate = function(){
    if (!mapRotationStop){
      projection.rotate([mapRotation, 0, 0]);
      d3.select("#map")
        .selectAll('path')
        .attr('d', d3.geoPath().projection(projection));
      d3.select("#graticule")
        .attr('d', pathGenerator(graticule()));
      d3.select("#cities")
        .selectAll('circle')
        .attr('cx', d => projection(d.coordinates)[0])
        .attr('cy', d => projection(d.coordinates)[1]);

      mapRotation += 0.5;
    }
  }

  /* use d3.timer, not setInterval */
  d3.timer(mapRotate);
  // setInterval(mapRotate, 500);

})
