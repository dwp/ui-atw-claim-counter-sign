const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const index = require('../../../../app/routes');

const sinon = require('sinon');

let assert, expect;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('/index', () => {

  it('should be a function', () => {
    assert.typeOf(index, 'function');
  });

  describe('when called', () => {
    const stubNext = sinon.stub();
    const redirectStub = sinon.stub();
    let router;
    let req;
    let res;

    const casaRouter = () => {
      const routerObj = {};
      routerObj.use = (func) => func(req, res, stubNext);
      return routerObj;
    };

    beforeEach(() => {
      router = casaRouter();
      req = new Request();
      res = new Response(req);
      stubNext.reset();
      redirectStub.reset();
    });

    it('should redirect to start page', async () => {
      req.originalUrl = '/review-claim/some-mount-url/'

      router.get = (path, callback) => {
        assert.equal(path, '/');
        res.redirect = redirectStub;
        callback(req, res);
      };
      const endSessionStub = sinon.stub();
      endSessionStub
        .resolves(Promise.resolve());

      await index({
        router,
        endSession: endSessionStub,
      });
      assert.equal(res.statusCode, 200);
      expect(redirectStub)
        .to
        .be
        .calledOnceWithExactly('/review-claim/auth/enter-claim-reference-number');
    });

    it('should redirect to start page even if the request is missing trailing slash', async () => {
      req.originalUrl = '/review-claim/some-mount-url'

      router.get = (path, callback) => {
        assert.equal(path, '/');
        res.redirect = redirectStub;
        callback(req, res);
      };

      index({ router });
      assert.equal(res.statusCode, 200);
      expect(redirectStub)
        .to
        .be
        .calledOnceWithExactly('/review-claim/some-mount-url/');
    });
  });
});
