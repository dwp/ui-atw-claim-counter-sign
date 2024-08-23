const rewire = require('rewire');
const page = rewire(
  '../../../../../../app/definitions/pages/workplace-contact/request-changes-to-claim');

const sinon = require('sinon');
const axiosStub = sinon.stub();

let assert, expect;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');

// eslint-disable-next-line no-underscore-dangle
page.__set__('axios', axiosStub);

const dataResponse = {
  status: 204,
};

describe('definitions/pages/workplace-contact/request-changes-to-claim', () => {
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
          assert.equal(this.result.view, 'pages/workplace-contact/request-changes-to-claim.njk');
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
            getDataForPage: (page) => {
              if (page === '__hidden_user_claim__') {
                return {
                  id: 1,
                  claimType: 'SUPPORT_WORKER',
                  claimant: {
                    forename: 'Fenrir',
                    surname: 'Aland',
                  },
                };
              } else if (page === 'claim-incorrect') {
                return {
                  claimIncorrect: 'yes',
                };
              }
            },
          },
        };

        this.result.hooks.prerender(req, res, sinon.stub());

        assert.equal(res.locals.claimReference, 'SW00000001');
        assert.equal(res.locals.employeeName, 'Fenrir Aland');
        assert.equal(res.locals.claimIncorrect, 'yes');
        assert.equal(res.locals.BUTTON_TEXT, 'request-changes-to-claim:link');
      });
    });

    describe('`postvalidate` key', () => {
      it('should be defined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('postvalidate');
      });

      it('should check if claim data exists', async () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('postvalidate');

        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();

        req.casa = {
          journeyContext: {
            getDataForPage: (thisPage) => {
              if (thisPage === '__hidden_user_claim__') {
                return {
                  id: '1',
                  claimType: 'SUPPORT_WORKER',
                };
              }
              if (thisPage === '__hidden_address__') {
                return {
                  addressDetails: {
                    address1: 'Road name',
                    address3: 'City',
                    postcode: 'NE26 4RS',
                  },
                };
              }
              if (thisPage === 'company-organisation-name') {
                return {
                  organisation: 'company2',
                };
              }
              if (thisPage === 'job-title') {
                return {
                  jobTitle: 'boss2',
                };
              }
              if (thisPage === 'claim-incorrect') {
                return {
                  reason: 'Here is a  reason.',
                };
              }
              return undefined;
            },
          },
        };

        axiosStub.resolves(Promise.resolve(dataResponse));

        await this.result.hooks.postvalidate(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
      });

      it('should check if response status:200 error', async () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('postvalidate');

        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();

        req.casa = {
          journeyContext: {
            getDataForPage: (thisPage) => {
              if (thisPage === '__hidden_user_claim__') {
                return {
                  id: '1',
                  claimType: 'SUPPORT_WORKER',
                };
              }
              if (thisPage === '__hidden_address__') {
                return {
                  addressDetails: {
                    address1: 'Road name',
                    address3: 'City',
                    postcode: 'NE26 4RS',
                  },
                };
              }
              if (thisPage === 'company-organisation-name') {
                return {
                  organisation: 'company2',
                };
              }
              if (thisPage === 'job-title') {
                return {
                  jobTitle: 'boss2',
                };
              }
              if (thisPage === 'claim-incorrect') {
                return {
                  reason: 'Here is a  reason.',
                };
              }
              return undefined;
            },
          },
        };

        const redirectStub = sinon.stub();

        res.redirect = redirectStub;

        dataResponse.status = 200;

        axiosStub.resolves(dataResponse);

        await this.result.hooks.postvalidate(req, res, nextStub);

        expect(redirectStub)
          .to
          .be
          .calledOnceWithExactly('/review-claim/problem-with-service');
      });

      it('should check if response status:400 error', async () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('postvalidate');

        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();

        req.casa = {
          journeyContext: {
            getDataForPage: (thisPage) => {
              if (thisPage === '__hidden_user_claim__') {
                return {
                  id: '1',
                  claimType: 'SUPPORT_WORKER',
                };
              }
              if (thisPage === '__hidden_address__') {
                return {
                  addressDetails: {
                    address1: 'Road name',
                    address3: 'City',
                    postcode: 'NE26 4RS',
                  },
                };
              }
              if (thisPage === 'company-organisation-name') {
                return {
                  organisation: 'company2',
                };
              }
              if (thisPage === 'job-title') {
                return {
                  jobTitle: 'boss2',
                };
              }
              if (thisPage === 'claim-incorrect') {
                return {
                  reason: 'Here is a  reason.',
                };
              }
              return undefined;
            },
          },
        };

        const redirectStub = sinon.stub();

        res.redirect = redirectStub;

        dataResponse.status = 400;

        axiosStub.resolves(dataResponse);

        await this.result.hooks.postvalidate(req, res, nextStub);

        expect(redirectStub)
          .to
          .be
          .calledOnceWithExactly('/review-claim/problem-with-service');
      });
    });
  });
});
