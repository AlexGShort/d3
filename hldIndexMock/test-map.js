console.log('test-map ran.');

const svg = d3.select(`body`)
  .append('svg')
  .attr('id', 'chart')
  .attr('width', 1000)
  .attr('height', 600);

const svg2 = d3.select('body')
  .append('svg')
  .attr('id', 'test-sphere')
  .attr('width', 1000)
  .attr('height', 600);

d3.json("http://localhost:8000/assets/land.json", function(json){

  const worldData = json;

  const projection = d3.geoArmadillo().scale(100).fitSize([1000, 600], {type: 'Sphere'});

  /* create clipping path to clip graticule lines */
  let defs = svg.append("defs");

  defs.append("path")
  .datum({type: "Sphere"})
  .attr("id", "sphere")
  .attr("d", d3.geoPath().projection(projection));

  defs.append("clipPath")
  .attr("id", "clip")
  .append("use")
  .attr("xlink:href", "#sphere");


  svg.append('g')
    .selectAll('path')
    // .data(topojson.feature(collection, collection.objects[key]).features)
    // .data(topojson.feature(this.worlddata, this.worlddata.objects.land).features)
    .data(worldData.features)
    .enter()
    .append('path')
    .attr('d', d3.geoPath().projection(projection))
    .attr('clip-path', "url(#clip)");

  /* generate graticule data and display */
  let graticule = d3.geoGraticule();

  svg.append('g')
    .append("path")
    .attr("id", "graticule")
    .datum(graticule())
    .attr('d', d3.geoPath().projection(projection))
    .attr('stroke', 'green')
    .attr('stroke-width', 0.5)
    .attr('fill', 'none')
    .attr('opacity', 0.5)
    .attr('clip-path', "url(#clip)");


  svg2
    .append('path')
    .datum({type: 'Sphere'})
    .attr('d', d3.geoPath().projection(projection))
    .attr('stroke', 'blue')
    .attr('stroke-width', 1)
    .attr('fill', 'none');

  console.log("projection center:", projection.center());

});
