const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');
const { expect } = require('chai');
const config = require('../demo/manual-entry/webpack.config');

const outDir = path.join(__dirname, '../dist');
const indexOutput =
  '<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script>console.log("hello inline script");</script><script src="app.202933f045cc9f6cdf51.js"></script></body></html>';

describe('manual-entry', function manualEntry() {
  this.timeout(1000 * 60);

  beforeEach(() => {
    rimraf.sync(outDir);
  });

  it('works for an application with a manual entry', done => {
    webpack(config, (err, stats) => {
      if (err) {
        throw err;
      }

      if (stats.hasErrors()) {
        throw stats.compilation.errors[0];
      }

      const { assets } = stats.compilation;
      const assetKeys = Object.keys(assets);

      assetKeys.forEach(key => {
        expect(assets[key].emitted).to.equal(true);
        expect(assets[key].existsAt).to.ok;
      });

      expect(assetKeys.length).to.equal(3);
      expect(assetKeys).to.include('index.html');
      expect(assetKeys.filter(key => key.startsWith('app') && key.endsWith('.js')).length).to.equal(
        1,
      );
      expect(assetKeys.filter(key => key.startsWith('1') && key.endsWith('.js')).length).to.equal(
        1,
      );

      expect(assets['index.html'].source()).to.equal(indexOutput);

      done();
    });
  });
});
