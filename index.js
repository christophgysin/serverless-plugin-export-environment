const fs = require('fs');

class ServerlessExportEnvironment {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      environment: {
        usage: 'Export environment variables',
        lifecycleEvents: [
          'export',
        ],
        options: {
          function: {
            usage: 'Include function specific environment',
            shortcut: 'f',
          },
          output: {
            usage: 'Write output to file',
            shortcut: 'o',
          },
        },
      },
    };
    this.hooks = {
      'environment:export': this.exportEnvironment.bind(this),
    };
  }

  getGlobalEnvironment() {
    return this.serverless.service.provider.environment;
  }

  getFunctionEnvironment(name) {
    if (name === undefined) {
      return {};
    }
    const func = this.serverless.service.getFunction(name);
    return func.environment;
  }

  exportEnvironment() {
    this.serverless.cli.log('Environment');

    const environment = Object.assign({},
      this.getGlobalEnvironment(),
      this.getFunctionEnvironment(this.options.function))

    const output = Object.keys(environment)
      .map(key => `export ${key}=${environment[key]}`)
      .join('\n');

    const outputFile = this.options.output;

    if (outputFile === undefined) {
      console.log(output);
    } else {
      fs.writeFileSync(outputFile, output);
    }
  }
}

module.exports = ServerlessExportEnvironment;
