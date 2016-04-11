/*eslint-disable */
import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import minify from 'gulp-minify';
import rimraf from 'rimraf';

const TMP_DIR = '.tmp';
const SOURCE_DIR = 'src';
const CSS_DIR = `${SOURCE_DIR}/css`;
const JS_DIR = `${SOURCE_DIR}/js`;
const DIST_DIR = 'dist';
const SERVER_DIR = 'server';

gulp.task('clean-distribution', (done) => {
  rimraf(DIST_DIR, done);
});

gulp.task('clean-tmp', (done) => {
  rimraf(TMP_DIR, () => {});
  rimraf(`${SOURCE_DIR}/${TMP_DIR}`, done);
});

const CSS_FILES = `${CSS_DIR}/**/*.css`;
gulp.task('concat-css', () => gulp
  .src(CSS_FILES, { base: CSS_DIR })
  .pipe(concat('conocerd.css'))
  .pipe(gulp.dest(`${SOURCE_DIR}/.tmp`))
);


const JS_FILES = `${JS_DIR}/**/*.js`;
gulp.task('concat-js', () => gulp
  .src(JS_FILES, { base: JS_DIR })
  .pipe(concat('conocerd.js'))
  .pipe(gulp.dest(`${SOURCE_DIR}/.tmp`))
);

gulp.task('minify', ['concat-css', 'concat-js'], () => gulp
  .src(`${SOURCE_DIR}/.tmp/*`)
  .pipe(minify())
  .pipe(gulp.dest(`${SOURCE_DIR}/.tmp`))
);

const SOURCE_FILES = []
  .concat(`${SOURCE_DIR}/.tmp/**/*`)
  .concat(`${SOURCE_DIR}/img/**/*.js`)
  .concat(`${SOURCE_DIR}/templates/**/*.html`)
  .concat(`${SOURCE_DIR}/index.html`);

gulp.task('build-dist', ['clean-distribution', 'minify'], () => gulp
  .src(SOURCE_FILES)
  .pipe(gulp.dest(DIST_DIR))
);

const SERVER_FILES = `${SERVER_DIR}/**/*.es6`;
gulp.task('compile-server', ['clean-tmp'], () => gulp
  .src(SERVER_FILES, { base: '.' })
  .pipe(babel())
  .pipe(rename((p) => { p.extname = '.js'; }))
  .pipe(gulp.dest(TMP_DIR))
);

const DIST_FILES = `${DIST_DIR}/**/*.*`;
gulp.task('ship', ['build-dist', 'compile-server'], () => gulp
  .src(DIST_FILES, { base: DIST_DIR })
  .pipe(gulp.dest(`${TMP_DIR}/public`))
);
