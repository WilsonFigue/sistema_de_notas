<template>
    <v-container fluid>
        <v-row justify="center">
            <v-col xs="12" sm="4" md="4" lg="4" xl="4" xxl="4">
                <v-card>
                    <v-img
                    height="150"
                    cover
                    src="https://cdn.prod.website-files.com/626c39fe1ac567f4c6aacbfe/629544dff4e15528ac549e9a_628ea4113451aa2f2870853f_registrar-empresa.jpeg">
                    </v-img>
                    <v-card-text>
                        <h2 class="text-blue-grey-darken-2">
                            Sistema de Ventas
                        </h2>
                        <p class="text-blue-grey-darken-2">
                            Registro de usuario
                        </p>
                        <br>
                        <v-form>
                            <v-text-field
                                label="Nombre"
                                placeholder="Nombre del usuario"
                                counter
                                maxlength="70"
                                color="indigo"
                                clearable
                                prepend-inner-icon="mdi-email"
                                v-model="usuario.name"
                            >
                            </v-text-field>
                            <!-- AJUSTAR MODELOS  -->
                            <v-text-field
                                label="Correo"
                                placeholder="correo@ventaxperto.com"
                                counter
                                maxlength="70"
                                color="indigo"
                                clearable
                                prepend-inner-icon="mdi-email"
                                v-model="usuario.email"
                            >
                            </v-text-field>
                            <!-- AJUSTAR MODELOS  -->
                            <v-text-field
                                label="Contraseña"
                                placeholder="*********"
                                counter
                                maxlength="15"
                                color="indigo"
                                clearable
                                type="password"
                                prepend-inner-icon="mdi-key"
                                v-model="usuario.password"
                            >
                            </v-text-field>
                            <!-- AJUSTAR MODELOS  -->
                            <v-btn
                                color="indigo"
                                block
                                @click="register"
                            >
                                Registrar usuario
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <!-- Alerta -->
        <v-snackbar
            :timeout="1500"
            color="red-darken-4"
            v-model="alertaEstado"
        >
            {{ alertaMensaje }}
        </v-snackbar>
    </v-container>
</template>

<script>
    // Importar axios
    import axios from 'axios'

    export default {

        name: 'RegisterView',
        data(){
        return {
            // Variable de formulario
            usuario: {
                name: '',
                email: '',
                rol: '',
                password: ''
            },
            // Variables para controlar la alerta
            alertaEstado: false,
            alertaMensaje: ''
        }
        },
        methods: {
            // Petición para realizar login
            login(){
                axios.post('http://127.0.0.1:8000/api/usuario/login', this.usuario)
                .then(response => {
                // console.log(response)
                    if(response.status==200){
                        // Se extrae el usuario y token de
                        // la respuesta que retorna el endpoint de login
                        let datos = {
                            usuario: response.data.data.name,
                            token: response.data.token
                        }
                        // Guardando datos en el storage y el state
                        this.$store.dispatch('login', datos)
                        // Redireccionando a la pantalla de bienvenida
                        this.$router.push('/welcome')
                    }
                })
                .catch(error => {
                    console.log('Ha ocurrido un error '+error)
                    this.alertaEstado = true
                    // Usuario no autorizado
                    if(error.response.status==401){
                        this.alertaMensaje = error.response.data.data
                    } else {
                        this.alertaMensaje = '¡Ups! Algo salió mal'
                    }
                })
            },
            // Petición para registrar un usuario
            register(){
                axios.post('http://127.0.0.1:8000/api/usuario/register', this.usuario, this.config)
                .then(response => {
                    if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.data
                        // Limpiar formulario
                        // this.usuario = {}
                        this.login()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
        }
    }
</script>