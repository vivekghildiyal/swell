import Vue from 'vue'

export default async (context, inject) => {
  // Access Swell context (not needed when consolidated)
  const { $swell, app } = context

  const storeSetting = await $swell.settings.get('store', {})

  // TODO: Get proper tracking ID i.e.(integrations.ga.id), for now use currently exposed FB Pixel ID
  const { facebookPixelId } = storeSetting

  if (facebookPixelId) {
    const VueGtag = await import('vue-gtag')

    Vue.use(
      VueGtag,
      {
        config: { id: facebookPixelId }
      },
      app.router
    )
  }
}
