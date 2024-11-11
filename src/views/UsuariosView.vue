<template>
    <v-container fluid>
        <div class="titulo">
            <h1>Usuarios del sistema</h1>
        </div>
        <v-row>
            <!-- Formulario para agregar usuarios -->
            <v-col xs="12" sm="3" md="3" lg="3" xl="3" xxl="3">
                <v-text-field 
                    label="Nombre" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable
                    required
                    placeholder="Nombre del usuario" 
                    v-model="usuario.name_user"
                >
                </v-text-field>
                <v-text-field 
                    label="Correo" 
                    maxlength="50" 
                    counter color="indigo" 
                    clearable
                    required 
                    placeholder="correo@ejemplo.com" 
                    v-model="usuario.email_user"
                >
                </v-text-field>
                <v-text-field 
                    label="Contraseña" 
                    maxlength="50" 
                    counter color="indigo" 
                    clearable
                    required 
                    placeholder="*********" 
                    v-model="usuario.password"
                >
                </v-text-field>
                <v-select
                    color="indigo"
                    label="Permisos"
                    :items="roles"
                    item-title="titulo"
                    item-value="valor"
                    required
                    v-model="usuario.rol"
                >
                </v-select>
                <v-btn
                    prepend-icon="mdi-check"
                    color="indigo"
                    block
                    @click="registrarUsuario"
                >
                    Agregar
                </v-btn>
            </v-col>
            <!-- Tabla para mostrar usuarios -->
            <v-col cols="9" xs="12" sm="9" md="9" lg="9" xl="9" xxl="9">
                <v-card>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody  v-for="(usuario, i) in usuarios" :key="i">
                                <tr>
                                    <th>{{usuario.id_user}}</th>
                                    <th>{{usuario.name_user}}</th>
                                    <th>{{usuario.email_user}}</th>
                                    <th>{{usuario.rol}}</th>
                                    <th>
                                        <v-btn-group>
                                            <!-- <v-btn icon="mdi-eye" color="indigo" @click="obtenerUsuario(usuario.id_user, 1)"></v-btn> -->
                                            <v-btn icon="mdi-pencil" color="green" @click="obtenerUsuario(usuario.id_user, 2)"></v-btn>
                                            <v-btn icon="mdi-delete" color="red" @click="eliminarUsuario(usuario.id_user)"></v-btn>
                                        </v-btn-group>
                                    </th>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-snackbar v-model="alertaEstado" color="blue-accent-1" timeout="2000">
        {{ mensaje }}
    </v-snackbar>
    <!-- Cuadro de diálogo para ver usuario -->
    <v-dialog
        v-model="dialogOne"
        transition="dialog-top-transition"
        width="500"
        >
        <v-card title="Ver" subtitle="Datos del usuario">
            <v-card-text>
                <v-list>
                    <v-list-item prepend-icon="mdi-account" :title="datos.name_user"></v-list-item>
                    <v-list-item prepend-icon="mdi-email" :title="datos.email_user"></v-list-item>
                    <v-list-item prepend-icon="mdi-briefcase" :title="datos.rol"></v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
    <!-- Cuadro de diálogo para editar registro -->
    <v-dialog
        v-model="dialogTwo"
        transition="dialog-top-transition"
        width="500"
        >
        <v-card title="Editar contraseña" subtitle="Escribir nueva contraseña">
            <v-card-text>
                <!-- <v-text-field 
                    label="Nombre" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Nombre del producto" 
                    v-model="datos.name_user"
                >
                </v-text-field> -->
                <!-- <v-text-field 
                    label="Correo" 
                    maxlength="50" 
                    counter color="indigo" 
                    clearable 
                    placeholder="correo@ejemplo.com" 
                    v-model="datos.email_user"
                >
                </v-text-field> -->
                <v-text-field 
                    label="Contraseña nueva" 
                    maxlength="50" 
                    counter color="indigo" 
                    clearable
                    required 
                    placeholder="*********" 
                    v-model="cambio.password"
                >
                </v-text-field>
                <v-text-field 
                    label="Confirmar contraseña" 
                    maxlength="50" 
                    counter color="indigo" 
                    clearable
                    required 
                    placeholder="*********" 
                    v-model="cambio.password_confirmation"
                >
                </v-text-field>
                <!-- <v-select
                    color="indigo"
                    label="Categoria"
                    :items="roles"
                    item-title="titulo"
                    item-value="valor"
                    v-model="datos.rol"
                >
                </v-select> -->
                <v-btn
                    prepend-icon="mdi-check"
                    color="indigo"
                    block
                    @click="modificarUsuario(datos.id_user)"
                >
                    Guardar
                </v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>

    // Importación de axios
    import axios from 'axios';
    // const base_url = 'http://127.0.0.1'
    export default {
        name: 'UsuariosView',
        data(){
            return {
                dialogTwo: false,
                roles: [
                  { titulo: 'Administrador', valor: 'admin' },
                  { titulo: 'Docente', valor: 'docente' },
                ],
                datos: {},
                cambio: {},
                dialogOne: false,
                usuario: {
                    name_user: '',
                    email_user: '',
                    password: '',
                    rol: ''
                },
                usuarios: [],
                alertaEstado: false,
                mensaje: '',
                // Configuración de header para todas las peticiones
                config: {
                    headers: {
                        'Authorization': 'Bearer '+this.$store.getters.getToken
                    }
                }
            }
        },
        methods: {
            // Petición para obtener usuarios registrados
            obtenerUsuarios(){
                axios.get('http://127.0.0.1:8000/api/usuario/select',this.config)
                .then(response => {
                    if(response.data.code==200){
                        let res = response.data
                        this.usuarios = res.data
                        // console.log(this.usuarios)
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para insertar un usuario
            registrarUsuario(){
                axios.post('http://127.0.0.1:8000/api/usuario/register', this.usuario, this.config)
                .then(response => {
                    if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.data
                        // Limpiar formulario
                        this.usuario = {}
                        this.obtenerUsuarios()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para consultar datos de un usuario
            obtenerUsuario(id, action){
                // Cambiar la visibilidad del modal ver/editar
                if(action==1){
                    this.dialogOne = true
                } else {
                    this.dialogTwo = true
                }
                this.datos.id_user = id
            },
            // Petición para modificar datos de un producto
            modificarUsuario(id){
                axios.post(`http://127.0.0.1:8000/api/usuario/update-password/${id}`, this.cambio, this.config)
                .then(response => {
                if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.data
                        // Ocultar cuadro de diálogo
                        this.dialogTwo = false
                        // Recargar tabla
                        this.obtenerUsuarios()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para eliminar un producto
            eliminarUsuario(id){
                axios.delete(`http://127.0.0.1:8000/api/usuario/delete/${id}`, this.config)
                .then(response => {
                    if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.data
                        // Recargar tabla
                        this.obtenerUsuarios()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            }
        },
        created(){
            this.obtenerUsuarios()
            console.log(this.usuarios)
        }
    }

</script>

<style scoped>

        .titulo {
        text-align: center;
        border: 0px;
        border-bottom: 2px;
        border-style: solid;
        border-color: blueviolet;
        margin-bottom: 15px;
    }

</style>