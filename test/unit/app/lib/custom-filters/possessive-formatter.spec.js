const formatter = require('../../../../../app/lib/custom-filters/possessive-formatter');
let assert;
(async() => {
  assert = (await import ('chai')).assert;
})();
describe('formatPossessive', () => {

  describe('en', () => {
    const locale = 'en';
    it('should add ’s for names not ending in s', () => {
      const result1 = formatter('Dexter', locale)
      const result2 = formatter('Debra', locale)

      assert.equal(result1, 'Dexter’s');
      assert.equal(result2, 'Debra’s');
    });

    it('should add ’ for names not ending in s', () => {
      const result = formatter('Harris', locale)

      assert.equal(result, 'Harris’');
    });
  });

  describe('cy', () => {
    const locale = 'cy';
    it('should return name unchanged', () => {
      const result1 = formatter('Masuka', locale)
      const result2 = formatter('Harris', locale)

      assert.equal(result1, 'Masuka');
      assert.equal(result2, 'Harris');
    });
  });

  describe('edge cases', () => {
    const locale = 'en';
    it('should return empty string if name is undefined', () => {
      const result = formatter(undefined, locale)

      assert.equal(result, '');
    });

    it('should return empty string if name is null', () => {
      const result = formatter(null, locale)

      assert.equal(result, '');
    });
  });
});
