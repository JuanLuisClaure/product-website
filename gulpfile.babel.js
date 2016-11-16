import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';

const paths = {
  //servidor
  srv: 'src/server/**/*.js',

  //cliente
  clnt: 'entry.js',


  //carpertas de distribucion
  srvrDir: 'www/server',
  clntDir: 'www/client',

  //limpieza de la direccion en el watcheo, buena practica
  serverBundle: 'www/server/*.js?(.map)',
  clientBundle: 'www/client/*.js?(.map)',
  stylesBundle: 'www/client/*.css?(.map)',

};


//gulp.task para limpiar el servidor cuando hago start y cuando watcheo
gulp.task('cleanServer', () => {
  return del([
      paths.serverBundle,
  ]);
});
//gulp.task para limpiar el cliente cuando hago start y cuando watcheo
gulp.task('cleanClient', () => {
  return del([
      paths.clientBundle,
      paths.stylesBundle,
  ]);
});
//gulp.task donde paso de ES6  a ES5. Solo del servidor
gulp.task('build-server', ['cleanServer'], () => {
  return gulp.src(paths.srv)
    .pipe(babel())
    .pipe(gulp.dest(paths.srvrDir));
});

//
// //gulp.task donde bundleo con webpack el cliente,
gulp.task('build-client', ['cleanClient'], (callback) => {
  return gulp.src(paths.clnt)
            .pipe(webpack(webpackConfig, require('webpack')))
            .pipe(gulp.dest(paths.clntDir))
});

//gulp.task donde watcheo los cambio en el cliente
gulp.task('watch-server', () => {
  gulp.watch(paths.srv, ['build-server']);
});


gulp.task('default', ['watch-server', 'build-server', 'build-client']);
