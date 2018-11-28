var gulp = require('gulp');
var	concat = require('gulp-concat');
var connect = require('gulp-connect');
var autoprefixer  = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var sass = require('gulp-sass');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var npmDist = require('gulp-npm-dist');


var vendorCSS = ['./node_modules/font-awesome/css/*.min.css'];
				 
var vendorFont = ['./node_modules/font-awesome/fonts/*'];		

var vendorJS = [];	 

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

const tmp_path = '.tmp/';
const tmp_path_css = tmp_path + 'css';
const tmp_path_js = tmp_path + 'js';
const tmp_path_font = tmp_path + 'fonts';

const src_path = 'src/';
const src_path_css = src_path + 'css';
const src_path_js = src_path + 'js';
const src_path_font = src_path + 'fonts';
//allow typing gulp to run task
//gulp.task('default', ['html', 'css']);

//for production build
gulp.task('build', ['clean'], function () {
   gulp.src(vendorCSS)
       .pipe(concat('vendor.css'))
	   // Auto-prefix css styles for cross browser compatibility
	   .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
		// Minify the file
	   .pipe(csso())
       .pipe(gulp.dest(dist_path_css));
	   
	gulp.src(src_path + 'scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
		.pipe(sass())
		.pipe(csso())
		.pipe(gulp.dest(dist_path_css))
	
	gulp.src(vendorFont)
       .pipe(gulp.dest(dist_path_font));
	   
	gulp.src(src_path + '/**/*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))   
        .pipe(gulp.dest(dist_path));
		
	gulp.src(src_path + '**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(dist_path))
		
});

//for development use
gulp.task('serve', ['clean','watch'], function () {
   gulp.src(vendorCSS)
       .pipe(concat('vendor.css'))
	   // Auto-prefix css styles for cross browser compatibility
	   .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
		// Minify the file
	   .pipe(csso())
       .pipe(gulp.dest(tmp_path+'/css'));
	   
	
	gulp.start('sass');
	
	gulp.src(vendorFont)
       .pipe(gulp.dest(tmp_path_font));
	   
	gulp.src(src_path + '/**/*.html')
        .pipe(gulp.dest(tmp_path));
			
	gulp.src(src_path + '/**/*.js')
        .pipe(gulp.dest(tmp_path));
		
	browserSync.init({
		server: {
			baseDir: tmp_path,
		
		},	
		port: 8888
	})
	//run dev webserver
	/*connect.server({
	  port: 8888,
	  root: tmp_path
	});*/
});


//copy files to src folder
gulp.task('copy', function(){
	
	gulp.src(vendorCSS)
       .pipe(concat('vendor.css'))
       .pipe(gulp.dest(src_path_css));
	   
	gulp.src(vendorFont)
       .pipe(gulp.dest(src_path_font));
	
	
});

//watch for changes
gulp.task('watch', function(){
	gulp.watch(src_path + 'scss/**/*.scss', ['sass','browserSync']); 
	gulp.watch(src_path + '**/*.html', ['html','browserSync']); 
	gulp.watch(src_path + '**/*.js', ['js','browserSync']); 
});


//converts scss to css the output file
gulp.task('sass', function() {
  return gulp.src(src_path + 'scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
	.pipe(sass())
	.pipe(gulp.dest(tmp_path_css))
	// Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}));
});



//copy html to .tmp
gulp.task('html', function() {
  return gulp.src(src_path + '**/*.html') // Gets all files ending with .scss in app/scss and children dirs
 
   .pipe(gulp.dest(tmp_path))
});

//copy js to .tmp
gulp.task('js', function() {
  return gulp.src(src_path + '**/*.js')
   .pipe(gulp.dest(tmp_path))
});

gulp.task('clean', () => del(['dist','.tmp']));

gulp.task('browserSync', function() {
		browserSync.reload();
});