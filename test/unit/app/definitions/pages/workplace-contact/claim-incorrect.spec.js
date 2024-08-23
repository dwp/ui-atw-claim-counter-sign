const rewire = require('rewire');
const page = rewire('../../../../../../app/definitions/pages/workplace-contact/claim-incorrect');

const sinon = require('sinon');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');

describe('definitions/pages/workplace-contact/claim-incorrect', () => {
  it('should page a function', () => {
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
          assert.equal(this.result.view, 'pages/workplace-contact/claim-incorrect.njk');
        });
      });
    });

    describe('`prerender` key', () => {
      it('should be defined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');
      });

      it('should display claim details', async () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

        const req = new Request();
        const res = new Response(req);

        req.casa = {
          journeyContext: {
            getDataForPage: () => ({
              claimant: {
                forename: 'Fenrir',
                surname: 'Aland'
              },
            }),
          },
        };

        this.result.hooks.prerender(req, res, sinon.stub());

        assert.equal(res.locals.employeeName, 'Fenrir Aland');
      });
    });
  });
});
