<template>
  <div class="container">
    <div class="alert alert-success mt-3">
      <h1>Todos somos Aurelio!!!!</h1>
    </div>
    <v-row>
      <v-col>
        <v-img
          :src="require('../assets/Aurelios_love.jpg')"
          class="my-3"
          contain
          height="500"
        />
      </v-col>
      <v-col>
        <v-img
          :src="require('../assets/Creacion.jpg')"
          class="my-3"
          contain
          height="500"
          width="700"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',

  data: () => ({
    ecosystem: [
      {
        text: 'vuetify-loader',
        href: 'https://github.com/vuetifyjs/vuetify-loader/tree/next',
      },
      {
        text: 'github',
        href: 'https://github.com/vuetifyjs/vuetify/tree/next',
      },
      {
        text: 'awesome-vuetify',
        href: 'https://github.com/vuetifyjs/awesome-vuetify',
      },
    ],
    importantLinks: [
      {
        text: 'Chat',
        href: 'https://community.vuetifyjs.com',
      },
      {
        text: 'Made with Vuetify',
        href: 'https://madewithvuejs.com/vuetify',
      },
      {
        text: 'Twitter',
        href: 'https://twitter.com/vuetifyjs',
      },
      {
        text: 'Articles',
        href: 'https://medium.com/vuetify',
      },
    ],
    whatsNext: [
      {
        text: 'Explore components',
        href: 'https://vuetifyjs.com',
      },
      {
        text: 'Roadmap',
        href: 'https://vuetifyjs.com/introduction/roadmap/',
      },
      {
        text: 'Frequently Asked Questions',
        href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
      },
    ],
  }),
}
</script>
<style>
.container{
  text-align: center;
}
</style>