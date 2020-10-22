// karma.conf.js
module.exports = function(config) {
  config.set({
    plugins: ["karma-jasmine", "karma-chrome-launcher"],
    files: ["javascript/index.js", "test/*.js"],
    frameworks: ["jasmine"],
    autoWatch: false,
    browsers: ["Chrome"]
  });
};
