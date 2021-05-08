// Data file path
const url = "/api/olympics";

// test data read as needed
// olympicsData.then(row => {
//   console.log(row);
// });

// Assign d3.json to variable
const olympicsData = d3.json(url);

// Create reference variables
const dropdownElement = d3.select("#selYear");
const yearElement = d3.select("#Year");
const barChartElement = d3.select("#bar-two");
const plotElement = d3.select("#plot");
const nocDropdownElement = d3.select("#selNOC");
const ctx = document.getElementById("polar-area-chart");
// const polarChartElement = d3.select("#polar-area-chart");
// console.log(polarChartElement);


// #########################################
// Initialize charts and dropdowns
// #########################################

function init() {

  // get data
  olympicsData.then(function(response) {
    console.log("Olympics Data:", response);

    // create Sets to avoid duplicates
    let years = new Set();
    let regions = new Set();

    // Pull out elements for dropdowns
    response.forEach((row) => {
      years.add(row.Year);
      regions.add(row.Region);
    });

    // create Arrays to sort 
    var sortedYears = Array.from(years).sort();
    var sortedRegions = Array.from(regions).sort();

    // populate year dropdown element
    sortedYears.forEach(year => {dropdownElement
      .append("option")
      .text(year)
      .property("value", year)
    });
    // console.log("sortedYears", sortedYears);

    // populate region dropdown element
    sortedRegions.forEach(row => {nocDropdownElement
      .append("option")
      .text(row)
      .property("value", row)
    });
    // console.log("sortedRegions", sortedRegions);

    // Set default year
    var filterYear = sortedYears[0];
    console.log("Default Year:", filterYear);

    // Set default region
    var filterRegion = sortedRegions[0];
    console.log("Default Region:", filterRegion);
    
    // Default charts
    barTwo(filterYear);
    buildPolarChart(filterRegion, filterYear);

  });
};


// #########################################
// EVENT HANDLERS
// #########################################

// var filterYear = parseInt(dropdownElement.node().value);
// var filterRegion = nocDropdownElement.node().value;

// year event handler
function yearChanged() { 

  // Create variable for year dropdown value
  var filterYear = parseInt(dropdownElement.node().value);
  var filterRegion = nocDropdownElement.node().value;
  console.log("filterYear year change -->", filterYear);
  console.log("filterRegion year change -->", filterRegion);
  
  barTwo(filterYear);
  buildPolarChart(filterRegion, filterYear);
  
};

// Region change event handler
function regionChanged() {
  
  var filterYear = parseInt(dropdownElement.node().value);
  var filterRegion = nocDropdownElement.node().value;
  console.log("filterYear region change -->", filterYear);
  console.log("filterRegion region change -->", filterRegion);


  buildPolarChart(filterRegion, filterYear);
  
};

// #########################################
// D3 Bar Chart
// #########################################

// bar two variables and set up 
var width = 800;
var height = 400;

var margin = {
  top: 10,
  bottom: 70,
  left: 70,
  right: 20
};

var svg = barChartElement
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .classed("chart", true)
  .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var x_scale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

var y_scale = d3.scaleLinear()
    .range([height, 0]);

var colour_scale = d3.scaleSequential().domain([1,10])
    .interpolator(d3.interpolateRdYlBu);

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);

// x-axis
svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

// y-axis
svg.append('g')
    .attr('class', 'y axis');


function barTwo (filterYear) {
  
  // get data
  olympicsData.then(function(response) {
    
    yearFilteredData = [];

    response.forEach((row) => {
      if (row.Year === filterYear) {
        // console.log("1",filterYear);

        // Add regions to array for chosen year
        yearFilteredData.push(row.Region);
      };
    });

    // console.log("3",filterYear);

    // Count medals won 
    var result = _.countBy(yearFilteredData);
    
    // console.log("Unsorted top 10 regions default year:", Object.keys(result));
    // console.log("barTwo sorted values -->", Object.values(result).sort(function(a, b){return b-a}));

    // Sort bar graph in descending order by medals won
    let medals = {}
    medals = Object.values(result).sort(function(a, b){
      return b-a});

    let countries = {}
    countries = Object.keys(result).sort((a, b) => {
      return result[b] - result[a] 
    });

    // Pull out top 10 medal winning countries
    top10MedalCount = medals.slice(0,10)
    top10CountryCount = countries.slice(0,10)

    // Transition time after event handler triggered
    var t = d3.transition()
        .duration(2000);

    // Scale x-axis for top 10 countries from chosen year
    x_scale.domain(top10CountryCount);

    // Get max medal count value in chosen year for y-axis scale
    var max_value = d3.max(top10MedalCount);
    // console.log("max_value -->", max_value);

    y_scale.domain([0, max_value]);
    colour_scale.domain([0, max_value]);

    var bars = svg.selectAll('.bar')
        .data(top10MedalCount);

    bars
        .exit()
        .remove();

    var new_bars = bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(d,i) {
            return x_scale(top10CountryCount[i])
        })
        .attr('width', x_scale.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .text((d, i) => top10CountryCount[i]);

    new_bars.merge(bars)
        .transition(t)
        .attr('y', function(top10MedalCount) {
            return y_scale(+top10MedalCount);
        })
        .attr('height', function(top10MedalCount) {
            return height - y_scale(+top10MedalCount);
        })
        .attr('fill', function(top10MedalCount) {
            return colour_scale(+top10MedalCount);
        })

    svg.select('.x.axis')
        .call(x_axis);

    svg.select('.y.axis')
        .transition(t)
        .call(y_axis);

    // append x axis
    svg.append("text")
      .attr("x",(width/2))
      .attr("y", height + 30)
      .attr("dy", "1em")
      .attr("font-weight", 700)
      .style("text-anchor", "middle")
      .classed("axis-text", true)
      .text("Top 10 Medal Winners");

    // append y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("font-weight", 700)
      .style("text-anchor", "middle")
      .classed("axis-text", true)
      .text("Medals Won");

    // append title
    svg.append("text")
      .attr("x",(width/2))
      .attr("y", 0 - (margin.top/2))
      .attr("dy", "1em")
      .attr("font-weight", 700)
      .style("text-anchor", "middle")
      .text("Top 10 Countries by Medal Count");
        
  });
};


// #########################################
// Polar area chart
// #########################################

function buildPolarChart(filterRegion, filterYear) {
  // Default year and region
  var filterYear = parseInt(dropdownElement.node().value); // Must be defined within function for parsed integer
  // var filterRegion = nocDropdownElement.node().value;
  var filterRegion = "USA";

  // var regionSelection = nocDropdownElement.property("value");
  // console.log("regionSelection--->", regionSelection);

  // Create empty array to hold all medals for selected region
  var regionSelectionArray = [];
  var metadataArray = [];

  // Get data
  olympicsData.then(function(response) {

    // Pull out elements for dropdowns
    response.forEach(row => {
      // console.log("row.Retion -->", row.Region);
      // console.log("row.Year -->", row.Year);
      if (row.Region === filterRegion && row.Year === filterYear) {
        regionSelectionArray.push(row.Medal);
        metadataArray.push(row);
      };
    });

    console.log("metadataArray", metadataArray);

    // Clear existing html data
    yearElement.html("");

    var metaElementArray = [metadataArray[0].City, metadataArray[0].Season];
    // console.log(metaElementArray)

      yearElement
        .append("p")
        .text(`${metaElementArray[0]}`)
        .append("p")
        .text(`${metaElementArray[1]}`)
  

    // console.log("regionSelectionArray USA test-->", regionSelectionArray);
    // console.log("filterYear--->", filterYear);
    // console.log("filterRegion && filterYear -->", `${filterYear} ${filterRegion}`);

    // Use lodash JS library to provide total medal counts for selected region in key value pairs
    var medalCountByRegion = _.countBy(regionSelectionArray);
    console.log(`${filterYear} ${filterRegion} medalCountByRegion:`, medalCountByRegion);

    // Pull array of keys to pass into chart
    var medalCountKeys = Object.keys(medalCountByRegion);
    // console.log("medalCountByRegion keys --->", Object.keys(medalCountByRegion));
    
    // Pull array of values to pass into chart
    var medalCountValues = Object.values(medalCountByRegion);
    // console.log("medalCountByRegion values --->", Object.values(medalCountByRegion));

    // Polar area chart data
    var mData = {
      datasets: [{
        data: [
          medalCountValues[1], 
          medalCountValues[0], 
          medalCountValues[2]
        ],
        label: 'Medals Won 1896 - 2016',
        backgroundColor: [
          '#D4AF37', // Gold
          '#C0C0C0', // Silver
          '#9F7A34' // Bronze
        ]
      }],
      labels: [
        medalCountKeys[1],
        medalCountKeys[0],
        medalCountKeys[2]
      ]
      
    };

    // Polar area chart options
    var mOptions = {
      segmentStrokeColor: "#000000",
      animateScale: true,
      easeInQuint: true,
      padding: 20,
      plugins: {
        title: {
          display: true,
          text: `Distribution of Medals Won:  ${filterRegion}`
        },
        // legend: {
        //   position: 'right'
        // }
      }
    }

    // console.log("polarChart labels --->", mData.labels);
    // console.log("polarChart data --->", mData.datasets);


    var pChart = new Chart(ctx, {
      type: "polarArea",
      data: mData,
      options: mOptions
    });
  
    // pChart.destroy();
    // console.log(pChart)

    // if(window.pChart === "")
    // {
    //   var pChart = new Chart(ctx, {
    //     type: "polarArea",
    //     data: mData,
    //     options: mOptions
    //   });
    // }
    // else
    // {
    //   pChart.destroy();
    //   var pChart = new Chart(ctx, {
    //     type: "polarArea",
    //     data: mData,
    //     options: mOptions
    //   });
    // }
    


    // on regionChanged()
  
    
    






  });
};



init();
