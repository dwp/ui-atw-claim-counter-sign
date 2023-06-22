const assert = require('chai').assert;

describe('config/config-mapping', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../../../../app/config/config-mapping')];
  });

  it('should export a function', () => {
    const config = require('../../../../app/config/config-mapping');
    assert.typeOf(config, 'object');
  });

  it('should mount the url', () => {
    const config = require('../../../../app/config/config-mapping');
    assert.equal(config.mountURL, '/review-claim/');
  });
});
