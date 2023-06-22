// Return data for waypoint if provided, defaulting to route source waypoint
const d = (route, context, waypoint = route.source) => context.getDataForPage(waypoint)
  || Object.create(null);
// Field in waypoint (route source if waypoint is undefined) is equal to value
const isEqualTo = (field, value, waypoint) => (r, c) => d(r, c, waypoint)[field] === value;

// Field in waypoint (route source if waypoint is undefined) is equal to value
const isNotEqualTo = (field, value, waypoint) => (r, c) => d(r, c, waypoint)[field] !== value;

// Way point was 'skipped' via skip link
const wasSkipped = (waypoint) => isEqualTo('__skipped__', true, waypoint);

// Way point was 'not skipped' via skip link
const notSkipped = (waypoint) => isNotEqualTo('__skipped__', true, waypoint);

// Field in waypoint is 'yes'
const isYes = (field, waypoint) => isEqualTo(field, 'yes', waypoint);

// Field in waypoint is 'no'
const isNo = (field, waypoint) => isEqualTo(field, 'no', waypoint);

module.exports = {
  wasSkipped,
  notSkipped,
  d,
  isNo,
  isYes,
  isEqualTo,
};
