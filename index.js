const { send } = require("micro");
const fs = require("pify")(require("fs"));
const Flickr = require("./Flickr");

if (process.env.NOW) {
  require("now-logs")("gimmeadog");
}

const flickr = new Flickr({ api_key: "9004c05e70e74904adb8ee60b42856ae" });

const totalPages = 50;
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const getDataPath = page =>
  process.env.NODE_ENV === "production"
    ? `/tmp/${page}.json`
    : `./data/${page}.json`;

module.exports = async function(req, res) {
  const page = random(1, totalPages);
  let result;
  try {
    result = require(getDataPath(page));
  } catch (e) {
    result = await flickr.get("photos.search", {
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
    await fs.writeFile(
      getDataPath(page),
      JSON.stringify(result.body, null, 2),
      "utf-8"
    );
    result = result.body;
  }
  const finalPhoto = result.photos.photo[random(0, 99)];
  res.setHeader("Location", flickr.getPhotoUrl(finalPhoto, "z"));
  send(res, 302);
};
