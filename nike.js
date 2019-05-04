class Monitor {
  constructor(time) {
    const params = {
      anchor: 0,
      count: 10,
      filter: [
        'marketplace(CN)',
        'language(zh-Hans)',
        'channelId(010794e5-35fe-4e32-aaff-cd2c74f89d61)',
        'exclusiveAccess(true,false)'
      ],
      fields: [
        'active',
        'id',
        'lastFetchTime',
        'productInfo',
        'publishedContent.nodes',
        'publishedContent.properties.coverCard',
        'publishedContent.properties.productCard',
        'publishedContent.properties.products',
        'publishedContent.properties.publish.collections',
        'publishedContent.properties.relatedThreads',
        'publishedContent.properties.seo',
        'publishedContent.properties.threadType',
        'publishedContent.properties.custom'
      ]
    }
    this.url = new URL(`https://api.nike.com/product_feed/threads/v2`)
    Object.keys(params).forEach(key => {
      if(!Array.isArray(params[key])) {
        this.url.searchParams.append(key, params[key])
      } else {
        const tempA = params[key]
        tempA.forEach(item => this.url.searchParams.append(key, item))
      }
    })
    this.time = time
    this.timeId = null
    this.nikeshoes = localStorage.getItem('nikeshoes') ? JSON.parse(localStorage.getItem('nikeshoes')) : {}
  }

  init() {
    setTimeout(this.fetchData.bind(this), this.time)
  }
  async fetchData() {
    const {objects} = await fetch(this.url).then(response => {
      return response.json()
    }).catch(e => {
      console.log(e)
    })
    console.log(objects)
    if(objects) {
      this.nikeshoes = JSON.parse(localStorage.getItem('nikeshoes'))
      objects.forEach(item => {
        if (!this.nikeshoes[item.id]) {
          this.nikeshoes[item.id] = true
          window.open(item.publishedContent.properties.coverCard.properties.portraitURL)
        }
      })
      localStorage.setItem('nikeshoes', JSON.stringify(this.nikeshoes))
    }
    this.init()
  }
}

const monitor = new Monitor(1000)
monitor.init()