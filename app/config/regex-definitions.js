const regex = {
  POSTCODE: /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]))))?[0-9][A-Za-z]{2})$/i,
  YEAR: /^[12]\d{3}$/,
  NUMBER_REGEX: /^\d*$/,
  UPRN: /^\d{1,12}$/,
  ROLL_NUMBER_CHARS: /^[\dA-Za-z.\\/ -]*$/,
  CURRENCY: /^(\d{1,8})(\.\d{0,2})?$/,
  CLAIM_TYPE_CHECK: /^(TW|SW|TIW)[0-9]+$/i,
  CLAIM_TYPE_PREFIX_CHECK: /^(TW|SW|TIW).*$/i,
  SPECIAL_CHARACTERS: /^((?![!|@|#|$|%|^|&|*|(|)|,|.|?|"|:|{|}|||<|>]).)*$/,
};

module.exports = regex;
