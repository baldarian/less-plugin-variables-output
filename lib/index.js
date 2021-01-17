const Visitor = require('./visitor');
const PostProcessor = require('./postProcessor');
const PreProcessor = require('./preProcessor');

const DEFAULTS = {
  theme: 'light',
};

class VariablesOutputPlugin {
  constructor(options) {
    this.minVersion = [2, 0, 0];

    this.options = Object.assign({}, DEFAULTS, options);
  }

  install(less, pluginManager) {
    const { theme, prefix, outputDir } = this.options;

    pluginManager.addPreProcessor(new PreProcessor(less));
    pluginManager.addVisitor(new Visitor(less));
    pluginManager.addPostProcessor(new PostProcessor({outputDir, less, theme, prefix}));
  }
}

module.exports = VariablesOutputPlugin;
