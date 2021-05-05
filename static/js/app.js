// Data file path
const url = "/api/olympics";

// olympicsData.then(row => {
//   console.log("Olympics Data:", row);
// });

// Assign d3.json to variable
var olympicsData = d3.json(url);

// Create reference variables
var dropdownElement = d3.select("#selYear");
var nocElement = d3.select("#Year");

function init() {

  // get data
  olympicsData.then(function(response) {
    console.log("Olympics Data:", response);

    // create Set to avoid duplicates
    let years = new Set()

    response.forEach((row) => {
      years
      .add(row.Year)
    });

    // create Array to sort 
    sortedYears = Array.from(years).sort()

    // populate dropdown element
    sortedYears.forEach(year => {
      dropdownElement
      .append("option")
      .text(year)
      .property("value", year)
    });

    barTwo();

})

};

function barTwo () {
  // bar chart with medals by year

  var width = 250
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
  }

  var svg = d3.select('bar-two')
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
  year = 2016

  // REPLACE
  //var csv_data = data[year];
  //

  yearFilteredData = [];

  response.forEach((row) => {
    if (row.Year === year) {
      //console.log(row.Year)
      yearFilteredData.push({
        Region: row.Region,
        // Medal: row.Medal
      })
    }
  });

  console.log(yearFilteredData)

  result = Array.from(yearFilteredData)
  
  //.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));

  console.log(result)

  // var t = d3.transition()
  //     .duration(2000);

  // var months = csv_data.map(function(d) {
  //     return d.month;
  // });
  // x_scale.domain(months);

  // var max_value = d3.max(csv_data, function(d) {
  //     return +d.value;
  // });

  // y_scale.domain([0, max_value]);
  // colour_scale.domain([0, max_value]);

  // var bars = svg.selectAll('.bar')
  //     .data(csv_data)

  // bars
  //     .exit()
  //     .remove();

  // var new_bars = bars
  //     .enter()
  //     .append('rect')
  //     .attr('class', 'bar')
  //     .attr('x', function(d) {
  //         return x_scale(d.month);
  //     })
  //     .attr('width', x_scale.bandwidth())
  //     .attr('y', height)
  //     .attr('height', 0)

  // new_bars.merge(bars)
  //     .transition(t)
  //     .attr('y', function(d) {
  //         return y_scale(+d.value);
  //     })
  //     .attr('height', function(d) {
  //         return height - y_scale(+d.value)
  //     })
  //     .attr('fill', function(d) {
  //         return colour_scale(+d.value);
  //     })

  // svg.select('.x.axis')
  //     .call(x_axis);

  // svg.select('.y.axis')
  //     .transition(t)
  //     .call(y_axis);

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
// };


// // Event handler for new selection
// function optionChanged(nocSelection) {
//   console.log(`National Olympic Committee: ${nocSelection}`);
//   buildDashboard(nocSelection);
// };
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

init();
