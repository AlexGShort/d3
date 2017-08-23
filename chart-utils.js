'use strict';

const protoChart = {
    target: "body",
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
    chart.svg = d3.select(`${chart.target}`)
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
