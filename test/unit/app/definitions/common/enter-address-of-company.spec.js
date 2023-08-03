const rewire = require('rewire');

const page = rewire('../../../../../app/definitions/pages/common/enter-address-of-company');
const chai = require('chai');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const { trimPostalAddressObject } = require('@dwp/govuk-casa').gatherModifiers;

describe('definitions/pages/common/enter-address-of-company', () => {
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
          assert.equal(this.result.view, 'pages/common/enter-address-of-company.njk');
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
    });


    describe('trimPostalAddressObject of fieldGatherModifiers', () => {
      it('should trim spaces from address object', async () => {
        expect(Object.keys(this.result))
          .to
          .includes('fieldGatherModifiers');

        const req = new Request();

        req.body.address =  { fieldValue:
            {
              "address1": "    1 Kenton Road    ",
              "address2": "    L o n d o n",
              "address3": "middlesex    ",
              "address4": "UK",
              "postcode": "    N   E 26   4 RS"
            }
        };

        const addressWithoutSpaces = {
          "address1": "1 Kenton Road",
          "address2": "L o n d o n",
          "address3": "middlesex",
          "address4": "UK",
          "postcode": "NE26 4RS",
        };

        expect(trimPostalAddressObject(req.body.address))
          .to
          .include
          .deep
          .equals(addressWithoutSpaces);
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
      it('should populate local with companyName', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

        const req = new Request();
        const res = new Response(req);

        const getDataForPageStub = sinon.stub()
          .returns({
            companyOrganisationName: 'George',
          });
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub,
          },
        };

        this.result.hooks.prerender(req, res, nextStub);

        assert.equal(res.locals.companyName, 'George');

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('company-organisation-name');

        sinon.assert.notCalled(setDataForPageStub);
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

      it('should setPage on hidden Address Waypoint', () => {
        const addressObj = {
          address1: 'Road',
          address2: 'Road2',
          postCode: 'Post Code',
        };

        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('postvalidate');

        const req = new Request();
        const res = new Response(req);

        const getDataForPageStub = sinon.stub()
          .returns({ address: addressObj });
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();

        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };

        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub,
          },
        };

        this.result.hooks.postvalidate(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('enter-company-address');

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('__hidden_address__', {
            addressDetails: addressObj,
            addressFrom: 'manual',
          });
      });
  });
  });
});
