<template>
    <v-container fluid>
        <v-row justify="center">
            <v-col xs="12" sm="4" md="4" lg="4" xl="4" xxl="4">
                <v-card>
                    <v-img
                        height="150"
                        cover
                        src="https://www.salesforce.com/content/dam/web/es_mx/blog/seguimiento-de-ventas-como-hacer.jpg">
                    </v-img>
                    <v-card-text>
                        <h2 class="text-blue-grey-darken-2">
                            Sistema de Ventas
                        </h2>
                        <p class="text-blue-grey-darken-2">
                            Login
                        </p>
                        <br>
                        <v-form>
                            <v-text-field
                                label="Correo"
                                placeholder="correo@ventaxperto.com"
                                counter
                                maxlength="70"
                                color="indigo"
                                clearable
                                prepend-inner-icon="mdi-email"
                                v-model="usuario.email_user"
                            >
                            <!-- AJUSTAR MODELOS  -->
                            </v-text-field>
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
                            <!-- AJUSTAR MODELOS  -->
                            </v-text-field>
                            <v-btn
                                color="indigo"
                                block
                                @click="login"
                            >
                                Iniciar sesión
                            </v-btn>
                            <br>
                            <p class="text-blue-grey-darken-2 text-center">
                                ¿No cuentas con un usuario?
                            </p>
                            <v-btn
                                color="indigo"
                                block
                                to="/register"
                            >
                                Registrarse
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
        name: 'LoginView',
        data(){
            return {
                // Variable de formulario
                usuario: {
                    // AJUSTAR VARIABLES CON NOMBRES DE CAMPOS EN LA BD
                    email_user: '',
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
                        // Se extrae el usuario y token de la respuesta que retorna el endpoint de login
                        let datos = {
                            // AJUSTAR RESPONSE.DATA.DATA. CON NOMBRES DE CAMPOS EN LA BD
                            usuario: response.data.data.name_user,
                            rol: response.data.data.rol,
                            token: response.data.token
                        }
                        // Guardando datos en el storage y el state
                        this.$store.dispatch('login', datos)
                        if (datos.rol == 'admin') {
                            this.$router.push('/admin')
                        } else {
                            // Redireccionando a la pantalla de bienvenida
                            this.$router.push('/home')
                        }
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
            }
        }
    }
</script>