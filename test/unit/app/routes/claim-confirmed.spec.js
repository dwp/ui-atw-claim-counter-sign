const rewire = require('rewire');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');

const thankYou = rewire('../../../../app/routes/claim-submitted');
const sinon = require('sinon');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

const endSessionStub = sinon.stub();
const app = {
  router: {
    get: sinon.stub(),
    use: sinon.stub(),
  },
  endSession: endSessionStub,
};

describe('submit-claim.router', () => {
  const req = new Request();
  const res = new Response(req);

  it('should be a function', () => {
    assert.typeOf(thankYou, 'function');
  });

  describe('use', () => {
    it('should set locals and render submitted page', async () => {
      req.casa = {
        journeyContext: {
          getValidationErrorsForPage: () => {
            return {};
          },
          getDataForPage: (page) => {
            if (page === 'claim-summary') {
              return {
                correctClaim: 'yes',
              };
            }
            if (page === '__hidden_user_claim__') {
              return {
                id: 1,
                claimType: 'SUPPORT_WORKER',
                claimant: {
                  forename: 'Fenrir',
                  surname: 'Aland',
                },
              };
            }
            return undefined;
          },
        },
      };
      endSessionStub
        .resolves(Promise.resolve());

      await thankYou(app)(req, res, true);

      // assert.equal(res.locals.correctClaim, 'yes');
      assert.equal(res.locals.claimReference, 'SW00000001');
      assert.equal(res.locals.employeeName, 'Fenrir Aland');
      assert.equal(res.locals.noNextButton, true);

      assert
        .equal(res.rendered.view, 'pages/workplace-contact/claim-confirmed.njk');
      endSessionStub
        .reset();
    });

    it('should error on submit', async () => {
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'claim-summary') {
              return {
                correctClaim: 'no',
              };
            }
            if (page === '__hidden_user_claim__') {
              return {
                id: 1,
                claimType: 'SUPPORT_WORKER',
                claimant: {
                  forename: 'Fenrir',
                  surname: 'Aland',
                },
              };
            }
            return undefined;
          },
        },
      };
      endSessionStub
        .resolves(Promise.resolve());

      await thankYou(app)(req, res, true);

      // assert.equal(res.locals.correctClaim, 'yes');
      assert.equal(res.locals.claimReference, 'SW00000001');
      assert.equal(res.locals.employeeName, 'Fenrir Aland');
      assert.equal(res.locals.noNextButton, true);

      assert
        .equal(res.rendered.view, 'pages/workplace-contact/claim-confirmed.njk');
      endSessionStub
        .reset();
    });
  });
});
