const rewire = require('rewire');

const page = rewire('../../../../../../app/definitions/pages/workplace-contact/claim-summary');
const chai = require('chai');

const {
  assert,
  expect,
} = chai;
chai.use(require('sinon-chai'));
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');

const axiosStub = sinon.stub();
// eslint-disable-next-line no-underscore-dangle
page.__set__('axios', axiosStub);

describe('definitions/pages/workplace-contact/claim-summary', () => {
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
          assert.equal(this.result.view, 'pages/workplace-contact/claim-summary.njk');
        });
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

    it('should display claim summary details', async () => {
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
          getDataForPage: (page) => {
            if (page === '__hidden_user_claim__') {
              return {
                id: 1,
                claimType: 'SUPPORT_WORKER',
                claimant: {
                  forename: 'Fenrir',
                  surname: 'Aland'
                },
              };
            }
          },
        },
      };

      this.result.hooks.prerender(req, res, sinon.stub());

      assert.equal(res.locals.claimReference, 'SW00000001');
      assert.equal(res.locals.employeeName, 'Fenrir Aland');
    });
  });
});
