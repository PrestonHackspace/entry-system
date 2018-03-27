import { FuseBox, Sparky, WebIndexPlugin, SVGPlugin, CSSPlugin, QuantumPlugin, Plugin, WorkFlowContext, CopyPlugin, CSSResourcePlugin } from 'fuse-box';
import { src, task, watch, context, fuse } from 'fuse-box/sparky';
import { BundleWriter } from 'fuse-box/quantum/plugin/BundleWriter';

const ctx = {
  isProduction: false,

  constructor() { },

  getConfig() {
    const plugins: (Plugin | Plugin[])[] = [
      [CSSResourcePlugin(), CSSPlugin()],
      SVGPlugin(),
      WebIndexPlugin({
        template: 'src/index.html',
      }),
      // CopyPlugin({
      //   files: [
      //     'css/style.css',
      //     // 'src/fonts/*.css',
      //     // 'src/fonts/*.woff2',
      //   ],
      //   dest: 'assets',
      // }),
    ];

    let quantum;

    if (this.isProduction) {
      quantum = QuantumPlugin({
        bakeApiIntoBundle: 'app',
        uglify: true,
        // css: true,
        treeshake: true,
      });
    } else {
      // quantum = QuantumPlugin({
      //   // css: true,
      //   treeshake: true,
      // });
    }

    if (quantum) {
      plugins.push(quantum);
    }

    return FuseBox.init({
      homeDir: 'src',
      output: 'dist/$name.js',
      target: 'browser@es5',
      hash: this.isProduction,
      useTypescriptCompiler: true,
      plugins,
    });
  },

  createBundle(fuse: FuseBox) {
    const app = fuse.bundle('app');

    fuse.register('material-ui', {
      homeDir: 'node_modules/material-ui',
      main: 'index.js',
      instructions: 'index.js',
    });

    fuse.register('material-ui-icons', {
      homeDir: 'node_modules/material-ui-icons',
      main: 'index.js',
      instructions: 'index.js',
    });

    fuse.register('react-router-dom', {
      homeDir: 'node_modules/react-router-dom',
      main: 'index.js',
      instructions: 'index.js',
    });

    fuse.register('returnof', {
      homeDir: 'node_modules/returnof',
      main: 'lib/returnof.js',
      instructions: '*.js',
    });

    // fuse.register('moment', {
    //   homeDir: 'node_modules/moment',
    //   main: 'moment.js',
    //   instructions: '*.js',
    // });

    // fuse.register('recompose', {
    //   homeDir: 'node_modules/recompose',
    //   main: 'src/packages/recompose/index.js',
    //   instructions: '*.js',
    // });

    if (!this.isProduction) {
      app.watch();
      app.hmr();
    }

    app.instructions('>index.tsx');

    return app;
  },
};

type MyContext = typeof ctx;

context(() => ctx);

task('clean', () => src('dist').clean('dist').exec());

task('default', ['clean'], async (context: MyContext) => {
  const fuse = context.getConfig();
  fuse.dev();
  context.createBundle(fuse);
  await fuse.run();
});

task('dist', ['clean'], async (context: MyContext) => {
  context.isProduction = true;
  const fuse = context.getConfig();
  fuse.dev(); // remove it later
  context.createBundle(fuse);
  await fuse.run();
});
