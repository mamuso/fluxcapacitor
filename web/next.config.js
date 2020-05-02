const path = require("path");

module.exports = {
  webpack: (config) => {
    config.resolve.alias["~"] = path.resolve(".");
    return config;
  },
};
