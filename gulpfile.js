const {
  task,
  src,
  dest,
  series,
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');

const assetsPath = './static';
const pathToGovFrontend = './node_modules/govuk-frontend-v5/dist/govuk';

// -------- Assets
task('build-assets-sass', () => src(['app/assets/sass/*.scss'])
  .pipe(sass
    .sync()
    .on('error', sass.logError))
  .pipe(dest(`${assetsPath}/css`)));

task('build-assets-js', () => src([`${pathToGovFrontend}/all.bundle.js`])
  .pipe(dest(`${assetsPath}/js`)));
task('build-assets', () => src([`${pathToGovFrontend}/assets/**/*`])
  .pipe(dest(`${assetsPath}/assets`)));

task('build-project-js', () => src(['./app/assets/js/*.js'])
  // .pipe(concat('uploadValidation.min.js'))
  .pipe(uglify())
  .pipe(dest(`${assetsPath}/js`)));

// --- Series
task('build', series(['build-assets-sass', 'build-project-js', 'build-assets', 'build-assets-js']));
