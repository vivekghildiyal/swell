import get from 'lodash/get'

// Add transformation parameters to image file URL
// for creating responsive images with srcset (For images on Swell CDN only)

const generateResponsiveImageData = (imageUrl, options) => {
  if (!imageUrl) return {}

  const { widths, format, quality } = options
  const host = 'https://965757062485e25e319b.ucr.io'
  let dpr = 1
  let q = quality
  const fm = format || 'jpg'
  const srcWidth = 1000

  if (process.client) {
    dpr = window.devicePixelRatio
    q = Math.round(q) // TODO lower value for higher pixel density screens - not needed with uploadcare
  }

  const srcsetArray = widths.map(width => {
    const transforms = `/-/resize/${width}x/-/quality/lighter/-/format/auto/`
    return host + transforms + imageUrl + ` ${width}w`
  })

  return {
    src: host + '/-/resize/1000x/-/quality/lighter/' + imageUrl,
    srcset: srcsetArray.join()
  }
}

export default {
  name: 'VisualMedia',
  functional: true,

  props: {
    // Media object returned by the API, or URL of the file
    source: {
      type: [Object, String],
      default:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    },
    // Alternative text for screen readers
    alt: {
      type: String,
      default: ''
    },
    // Aspect ratio (width to height) of the image container
    aspectRatio: {
      type: String,
      default: '1:1'
    },
    // Visual quality level expressed as a percentage (0–100)
    // Higher value = less compression, better quality, larger file size
    quality: {
      type: Number,
      default: 80
    },
    // Image widths to generate source urls for
    widths: {
      type: Array,
      default: () => [375, 640, 750, 1080, 1440, 2048, 2560, 3000, 3840]
    },
    // Media conditions that determine how wide the image will be displayed
    sizes: {
      type: String,
      default: '100vw'
    },
    // Flag for making the whole component display like
    // a background cover image with no set aspect ratio
    isBackground: {
      type: Boolean,
      default: false
    },
    // Determines if media should be lazy-loaded
    lazyLoad: {
      type: Boolean,
      default: true
    }
  },

  render(h, context) {
    const {
      source,
      alt,
      aspectRatio,
      quality,
      widths,
      sizes,
      isBackground,
      lazyLoad,
      browserCanLazyLoad
    } = context.props

    const [x, y] = aspectRatio.split(':')
    const ratioPadding = `${(y / x) * 100}%`

    // Set image object
    const image = {
      // src: source,
      // srcset: '',
      // sizes,
      alt
    }

    if (source && typeof source === 'object') {
      const file = get(source, 'file', source)
      image['data-blink-src'] = file.url
      // image.src = imageData.src
      // image.srcset = imageData.srcset
      // image.width = file.width
      // image.height = file.height
    }

    // Merge passed class string with staticClass from context
    const mergeClasses = classes => {
      const contextClasses = context.data.staticClass
      return contextClasses ? `${classes} ${contextClasses}` : classes
    }

    const wrapperClass = isBackground
      ? mergeClasses('h-full overflow-hidden')
      : mergeClasses('relative bg-primary-lighter w-full pb-full overflow-hidden')

    const imgClass = isBackground
      ? 'absolute top-0 left-0 w-full h-full object-cover'
      : 'absolute inset-0 w-full h-full object-cover'

    return (
      <div class={wrapperClass} style={isBackground ? null : `padding-bottom: ${ratioPadding}`}>
        <img
          {...{ attrs: image }}
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          style="object-fit: cover;"
          class={imgClass}
        />
      </div>
    )
  }
}
