/**
 * This simply collates all of journeys together in an array.
 */
const { Plan } = require('@dwp/govuk-casa');

const graphlib = require('graphlib');
const dot = require('graphlib-dot');
const workplaceContact = require('./journeys/workplace-contact');
const auth = require('./journeys/auth');

// eslint-disable-next-line no-multi-assign
exports = module.exports = () => {
  const plan = new Plan();

  workplaceContact(plan);
  auth(plan);

  // JSON serialisation is needed to remove any undefined labels, which can trip
  // up graphlib-dot
  const graph = plan.getGraphStructure();
  const json = JSON.stringify(graphlib.json.write(graph));
  const graphcopy = graphlib.json.read(JSON.parse(json));

  process.stdout.write(dot.write(graphcopy));

  return plan;
};
