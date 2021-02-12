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

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.lon}`, (error, response, body) => {
    if (error) return callback(error, null);
      
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coords. Response ${body}`), null);
      return;
    }
    const passTimes = JSON.parse(body).response;
    callback(null, passTimes);
  });
};


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };