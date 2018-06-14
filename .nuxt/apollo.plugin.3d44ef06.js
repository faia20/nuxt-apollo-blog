import 'isomorphic-fetch'
import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

export default (ctx) => {

  const providerOptions = {
    clients: {}
  }

  const { isDev, isClient, isServer, app, route, beforeNuxtRender, store } = ctx

  
    let client = require('~/apollo/client-configs/default.js')
    // es6 module default export or not
    client = client.default(ctx) || client(ctx)
    const cache = client.cache || new InMemoryCache()

    const opts = isServer ? {
        ssrMode: true
    } : {
      ssrForceFetchDelay: 100,
      connectToDevTools: isDev
    }

    // hydrate client cache from the server
    if (!isServer) {
      cache.restore(window.__NUXT__ ? window.__NUXT__.apollo.defaultClient : null)
    }

    const finalOptions = Object.assign({}, opts, client, { cache })
    const defaultClient = new ApolloClient(finalOptions)

    
      providerOptions.defaultClient = defaultClient
    

  


  app.apolloProvider = new VueApollo(providerOptions)

  if (isServer) {
    beforeNuxtRender(async ({ Components, nuxtState }) => {
      Components.forEach((Component) => {
        // Fix https://github.com/nuxt-community/apollo-module/issues/19
        if (Component.options && Component.options.apollo && Component.options.apollo.$init) {
          delete Component.options.apollo.$init
        }
      })
      await app.apolloProvider.prefetchAll(ctx, Components)
      nuxtState.apollo = app.apolloProvider.getStates()
    })
  }

}
