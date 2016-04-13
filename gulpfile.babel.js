/*eslint-disable */
import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import minifyjs from 'gulp-minify';
import minifycss from 'gulp-cssmin';
import eslint from 'gulp-eslint';
import rimraf from 'rimraf';

const TMP_DIR = '.tmp';

const SOURCE_DIR = 'src';
const SOURCE_FILES = []
  .concat(`${SOURCE_DIR}/.tmp/**/*.min.*`)
  .concat(`${SOURCE_DIR}/img/**/*.js`)
  .concat(`${SOURCE_DIR}/templates/**/*.html`)
  .concat(`${SOURCE_DIR}/index.html`);

const CSS_DIR = `${SOURCE_DIR}/css`;
const CSS_FILES = `${CSS_DIR}/**/*.css`;

const JS_DIR = `${SOURCE_DIR}/js`;
const JS_FILES = []
  .concat(`${JS_DIR}/conocerd.router.js`)
  .concat(`${JS_DIR}/conocerd.templates.js`)
  .concat(`${JS_DIR}/**/*.js`);

const BUILD_DIR = 'dist';
const BUILD_FILES = `${BUILD_DIR}/**/*.*`;

const SERVER_DIR = 'server';
const SERVER_FILES = `${SERVER_DIR}/**/*.es6`;

/*
 * Clean folders genereted by running
 * other tasks.
 */
gulp.task('clean-build', (done) => rimraf(BUILD_DIR, done));
gulp.task('clean-src-tmp', (done) => rimraf(`${SOURCE_DIR}/${TMP_DIR}`, done));
gulp.task('clean-server-tmp', (done) => rimraf(`${TMP_DIR}`, done));

/*
 * Ensure js files have no syntax errors and
 * complay with code standards.
 */
gulp.task('lint', () => {
  const filesToLint = JS_FILES;

  return gulp.src(filesToLint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

/*
 * Concat all css and js files into two unique files
 * conocerd.css and conocerd.js respectively.
 */
gulp.task('concat-css', () => gulp
  .src(CSS_FILES, { base: CSS_DIR })
  .pipe(concat('conocerd.css'))
  .pipe(gulp.dest(`${SOURCE_DIR}/.tmp`))
);

gulp.task('concat-js', ['lint'], () => gulp
  .src(JS_FILES, { base: JS_DIR })
  .pipe(concat('conocerd.js'))
  .pipe(gulp.dest(`${SOURCE_DIR}/.tmp`))
);

gulp.task('concat', ['concat-css', 'concat-js'], (done) => done());

/*
 * Minify conocerd.css and conocerd.js, and
 * generate conocerd.min.css and conocerd.min.js.
 */
gulp.task('minify-css', () => gulp
  .src(`${SOURCE_DIR}/.tmp/conocerd.css`)
  .pipe(minifycss())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(`${SOURCE_DIR}/.tmp`))
);

gulp.task('minify-js', () => gulp
  .src(`${SOURCE_DIR}/.tmp/conocerd.js`)
  .pipe(minifyjs({
    ext:'.min.js',
    ignoreFiles: ['*.min.js']
  }))
  .pipe(gulp.dest(`${SOURCE_DIR}/.tmp`))
);

gulp.task('minify', ['concat', 'minify-css', 'minify-js'], (done) => done());

/*
 * Build app. Get all files that matter into `dist/` folder.
 */
gulp.task('build', ['clean-build', 'minify'], () => gulp
  .src(SOURCE_FILES)
  .pipe(gulp.dest(BUILD_DIR))
);

/*
 * Transpile server files and get them to `.tmp/` folder.
 */
gulp.task('compile-server', ['clean-server-tmp'], () => gulp
  .src(SERVER_FILES, { base: '.' })
  .pipe(babel())
  .pipe(rename((p) => { p.extname = '.js'; }))
  .pipe(gulp.dest(TMP_DIR))
);

/*
 * Ship build files to `.tmp/public/` folder so the server
 * can serve them.
 */
gulp.task('ship', ['build', 'compile-server'], () => gulp
  .src(BUILD_FILES, { base: BUILD_DIR })
  .pipe(gulp.dest(`${TMP_DIR}/public`))
);
