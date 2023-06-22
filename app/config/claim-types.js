const claimTypes = {
  EQUIPMENT_OR_ADAPTATION: 'EA',
  TRAVEL_TO_WORK: 'TW',
  SUPPORT_WORKER: 'SW',
};

const claimTypesSetKey = {
  EA: 'EQUIPMENT_OR_ADAPTATION',
  TW: 'TRAVEL_TO_WORK',
  SW: 'SUPPORT_WORKER',
};

const claimTypesToDisplayText = {
  EQUIPMENT_OR_ADAPTATION: 'Equipment or adaptation',
  TRAVEL_TO_WORK: 'Travel to or from work',
  SUPPORT_WORKER: 'Support worker',
};

module.exports = {
  claimTypes,
  claimTypesSetKey,
  claimTypesToDisplayText,
};
