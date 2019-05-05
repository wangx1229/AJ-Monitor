// 类的继承
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

// 对象委托

const Monitor = {
  data: {
    params: null,
    nikeshoes: null,
    url: null
  },
  start () {
    this.data.url = new URL(this.data.url)
    Object.keys(this.data.params).forEach(key => {
      if (!Array.isArray(this.data.params[key])) {
        this.data.url.searchParams.append(key, this.data.params[key])
      } else {
        const tempA = this.data.params[key]
        tempA.forEach(item => this.data.url.searchParams.append(key, item))
      }
    })
    this.getList()
  },
  async getList () {
    const { objects } = await fetch(this.data.url).then(response => {
      return response.json()
    }).catch(e => {
      console.log(e)
    })
    if (objects) {
      this.data.nikeshoes = localStorage.getItem('nikeshoes') ? JSON.parse(localStorage.getItem('nikeshoes')) : {}
      objects.forEach(item => {
        if (!this.data.nikeshoes[item.id]) {
          this.data.nikeshoes[item.id] = true
          window.open(item.publishedContent.properties.coverCard.properties.portraitURL)
        }
      })
      localStorage.setItem('nikeshoes', JSON.stringify(this.data.nikeshoes))
    }
    this.getList()
  }
}

const nike = Object.create(Monitor, {
  data: {
    value: {
      params: {
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
      },
      nikeshoes: null,
      url: `https://api.nike.com/product_feed/threads/v2`
    }
  }
})

nike.start()

