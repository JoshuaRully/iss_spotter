const { nextISSTimesForMyLocation, printPassTimes } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:', ip);
// });

// fetchCoordsByIP('24.85.172.97', (error, coords) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log('It worked! Returned Coords:', coords);
// });

// fetchISSFlyOverTimes({ lat: 49.6979, lon: -123.1552 }, (error, flyoverTimes) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }
//   console.log('It worked! Retured ISS pass times: ', flyoverTimes)
// })

nextISSTimesForMyLocation((error, flyoverTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(flyoverTimes);
});