import gulp from 'gulp'
import babel from 'gulp-babel'
import del from 'del'
import eslint from 'gulp-eslint'
import gulpStylelint from 'gulp-stylelint'
import webpack from 'webpack-stream'
import webpackConfig from './webpack.config.babel'


const paths = {
  //  servidor
  srv: 'src/server/**/*.js',

  //  cliente
  clnt: 'src/client/**/*.js',


  //  redireccion a la entrada de webpack2
  entry: 'entry.js',

  //  lint para arhivos especificos
  gulpFile: 'gulpfile.babel.js',
  webpackC: 'webpack.config.babel.js',
  scssFile: 'src/client/**/*.scss',


  //  carpertas de distribucion
  srvrDir: 'www/server',
  clntDir: 'www/client',

  //  limpieza de la direccion en el watcheo, buena practica
  serverBundle: 'www/server/*.js?(.map)',
  clientBundle: 'www/client/*.js?(.map)',
  stylesBundle: 'www/client/*.css?(.map)',

}

gulp.task('lint-css', () =>
  gulp.src([
    paths.scssFile,
  ])
    .pipe(gulpStylelint(
        {
        failAfterError: false,
        reporters: [
          {formatter: 'string', console: true}
        ],
        }
    ))
)

//  gulp.task to make a ESlint of files in the src
gulp.task('lint', () =>
  gulp.src([
    paths.srv,
    paths.clnt,
    paths.gulpFile,
    paths.webpackC,
  ])
    .pipe(eslint())
    .pipe(eslint.format()),
    //  .pipe(eslint.failAfterError())
    //   esto esta comentado, si quieres que si encuentra
    //  un error lo bota automaticamente. si esta comenta sigue el proceso. depende de uno
)
//  gulp.task para limpiar el servidor cuando hago start y cuando watcheo
gulp.task('cleanServer', () => {
  del([
    paths.serverBundle,
  ])
})
//  gulp.task para limpiar el cliente cuando hago start y cuando watcheo
gulp.task('cleanClient', () => {
  del([
    paths.clientBundle,
    paths.stylesBundle,
  ])
})
//  gulp.task donde paso de ES6  a ES5. Solo del servidor
gulp.task('build-server', ['lint', 'cleanServer'], () => {
  gulp.src(paths.srv)
    .pipe(babel())
    .pipe(gulp.dest(paths.srvrDir))
})

// gulp.task donde bundleo con webpack el cliente,
gulp.task('build-client', ['lint-css', 'lint', 'cleanClient'], () => {
  gulp.src(paths.entry)
    .pipe(webpack(webpackConfig, require('webpack')))
    .pipe(gulp.dest(paths.clntDir))
})

//  gulp.task donde watcheo los cambio en el cliente
gulp.task('watch-server', () => {
  gulp.watch(paths.srv, ['build-server'])
})


gulp.task('default', ['watch-server', 'build-server', 'build-client'])
