import get from 'lodash/get'

export default {
  name: 'VisualMedia',
  functional: true,

  props: {
    // Media object returned by the API, or URL of the file
    source: {
      type: [Object],
      default: null
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
    }
  },

  render(h, context) {
    const { source, alt, aspectRatio, sizes, isBackground } = context.props
    const [x, y] = aspectRatio.split(':')
    const ratioPadding = `${(y / x) * 100}%`

    // Set image object
    const image = {
      sizes,
      alt
    }

    if (source && typeof source === 'object') {
      const file = get(source, 'file', source)
      image['data-blink-src'] = file.url
    }

    if (!isBackground) {
      // TODO resolve aspect ratio crop issue with UC
      // image['data-blink-ops'] = `scale-crop: ${x * 1000}x${y * 1000}; scale-crop-position: center;`
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
