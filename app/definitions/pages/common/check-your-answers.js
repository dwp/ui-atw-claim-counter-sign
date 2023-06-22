const { createGetRequest } = require('@dwp/govuk-casa/lib/utils/index');
const {
  SimpleField,
  rules,
} = require('@dwp/govuk-casa/lib/validation/index');
// const { claimTypes } = require('../../../config/claim-types');

module.exports = function reviewPageDefinition(
  pagesMeta = {},
) {
  return {
    view: 'pages/common/review/check-your-answers.njk',
    fieldValidators: {
      reviewed: SimpleField([
        rules.required,
      ]),
    },
    hooks: {
      prerender(req, res, next) {
        req.casa = req.casa || Object.create(null);

        // Determine active journey in order to define the "edit origin" URL,
        // and make journey data and errors available to templates
        const userJourney = req.casa.plan;
        const { journeyOrigin } = req.casa;
        res.locals.changeUrlPrefix = `${res.locals.casa.mountUrl}${journeyOrigin.originId
        || ''}/`.replace(/\/+/g, '/');
        res.locals.journeyContext = req.casa.journeyContext.getData();
        res.locals.reviewErrors = req.casa.journeyContext.getValidationErrors();

        // Determine which pages have been traversed in the user's journey in
        // order to get to this review point (not all journey waypoints will
        // have been touched, but may contain data which needs to be ignored)

        const traversalOptions = {
          startWaypoint: journeyOrigin.waypoint,
        };

        const waypointsTraversed = userJourney.traverse(req.casa.journeyContext, traversalOptions);

        res.locals.reviewBlocks = waypointsTraversed.map((waypointId) => {
          const meta = pagesMeta[waypointId] || Object.create(null);
          return meta.reviewBlockView ? {
            waypointId,
            waypointEditUrl: createGetRequest({
              mountUrl: res.locals.casa.mountUrl,
              waypoint: `${journeyOrigin.originId || ''}/${waypointId}`,
              editMode: true,
              editOrigin: req.editOriginUrl,
              contextId: req.casa.journeyContext.identity.id,
            }),
            reviewBlockView: meta.reviewBlockView,
          } : null;
        })
          .filter((o) => o !== null);

        next();
      },
    },
  };
};
