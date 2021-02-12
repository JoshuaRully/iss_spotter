/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    const ip = JSON.parse(body).ip;

    if (error) return callback(error, null);
      
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response ${body}`), null);
      return;
    }
    callback(null, ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) return callback(error, null);
      
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coords. Response ${body}`), null);
      return;
    }
    const lat = JSON.parse(body).latitude;
    const lon = JSON.parse(body).longitude;
    const coords = {lat, lon};
    callback(null, coords);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.lon}`, (error, response, body) => {
    if (error) return callback(error, null);
      
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS flyover times. Response ${body}`), null);
      return;
    }
    const passTimes = JSON.parse(body).response;
    callback(null, passTimes);
  });
};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, flyoverTimes) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, flyoverTimes);
      });
    });
  });
};

const printPassTimes = function(flyoverTimes) {
  for (const pass of flyoverTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass on ${datetime} for ${duration} seconds!`);
  }
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation, printPassTimes };