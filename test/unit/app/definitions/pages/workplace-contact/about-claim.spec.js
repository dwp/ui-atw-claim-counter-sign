const rewire = require('rewire');

const page = rewire('../../../../../../app/definitions/pages/workplace-contact/about-claim');
const chai = require('chai');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');

describe('definitions/pages/workplace-contact/about-claim', () => {
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
          assert.equal(this.result.view, 'pages/workplace-contact/about-claim.njk');
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

    it('should display claim details - sw', async () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('prerender');

      const req = new Request();
      const res = new Response(req);

      res.locals.casa.mountUrl = '/exampleMountUrl';
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__hidden_user_claim__') {
              return {
                id: 1,
                claimType: 'SUPPORT_WORKER',
                createdDate: '2022-03-12T16:33:16',
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

      assert.equal(res.locals.casa.journeyPreviousUrl, '/exampleMountUrl');
      assert.equal(res.locals.claimReference, 'SW00000001');
      assert.equal(res.locals.createdDate, '2022-03-12T16:33:16');
      assert.equal(res.locals.employeeName, 'Fenrir Aland');
    });

    it('should display claim details - tiw', async () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('prerender');

      const req = new Request();
      const res = new Response(req);

      res.locals.casa.mountUrl = '/exampleMountUrl';
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__hidden_user_claim__') {
              return {
                id: 1,
                claimType: 'TRAVEL_IN_WORK',
                createdDate: '2022-03-12T15:33:16',
                claimant: {
                  forename: 'Alan',
                  surname: 'Jones'
                },
              };
            }
          },
        },
      };

      this.result.hooks.prerender(req, res, sinon.stub());

      assert.equal(res.locals.casa.journeyPreviousUrl, '/exampleMountUrl');
      assert.equal(res.locals.claimReference, 'TIW0000001');
      assert.equal(res.locals.createdDate, '2022-03-12T15:33:16');
      assert.equal(res.locals.employeeName, 'Alan Jones');
    });
  });
});
