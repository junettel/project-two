// Data file paths ** REPLACE WITH DATABASE PATH LATER **
// const athleteURL = "../../data/athlete_events.csv";
// const nocURL = "../../data/noc_regions.csv";
// // Test data read
// var athleteData = d3.csv(athleteURL);
// athleteData.then(row => {
//   console.log("Athlete Data:", row);
// });
// var nocData = d3.csv(nocURL)
// nocData.then(row => {
//   console.log("NOC Region Data:", row);
// });
// Create reference variables
const dropdownElement = d3.select("#selCountry");
const nocElement = d3.select("#noc");
function init() {
    const url = "/api/olympics";
    d3.json(url).then(function(response) {
      console.log(response);
      const data = response;

    })
//   // Add National Olympic Committees to dropdown
//   nocData.then(row => {row.region
//     .forEach(code => dropdownElement
//       .append("option")
//       .text(code)
//       .property("value")
//     );
//   });
  // // Default plot
  // athleteData.then(row => {
  //   buildDashboard(row.NOC[0])
  //   console.log("Default NOC:", row.NOC[0])
  // });
  // // Default plots for selected data
  // athleteData.then(row => {
  //   buildDashboard(row.NOC[0])
  //   console.log("Default NOC:", row.NOC[0])
  // });
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
    //   x: selectionData.noc.reverse(),
    //   y: selectionData.noc.reverse(),
    // }
    // var barLayout = {
    //   scope: "usa",
    //   title: "Pet Pals",
    //   showlegend: false,
    //   height: 600,
            // width: 980,
      // geo: {
      //   scope: "usa",
      //   projection: {
      //     type: "albers usa"
      //   },
      //   showland: true,
      //   landcolor: "rgb(217, 217, 217)",
      //   subunitwidth: 1,
      //   countrywidth: 1,
      //   subunitcolor: "rgb(255,255,255)",
      //   countrycolor: "rgb(255,255,255)"
    // };
//   });
//     // Plotly.newPlot("plot", data, layout);
// };
init();










