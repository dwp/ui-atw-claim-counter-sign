# Changelog

## 1.33.0 (2025-08-15)
* dockerfile version bumps
* Major dependency update - eslint, hmrc-frontend, husky, gulp, gulp-saas, sinon, nhsuk-frontend
* dependency updates

## 1.32.0 (2025-08-6)
* Frontend update to govuk v5
* Autmoate test branch pickup
* dependency updates

## 1.31.0 (2025-07-16)
* Deploy new feedback link
* update catalog info
* Add zoom accessibility header to banner
* accessibility statement update
* dependency updates

## 1.30.0 (2025-06-9)
* Adopt pipeline execution policy changes
* Possesive formatter content change for claim return screen

## 1.29.0 (2025-05-22)
* Error messaging now appearing on text fields
* Content changes

## 1.28.0 (2025-04-30)
* WCAG compliance updates for title tags

## 1.27.0 (2025-04-09)
* removed unused h2 on check-your-answers
* Dependency updates
* Updated suppression

## 1.26.0 (2025-03-28)
* README updated
* Fragment updates
* AWS information updated 

## 1.25.0 (2025-03-10)
* Update version ([be09420](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/be09420))
* Update version and push jobs ([f41e4bb](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/f41e4bb))
* Add tests ([b344b6f](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/b344b6f))
* [skip-ci] ([857914b](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/857914b))
* Ignore connect-redis version ([a15bf38](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/a15bf38))
* Ignore connect-redis version ([fac89db](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/fac89db))
* Ignore connect-redis version ([66d7998](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/66d7998))
* Remove tests for now ([f6f6dbd](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/f6f6dbd))
* Merge develop into branch ([2cd0250](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/2cd0250))
* Pull Integration CA from secrets manager ([56d5cad](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/56d5cad))
* Pull Integration CA from secrets manager ([1348109](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/1348109))
* Pull Integration CA from secrets manager ([0b2c1ab](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/0b2c1ab))
* Pull Integration CA from secrets manager ([ad4bad7](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/ad4bad7))
* Pull Integration CA from secrets manager ([df63a15](https://gitlab.com/dwp/health/atw/components/ui-claim-counter-sign/-/commit/df63a15))


## 1.24.0 - (2024-02-18)
* Fixed Git vulnerabilities
* Fixed Pipeline
* Fragment Updates

## 1.23.0 - (2024-01-22)
* Changes to visually hidden text
* Updated content on cookies page

## 1.22.0 - (2024-09-25)
* Push to shared account
* Configurable variable added for GA cookie removal
* Dynatrace config added
* Dependency updates

## 1.21.0 - (2024-08-21)
* Major Chai dependency update to 5.1.1
* Node updated to 22.*.*
* Dependency updates

## 1.20.0 - (2024-06-04)
* Update pipeline to v3.1
* Moved from SaaS to HCS runners
* Fixing Axios errors by adjusting validation for enter claim ref number
* Fixed gov.uk link 
* Dependency updates

## 1.19.0 - (2024-04-17)
* Changes for Travel in Work journey by updating About your grant, Summary andd Declaration screen
* Update fragments

## 1.18.0 - (2024-02-28)
* Update fragments
* Update packages
* Crown logo change to tudor crown

## 1.17.0 - (2024-02-12)
* New card summary style for summary tables added
* Data model changes for new updates to SW journey
* project-metadata.yml updated
* pipeline updates adding retry: 2 for create-project-badges
* Dockerfile updates for curl versions

## 1.16.0 - (2023-08-02)
* Changes to declaration and claim confirmed pages
* Change to URLs from 'workplace-contact' to 'confirmer'
* Removed aria-required from some radio buttons for accessibility
* Content changes to declaration page
* Update for feedback links to go direct to form
* Dockerfile updates for curl versions
* Fragment updates

## 1.15.0 - (2023-07-11)
* Updating node version to 18.16.1
* Updating cron schedule to run pipeline
* component tests set to manual for feature branch
* Dependancy updates
* Fragment updates

## 1.14.0 - (2023-06-20)
* Open source added to repo
* Enabled welsh language toggle by default
* Content changes to search-for-address-of-company
* Dependency updates
* Fragment updates
* Mongo image update

## 1.13.0 - (2023-06-13)

* Add welsh translations for more pages
* Accessibility fixes and updates
* Dependency bumps

## 1.12.0 - (2023-05-30)

* Accessible tools, fix for screen zoom usability
* Move location and bank stub to atw stub image
* Content changes to multiple pages across service
* Welsh toggle added to service, feature flag added and set to FALSE, content changes and updates to prepare service for
  welsh locales
* Dependency bumps
* Fragment updates
* Dockerfile updates

## 1.11.0 - (2023-04-19)

* Page title changes to adhere to accessibility standards
* Adding back support for just hoursOfSupport, to allow for both old and new claims to be processed
* Added functionality to handle white spaces when using mac voice control assistive tools
* Dockerfile version update
* Fragment updates

## 1.10.0 - (2023-04-11)

* SW journey design updated to include a minutes field when submitting time of support, now there is an hours and
  minutes field.
* Lingering hard coded language moved to json files.
* Version update in dockerfile
* Dependency bumps

## 1.9.0 - (2022-03-06)

* Fix HTML Validation Errors
* Update node version
* Update dockerfile fragments
* Updated luxon package to 3.2.1
* Changed <b> tags to <strong> tags for accessibilty
* Package lock to look at registry.npmjs instead of nexus
* Revert govuk-casa to 7.0.9
* Updating Wiremock versions
* Update dependency hmrc-frontend to v5.16.0

## 1.8.0 - (2022-12-14)

* Postcode lookup updated - Handle postcodes that are 1 letter 1 number and addresses with more than 4 lines
* Dependency bumps
* Fragment updates
* Pre-commit updated to remove axios from ignore as no longer causing issues

## 1.7.0 - (2022-12-6)

* AWS Certificate fix for non root users
* Fragment updates (Luxon/IORedis/hmrc-frontend/minimatch)
* Pre-commit addition due to axios 1.2.0 causing issues with component tests

## 1.6.0 - (2022-11-8)

* Made the URL context for location service configurable
* Fragment updates
* Dependency bumps

## 1.5.0 - (2022-10-25)

* Google analytics tag added to headers
* Updated content and feedback link for feedback page
* Dependency bumps

## 1.4.0 - (2022-10-11)

* Bump dependencies
* Remove tactical push

## 1.3.0 - (2022-09-20)

* Fix inaccessible assets in higher envs
* Switch over to Health Certificate Manager API for sourcing certificates

## 1.2.0 - (2022-08-19)

* Fix routing for mountURl with Akamai
* Add missing agency/SW name
* Updating trivy fragment for pipeline fix

## 1.1.0 - (2022-08-01)

* Release

## 1.0.0 - (2022-06-17)

* Initial release
