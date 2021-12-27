
//Подключение модулей
const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const del = require('del')
const autoPrefixer = require('gulp-autoprefixer')

//Пути к изначальным файлам (src) и файлам назначения (dist)
const paths = {
	styles: {
		src: 'src/styles/**/*.less',
		dest: 'dist/css/'
	},
	scripts: {
		src: 'src/scripts/**/*.js',
		dest: 'dist/js/'
	}
}

//Задача для очистки каталога dist
function clean() {
	return del(['dist'])
}

//Задача для обработки стилей
function styles() {
	return gulp.src(paths.styles.src)
		.pipe(less())
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(rename({
			basename: 'main',
			suffix: '.min'
		}))
		.pipe(gulp.dest(paths.styles.dest))
}

//Задача для обработки скриптов
function scripts() {
	return gulp.src(paths.scripts.src, {
		sourcemaps: true
	})
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(uglify())
	.pipe(concat('main.min.js'))
	.pipe(gulp.dest(paths.scripts.dest))
}

//Задача для отслеживания изменений в проекте
function watch() {
	gulp.watch(paths.styles.src, styles)
	gulp.watch(paths.scripts.src, scripts)
}

//Задача для последовательного выполнения записанных в скобках функций (очистка, обработка стилей, отслеживание)
const build = gulp.series(clean, gulp.parallel(styles, scripts), watch)

//Задача для экспорта
exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build