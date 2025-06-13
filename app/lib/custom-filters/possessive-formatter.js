/**
 * Formats a name into correct possessive form, only for English
 * 
 * Examples:
 * John Jones -> John Jones'
 * John Smith -> John Smith's
 *
 * @param  {string} name the name to make possessive
 * @param  {string} locale e.g. 'en' or 'cy'
 * @returns {string} formatted name if English else original name
 */
module.exports = function possessiveFormatter(name, locale) {
    if (!name) return '';
    
    // welsh doesn't require change
    if (locale !== 'en') return name;

    return name.endsWith('s') ? `${name}’` : `${name}’s`
};