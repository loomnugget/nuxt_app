import { setContext } from 'apollo-link-context'
import { from } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// Nuxt Apollo Docs: https://github.com/nuxt-community/apollo-module
export default () => {
  return {
    link: new HttpLink({ uri: `mock/graphql` }),
    cache: new InMemoryCache()
  }
}
