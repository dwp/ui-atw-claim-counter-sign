const rewire = require('rewire');

const page = rewire('../../../../../../app/definitions/pages/workplace-contact/declaration');
const chai = require('chai');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');

const axiosStub = sinon.stub();
// eslint-disable-next-line no-underscore-dangle
page.__set__('axios', axiosStub);

const dataResponse = {
  status: 204,
};

describe('definitions/pages/workplace-contact/declaration', () => {
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
          assert.equal(this.result.view, 'pages/workplace-contact/1.0/declaration.njk');
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
                surname: 'Aland',
              },
            }),
          },
        };

        this.result.hooks.prerender(req, res, sinon.stub());

        assert.equal(res.locals.employeeName, 'Fenrir Aland');

        assert.equal(res.locals.BUTTON_TEXT, 'declaration:link');
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

      it('should check response status:204 and move to next page', async () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('postvalidate');

        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const redirectStub = sinon.stub();

        res.redirect = redirectStub;

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
              return undefined;
            },
          },
        };

        axiosStub.resolves(Promise.resolve(dataResponse));

        await this.result.hooks.postvalidate(req, res, nextStub);

        expect(redirectStub)
          .to
          .be
          .calledOnceWithExactly('/review-claim/workplace-contact/claim-confirmed');
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
