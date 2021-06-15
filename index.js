process.title = "WHI Scraper By NotII"
const prompt = require("prompt");
const helper = require("./helper");
prompt.start();


console.log(` █     █░ ██░ ██  ██▓     ██████  ▄████▄   ██▀███   ▄▄▄       ██▓███  ▓█████  ██▀███  
▓█░ █ ░█░▓██░ ██▒▓██▒   ▒██    ▒ ▒██▀ ▀█  ▓██ ▒ ██▒▒████▄    ▓██░  ██▒▓█   ▀ ▓██ ▒ ██▒
▒█░ █ ░█ ▒██▀▀██░▒██▒   ░ ▓██▄   ▒▓█    ▄ ▓██ ░▄█ ▒▒██  ▀█▄  ▓██░ ██▓▒▒███   ▓██ ░▄█ ▒
░█░ █ ░█ ░▓█ ░██ ░██░     ▒   ██▒▒▓▓▄ ▄██▒▒██▀▀█▄  ░██▄▄▄▄██ ▒██▄█▓▒ ▒▒▓█  ▄ ▒██▀▀█▄  
░░██▒██▓ ░▓█▒░██▓░██░   ▒██████▒▒▒ ▓███▀ ░░██▓ ▒██▒ ▓█   ▓██▒▒██▒ ░  ░░▒████▒░██▓ ▒██▒
░ ▓░▒ ▒   ▒ ░░▒░▒░▓     ▒ ▒▓▒ ▒ ░░ ░▒ ▒  ░░ ▒▓ ░▒▓░ ▒▒   ▓▒█░▒▓▒░ ░  ░░░ ▒░ ░░ ▒▓ ░▒▓░
  ▒ ░ ░   ▒ ░▒░ ░ ▒ ░   ░ ░▒  ░ ░  ░  ▒     ░▒ ░ ▒░  ▒   ▒▒ ░░▒ ░      ░ ░  ░  ░▒ ░ ▒░
  ░   ░   ░  ░░ ░ ▒ ░   ░  ░  ░  ░          ░░   ░   ░   ▒   ░░          ░     ░░   ░ 
    ░     ░  ░  ░ ░           ░  ░ ░         ░           ░  ░            ░  ░   ░     
                                 ░                                                    `)

prompt.get(["whiUrl"], function (err, result) {
    process.title = `Scraping ${result.whiUrl} | WHI Scraper By NotII`
    helper.getPostCount(result.whiUrl);
});
