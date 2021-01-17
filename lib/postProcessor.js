const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { SELECTOR } = require('./utils');

class VariablesOutputPostProcessor {
  constructor({ outputDir, less, theme, prefix }) {
    this.theme = theme;
    this.prefix = prefix;
    this.outputDir = outputDir;
  }

  process(css) {
    // Find the dummy selector in the output CSS
    const selectorStart = css.indexOf(SELECTOR);
    const selectorEnd = css.lastIndexOf('}');
    const selectorContents = css
      .slice(selectorStart + SELECTOR.length + 2, selectorEnd)
      .trim();

    let output = '';

    // Parse the dummy selector's contents into a regular JSON-y object
    selectorContents.split(';').forEach((variable) => {
      if (!variable) {
        return;
      }

      const [name, value] = variable.split(':');

      output = `${output}\n  --${this.prefix ? this.prefix + '-' : ''}${name.trim()}: ${value.trim()};`;
    });

    output = `html[data-theme='${this.theme}'] {${output}\n}`;

    // Write the variables to the given filename, creating
    // directories as we go if not present using mkdirp
    mkdirp.sync(path.dirname('./'));
    fs.writeFileSync(path.resolve(this.outputDir, this.theme + '.css'), output);

    // Remove the dummy selector from the output
    return css.slice(0, selectorStart);
  }
}

module.exports = VariablesOutputPostProcessor;
