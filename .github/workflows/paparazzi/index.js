const puppeteer = require('puppeteer');
const core = require("@actions/core");
const github = require("@actions/github");

const githubtoken = core.getInput("GITHUB_TOKEN");
const octokit = new github.GitHub(githubtoken);
const context = github.context;
const date = new Date().toISOString().split("T")[0];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.goto('https://github.com');
  await page.screenshot({path: 'github.png', fullPage: true});
  await browser.close();
  
  await ()
})();
