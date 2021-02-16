import path from 'path'

export default function(moduleOptions) {
  const options = {
    dev: true,
    ...this.options.swellAnalytics,
    ...moduleOptions
  }

  this.addPlugin({
    src: path.resolve(__dirname, './plugin.js'),
    ssr: false,
    fileName: 'swell-analytics-plugin.js',
    options
  })
}