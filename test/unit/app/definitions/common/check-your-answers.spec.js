const rewire = require('rewire');

const page = rewire('../../../../../app/definitions/pages/common/check-your-answers');
const chai = require('chai');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');

const {
  map,
  data,
} = require('../../../../helpers/journey-mocks');

describe('definitions/pages/common/check-your-answers', () => {
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
          assert.equal(this.result.view, 'pages/common/review/check-your-answers.njk');
        });
      });
    });
  });

  describe('prerender hook', () => {
    let mockRequest;
    let mockResponse;
    let stubNext;
    let prerender;

    beforeEach(() => {
      mockRequest = new Request();
      mockRequest.casa = {
        plan: map(),
        journeyContext: data(),
      };
      mockResponse = new Response();
      mockResponse.locals.casa = {
        mountUrl: '/test-mount/',
      };
      stubNext = sinon.stub();
      prerender = page().hooks.prerender;
    });

    it('should call next middleware in chain', () => {
      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      prerender(mockRequest, mockResponse, stubNext);
      expect(stubNext)
        .to
        .be
        .calledOnceWithExactly();
    });

    it('should set the correct "changeUrlPrefix" template variable', () => {
      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('changeUrlPrefix')
        .that
        .equals('/test-mount/');

      mockRequest.casa.journeyOrigin = {
        originId: 'test-guid',
        waypoint: '',
      };
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('changeUrlPrefix')
        .that
        .equals('/test-mount/test-guid/');
    });

    it('should set the correct "journeyContext" template variable', () => {
      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      mockRequest.casa.journeyContext.getData = sinon.stub()
        .returns({
          test: 'data',
        });
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('journeyContext')
        .that
        .eql({
          test: 'data',
        });
    });

    it('should set the correct "reviewErrors" template variable', () => {
      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      mockRequest.casa.journeyContext.getValidationErrors = sinon.stub()
        .returns('test-errors');
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('reviewErrors')
        .that
        .eql('test-errors');
    });

    it('should set the correct "reviewBlocks" template variable EA', () => {
      const equipmentAndAdaptationPageMeta = {
        'test-page-0': {
          reviewBlockView: 'test-view',
        },
        'test-page-1': Object.create(null),
      };

      const supportWorkerPageMeta = {
        'test-page-2': {
          reviewBlockView: 'test-view-2',
        },
        'test-page-3': Object.create(null),
      };

      prerender = page(equipmentAndAdaptationPageMeta, supportWorkerPageMeta).hooks.prerender;
      mockRequest.editOriginUrl = 'test-origin';
      mockRequest.casa.journeyContext.getDataForPage = () => ({ journeyType: 'EA' });
      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      mockRequest.casa.plan.traverse = sinon.stub()
        .returns(['test-page-0', 'test-page-1']);
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('reviewBlocks')
        .that
        .deep
        .eql([
          {
            waypointId: 'test-page-0',
            waypointEditUrl: '/test-mount/test-page-0?edit=&editorigin=%2Ftest-origin',
            reviewBlockView: 'test-view',
          }]);
    });
  });
});
