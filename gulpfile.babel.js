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
  rimraf(TMP_DIR, done);
});

const CSS_FILES = `${CSS_DIR}/**/*.css`;
gulp.task('minify-css', () => gulp
  .src(CSS_FILES)
  .pipe(concat('conocerd.min.css'))
  .pipe(minify())
  .pipe(gulp.dest(CSS_FILES))
);

const JS_FILES = `${JS_DIR}/**/*.css`;
gulp.task('minify-js', () => gulp
  .src(JS_FILES)
  .pipe(concat('conocerd.min.js'))
  .pipe(minify())
  .pipe(gulp.dest(JS_FILES))
);

const SOURCE_FILES = []
  .concat(`${CSS_FILES}/conocerd.min.css`)
  .concat(`${JS_FILES}/conocerd.min.js`)
  .concat(`${SOURCE_DIR}/img/**/*.js`)
  .concat(`${SOURCE_DIR}/templates/**/*.html`)
  .concat(`${SOURCE_DIR}/index.html`);

gulp.task('build-dist', ['clean-distribution', 'minify-css', 'minify-js'], () => gulp
  .src(SOURCE_FILES, { base: SOURCE_DIR })
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
