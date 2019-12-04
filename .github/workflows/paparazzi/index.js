const puppeteer = require('puppeteer');
const core = require("@actions/core");
const github = require("@actions/github");

const config = require("../../../timesled-config");

const githubtoken = core.getInput("GITHUB_TOKEN");
const octokit = new github.GitHub(githubtoken);
const context = github.context;
const date = new Date().toISOString().split("T")[0];

(async () => {
 
  // Loop devices
  for (let i = 0; i < config.devices.length; i++) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Emulate device
    let device = config.devices[i].device ? puppeteer.devices[config.devices[i].device] : config.devices[i];
    device.userAgent = device.userAgent || await browser.userAgent();
    await console.log(device.userAgent);
    await page.emulate(device);

//await page.setViewport({width: 1920, height: 1080});
    await page.goto('https://github.com');
    await page.screenshot({path: `screens/${config.devices[i].id}-github.png`, fullPage: true});
    await browser.close();
  }
})();
