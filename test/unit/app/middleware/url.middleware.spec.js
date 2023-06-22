const middleware = require('../../../../app/middleware/url.middleware');
const sinon = require('sinon');
const chai = require('chai');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
chai.use(require('sinon-chai'));
const {
  expect,
} = chai;

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

  it('Should set correct url for feedbackUrl', () => {
    res.locals.currentUrl = 'someUrl';
    middleware(app);
    app.use(req, res, nextStub);
    expect(res.locals.feedbackUrl)
      .to
      .eql('/review-claim/feedback?referrer=someUrl');
  });

});
