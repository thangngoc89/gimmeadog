const { send } = require("micro");
const Flickr = require("./Flickr");
const cp = require("child_process");

if (process.env.NOW) {
  require("now-logs")("gimmeadog");
}

const flickr = new Flickr({ api_key: "9004c05e70e74904adb8ee60b42856ae" });

const totalPages = 5000;
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const getData = () =>
  new Promise((resolve, reject) => {
    const page = random(1, totalPages);
    cp.exec(`sed '${page}q;d' data.lines`, (e, stdout, stderr) => {
      if (e instanceof Error) {
        reject(err);
      }
      resolve(JSON.parse(stdout));
    });
  });

module.exports = async function(req, res) {
  try {
    const data = await getData();
    res.setHeader("Location", flickr.getPhotoUrl(data, "z"));
    send(res, 302);
  } catch (err) {
    console.error(err);
  }
};
