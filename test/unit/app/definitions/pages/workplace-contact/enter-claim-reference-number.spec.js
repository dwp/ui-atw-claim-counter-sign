const rewire = require('rewire');

const page = rewire(
  '../../../../../../app/definitions/pages/workplace-contact/enter-claim-reference-number');
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
const req = new Request();
const res = new Response(req);

// eslint-disable-next-line no-underscore-dangle
page.__set__('axios', axiosStub);

const dataResponse200 = {
  status: 200,
};

const errorMessage1 = res.locals.t('enter-claim-reference-number:validation.notFound.p1')
const errorMessage2 = res.locals.t('enter-claim-reference-number:validation.notFound.p2');

const dataResponse = {
  status: 200,
  data: {
    id: '619f78a4820db02fed9c5cbb',
    claimNumber: 1,
    claimStatus: 'AWAITING_COUNTER_SIGN',
    nino: 'AA370773A',
    claimType: 'SUPPORT_WORKER',
    cost: 2000,
    evidence: [
      {
        fileId: '09672038-7155-4cb9-8b2e-56eda1fd6b53/7e67a9c5-f7c7-4565-a2ab-6c36530e0710',
        fileName: '6b99f480c27e246fa5dd0453cd4fba29.pdf',
      },
      {
        fileId: 'b9c2ea02-f424-4cd3-bdc1-0ab1c26706fe/cfda6946-7bb5-4886-8b27-beaccbd8e834',
        fileName: 'Technical Architect.docx',
      },
    ],
    payee: {
      details: {
        fullName: 'INeed Paying',
        emailAddress: 'payment@now.com',
      },
      address: {
        address1: 'THE COTTAGE',
        address2: 'ST. MARYS ISLAND',
        address3: 'WHITLEY BAY',
        address4: null,
        postcode: 'NE26 4RS',
      },
      bankDetails: {
        accountHolderName: 'Ineed Paying',
        sortCode: '000004',
        accountNumber: '12345677',
        rollNumber: null,
      },
    },
    claim: {
      0: {
        monthYear: {
          mm: '04',
          yyyy: '2020',
        },
        claim: [
          {
            dayOfSupport: '1',
            timeOfSupport: {
              hoursOfSupport: '2',
              minutesOfSupport: '30',
            },
            nameOfSupport: 'person 1',
          },
          {
            dayOfSupport: '2',
            timeOfSupport: {
              hoursOfSupport: '3',
              minutesOfSupport: '20',
            },            
            nameOfSupport: 'Person 2',
          },
        ],
      },
      1: {
        monthYear: {
          mm: '05',
          yyyy: '2020',
        },
        claim: [
          {
            dayOfSupport: '12',
            timeOfSupport: {
              hoursOfSupport: '12',
              minutesOfSupport: '15',
            },            
            nameOfSupport: null,
          },
          {
            dayOfSupport: '14',
            timeOfSupport: {
              hoursOfSupport: '12',
              minutesOfSupport: '40',
            },
            nameOfSupport: 'Person 4',
          },
        ],
      },
    },
    workplaceContact: {
      emailAddress: 'count@signer.com',
      fullName: 'Count Signer',
    },
  },
};

describe('definitions/pages/workplace-contact/enter-claim-reference-number', () => {
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
          assert.equal(this.result.view,
            'pages/workplace-contact/enter-claim-reference-number.njk');
        });
      });
      describe('`custom-validators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .include('fieldValidators');
        });

        it('value should return an object', () => {
          assert.typeOf(this.result.fieldValidators, 'object');
        });
      });
    });

    describe('`pregather` key', () => {
      it('should be defined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('pregather');
      });

      it('should check if claim number exists - sw', async () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('pregather');

        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();

        req.body = {
          claimReference: 'sw1',
        };

        await this.result.hooks.pregather(req, res, nextStub);

        expect(req.body.claimReference)
          .to
          .equal('SW1');
      });

      it('should check if claim number exists - tiw', async () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('pregather');

        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();

        req.body = {
          claimReference: 'tiw1',
        };

        await this.result.hooks.pregather(req, res, nextStub);

        expect(req.body.claimReference)
          .to
          .equal('TIW1');
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

      it('clear authentication session', async () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();

        req.session.AUTH_STATE = 'OLD_STATE';

        await this.result.hooks.prerender(req, res, nextStub);

        expect(req.session.AUTH_STATE)
          .to
          .equal(undefined);
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

      it('should check if claim number exists', async () => {
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
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: () => ({
              claimReference: 'SW1',
            }),
          },
        };

        axiosStub.onCall(0)
          .resolves(Promise.resolve(dataResponse));
        axiosStub.onCall(1)
          .resolves(Promise.resolve(dataResponse200));

        await this.result.hooks.postvalidate(req, res, nextStub);

        sinon.assert.calledTwice(axiosStub);

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('__hidden_user_claim__', dataResponse.data);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
      });

      it('should check if claim number exists and error if status 201', async () => {
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
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: () => ({
              claimReference: 'SW1',
            }),
          },
        };

        dataResponse.status = 201;

        axiosStub.resolves(Promise.resolve(dataResponse));

        await this.result.hooks.postvalidate(req, res, nextStub);

        sinon.assert.notCalled(setDataForPageStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly({
            claimReference: [
              {
                field: 'claimReference',
                fieldHref: '#f-claimReference',
                focusSuffix: '',
                validator: 'required',
                inline: errorMessage2,
                summary: errorMessage2,
              }],
          });
      });

      it('should check if claim number exists and error if status 400', async () => {
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
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: () => ({
              claimReference: 'EA1',
            }),
          },
        };

        dataResponse.status = 201;

        // eslint-disable-next-line prefer-promise-reject-errors
        axiosStub.resolves(Promise.reject({ response: { status: 400 } }));

        await this.result.hooks.postvalidate(req, res, nextStub);

        sinon.assert.notCalled(setDataForPageStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly({
            claimReference: [
              {
                field: 'claimReference',
                fieldHref: '#f-claimReference',
                focusSuffix: '',
                validator: 'required',
                inline: errorMessage1,
                summary: errorMessage1,
              }],
          });
      });

      it('should check if claim number exists and error if status 400', async () => {
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
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: () => ({
              claimReference: 'SW1',
            }),
          },
        };

        dataResponse.status = 201;

        // eslint-disable-next-line prefer-promise-reject-errors
        axiosStub.resolves(Promise.reject({ response: { status: 404 } }));

        await this.result.hooks.postvalidate(req, res, nextStub);

        sinon.assert.notCalled(setDataForPageStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly({
            claimReference: [
              {
                field: 'claimReference',
                fieldHref: '#f-claimReference',
                focusSuffix: '',
                validator: 'required',
                inline: errorMessage1,
                summary: errorMessage1,
              }],
          });
      });

      it('should check if claim number exists and error if status 423', async () => {
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
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: () => ({
              claimReference: 'SW1',
            }),
          },
        };

        dataResponse.status = 201;

        // eslint-disable-next-line prefer-promise-reject-errors
        axiosStub.resolves(Promise.reject({ response: { status: 423 } }));

        await this.result.hooks.postvalidate(req, res, nextStub);

        sinon.assert.notCalled(setDataForPageStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly({
            claimReference: [
              {
                field: 'claimReference',
                fieldHref: '#f-claimReference',
                focusSuffix: '',
                validator: 'required',
                inline: errorMessage1,
                summary: errorMessage1,
              }],
          });
      });

      it('should check if claim number exists and error if status 401', async () => {
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
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: () => ({
              claimReference: 'SW1',
            }),
          },
        };

        dataResponse.status = 201;

        // eslint-disable-next-line prefer-promise-reject-errors
        axiosStub.resolves(Promise.reject({ response: 'error' }));

        await this.result.hooks.postvalidate(req, res, nextStub);

        sinon.assert.notCalled(setDataForPageStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly({
            claimReference: [
              {
                field: 'claimReference',
                fieldHref: '#f-claimReference',
                focusSuffix: '',
                validator: 'required',
                inline: errorMessage2,
                summary: errorMessage2,
              }],
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

        req.body.claimReference = '  S    W                 1  ';

        await this.result.hooks.pregather(req, res, nextStub);

        expect(req.body.claimReference)
          .to
          .equal('SW1');
      });
    });
  });
});
