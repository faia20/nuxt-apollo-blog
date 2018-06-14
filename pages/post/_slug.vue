<template>
  <div>
    <article>
      <h1>{{post.title}}</h1>
      <div class='placeholder'>
        <img
          :alt="post.title"
          :src="`https://media.graphcms.com/resize=w:650,h:366,fit:crop/${post.coverImage.handle}`"
        />
      </div>
      <vue-markdown>{{post.content}}</vue-markdown>
    </article>
  </div>
</template>

<script>
  import gql from 'graphql-tag'
  import VueMarkdown from 'vue-markdown'

  const post = gql`
    query post($slug: String!) {
      post: Post(slug: $slug) {
        id
        slug
        title
        coverImage {
          handle
        }
        content
        dateAndTime
      }
    }
  `

  export default {
    name: 'PostPage',
    apollo: {
      post: {
        query: post,
        variables () {
          return {
            slug: this.$route.params.slug
          }
        },
        prefetch: true
      }
    },
    components: { VueMarkdown }
  }
</script>

<style scoped>
  .placeholder {
    height: 366px;
    background-color: #eee;
  }
</style>
