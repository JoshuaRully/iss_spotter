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
    const coords = `${lat}, ${lon}`;
    callback(null, coords);
  });
}


module.exports = { fetchMyIP, fetchCoordsByIP };