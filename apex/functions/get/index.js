const cp = require("child_process");

const totalPages = 5000;
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const getPhotoUrl = (photo, size = "c", result) => {
  const { server, farm, id, secret } = photo;
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
};

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

exports.handle = function(e, ctx, cb) {
  getData()
    .then(data => {
      const url = getPhotoUrl(data, "z");
      ctx.succeed({ location: url });
    })
    .catch(err => cb(err));
};
