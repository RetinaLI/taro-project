const config = {
  projectName: 'we-app-taro',
  date: '2018-12-5',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        'env'
      ],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-object-rest-spread'
      ]
    }
  },
  defineConstants: {
  },
  copy: {
    patterns: [
      { from: 'src/assets', to: 'dist/assets' }
    ],
    options: {
    }
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        pxtransform: {
          enable: true,
          config: {

          }
        },
        url: {
          enable: true,
          config: {
            limit: 10240 // 设定转换尺寸上限
          }
        }
      }
    },
    compile: {
      exclude: ['src/plugins/ec-canvas/echarts.js']
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        }
      }
    },
    compile: {
      exclude: ['src/plugins/ec-canvas/echarts.js']
    },
    esnextModules: ['taro-ui']
  }
}

module.exports = function (merge) {
  if (process.env.npm_lifecycle_event === 'build:h5' && config.outputRoot !== 'h5-dist' && config.outputRoot !== 'h5-build-dist') {
    if (process.env.NODE_ENV === 'development') {
      config.outputRoot = 'h5-dist';
      config.copy.patterns.forEach(opt => {
        opt.to = opt.to.replace('dist', 'h5-dist');
      })
    } else {
      config.outputRoot = 'h5-build-dist';
      config.copy.patterns.forEach(opt => {
        opt.to = opt.to.replace('dist', 'h5-build-dist');
      })
    }

  }
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  if (process.env.npm_lifecycle_event === 'build:h5') {
    config.h5.publicPath = './';
  }
  return merge({}, config, require('./prod'));
}
