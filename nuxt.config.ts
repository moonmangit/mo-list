export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
    public: {
      firebase: {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
      },
    },
  },
  components: [
    {
      path: "~/components/app",
      prefix: "app",
      pathPrefix: false,
    },
    {
      path: "~/components/element",
      prefix: "el",
      pathPrefix: false,
    },
    {
      path: "~/components/part",
      prefix: "part",
    },
  ],
  modules: [
    "@nuxtjs/tailwindcss",
    "dayjs-nuxt",
    "nuxt-icon",
    "@nuxtjs/google-fonts",
    "@vee-validate/nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],

  googleFonts: {
    families: {
      Poppins: [400, 500, 600, 700],
    },
  },
});
