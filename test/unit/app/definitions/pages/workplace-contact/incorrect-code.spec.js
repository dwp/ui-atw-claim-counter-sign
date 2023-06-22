const chai = require('chai');
const page = require(
  '../../../../../../app/definitions/pages/workplace-contact/incorrect-code');

const {
  assert,
  expect,
} = chai;
chai.use(require('sinon-chai'));

describe('definitions/pages/workplace-contact/incorrect-code', () => {
  it('should export a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
    beforeEach(() => {
      this.result = page();
    });
    it('when exported function is invoked', () => {
      assert.typeOf(this.result, 'object');
    });

    describe('returned object keys', () => {
      describe('`view` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('view');
        });
        it('value be a string', () => {
          assert.typeOf(this.result.view, 'string');
          assert.equal(this.result.view,
            'pages/workplace-contact/incorrect-code.njk');
        });
      });
    });
  });
});
