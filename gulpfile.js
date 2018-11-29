var gulp = require('gulp');
var autoprefixer  = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var gulpif = require('gulp-if');


const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];



const dist_path = 'dist/';
const dist_path_css = dist_path + 'css';
const dist_path_js = dist_path + 'js';
const dist_path_font = dist_path + 'fonts';


const src_path = 'src/';
const src_path_css = src_path + 'css';
const src_path_js = src_path + 'js';
const src_path_font = src_path + 'fonts';
//allow typing gulp to run task
//gulp.task('default', ['html', 'css']);

//for production build
gulp.task('build', ['clean','buildSass'], function(){
	
	gulp.start('move-images');
	gulp.start('move-fonts');
	
	gulp.src(src_path + '*.html')
	.pipe(useref())
	.pipe(gulpif('*.js', uglify()))
	.pipe(gulpif('*.css', csso()))
    .pipe(gulp.dest(dist_path));


});


//compile sass into css in src folder
gulp.task('buildSass', function(){
	gulp.src(src_path + 'scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
	.pipe(sass())
	.pipe(csso())
	.pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
	.pipe(gulp.dest(src_path_css));
});


//for development use
gulp.task('serve', ['buildSass', 'watch'], function () {
	
	browserSync.init({
		server: {
			baseDir: src_path,
			routes: {
				"../node_modules": "node_modules"
			}
		
		},	
		port: 8888
	})

});


//watch for changes
gulp.task('watch', function(){
	gulp.watch(src_path + 'scss/**/*.scss', ['sass','browserSync']); 
	gulp.watch(src_path + '**/*.html', ['browserSync']); 
	gulp.watch(src_path + '**/*.js', ['browserSync']); 
});

//move fonts to dist folder
gulp.task('move-fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

//move images to dist folder
gulp.task('move-images', function() {
    return gulp.src(src_path + 'img/**/*.{jpg,svg,png,gif}')
        .pipe(gulp.dest('dist/img'))
});



//delete dist folder 
gulp.task('clean', () => del(['dist']));

gulp.task('browserSync', function() {
		browserSync.reload();
});