beforeEach(function(){

})

describe("this is a test spec", function(){
  it("test it", function(){
    expect(true).toEqual(true);
  })
})

describe("should create chart components:", function(){
  it("SVG exists", function(){
    expect(d3.select('svg').empty()).toBeFalsy();
  })
  it("chart group exists", function(){
    expect(d3.select('#chart').empty()).toBeFalsy();
  })
  it("xaxis group exists", function(){
    expect(d3.select('#xaxis').empty()).toBeFalsy();
  })
  it("yaxis group exists", function(){
    expect(d3.select('#yaxis').empty()).toBeFalsy();
  })
})
