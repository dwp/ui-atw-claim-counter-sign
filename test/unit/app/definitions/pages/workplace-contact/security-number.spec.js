const rewire = require('rewire');

const page = rewire('../../../../../../app/definitions/pages/workplace-contact/security-number');
const chai = require('chai');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const generateSHA512HashValue = require('../../../../../../app/utils/generate-sha512-hash-value');

const axiosStub = sinon.stub();
const skipValidationStub = sinon.stub();
const req = new Request();
const res = new Response(req);

// eslint-disable-next-line no-underscore-dangle
page.__set__('axios', axiosStub);

const dataResponse200 = {
  status: 200,
};

const errorMessage_email = res.locals.t('security-number:validation.summary_email');
const errorMessage_main = res.locals.t('security-number:validation.summary_main');
const errorMessage_Attempts_1 = res.locals.t('security-number:validation.summary_attempts.p1');
const errorMessage_Attempts_2 = res.locals.t('security-number:validation.summary_attempts.p2');

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

describe('definitions/pages/workplace-contact/security-number', () => {
  beforeEach(() => {
    this.result = page();
    axiosStub.reset();
  });

  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
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
          assert.equal(this.result.view, 'pages/workplace-contact/security-number.njk');
        });
      });
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

    it('should check if is correct security number', async () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('postvalidate');

      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();
      const hashvalue = generateSHA512HashValue('SW1');
      req.casa = {
        journeyContext: {
          getDataForPage: () => ({
            claimReference: 'SW1',
            securityNumber: '123456',
          }),
        },
      };
      page.__set__('skipValidation', 'false');

      axiosStub.resolves(Promise.resolve({ status: 200 }));

      await this.result.hooks.postvalidate(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();

      assert.equal(hashvalue,
        generateSHA512HashValue(req.casa.journeyContext.getDataForPage().claimReference));
    });

    it('should skip security check', async () => {
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
          getDataForPage: () => ({
            claimReference: 'SW1',
            securityNumber: '123456',
          }),
        },
      };

      page.__set__('skipValidation', 'true');

      await this.result.hooks.postvalidate(req, res, nextStub);

      sinon.assert.notCalled(axiosStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();
    });

    it('should check if it is correct security number and status is 401', async () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('postvalidate');

      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();
      page.__set__('skipValidation', 'false');

      req.casa = {
        journeyContext: {
          getDataForPage: () => ({
            claimReference: 'SW1',
            securityNumber: '123456',
          }),
          clearValidationErrorsForPage: sinon.stub(),
          setDataForPage: sinon.stub(),
        },
      };

      // eslint-disable-next-line prefer-promise-reject-errors
      axiosStub.resolves(Promise.reject({ response: { status: 401 } }));

      await this.result.hooks.postvalidate(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly({
          securityNumber: [
            {
              field: 'securityNumber',
              fieldHref: '#f-securityNumber',
              focusSuffix: '',
              validator: 'required',
              inline: errorMessage_email,
              summary: errorMessage_main + errorMessage_Attempts_1 + '2' + errorMessage_Attempts_2,
            }],
        });
    });

    it('should check if it is correct security number and status is not 401', async () => {
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
          getDataForPage: () => ({
            claimReference: 'SW1',
            securityNumber: '123456',
          }),
        },
      };
      skipValidationStub.returns('false');

      // eslint-disable-next-line prefer-promise-reject-errors
      axiosStub.resolves(Promise.reject({ response: 'error' }));

      await this.result.hooks.postvalidate(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly({
          securityNumber: [
            {
              field: 'securityNumber',
              fieldHref: '#f-securityNumber',
              focusSuffix: '',
              validator: 'required',
              inline: errorMessage_email,
              summary: errorMessage_main,
            }],
        });
    });

    it('should check if it is incorrect security number and status is 401', async () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('postvalidate');

      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();
      page.__set__('skipValidation', 'false');

      req.session.wrongNumberErrorCount = 0;

      req.casa = {
        journeyContext: {
          getDataForPage: () => ({
            claimReference: 'SW1',
            securityNumber: '123456',
          }),
          clearValidationErrorsForPage: sinon.stub(),
          setDataForPage: sinon.stub(),
        },
      };

      // eslint-disable-next-line prefer-promise-reject-errors
      axiosStub.resolves(Promise.reject({ response: { status: 401 } }));

      await this.result.hooks.postvalidate(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly({
          securityNumber: [
            {
              field: 'securityNumber',
              fieldHref: '#f-securityNumber',
              focusSuffix: '',
              validator: 'required',
              inline: errorMessage_email,
              summary: errorMessage_main + errorMessage_Attempts_1 + '2' + errorMessage_Attempts_2,
            }],
        });
    });

    it('should check if it is NOT correct security number and status is 401', async () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('postvalidate');

      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();

      req.session.wrongNumberErrorCount = 5;

      req.casa = {
        journeyContext: {
          getDataForPage: () => ({
            claimReference: 'SW1',
            securityNumber: '12345456',
          }),
        },
      };
      skipValidationStub.returns('false');

      // eslint-disable-next-line prefer-promise-reject-errors
      axiosStub.resolves(Promise.reject({ response: 401 }));

      await this.result.hooks.postvalidate(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly({
          securityNumber: [
            {
              field: 'securityNumber',
              fieldHref: '#f-securityNumber',
              focusSuffix: '',
              validator: 'required',
              inline: errorMessage_email,
              summary: errorMessage_main,
            }],
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

      it('redirect the workplace-contact journey and clear auth journey', async () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();

        const setDataPageStub = sinon.stub();
        const redirectStub = sinon.stub();
        const removeValidationStateForPageStub = sinon.stub();
        res.redirect = redirectStub;

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
            setDataForPage: setDataPageStub,
            removeValidationStateForPage: removeValidationStateForPageStub,
          },
        };

        this.result.hooks.preredirect(req, res, nextStub);

        expect(setDataPageStub.callCount)
          .to
          .equal(3);

        expect(removeValidationStateForPageStub.callCount)
          .to
          .equal(3);

        removeValidationStateForPageStub.getCall(0)
          .calledWithExactly('security-number');
        removeValidationStateForPageStub.getCall(1)
          .calledWithExactly('enter-claim-reference-number');
        removeValidationStateForPageStub.getCall(2)
          .calledWithExactly('confirm-claim-reference-number');

        setDataPageStub.getCall(0)
          .calledWithExactly('security-number', undefined);
        setDataPageStub.getCall(1)
          .calledWithExactly('enter-claim-reference-number', undefined);
        setDataPageStub.getCall(2)
          .calledWithExactly('confirm-claim-reference-number', undefined);

        expect(redirectStub)
          .to
          .be
          .calledOnceWithExactly('/review-claim/confirmer/about-claim');

        expect(req.session.AUTH_STATE)
          .to
          .equal('AUTHENTICATED');
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

    it('should check if request is to resend security code email', async () => {
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
      const TWO_MINUTES = (1000 * 60) * 2;
      req.query.m = 'rs';
      req.session.wrongNumberErrorCount = 0;
      req.session.lastEmailSentTime = Date.now() - TWO_MINUTES;
      res.locals.errorPage = undefined;
      req.casa = {
        journeyContext: {
          getDataForPage: () => ({
            claimReference: 'SW1',
            securityNumber: '123456',
          }),
          setDataForPage: setDataForPageStub,
          clearValidationErrorsForPage: sinon.stub(),
        },
      };
      page.__set__('skipValidation', 'false');

      axiosStub.onCall(0)
        .resolves(Promise.resolve(dataResponse));
      axiosStub.onCall(1)
        .resolves(Promise.resolve(dataResponse200));

      await this.result.hooks.prerender(req, res, nextStub);

      sinon.assert.calledTwice(axiosStub);

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('__hidden_user_claim__', dataResponse.data);

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('__hidden_user_claim__', dataResponse.data);
    });

    it('should check if request is to load page as normal', async () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('prerender');

      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();
      req.query.m = 'rs';
      req.session.wrongNumberErrorCount = 0;
      req.casa = {
        journeyContext: {
          getDataForPage: () => ({
            claimReference: 'SW1',
            securityNumber: '123456',
          }),
          setDataForPage: sinon.stub(),
        },
      };
      page.__set__('skipValidation', 'false');

      axiosStub.resolves(Promise.resolve({ status: 200 }));

      await this.result.hooks.prerender(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();
    });

    it('should check if request is to load page as normal and wrongNumberCount = undefined',
      async () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        req.query.m = 'rs';
        req.session.wrongNumberErrorCount = undefined;
        req.casa = {
          journeyContext: {
            getDataForPage: () => ({
              claimReference: 'SW1',
              securityNumber: '123456',
            }),
            setDataForPage: sinon.stub(),
          },
        };
        page.__set__('skipValidation', 'false');

        axiosStub.resolves(Promise.resolve({ status: 200 }));

        await this.result.hooks.prerender(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
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

      req.body.securityNumber = '  814694  ';

      await this.result.hooks.pregather(req, res, nextStub);

      expect(req.body.securityNumber)
        .to
        .equal('814694');
    });
  });
});
