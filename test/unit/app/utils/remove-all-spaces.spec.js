const { expect } = require('chai');
const removeAllSpaces = require('../../../../app/utils/remove-all-spaces.js');

describe('Utils: remove-all-spaces', () => {
  it('should export a function', () => {
    expect(removeAllSpaces)
      .to
      .be
      .a('function');
  });

  it('should strip spaces from a string', () => {
    expect(removeAllSpaces(' A A A A A '))
      .to
      .equal('AAAAA');
  });
});
