<template>
  <v-app>     
    <v-app-bar color="deep-purple-darken-1" prominent >
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Sistema de notas MIAURELIO</v-toolbar-title>
      <v-spacer></v-spacer>
      <template  v-if="this.$store.getters.getUsuario==null">
        <v-btn icon="mdi-home" to="/"></v-btn>
      </template>
      <template v-if="this.$store.getters.getUsuario!==null">
        <v-btn icon="mdi-home" to="/home"></v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer color="deep-purple-darken-1" v-model="drawer" permanent>
      <v-list>
        <template  v-if="this.$store.getters.getUsuario==null">
          <v-list-item link to="/" title="Login"  prepend-icon="mdi-login"></v-list-item>
        </template>

        <template v-if="this.$store.getters.getUsuario!==null">
          <template v-if="this.$store.getters.getRol=='admin'">
            <v-list-item link to="/admin" title="Inicio" prepend-icon="mdi-home"></v-list-item>
            <v-list-item link to="/usuarios" title="Usuarios" prepend-icon="mdi-account-edit"></v-list-item>
            <v-list-item link to="/encargados" title="Encargados" prepend-icon="mdi-human-male-boy"></v-list-item>
            <v-list-item link to="/alumnos" title="Alumnos" prepend-icon="mdi-school"></v-list-item>
            <v-list-item link to="/docentes" title="Docentes" prepend-icon="mdi-glasses"></v-list-item>
            <v-list-item link to="/materias" title="Materias" prepend-icon="mdi-book-edit"></v-list-item>
            <v-list-item title="Logout" prepend-icon="mdi-logout" @click="logout"></v-list-item>
          </template>
          <template v-if="this.$store.getters.getRol!=='admin'">
            <v-list-item link to="/" title="Inicio" prepend-icon="mdi-home"></v-list-item>
            <v-list-item link to="/" title="Mis clases" prepend-icon="mdi-home"></v-list-item>
            <v-list-item link to="/asistencias" title="Asistencia" prepend-icon="mdi-home"></v-list-item>
            <v-list-item link to="/" title="Actividades" prepend-icon="mdi-home"></v-list-item>
            <v-list-item link to="/notas" title="Notas" prepend-icon="mdi-home"></v-list-item>
            <v-list-item title="Logout" prepend-icon="mdi-logout" @click="logout"></v-list-item>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data(){
    return{
      drawer: true,
      group: null,
    }
  },
  methods: {
    // Este método realiza el cierre de sesión
    logout(){
      // Vaciando el estado de la aplicación y el storage
      this.$store.dispatch('logout')
      // Redireccionando al login
      this.$router.push('/')
    },
    // Este método verifica si hay sesión para mantener o expulsar al usuario de la aplicación
    validarAcceso(){
      let datos = localStorage.getItem('userData');
      if(datos){
        // Si hay data en el storage se valida el acceso
        this.$store.dispatch('login', JSON.parse(datos));
        this.$router.push('/home')
        console.log(datos)
      } else {
        // Si no hay data se redirecciona al login
        this.$router.push('/')
      }
    }
  },
  created(){
    // El método se ejecuta cada vez que el componente se crea
    this.validarAcceso()
  },
  watch: {
      group () {
        this.drawer = false
      },
  }
}
</script>
