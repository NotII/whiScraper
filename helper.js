// Variables
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const config = require("./config");
const Discord = require("discord.js");
const webhookClient = new Discord.WebhookClient(
  config.webhookUrl.split("/")[5],
  config.webhookUrl.split("/")[6]
);
completed = [];

function getPostCount(account) {
    console.log(` [Info] Account ${account}`);
      axios.get(account).then((response) => {
        if (response.status === 200) {
          const data = cheerio.load(response.data);
          const t = data(".active").text();
          newData = t.match(/\d+/g);
          if (newData[1]) {
            scrapePosts(account, Math.round(((newData[0] + newData[1] - 32) / 20) + 2));
          } else {
            const calc = Math.round((parseInt(newData[0]) - 32) / 20) + 2
            if (calc < 1) {
              scrapePosts(account, 1);
            } else {
              scrapePosts(account, calc);
            }
          }
        }
      }).catch(() => {getPostCount(account)})
    }

function scrapePosts(result, maxPage) {
  for (let i = 1; i < maxPage; i++)
    axios
      .get(`${result}?page=${i}`)
      .then((resp) => {
        console.log("\x1b[32m", `[Scraper] : Scraped ${resp.config.url}`);
        const d = cheerio.load(resp.data);
        d("a").each((_index, value) => {
          if (d(value).attr("href").includes("entry"))
            checkPost(d(value).attr("href"), result, resp.config.url);
        });
      })
      .catch((e) => {});
}

function checkPost(url) {
  axios
    .get(`https://weheartit.com/${url}`)
    .then((resp) => {
      const data = cheerio.load(resp.data);
      data(".cel img").each((_i, img) => {
        if (
          img.attribs.src.includes("avatar") ||
          img.attribs.src.includes("weheartit") ||
          img.attribs.src.includes("superthumb") ||
          img.attribs.src.includes("ajax") ||
          img.attribs.src.includes("pink_heart")
        ) {
          return;
        } else {
          if (completed.includes(img.attribs.src.split("/images/")[1].split("/")[0])) {
            return;
          } else {
            fs.appendFileSync("./url1.txt", `${img.attribs.src}\n`);
            completed.push(img.attribs.src.split("/images/")[1].split("/")[0])
            send(img.attribs.src);
          }
        }
      });
    })
    .catch(() => {
        checkPost(url)
    });
}

function send(url) {
  webhookClient.send(url, {
    username: "icon",
    avatarURL: "https://i.imgur.com/9aYk9Xz.png",
  });
}

process.on("uncaughtException", (err) => {
  console.error(err)
});
process.on("uncaughtExceptionMonitor", (err) => {
  console.error(err)
});
process.on("unhandledRejection", (err) => {
  console.error(err)
});

module.exports = {
  getPostCount,
};
