const rewire = require('rewire');
const page = rewire('../../../../../app/definitions/pages/common/search-for-address-of-company');

const sinon = require('sinon');

let assert, expect;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');

describe('definitions/pages/common/search-for-address-of-company', () => {
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
          assert.equal(
            this.result.view,
            'pages/common/search-for-address-of-company.njk',
          );
        });
      });
      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });
      });

      describe('`prerender` key', () => {
        it('should load page with list of addresses', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          // const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              // setDataForPage: setDataForPageStub,
              getDataForPage: (pageName) => {
                if (pageName === 'company-postcode') {
                  return {
                    postcode: 'NE26 4RS',
                    addresses: [
                      {
                        postcode: 'NE26 4RS',
                        uprn: '1234567',
                        singleLine: '10 downing street, London, NE26 4RS',
                      },
                    ],
                  };
                }
                if (pageName === 'company-address-search') {
                  return {
                    uprn: '7654321',
                  };
                }
                if (pageName === 'company-organisation-name') {
                  return {
                    companyOrganisationName: 'Ted Smith',
                  };
                }
                return undefined;
              },
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.addresses)
            .to
            .deep
            .equal([
              {
                value: 'select-address',
                text: 'search-for-address-of-company:addressFound:1',
              },
              {
                value: '1234567',
                text: '10 downing street, London',
                selected: false,
              },
            ]);

          expect(res.locals.changePostcodeUrl)
            .to
            .deep
            .equal(
              'company-postcode#f-postcode',
            );

          expect(res.locals.manualAddressUrl)
            .to
            .deep
            .equal(
              '?skipto=enter-company-address',
            );

          expect(res.locals.companyName)
            .to
            .deep
            .equal('Ted Smith');

          expect(res.locals.postcode)
            .to
            .deep
            .equal('NE26 4RS');

          expect(res.locals.hideContinueButton)
            .to
            .deep
            .equal(undefined);
        });

        it('should load page with list of addresses in edit mode', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.inEditMode = true;

          req.editOriginUrl = 'test-origin';

          const setValidationErrorsForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setValidationErrorsForPage: setValidationErrorsForPageStub,
              getDataForPage: (pageName) => {
                if (pageName === 'company-postcode') {
                  return {
                    postcode: 'NE26 4RS',
                    addresses: [
                      {
                        postcode: 'NE26 4RS',
                        uprn: '1234567',
                        singleLine: '10 downing street, London, NE26 4RS',
                      },
                    ],
                  };
                }
                if (pageName === 'company-address-search') {
                  return {
                    uprn: '7654321',
                  };
                }
                if (pageName === 'company-organisation-name') {
                  return {
                    companyOrganisationName: 'Ted Smith',
                  };
                }
                return undefined;
              },
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(setValidationErrorsForPageStub)
            .to
            .be
            .calledOnceWithExactly('check-your-answers', undefined);

          expect(res.locals.addresses)
            .to
            .deep
            .equal([
              {
                value: 'select-address',
                text: 'search-for-address-of-company:addressFound:1',
              },
              {
                value: '1234567',
                text: '10 downing street, London',
                selected: false,
              },
            ]);

          expect(res.locals.changePostcodeUrl)
            .to
            .deep
            .equal(
              'company-postcode?edit=&editorigin=test-origin#f-postcode',
            );

          expect(res.locals.manualAddressUrl)
            .to
            .deep
            .equal(
              '?skipto=enter-company-address&edit=&editorigin=test-origin',
            );

          expect(res.locals.companyName)
            .to
            .deep
            .equal('Ted Smith');

          expect(res.locals.postcode)
            .to
            .deep
            .equal('NE26 4RS');

          expect(res.locals.hideContinueButton)
            .to
            .deep
            .equal(undefined);
        });

        it('should load page with addresses undefined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (pageName) => {
                if (pageName === 'company-postcode') {
                  return {
                    postcode: 'NE26 4RS',
                  };
                }
                if (pageName === 'company-address-search') {
                  return {
                    uprn: '7654321',
                  };
                }
                if (pageName === 'company-organisation-name') {
                  return {
                    companyOrganisationName: 'Ted Smith',
                  };
                }
                return undefined;
              },
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.addresses)
            .to
            .deep
            .equal([
              {
                value: 'select-address',
                text: 'search-for-address-of-company:addressFound',
              },
            ]);

          expect(res.locals.changePostcodeUrl)
            .to
            .deep
            .equal(
              'company-postcode#f-postcode',
            );

          expect(res.locals.manualAddressUrl)
            .to
            .deep
            .equal(
              '?skipto=enter-company-address',
            );

          expect(res.locals.companyName)
            .to
            .deep
            .equal('Ted Smith');

          expect(res.locals.postcode)
            .to
            .deep
            .equal('NE26 4RS');

          expect(res.locals.hideContinueButton)
            .to
            .deep
            .equal(true);
        });

        it('should load page with existing data', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.casa = {
            journeyWaypointId: 'company-address-search',
            journeyContext: {
              getDataForPage: (pageName) => {
                if (pageName === 'company-postcode') {
                  return {
                    postcode: 'NE26 4RS',
                    addresses: [
                      {
                        postcode: 'NE26 4RS',
                        uprn: '1234567',
                        singleLine: '10 downing street, London, NE26 4RS',
                      },
                      {
                        postcode: 'NE26 4RS',
                        uprn: '12345678',
                        singleLine: '11 downing street, London, NE26 4RS',
                      },
                    ],
                  };
                }
                if (pageName === 'company-address-search') {
                  return {
                    uprn: '1234567',
                  };
                }
                if (pageName === 'company-organisation-name') {
                  return {
                    companyOrganisationName: 'Ted Smith',
                  };
                }
                return undefined;
              },
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.addresses)
            .to
            .deep
            .equal([
              {
                value: 'select-address',
                text: 'search-for-address-of-company:addressFound:2',
              },
              {
                value: '1234567',
                text: '10 downing street, London',
                selected: true,
              },
              {
                value: '12345678',
                text: '11 downing street, London',
                selected: false,
              },
            ]);

          expect(res.locals.changePostcodeUrl)
            .to
            .deep
            .equal(
              'company-postcode#f-postcode',
            );

          expect(res.locals.manualAddressUrl)
            .to
            .deep
            .equal(
              '?skipto=enter-company-address',
            );

          expect(res.locals.companyName)
            .to
            .deep
            .equal('Ted Smith');

          expect(res.locals.postcode)
            .to
            .deep
            .equal('NE26 4RS');

          expect(res.locals.hideContinueButton)
            .to
            .deep
            .equal(undefined);
        });
      });
    });

    describe('postvalidate key', () => {
      it('should be defined', () => {
        expect(Object.keys(this.result.hooks))
          .to
          .include('postvalidate');
      });

      it('key value should be a function', () => {
        assert.typeOf(this.result.hooks.postvalidate, 'function');
      });

      it('should save to hidden address page', () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const setDataForPageStub = sinon.stub();

        req.casa = {
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: (pageName) => {
              if (pageName === 'company-postcode') {
                return {
                  postcode: 'NE26 4RS',
                  addresses: [
                    {
                      postcode: 'NE26 4RS',
                      uprn: '1234567',
                      singleLine: '10 downing street, London, NE26 4RS',
                    },
                  ],
                };
              }
              if (pageName === 'company-address-search') {
                return {
                  uprn: '1234567',
                };
              }
              return undefined;
            },
          },
        };

        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };

        this.result.hooks.postvalidate(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly(
            '__hidden_address__',
            {
              singleLine: '10 downing street, London, NE26 4RS',
              addressDetails: {
                address1: '10 downing street',
                address2: 'London',
                postcode: 'NE26 4RS',
              },
              addressFrom: 'select',
              uprn: '1234567',
            },
          );
      });

      it('should save to hidden address page for postcodes with format AA1A 1AA', () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const setDataForPageStub = sinon.stub();

        req.casa = {
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: (pageName) => {
              if (pageName === 'company-postcode') {
                return {
                  postcode: 'AA9A 9AA',
                  addresses: [
                    {
                      postcode: 'AA9A 9AA',
                      uprn: '1234567',
                      singleLine: '10 downing street, London, AA9A 9AA',
                    },
                  ],
                };
              }
              if (pageName === 'company-address-search') {
                return {
                  uprn: '1234567',
                };
              }
              return undefined;
            },
          },
        };

        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };

        this.result.hooks.postvalidate(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly(
            '__hidden_address__',
            {
              singleLine: '10 downing street, London, AA9A 9AA',
              addressDetails: {
                address1: '10 downing street',
                address2: 'London',
                postcode: 'AA9A 9AA',
              },
              addressFrom: 'select',
              uprn: '1234567',
            },
          );
      });

      it(
        'should save to hidden address page and handle short postcodes and addresses with more than 4 lines',
        () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: (pageName) => {
                if (pageName === 'company-postcode') {
                  return {
                    postcode: 'E2 4RS',
                    addresses: [
                      {
                        postcode: 'E2 4RS',
                        uprn: '1234567',
                        singleLine: 'Flat 1, Block 2, Street Name, South Ealing, Ealing, London, E2 4RS',
                      },
                    ],
                  };
                }
                if (pageName === 'company-address-search') {
                  return {
                    uprn: '1234567',
                  };
                }
                return undefined;
              },
            },
          };

          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly(
              '__hidden_address__',
              {
                singleLine: 'Flat 1, Block 2, Street Name, South Ealing, Ealing, London, E2 4RS',
                addressDetails: {
                  address1: 'Flat 1, Block 2, Street Name',
                  address2: 'South Ealing',
                  address3: 'Ealing',
                  address4: 'London',
                  postcode: 'E2 4RS',
                },
                addressFrom: 'select',
                uprn: '1234567',
              },
            );
        });

      it('throw error when address undefined', () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const setDataForPageStub = sinon.stub();

        req.casa = {
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: (pageName) => {
              if (pageName === 'company-postcode') {
                return {
                  postcode: 'NE26 4RS',
                };
              }
              if (pageName === 'company-address-search') {
                return {
                  uprn: '1234567',
                };
              }
              return undefined;
            },
          },
        };

        // Throw needs a function to check rather than a function result
        const postValidate = () => this.result.hooks.postvalidate(req, res, nextStub);

        expect(postValidate)
          .to
          .throw();

        sinon.assert.notCalled(setDataForPageStub);
        sinon.assert.notCalled(nextStub);
      });
    });

    it('throw error when uprn undefined', () => {
      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();
      const setDataForPageStub = sinon.stub();

      req.casa = {
        journeyContext: {
          setDataForPage: setDataForPageStub,
          getDataForPage: (pageName) => {
            if (pageName === 'company-postcode') {
              return {
                postcode: 'NE26 4RS',
                addresses: [
                  {
                    postcode: 'NE26 4RS',
                    uprn: '1234567',
                    singleLine: '10 downing street, London, NE26 4RS',
                  },
                ],
              };
            }
            return undefined;
          },
        },
      };

      // Throw needs a function to check rather than a function result
      const postValidate = () => this.result.hooks.postvalidate(req, res, nextStub);

      expect(postValidate)
        .to
        .throw();

      sinon.assert.notCalled(setDataForPageStub);
      sinon.assert.notCalled(nextStub);
    });
  });
});
