const fs = require("fs");
const Flickr = require("./Flickr");
const async = require("async");

const flickr = new Flickr({ api_key: "9004c05e70e74904adb8ee60b42856ae" });
const totalPages = 50;

const ws = fs.createWriteStream("./data.js");

const job = async page => {
  try {
    const res = await flickr.get("photos.search", {
      text: "dog",
      tags: "dog,dogs",
      tag_mode: "all",
      content_type: "photos",
      media: "photos",
      sort: "interestingness-desc",
      license: "1,2,3,4,5,6,7",
      page: page,
      per_page: 100
    });
    const result = res.body.photos.photo;
    result.forEach(data => {
      ws.write(JSON.stringify(data));
    });
  } catch (err) {
    console.error(err);
  }
};

var q = async.queue(job, 2);

q.drain = function() {
  console.log("All items have been processed");
};

for (let i = 1; i <= totalPages; i++) {
  q.push(i, function(err) {
    if (err) {
      console.error(err);
    }
    console.log("Finished processing page", i);
  });
}
