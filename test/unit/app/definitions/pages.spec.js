let assert;
(async() => {
  assert = (await import ('chai')).assert;
})();
const pages = require('../../../../app/definitions/pages');

describe('definitions/page.js', () => {
  it('when exported function is invoked', () => {
    assert.typeOf(pages, 'function');
  });
  it('when exported function is invoked', () => {
    assert.typeOf(pages(), 'object');
  });

  it('loads all pages', () => {
    assert.typeOf(pages(), 'object');
    assert.equal(Object.keys(pages()).length, 16);
  });
});
