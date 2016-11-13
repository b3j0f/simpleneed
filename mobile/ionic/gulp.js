var gulp = require('gulp'); // Gulp needed locally - sudo npm install gulp
var bower = require('bower'); // Bower needed locally - sudo npm install bower
var gutil = require('gulp-util');
var del = require('del'); // Cleans directory
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate'); // Add angularjs dependency injection annotations
var cache = require('gulp-cached'); // A simple in-memory file cache for gulp
var ngHtml2Js = require('gulp-ng-html2js'); // Generates AngularJS modules, which pre-load your HTML code into the $templateCache
var minifyHtml = require('gulp-minify-html');
var angularFilesort = require('gulp-angular-filesort'); // Automatically sort AngularJS app files depending on module definitions and usage
var sh = require('shelljs');
var jshint = require('gulp-jshint'); // Lints your js for suggestions
var gulpif = require('gulp-if'); //  provides if/else functionlaity
var inject = require('gulp-inject'); // allows you to inject js/css between template tags
var runSequence = require('run-sequence'); // serialise the run sequence of tasks
var replace = require('gulp-replace'); // replace strings in files
//var sourcemaps = require('gulp-sourcemaps'); // Creates source maps so we can debug minified/uglified code

// Command line options - defines whether this is a dev or release build
// e.g gulp -r or gulp -d.
// By default, just running 'gulp' is the same as running 'gulp -d'
var args = require('yargs')
    .alias('r', 'release')
    .alias('d', 'develop')
    .default('release', false)
    .argv;

var release = args.release;
var dev = release ? false : true;

if(release){
    console.log('Starting RELEASE build');
} else {
    console.log('Starting DEV build');
}


// Paths - define your source and destination file/directory locations
var SOURCE_DIRECTORY = './src'; // Ionic default would be './www'
var BUILD_DIRECTORY = './www';     // No current Ionic default

// Edit these as required...
var paths = {
    project: {
        vendorJs: './project/vendor-js.json',   // defines which vendor js files to copy
        vendorCss: './project/vendor-css.json', // defines which vendor css files to copy
        jsHint: './project/jshintrc.json'       // defines the js hint rules file
    },
    source:{
        ionic: SOURCE_DIRECTORY+ '/vendor/bower_components/ionic/js/ionic.bundle.js',
        sass: [SOURCE_DIRECTORY + '/scss/**/*.scss'],
        js: [SOURCE_DIRECTORY + '/js/**/*.js'],
        css: [SOURCE_DIRECTORY + '/css/*.css'],
        vendor: [SOURCE_DIRECTORY + '/vendor/'],
        otherJs: [SOURCE_DIRECTORY + '/vendor/bower_components/angular-leaflet/dist/angular-leaflet-directive.min.js'],
        templates: [SOURCE_DIRECTORY + '/templates/**/*.html'],
        images: [SOURCE_DIRECTORY + '/img/**/*'],
        resources: [SOURCE_DIRECTORY + '/resources/**/*'],
        fonts: [SOURCE_DIRECTORY + '/fonts/*',
            SOURCE_DIRECTORY + '/vendor/bower_components/ionic/fonts/*'], // '.source/vendor/bower_components/fontawesome/**/*',
        index: [SOURCE_DIRECTORY + '/index.html'],
        config: SOURCE_DIRECTORY + '/js/config.json'
    },
    build: {
        root: BUILD_DIRECTORY + '/',
        ionic: BUILD_DIRECTORY + '/js/vendor/ionic.bundle.js',
        js: BUILD_DIRECTORY + '/js/',
        css: BUILD_DIRECTORY + '/css/',
        vendorJs: BUILD_DIRECTORY + '/js/vendor/',
        indexHtml: BUILD_DIRECTORY + '/index.html',
        indexJs: BUILD_DIRECTORY + '/js/**/*.js',
        indexCss: BUILD_DIRECTORY + '/css/**/*.css',
        images: BUILD_DIRECTORY + '/img/',
        resources: BUILD_DIRECTORY + '/resources/',
        fonts: BUILD_DIRECTORY + '/fonts/',
        templates: BUILD_DIRECTORY + '/templates/',
        templatesJs: BUILD_DIRECTORY + '/js/templates.min.js'
        //maps:'../maps/' // Not for release
    },
    extensions: {
        minJs: '.min.js',
        minCss: '.min.css'
    }
};

// TASKS
// default task just runs our main build task
// e.g. 'gulp' is the same as running 'gulp build'
gulp.task('default', ['build']);

// Main build task. Runs tasks in sequence where needed
gulp.task('build', function (callback) {
    runSequence(
        'clean',    // Do this first
        [
            'jsHint',
            'sass',
            'ionic',
            'vendor-js',
            'other-js',
            'vendor-css',
            'js',
            'css',
            'templates',
            'images',
            'resources',
            'fonts',
            'config'
        ],
        'indexJs', // These require the above tasks to be completed
        'indexCss',
        callback
    );
});

// Clean build directory
gulp.task('clean', function(done) {
    del(paths.build.root, done);
});


// Index - inject all the output js files in build directory into index.html using gulp-inject
// Make sure ionic.bundle.js is first and that templates.js are placed last
// then just use whatver .js files are in the folder in between (these are then sorted using gulp-angular-filesort)
gulp.task('indexJs', function() {
    return gulp.src(paths.source.index)
        .pipe(inject(
            gulp.src(paths.build.ionic, {read: false}), {name: 'ionic', ignorePath: 'www'}))
        .pipe(gulpif(release, inject(
            gulp.src(paths.build.templatesJs, {read: false}), {name: 'templates', ignorePath: 'www'})))
        .pipe(inject(gulp.src([paths.build.indexJs, '!' + paths.build.ionic, '!' + paths.build.templatesJs])
            .pipe(angularFilesort()), {ignorePath: 'www'}))
        .pipe(gulp.dest(paths.build.root));
});


// Index - inject all the output css files in build directory into index.html using gulp-inject
gulp.task('indexCss', function() {
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    return gulp.src(paths.build.indexHtml)
        .pipe(inject(
            gulp.src(paths.build.indexCss, {read: false}), {ignorePath: 'www'}))
        .pipe(gulp.dest(paths.build.root));
});


// Lint js sources based on .jshintrc ruleset and output to file
gulp.task('jsHint', function() {
    // return gulp.src(paths.source.js)
    //     .pipe(jshint(paths.project.jsHint))
    //     .pipe(jshint.reporter('default'));

    return gulp.src(paths.source.js)
        .pipe(gulpif(dev, jshint(paths.project.jsHint)))
        .pipe(gulpif(dev, jshint.reporter('gulp-jshint-html-reporter', {
            filename: 'jshint-output.html'
        })));

});


// SASS - buids the sass files
gulp.task('sass', function() {
  return gulp.src(paths.source.sass)
    .pipe(cache('sass'))
    //.pipe(gulpif(release, sourcemaps.init({loadMaps: true})))
    .pipe(sass())
    .pipe(gulpif(release, minifyCss({keepSpecialComments: 0})))
    .pipe(gulpif(release, rename({ extname: paths.extensions.minCss })))
    //.pipe(gulpif(release, sourcemaps.write(paths.build.maps)))
    .pipe(gulp.dest(paths.build.css));
});


// Ionic - copy the ionic bundle
// Keep Ionic bundle in its own task as it doesn't seem to work with gulp-angular-filesort
gulp.task('ionic', function() {
    return gulp.src(paths.source.ionic)
        .pipe(gulp.dest(paths.build.vendorJs));
});


// Vendor js - concatenate and minify vendor js sources. bower_components etc
// Vendor js files are defined in vendor-js.json
gulp.task('vendor-js', function() {
    var vendorFiles = require(paths.project.vendorJs);

    return gulp.src(vendorFiles)
        .pipe(cache('vendor-js'))
        //.pipe(gulpif(release, sourcemaps.init({loadMaps: true})))
        .pipe(gulpif(release, concat('vendor.js')))
        .pipe(gulpif(release, ngAnnotate())) // insert dependency injection annotation
        .pipe(gulpif(release, uglify()))
        .pipe(gulpif(release, rename({ extname: paths.extensions.minJs })))
        //.pipe(gulpif(release, sourcemaps.write(paths.build.maps)))
        .pipe(gulp.dest(paths.build.vendorJs));
});


// This is required because some js files don't minify and concat with others.
// Don't know why, some just don't play well
// N.B. This task may not be required depending on your sources
gulp.task('other-js', function() {
    return gulp.src(paths.source.otherJs)
        .pipe(gulp.dest(paths.build.vendorJs));
});


// Vendor css - concatenate and minify vendor css sources. bower_components etc
// Vendor css files are defined in vendor-css.json
gulp.task('vendor-css', function() {
    var vendorCssFiles = require(paths.project.vendorCss);

    return gulp.src(vendorCssFiles)
        .pipe(cache('vendor-css'))
        //.pipe(gulpif(release, sourcemaps.init({loadMaps: true})))
        .pipe(gulpif(release, concat('vendor.css')))
        .pipe(gulpif(release, minifyCss({
            keepSpecialComments: 0
        })))
        .pipe(gulpif(release, rename({ extname: paths.extensions.minCss })))
        //.pipe(gulpif(release, sourcemaps.write(paths.build.maps)))
        .pipe(gulp.dest(paths.build.css));
});


//  Your app's JS
gulp.task('js', function() {
    return gulp.src(paths.source.js)
        .pipe(cache('js'))
        .pipe(gulpif(release, angularFilesort())) // sort them depending on module and dependency
        //.pipe(gulpif(release, sourcemaps.init({loadMaps: true})))
        .pipe(gulpif(release, concat('app.js')))
        .pipe(gulpif(release, ngAnnotate())) // insert dependency injection annotation
        .pipe(gulpif(release, uglify()))
        .pipe(gulpif(release, rename({ extname: paths.extensions.minJs })))
        //.pipe(gulpif(release, sourcemaps.write(paths.build.maps)))
        .pipe(gulp.dest(paths.build.js));
});


// Your app's CSS
gulp.task('css', function() {
    return gulp.src(paths.source.css)
        .pipe(cache('css'))
        //.pipe(gulpif(release, sourcemaps.init({loadMaps: true})))
        .pipe(gulpif(release, concat('style.css')))
        .pipe(gulpif(release, minifyCss({
            keepSpecialComments: 0
        })))
        .pipe(gulpif(release, rename({ extname: paths.extensions.minCss })))
        //.pipe(gulpif(release, sourcemaps.write(paths.build.maps)))
        .pipe(gulp.dest(paths.build.css));
});


// Templates - add all html templates into Angular's $templateCache using gulp-ng-html2js
// N.B. Couldn't get gulp-angular-templatecache to work.
// Did weird URL reloading/flicking, maybe something to do with module definition...
gulp.task('templates', function() {
    return gulp.src(paths.source.templates)
        .pipe(cache('templates'))
        .pipe(gulpif(release, minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        })))
        .pipe(gulpif(release, ngHtml2Js({
            moduleName: 'myApp',
            prefix: 'templates/'
        })))
        .pipe(gulpif(release, concat('templates.js')))
        .pipe(gulpif(release, uglify()))
        .pipe(gulpif(release, rename({ extname: paths.extensions.minJs })))
        .pipe(gulpif(release, gulp.dest(paths.build.js), gulp.dest(paths.build.templates)));
});


// Images - copy images to build directory
gulp.task('images', function() {
  return gulp.src(paths.source.images)
    .pipe(gulp.dest(paths.build.images));
});


// Resources - copy other resource files to build directory
gulp.task('resources', function() {
  return gulp.src(paths.source.resources)
    .pipe(gulp.dest(paths.build.resources));
});


// Fonts - copy fonts to build directory
gulp.task('fonts', function() {
    return gulp.src(paths.source.fonts)
    .pipe(gulp.dest(paths.build.fonts));
});


// config - sets the dev/release config variable in config.json depending on whether build is a dev or release
// e.g. In your js you can then use this to check whether you need to load dev or release config variables from file
gulp.task('config', function(){
  return gulp.src(paths.source.config)
    .pipe(gulpif(release,
        replace('<BUILD>', 'release'),
        replace('<BUILD>', 'dev')))
    .pipe(gulp.dest(paths.build.js));
});


// Watchers
gulp.task('watch', function() {
    gulp.watch(paths.source.sass, ['sass']);
    gulp.watch(paths.source.js, ['js']);
    gulp.watch(paths.source.css, ['css']);
    gulp.watch(paths.source.vendor, ['vendor-js', 'vendor-css']);
    gulp.watch(paths.source.templates, ['templates']);
    gulp.watch(paths.source.images, ['images']);
    gulp.watch(paths.source.resources, ['resources']);
    gulp.watch(paths.source.fonts, ['fonts']);
    gulp.watch(paths.source.index, ['index']);
});


// Below is not part of the default gulp task - it's just used to update ionic
gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});


// Checks if Git is installed
gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
