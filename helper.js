// Variables
const axios = require("axios");
const cheerio = require("cheerio");
const config = require("./config");
const Discord = require("discord.js");
const webhookClient = new Discord.WebhookClient(
  config.webhookUrl.split("/")[5],
  config.webhookUrl.split("/")[6]
);
completed = [];

if (config.cookie.length < 20) {
  console.log(
    `Scraping with a max of 100 pages as no cookie was set in config`
  );
  cookie = false;
} else {
  cookie = config.cookie;
}

function getPostCount(account) {
  console.log(` [Info] Account ${account}`);
  axios
    .get(account)
    .then((response) => {
      if (response.status === 200) {
        const data = cheerio.load(response.data);
        const t = data(".active").text();
        newData = t.match(/\d+/g);
        if (newData[1]) {
          scrapePosts(
            account,
            Math.round((newData[0] + newData[1] - 32) / 20 + 2)
          );
        } else {
          const calc = Math.round((newData[0] - 32) / 20) + 2;
          if (calc < 1) {
            scrapePosts(account, 1);
          } else {
            scrapePosts(account, calc);
          }
        }
      }
    })
    .catch((e) => {
      getPostCount(account);
    });
}

function scrapePosts(result, maxPage) {
  if (cookie === false && maxPage > 100) {
    maxPage = 100;
  }
  if (cookie != false && maxPage > 1000) {
    maxPage = 1000;
  }

  for (let i = 1; i < maxPage; i++) {
    setTimeout(() => {
      axios
        .get(`${result}?page=${i}`, {
          headers: {
            Cookie: cookie ? `login_token=${cookie}` : null,
          },
        })
        .then((resp) => {
          console.log("\x1b[32m", `[Scraper] : Scraped ${resp.config.url}`);
          const d = cheerio.load(resp.data);
          d("a").each((_index, value) => {
            if (d(value).attr("href").includes("entry"))
              checkPost(d(value).attr("href"), result, resp.config.url);
          });
        })
        .catch(() => {});
    }, i * 1000);
  }
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
          if (
            completed.includes(
              img.attribs.src.split("/images/")[1].split("/")[0]
            )
          ) {
          } else {
            send(img.attribs.src);
            completed.push(img.attribs.src.split("/images/")[1].split("/")[0]);
          }
        }
      });
    })
    .catch(() => {
      checkPost(url);
    });
}

function send(url) {
  webhookClient
    .send(url, {
      username: "icon",
      avatarURL: "https://i.imgur.com/9aYk9Xz.png",
    })
    .catch(() => send(url));
}

setInterval(() => {
  completed = [];
}, 120000);

module.exports = {
  getPostCount,
};
