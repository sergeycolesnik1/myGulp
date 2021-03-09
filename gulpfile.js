//----подключение библиотек---------------------->
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const rename = require("gulp-rename");
const del = require('del');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const{src,dest,parallel,watch,series} = require('gulp');
const imagemin = require('gulp-imagemin');
//--------------------------------------------------------->
//---обработка scss  файла----->
const styles=()=>{
    return src('./src/scss/**/*.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(dest('./dist/css/'))
    .pipe(cleanCSS({leval: 2}))
    .pipe(rename({suffix:'min'}))
    .pipe(autoprefixer({cascade:false}))
    .pipe(dest('./dist/css/'))
    .pipe(browserSync.stream())
}
//----------------------------------->
//---обработка script  файла----->
function scripts(){
    return src('./src/js/**/*.js')
    .pipe(concat('script.js'))
    .pipe(dest('./dist/js/'))
    .pipe(rename({suffix:'min'}))
    .pipe(uglify())
    .pipe(dest('./dist/js/'))
    .pipe(browserSync.stream())
}
//--------------------------->
//---обработка img  файла----->
function images(){
    return src('./src/images/*')
    .pipe(imagemin({
        progressive:true,
        svgoPlugins:[{removeViewBox:false}],
        interlaced:true,
        optimizationLevel:3
    }))
    .pipe(dest('dist/images'))
}
//----------------------------->
//---обработка html  файла----->
function htmlInclud(){
   return src('./src/*.html')
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('./dist/'))
    .pipe(browserSync.stream())
}
//------------------------------>
//---------очистка исходной папки---->
function clean(){
   return del('dist/')
}
//-------------------------------------->
//--запуск браузера и слижение за изминениями----->
const watchFile=()=>{
      browserSync.init({
      server:{
      baseDir:"./dist"
      }   
      });
    watch('./src/scss/**/*.scss',styles);
    watch('./src/js/**/*.js',scripts);
    watch('./src/images/*',images);
    watch('./src/index.html',htmlInclud);
}
//-------------------------------------------->
//--- очистка и паралельное подключение всех файлов------------------>
exports.default=series(clean,parallel(htmlInclud,styles,images,scripts,watchFile));
//--------------------------------------------------------------->
