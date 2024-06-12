const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
const concat = require("gulp-concat");
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require("gulp-sourcemaps");
const sortMediaQueries = require("postcss-sort-media-queries");
const pug = require('gulp-pug');
const svgSprite = require("gulp-svg-sprite");

const property = {
	result: {
		main: "./dist/",
		css: "./dist/css/",
		scripts: "./dist/scripts/",
		images: "./dist/images/",
		svg: "./dist/images/",
		fonts: "./dist/fonts/",
		libs: "./dist/libs/",
	},
	source: {
		main: "./src/",
		html: {
			main: "./src/html/",
			include: "./src/html/include/",
		},
		pug: "./src/pug/",
		scss: "./src/scss/",
		fonts: "./src/fonts/",
		images: "./src/images/",
		svg: "./src/images/svg-sprite/",
		libs: "./src/libs/",
		scripts: "./src/scripts/",
	},
};

gulp.task('clean', function () {
	return gulp.src(property.result.main, {read: false})
		.pipe(clean());
});

gulp.task("sass", function () {
	return gulp
		.src(property.source.scss + "/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(
			autoprefixer({
				cascade: false,
				overrideBrowserslist: ["last 2 versions"],
			})
		)
		.pipe(
			postcss([
				sortMediaQueries({
					sort: "desktop-first",
				}),
			])
		)
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(property.result.css));
});

gulp.task("fonts:build", function () {
	return gulp
		.src(property.source.fonts + "/**/*.{woff,woff2,ttf}")
		.pipe(gulp.dest(property.result.fonts));
});

gulp.task("svgSprite", function () {
    return gulp
        .src(property.source.svg + "/*.svg")
        .pipe(
            svgSprite({
                mode: {
                    stack: {
                        sprite: "../sprite.svg",
                    },
                },
            })
        )
        .pipe(gulp.dest(property.result.svg));
});

gulp.task('scripts:build', function () {
	return gulp.src(property.source.scripts + '/**')
		.pipe(gulp.dest(property.result.scripts));
});
gulp.task("img:build", function () {
    return gulp
        .src(
            [
                property.source.images + "/**/*",
                "!" + property.source.images + "/svg-sprite/",
                "!" + property.source.images + "/svg-sprite/**/*",
            ],
            { nodir: true }
        )
        .pipe(gulp.dest(property.result.images));
});
gulp.task('pug:build', function buildHTML() {
    return gulp.src(property.source.pug + "/*.pug")
        .pipe(pug({
            pretty: true,
            locals: { objectHash: require("object-hash") },
        }))
        .pipe(gulp.dest(property.result.main))
});


gulp.task("watch", function () {
	gulp.watch(property.source.main + "**/*", gulp.series("build"));
});

gulp.task(
	"build",
	gulp.series([
		"clean",
		"sass",
		"fonts:build",
		"scripts:build",
		"img:build",
		"svgSprite",
        "pug:build",
	])
);

gulp.task("default", function (done) {
	browserSync.init({
		server: {
			baseDir: property.result.main,
			browser: ["explorer"],
		},
	});

	gulp.watch(property.source.main + "**/*", gulp.series("build", "reload"));
});

gulp.task("reload", function (done) {
	browserSync.reload();
	done();
});