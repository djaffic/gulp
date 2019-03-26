// подключаем модули gulp
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
]

const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]

//styles tasks 
function styles() {
    //Шаблон для поиска файлов CSS
    // Все файлы по шаблону './src/css/**/*.css'
    return gulp.src(cssFiles)

    //объединение фалйов в один
    .pipe(concat('style.css'))
    //префиксы для браузеров
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))

    .pipe(cleanCSS({
        level: 2
    }))
    //Выходная папка для стилей
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

//scripts tasks
function scripts() {
    return gulp.src(jsFiles)

    //объединение фалйов в один
    .pipe(concat('scripts.js'))

    //uglify
    .pipe(uglify())

    //Выходная папка для скриптов
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}

function clean() {
    return del(['build/*'])
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //следить за CSS
    gulp.watch('./src/css/**/*.css', styles)
    //следить за JS
    gulp.watch('./src/js/**/*.js', scripts)
//следить за HTML
    gulp.watch('./*html').on('change', browserSync.reload);
}

//таск вызывающий функцию styles
gulp.task('styles', styles);
//таск вызывающий функцию scripts
gulp.task('scripts', scripts);
//очистка папок
gulp.task('del', clean);
//отслеживание изменений в файлах
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));

gulp.task('dev', gulp.series('build','watch'));