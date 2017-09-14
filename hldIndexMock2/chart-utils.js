'use strict';

var protoChart = {
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

function chartFactory(opts) {
    var chart = {};
    var proto = protoChart;
    chart.target = opts && opts.target || proto.target;
    chart.width = opts && opts.width || proto.width;
    chart.height = opts && opts.height || proto.height;
    chart.margin = opts && opts.margin || proto.margin;
    console.log('proto:', proto);
    console.log('chart:', chart);
    var target = d3.select(chart.target).node();
    console.log("target:", target);
    console.log("target width:", target.offsetWidth || chart.width);
    console.log("target height:", target.offsetHeight || chart.height);
    chart.width = target.offsetWidth || chart.width;
    chart.height = target.offsetHeight || chart.height;
    chart.svg = d3.select(chart.target)
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
      .attr('transform', "translate(" + chart.margin.left + ", " + chart.margin.top + ")");
    chart.container.width = chart.container.attr('width');
    chart.container.height = chart.container.attr('height');
    chart.container.transform = chart.container.attr('transform');

    return chart;
}
