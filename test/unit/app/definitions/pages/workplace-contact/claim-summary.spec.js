const page = require('../../../../../../app/definitions/pages/workplace-contact/claim-summary');
const chai = require('chai');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');

describe('definitions/pages/workplace-contact/claim-summary', () => {
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
          assert.equal(this.result.view, 'pages/workplace-contact/claim-summary.njk');
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

        it('should display claim summary details - sw', async () => {
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
              getDataForPage: (page) => {
                if (page === '__hidden_user_claim__') {
                  return {
                    id: 1,
                    claimType: 'SUPPORT_WORKER',
                    claimant: {
                      forename: 'Fenrir',
                      surname: 'Aland'
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
                  };
                }
              },
            },
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.locals.claimReference, 'SW00000001');
          assert.equal(res.locals.employeeName, 'Fenrir Aland');
        });

        it('should display claim summary details - tiw', async () => {
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
              getDataForPage: (page) => {
                if (page === '__hidden_user_claim__') {
                  return {
                    id: 1,
                    claimType: 'TRAVEL_IN_WORK',
                    claimant: {
                      forename: 'Alan',
                      surname: 'Jones'
                    },
                    claim: {
                      0: {
                        monthYear: {
                          mm: '04',
                          yyyy: '2020',
                        },
                        claim: [
                          {
                            startPostcode: 'NP12 0QW',
                            endPostcode: 'LL14 4EX',
                            cost: '22'
                          },
                        ],
                      },
                    },
                  };
                }
              },
            },
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.locals.claimReference, 'TIW0000001');
          assert.equal(res.locals.employeeName, 'Alan Jones');
        });

        it('should display claim summary details of new data model', async () => {
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
              getDataForPage: (page) => {
                if (page === '__hidden_user_claim__') {
                  return {
                    id: 1,
                    claimType: 'SUPPORT_WORKER',
                    claimant: {
                      forename: 'Jackie',
                      surname: 'Turner'
                    },
                    nameOfSupport: 'person 1',
                    claim: {
                      0: {
                        monthYear: {
                          mm: '11',
                          yyyy: '2023',
                        },
                        claim: [
                          {
                            dayOfSupport: '10',
                            timeOfSupport: {
                              hoursOfSupport: '4',
                              minutesOfSupport: '30',
                            },
                          },
                          {
                            dayOfSupport: '2',
                            timeOfSupport: {
                              hoursOfSupport: '3',
                              minutesOfSupport: '20',
                            },
                          },
                        ],
                      },
                      1: {
                        monthYear: {
                          mm: '12',
                          yyyy: '2020',
                        },
                        claim: [
                          {
                            dayOfSupport: '20',
                            timeOfSupport: {
                              hoursOfSupport: '12',
                              minutesOfSupport: '15',
                            },
                          },
                          {
                            dayOfSupport: '14',
                            timeOfSupport: {
                              hoursOfSupport: '12',
                              minutesOfSupport: '40',
                            },
                          },
                        ],
                      },
                    },
                  };
                }
              },
            },
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.locals.employeeName, 'Jackie Turner');
          expect(res.locals.daysOfSupport)
            .to
            .deep
            .equal([
            [
              {
                'day': '10',
                'weekday': 5,
                'month': '11'
              },
              {
                'day': '2',
                'weekday': 4,
                'month': '11'
              }
            ],
            [
              {
                'day': '20',
                'weekday': 0,
                'month': '12'
              },
              {
                'day': '14',
                'weekday': 1,
                'month': '12'
              }
            ]
          ]);
        });
      });
    });
  });
});
