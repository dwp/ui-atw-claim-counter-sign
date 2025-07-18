const middleware = require('../../../../app/middleware/url.middleware');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const sinon = require('sinon');

let expect;
(async() => {
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('Middleware: url', () => {
  let app;
  let req;
  let res;
  let nextStub;
  beforeEach(() => {
    app = {
      use(mw) {
        this.use = mw;
      },
    };
    req = new Request();
    res = new Response(req);
    nextStub = sinon.stub();
  });

  it('should add a "use" middleware', () => {
    middleware(app);
    expect(app.use)
      .to
      .be
      .an
      .instanceOf(Function);
  });

  it('Should set correct url for feedbackFormDirectUrl', () => {
    middleware(app);
    app.use(req, res, nextStub);
    expect(res.locals.feedbackFormDirectUrl)
      .to
      .eql('https://forms.cloud.microsoft/e/QQqHJvdYEy');
  });

});
