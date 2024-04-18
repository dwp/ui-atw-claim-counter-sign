const rewire = require('rewire');

const page = rewire('../../../../../../app/definitions/pages/workplace-contact/job-title');
const chai = require('chai');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');

describe('definitions/pages/workplace-contact/job-title', () => {
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
          assert.equal(this.result.view, 'pages/workplace-contact/job-title.njk');
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

      it('reset validation on check-your-answers if in edit mode', () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const setValidationErrorsForPageStub = sinon.stub();

        req.casa = {
          journeyContext: {
            setValidationErrorsForPage: setValidationErrorsForPageStub,
          },
        };

        req.inEditMode = true;

        req.editOriginUrl = 'test-origin';

        this.result.hooks.prerender(req, res, nextStub);

        expect(setValidationErrorsForPageStub)
          .to
          .be
          .calledOnceWithExactly('check-your-answers', undefined);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
      });

      it('does not reset validation on check-your-answers if not in edit mode', () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const setValidationErrorsForPageStub = sinon.stub();

        req.casa = {
          journeyContext: {
            setValidationErrorsForPage: setValidationErrorsForPageStub,
          },
        };

        req.inEditMode = false;

        req.editOriginUrl = 'test-origin';

        this.result.hooks.prerender(req, res, nextStub);

        sinon.assert.notCalled(setValidationErrorsForPageStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
      });
    });
  });
});
