/**
 * Declarative definitions of pages within a user journey.
 */

const pageIndex = require('./pages/index');
const logger = require('../logger/logger');

const log = logger('definitions:pages');

module.exports = () => {
  const allPages = pageIndex();
  const pages = {};

  log.info('Loading page definitions');

  Object.keys(allPages)
    .forEach((pageName) => {
      pages[pageName] = allPages[pageName];
    });

  log.info('Page definitions loaded, %s pages added', Object.keys(pages).length);

  return pages;
};
