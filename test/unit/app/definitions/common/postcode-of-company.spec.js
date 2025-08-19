const rewire = require('rewire');
const page = rewire('../../../../../app/definitions/pages/common/postcode-of-company');
const sinon = require('sinon');
const axiosStub = sinon.stub();

let assert, expect;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
page.__set__('axios', axiosStub);

const dataResponse = {
  status: 200,
  data: {
    data: [
      {
        key: 'GBR-47079655',
        uprn: '47079655',
        org: [],
        subBuilding: null,
        poBoxNumber: null,
        buildingName: 'THE COTTAGE',
        buildingNumber: null,
        street: [
          'ST. MARYS ISLAND',
        ],
        locality: [],
        postTown: 'WHITLEY BAY',
        postcode: 'NE26 4RS',
        countryCode: 'GBR',
        singleLine: 'THE COTTAGE, ST. MARYS ISLAND, WHITLEY BAY, NE26 4RS',
        alternateSingleLine: 'THE COTTAGE, ST MARYS ISLAND, ST MARYS ISLAND ACCESS ROAD, WHITLEY BAY, NE26 4RS',
        lines: [
          'THE COTTAGE',
          'ST. MARYS ISLAND',
          'WHITLEY BAY',
          'NE26 4RS',
        ],
        homeNationCode: 'ENG',
        localAuthority: 'NORTH TYNESIDE',
        addressType: {
          osLevel1Class: 'R',
          osLevel2Class: 'D',
          osLevel3Class: '2',
          osLevel4Class: '',
          osLevel1Description: 'RESIDENTIAL',
          osLevel2Description: 'DWELLING',
          osLevel3Description: 'DETACHED',
          osLevel4Description: '',
        },
        metaData: {
          source: 'ORDNANCE_SURVEY',
        },
        coordinates: {
          latitude: '55.0717902',
          longitude: '-1.4498227',
          xCoordinate: '435231.00',
          yCoordinate: '575396.00',
        },
      },
    ],
  },
};

const dataResponseEmpty = {
  status: 200,
  data: {
    data: [],
  },
};

describe('definitions/pages/common/postcode-of-company', () => {
  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
    beforeEach(() => {
      this.result = page();
      axiosStub.reset();
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
          assert.equal(this.result.view, 'pages/common/postcode-of-company.njk');
        });
      });

      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });

        it('value should return an object', () => {
          assert.typeOf(this.result.fieldValidators, 'object');
        });
      });

      describe('`preredirect` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');
        });

        it('should be inEditMode preredirect', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();
          const setValidationErrorsForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setValidationErrorsForPage: setValidationErrorsForPageStub,
              setDataForPage: setDataForPageStub,
            },
          };

          req.inEditMode = true;

          req.editOriginUrl = 'test-origin';

          const redirectStub = sinon.stub();

          res.redirect = redirectStub;

          this.result.hooks.preredirect(req, res, nextStub);

          sinon.assert.notCalled(nextStub);

          expect(setValidationErrorsForPageStub)
            .to
            .be
            .calledOnceWithExactly('check-your-answers', undefined);

          expect(redirectStub)
            .to
            .be
            .calledOnceWithExactly('company-address-search?edit=&editorigin=test-origin');

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'company-address-search',
            undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'enter-company-address',
            undefined);
        });

        it('should not be inEditMode preredirect', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
            },
          };

          req.inEditMode = false;

          req.editOriginUrl = 'test-origin';

          const redirectStub = sinon.stub();

          res.redirect = redirectStub;

          this.result.hooks.preredirect(req, res, nextStub);

          sinon.assert.notCalled(setDataForPageStub);
          sinon.assert.notCalled(redirectStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
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

        it('should be inEditMode prerender', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: (pageName) => {
                if (pageName === '__hidden_address__') {
                  return {
                    addressDetails: {
                      address1: 'Road name',
                      address3: 'City',
                      postcode: 'NE26 4RS',
                    },
                  };
                }
                if (pageName === 'company-organisation-name') {
                  return {
                    companyOrganisationName: 'Joe Blogs',
                  };
                }
                return undefined;
              },
            },
          };

          req.inEditMode = true;

          this.result.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.companyName, 'Joe Blogs');

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('company-postcode', { postcode: 'NE26 4RS' });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('should not be inEditMode prerender', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: (pageName) => {
                if (pageName === 'company-organisation-name') {
                  return {
                    companyOrganisationName: 'Joe Blogs',
                  };
                }
                return undefined;
              },
            },
          };

          req.inEditMode = false;

          this.result.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.companyName, 'Joe Blogs');

          sinon.assert.notCalled(setDataForPageStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
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

        it('should retrieve a list of addresses', async () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('postvalidate');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyWaypointId: 'postcode-of-person-or-company-being-paid',
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: () => ({
                postcode: 'NE26 4RS',
              }),
            },
          };

          axiosStub.resolves(Promise.resolve(dataResponse));

          await this.result.hooks.postvalidate(req, res, nextStub);

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('postcode-of-person-or-company-being-paid', {
              postcode: 'NE26 4RS',
              lookup_attempted: true,
              addresses: [
                {
                  uprn: '47079655',
                  postcode: 'NE26 4RS',
                  singleLine: 'THE COTTAGE, ST. MARYS ISLAND, WHITLEY BAY, NE26 4RS',

                }],
            });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('should retrieve an empty list of addresses', async () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('postvalidate');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyWaypointId: 'postcode-of-person-or-company-being-paid',
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: () => ({
                postcode: 'NE27 4RS',
              }),
            },
          };

          axiosStub.resolves(Promise.resolve(dataResponseEmpty));

          await this.result.hooks.postvalidate(req, res, nextStub);

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('postcode-of-person-or-company-being-paid', {
              postcode: 'NE27 4RS',
              lookup_attempted: true,
              addresses: [],
            });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('should retrieve and 404 for address not found', async () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('postvalidate');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyWaypointId: 'postcode-of-person-or-company-being-paid',
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: () => ({
                postcode: 'NE27 4RS',
              }),
            },
          };

          axiosStub.resolves(Promise.reject({ response: { status: 404 } }));

          await this.result.hooks.postvalidate(req, res, nextStub);

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('postcode-of-person-or-company-being-paid', {
              postcode: 'NE27 4RS',
              lookup_attempted: true,
              addresses: [],
            });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });
      });
    });
  });
  describe('Removing white spaces', () => {

    it('should trim spaces from the input values', async () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('pregather');

      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();

      req.body.postcode = '    N   E 26   4 RS';

      await this.result.hooks.pregather(req, res, nextStub);

      expect(req.body.postcode)
        .to
        .equal('NE264RS');
    });
  });
});
