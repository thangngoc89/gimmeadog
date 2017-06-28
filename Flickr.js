const path = require("path");
const got = require("got");
const url = require("url");

const Flickr = function(keys) {
  this.apiKey = keys.api_key;
  this.apiUrl = "https://api.flickr.com/services/rest/";
};

Flickr.prototype.getPhotoUrl = function(photo, size = "c", result) {
  const { server, farm, id, secret } = photo;
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
};
Flickr.prototype.get = function(method, opts, result) {
  const queryString = Object.assign(
    {},
    {
      method: "flickr." + method,
      api_key: this.apiKey,
      format: "json",
      nojsoncallback: 1
    },
    opts
  );

  return got(this.apiUrl, { query: queryString, json: true }).then(result => {
    return result;
  });
};

// export the module
module.exports = Flickr;
