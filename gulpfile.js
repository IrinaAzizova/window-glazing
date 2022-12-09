const { src, dest, watch, parallel } = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

function browserReload() {
    browserSync.init({
        server: {
            baseDir: 'dist',
        },
    });  
    watch('src/*.html').on('change', browserSync.reload);
}

function styles() {
    return src('src/sass/*.+(scss|sass|css)')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(
            rename({
                prefix: '',
                suffix: '.min',
            })
        )
        .pipe(
            autoprefixer({
                cascade: false,
            })
        )
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

function html() {
    return src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist'));
}

function scripts() {
    return src('src/js/**/*.js')
            .pipe(dest('dist/js'))
            .pipe(browserSync.stream());
}

function fonts() {
    return src('src/fonts/**/*')
        .pipe(dest('dist/fonts'))
        .pipe(browserSync.stream());
}

function icons() {
    return src('src/icons/**/*')
        .pipe(dest('dist/icons'))
        .pipe(browserSync.stream());
}

function images() {
    return src('src/img/**/*')
        .pipe(imagemin())
        .pipe(dest('dist/img'))
        .pipe(browserSync.stream());
}

function watchChanges() {
    watch('src/sass/**/*.+(scss|sass|css)', parallel(styles));
    watch('src/*.html').on('change', parallel(html));
    watch("src/js/**/*.js").on('change', parallel(scripts));
    watch("src/fonts/**/*").on('add', parallel(fonts));
    watch("src/icons/**/*").on('all', parallel(icons));
    watch("src/img/**/*").on('all', parallel(images));
}

function defaultTask() {
    browserReload();
    styles();
    html();
    scripts();
    fonts();
    icons();
    images();
    watchChanges();
}
   
exports.default = defaultTask;