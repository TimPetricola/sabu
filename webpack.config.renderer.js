module.exports = config => {
  const cssRule = config.module.rules.find(
    rule => rule.test.toString() === "/\\.css$/"
  );

  cssRule.use.push("postcss-loader");

  return config;
};
