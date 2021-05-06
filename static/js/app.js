// Data file path
const url = "/api/olympics";

// olympicsData.then(row => {
//   console.log(row);
// });

// Assign d3.json to variable
var olympicsData = d3.json(url);

// Create reference variables
var dropdownElement = d3.select("#selYear");
var yearElement = d3.select("#Year");
var barChartElement = d3.select("#bar-two");
var mapElement = d3.select("#map");
var nocDropdownElement = d3.select("#selNOC");
var polarChartElement = d3.select("#polar-area-chart");

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

    // populate NOC region dropdown element
    sortedRegions.forEach(row => {nocDropdownElement
      .append("option")
      .text(row)
      .property("value", row)
    });
    // console.log(sortedRegions);

  })
  
  barTwo();

};

function barTwo () {
  
  // get data
  olympicsData.then(function(response) {
    
  // bar chart with medals by year

  var width = 500
  // document.getElementById('bar-two')
  //     .clientWidth;
  var height = 250
  // document.getElementById('bar-two')
  //     .clientHeight;

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
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  var data = {};

  var x_scale = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.1);

  var y_scale = d3.scaleLinear()
      .range([height, 0]);

  var colour_scale = d3.scaleQuantile()
      .range(["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);

  var y_axis = d3.axisLeft(y_scale);
  var x_axis = d3.axisBottom(x_scale);

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')');

  svg.append('g')
      .attr('class', 'y axis');

  // start with selected year
  
  // placeholder variable vs. selection
  var year = 2016;

  // REPLACE
  //var csv_data = data[year];
  //

  yearFilteredData = [];

  response.forEach((row) => {
    if (row.Year === year) {
      //console.log(row.Year)
      yearFilteredData.push(row.Region,
        // Medal: row.Medal
      )
    }
  });

  // console.log(yearFilteredData)

  var result = _.countBy(yearFilteredData);

  // console.log(Object.keys(result))

  console.log(Object.values(result).sort(function(a, b){return b-a}))

  let medals = {}
  medals = Object.values(result).sort(function(a, b){
      return b-a})

  let countries = {}
  countries = Object.keys(result).sort((a, b) => {
      return result[b] - result[a] 
  });

  top10MedalCount = medals.slice(0,10)
  top10CountryCount = countries.slice(0,10)

  console.log(top10CountryCount, top10MedalCount)

  var t = d3.transition()
      .duration(2000);

  x_scale.domain(top10CountryCount);

  var max_value = d3.max(top10MedalCount);

  console.log(max_value)

  y_scale.domain([0, max_value]);
  colour_scale.domain([0, max_value]);

  var bars = svg.selectAll('.bar')
      .data(top10MedalCount)

  bars
      .exit()
      .remove();

  var new_bars = bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function(top10CountryCount) {
          return x_scale(top10CountryCount.length);
      })
      .attr('width', x_scale.bandwidth())
      .attr('y', height)
      .attr('height', 0)

  new_bars.merge(bars)
      .transition(t)
      .attr('y', function(top10MedalCount) {
          return y_scale(+top10MedalCount);
      })
      .attr('height', function(top10MedalCount) {
          return height - y_scale(+top10MedalCount)
      })
      .attr('fill', function(top10MedalCount) {
          return colour_scale(+top10MedalCount);
      })

  svg.select('.x.axis')
      .call(x_axis);

  svg.select('.y.axis')
      .transition(t)
      .call(y_axis);
  })
}




  
//   // Default plot
//   athleteData.then(row => {
//     buildDashboard(row.NOC[0])
//     console.log("Default NOC:", row.NOC[0])
//   });
//   // Default plots for selected data
//   athleteData.then(row => {
//     buildDashboard(row.NOC[0])
//     console.log("Default NOC:", row.NOC[0])
//   });
// };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   UUU


// // Event handler for new selection
// function nocChanged(nocSelection) {
//   console.log(`National Olympic Committee selection ---> ${nocSelection}`);
//   buildPolarChart(nocSelection);
// };
// nocChanged();



// Read data from database here and format for front-end plotting
// function buildDashboard(nocSelection) {
//   /* data route */
//   athleteData.then(function(data) {
//     // Test
//     // console.log("response", response);
//     // Create reference variable for selected NOC
//     var selectionData = data.NOC.filter(d => d.NOC === nocSelection)[0];
//     console.log(`NOC ${selectionData.NOC} selectionData:`, selectionData);
//     // const data = response;
//     data.forEach(function(row) {
//       row.id = +row.id;
//       row.age = +row.age;
//       row.height = +row.height;
//       row.weight = +row.weight;
//       row.year = +row.year;
//     });
//     console.log("parsed int data", data);
//     // var barDashTrace = {
//       x: selectionData.noc.reverse(),
//       y: selectionData.noc.reverse(),
//     }
//     var barLayout = {
//       scope: "usa",
//       title: "Pet Pals",
//       showlegend: false,
//       height: 600,
//             width: 980,
//       geo: {
//         scope: "usa",
//         projection: {
//           type: "albers usa"
//         },
//         showland: true,
//         landcolor: "rgb(217, 217, 217)",
//         subunitwidth: 1,
//         countrywidth: 1,
//         subunitcolor: "rgb(255,255,255)",
//         countrycolor: "rgb(255,255,255)"
//     };
//   });
//     // Plotly.newPlot("plot", data, layout);
// };

var nocSelection = "USA"
function buildPolarChart() {

  // var filteredData = (row) => {
  //   row.forEach(([key, value]) => {
  //     data.append("td").text(value)
  //   })
  //   console.log(filteredData)
  // }

  // var regionSelection = nocDropdownElement.property("value")
  // console.log("regionSelection--->", regionSelection)

  regionSelectionArray = [];

  // get data
  olympicsData.then(function(response) {

    // Pull out elements for dropdowns
    response.forEach(row => {
      // var regionFilter = row.Region.filter(d => d.Region == nocSelection)[0];
      // console.log(row.Region)
      if (row.Region == nocSelection) {
        regionSelectionArray.push(row.Medal);
      }
      
    });
    console.log("regionSelectionArray-->", regionSelectionArray)
    
    var medalCountByRegion = _.countBy(regionSelectionArray);
    console.log("medalCountByRegion-->", medalCountByRegion)
    


    var data = {
      datasets: [{
          data: [
            medalCountByRegion
          ],
          backgroundColor: [
              "#FF6384",
              "#4BC0C0",
              "#FFCE56",
              "#E7E9ED",
              "#36A2EB"
          ],
          label: 'Region Medal Count by year' // for legend
      }],
      labels: [
          "Red",
          "Green",
          "Yellow",
          "Grey",
          "Blue"
      ]
    };
    var ctx = $("#polar-area-chart");
    new Chart(ctx, {
      data: data,
      type: 'polarArea'
    });

  });
};



buildPolarChart();

init();
