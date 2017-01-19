const { send } = require("micro")
const got = require("got")

const data = require("./data")

const defaultDogUrl = "https://source.unsplash.com/random/400x400/?dog"
let lastDog

const randomDogImage = function () {
  const aDog = data[Math.floor(Math.random() * data.length)]
  return aDog
}
module.exports = async function (req, res) {
  const url = req.url.split("remove_after_me")[0].slice(1) || defaultDogUrl
  const getRedirection = await got(url, {
    method: "HEAD"
  })
  const imgUrl = getRedirection.url

  if (lastDog === imgUrl) {
    res.setHeader("Location", randomDogImage())
  }
  else {
    lastDog = imgUrl
    res.setHeader("Location", imgUrl)
  }
  send(res, 302)
}
