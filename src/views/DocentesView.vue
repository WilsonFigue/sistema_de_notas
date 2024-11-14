<template>
    <v-container fluid>
        <div class="titulo">
            <h1>Registro de docentes</h1>
        </div>
        <v-row>
            <!-- Formulario para agregar docente -->
            <v-col xs="12" sm="12" md="3" lg="3" xl="3" xxl="3">
                <v-form style="margin: 15px;">
                    <v-text-field 
                        label="Nombre" 
                        maxlength="50" 
                        counter 
                        color="indigo" 
                        clearable 
                        placeholder="Nombre del docente" 
                        v-model="docente.nombre_docente"
                    >
                    </v-text-field>
                    <v-text-field 
                        label="Apellido" 
                        maxlength="50" 
                        counter 
                        color="indigo" 
                        clearable 
                        placeholder="Apellido del docente" 
                        v-model="docente.apellido_docente"
                    >
                    </v-text-field>
                    <v-text-field 
                        label="Dirección" 
                        maxlength="50" 
                        counter 
                        color="indigo" 
                        clearable 
                        placeholder="Municipio, Departamento" 
                        v-model="docente.direccion_docente"
                    >
                    </v-text-field>
                    <v-text-field 
                        label="Teléfono" 
                        maxlength="50" 
                        counter 
                        color="indigo" 
                        clearable 
                        placeholder="7777-7777" 
                        v-model="docente.telefono_docente"
                    >
                    </v-text-field>
                    <v-text-field 
                        label="Correo electrónico" 
                        maxlength="50" 
                        counter 
                        color="indigo" 
                        clearable 
                        placeholder="Correo del docente" 
                        v-model="docente.correo_docente"
                    >
                    </v-text-field>
                    <v-text-field 
                        label="Especialidad" 
                        maxlength="50" 
                        counter 
                        color="indigo" 
                        clearable 
                        placeholder="Especialidad del docente" 
                        v-model="docente.especialidad"
                    >
                    </v-text-field>
                    <v-select
                        color="indigo"
                        label="Asignar usuario"
                        :items="usuarios"
                        item-value="id_user"
                        item-title="email_user"
                        v-model="docente.id_user"
                    >
                    </v-select>
                    <v-btn
                        prepend-icon="mdi-account-plus"
                        color="indigo"
                        block
                        style="margin-bottom: 20px;"
                        @click="obtenerUsuario"
                    >
                        Registrar usuario
                    </v-btn>
                    <v-btn
                        prepend-icon="mdi-check"
                        color="indigo"
                        block
                        @click="agregarDocente"
                    >
                        Agregar docente
                    </v-btn>
                </v-form>
            </v-col>
            <!-- Tabla para mostrar docentes -->
            <v-col cols="9" xs="12" sm="9" md="9" lg="9" xl="9" xxl="9">
                <v-card>
                    <v-card-text>
                         <!-- implementando data table -->                        
                         <v-data-table :headers="headers" :items="docentes" class="elevation-1"
                        :items-per-page="10" :search="search" loading-text="Loading... Please wait">
                            <template v-slot:top> <!-- Cabecera de la tabla -->
                                <v-toolbar flat>
                                <v-toolbar-title>LISTADO DE DOCENTES</v-toolbar-title>
                                </v-toolbar>
                                <!-- para el filtro de busqueda -->
                                <v-text-field color="indigo" label="Buscar" clearable v-model="search"></v-text-field>
                            </template>
                            <template v-slot:[`item.actions`]="{ item }"> <!-- botones de la tabla -->
                                <div class="text-center">
                                <v-btn-group>
                                    <!-- <v-btn icon="mdi-eye" color="indigo" @click="obtenerEncargado(item.id_encargado, 1)"></v-btn> -->
                                    <v-btn icon="mdi-pencil" color="green" @click="obtenerDocente(item.id_docente, 2)"></v-btn>
                                    <v-btn icon="mdi-delete" color="red" @click="eliminarDocente(item.id_docente)"></v-btn>
                                </v-btn-group>
                                </div>
                            </template>
                        </v-data-table>
                        <!-- <v-table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Foto</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Genero</th>
                                    <th>Observaciones</th>
                                    <th>Grado</th>
                                    <th>Estado</th>
                                    <th>Encargado</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody  v-for="(docente, i) in docentes" :key="i">
                                <tr>
                                    <th>{{docente.id_docente}}</th>
                                    <th>
                                        <template>
                                            <v-img :src="getImageSrc(docente.foto_docentes)" min-width="100%" alt=""></v-img>
                                        </template>
                                    </th>
                                    <th>{{docente.nombre_docente}}</th>
                                    <th>{{docente.apellido_docente}}</th>
                                    <th>{{docente.genero_docente}}</th>
                                    <th>{{docente.observaciones_alumn}}</th>
                                    <th>{{docente.nombre_grado}}</th>
                                    <th v-if="docente.estado_docente == 1">Activo</th>
                                    <th v-if="docente.estado_docente !== 1">Inactivo</th>
                                    <th>{{docente.nombre_encargado}}</th>
                                    <th>{{docente.apellido_encargado}}</th>
                                    <th>
                                        <v-btn-group>
                                            <v-btn icon="mdi-eye" color="indigo" @click="obtenerAlumno(docente.id_docente, 1)"></v-btn>
                                            <v-btn icon="mdi-pencil" color="green" @click="obtenerAlumno(docente.id_docente, 2)"></v-btn>
                                            <v-btn icon="mdi-delete" color="red" @click="elimniarAlumno(docente.id_docente)"></v-btn>
                                        </v-btn-group>
                                    </th>
                                </tr>
                            </tbody>
                        </v-table> -->
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-snackbar v-model="alertaEstado" color="blue-accent-1" timeout="2000">
        {{ mensaje }}
    </v-snackbar>
    <!-- Cuadro de diálogo para ver registro -->
    <!-- <v-dialog
        v-model="dialogOne"
        transition="dialog-top-transition"
        width="500"
        >
        <v-card title="Ver" subtitle="Datos del docente">
            <v-card-text>
                <v-list>
                    <v-list-item prepend-icon="mdi-account" :title="datos.nombre_docente"></v-list-item>
                    <v-list-item prepend-icon="mdi-currency-usd" :title="datos.apellido_docente"></v-list-item>
                    <v-list-item prepend-icon="mdi-book-variant" :title="datos.genero_docente"></v-list-item>
                    <v-list-item prepend-icon="mdi-shape" :title="datos.nombre_grado"></v-list-item>
                    <v-list-item prepend-icon="mdi-shape" :title="datos.nombre_encargado"></v-list-item>
                    <v-list-item prepend-icon="mdi-shape" :title="datos.apellido_encargado"></v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog> -->
    <!-- Cuadro de diálogo para editar registro -->
    <v-dialog
        v-model="dialogTwo"
        transition="dialog-top-transition"
        width="500"
        >
        <v-card title="Editar" subtitle="Datos del docente">
            <v-card-text>
                <v-text-field 
                    label="Nombre" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Nombre del docente" 
                    v-model="datos.nombre_docente"
                >
                </v-text-field>
                <v-text-field 
                    label="Apellido" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Apellido del docente" 
                    v-model="datos.apellido_docente"
                >
                </v-text-field>
                <v-text-field 
                    label="Dirección" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Municipio, Departamento" 
                    v-model="datos.direccion_docente"
                >
                </v-text-field>
                <v-text-field 
                    label="Teléfono" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="7777-7777" 
                    v-model="datos.telefono_docente"
                >
                </v-text-field>
                <v-text-field 
                    label="Correo electrónico" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Correo del docente" 
                    v-model="datos.correo_docente"
                >
                </v-text-field>
                <v-text-field 
                    label="Especialidad" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Especialidad del docente" 
                    v-model="datos.especialidad"
                >
                </v-text-field>
                <v-select
                    color="indigo"
                    label="Asignar usuario"
                    disabled
                    :title="datos.email_user"
                    v-model="datos.id_user"
                >
                </v-select>
                <v-btn
                    prepend-icon="mdi-check"
                    color="indigo"
                    block
                    @click="modificarDocente(datos.id_docente)"
                >
                    Guardar
                </v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog
        v-model="dialogUsuario"
        transition="dialog-top-transition"
        width="500"
    >
        <v-card title="Registrar usuario" subtitle="Datos del usuario">
            <v-card-text>
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
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>

    // Importación de axios
    import axios from 'axios';
    // const base_url = 'http://127.0.0.1'
    export default {
        name: 'AlumnosView',
        data(){
            return {
                dialogTwo: false,
                dialogUsuario: false,
                dialogOne: false,
                datos: {},
                usuario: {},
                usuarios: [],
                docente: {},
                docentes: [],
                alertaEstado: false,
                mensaje: '',
                roles: [
                    { titulo: 'Administrador', valor: 'admin' },
                    { titulo: 'Docente', valor: 'docente' },
                ],
                headers: [//esto es para el data table
                    { title: 'ID', value: 'id_docente' },
                    { title: 'Nombre', value: 'nombre_docente' },
                    { title: 'Apellido', value: 'apellido_docente' },
                    { title: 'Usuario', value: 'email_user' },
                    { title: 'Correo', value: 'correo_docente' },
                    { title: 'Especialidad', value: 'especialidad' },
                    { title: 'Teléfono', value: 'telefono_docente' },
                    { title: 'Dirección', value: 'direccion_docente' },
                    { title: 'Acciones', value: 'actions', sortable: false, align: 'center' }
                ],
                search: '',//para el filtro de busqueda
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
                axios.get('http://127.0.0.1:8000/api/usuario/get-users',this.config)
                .then(response => {
                    if(response.data.code==200){
                        let res = response.data
                        this.usuarios = res.data
                        // console.log(this.usuarios)
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para obtener encargados
            obtenerDocentes(){
                axios.get('http://127.0.0.1:8000/api/docentes/select', this.config)
                .then(response => {
                    if(response.data.code==200){
                        let res = response.data
                        this.docentes = res.data
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para insertar un docente
            agregarDocente(){
                axios.post('http://127.0.0.1:8000/api/docentes/store', this.docente, this.config)
                .then(response => {
                    if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.message
                        // Limpiar formulario
                        this.docente = {}
                        this.obtenerDocentes()
                        this.obtenerUsuarios()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para insertar un encargado
            obtenerUsuario(){
                this.dialogUsuario = true
            },
            // Petición para insertar un usuario
            registrarUsuario(){
                axios.post('http://127.0.0.1:8000/api/usuario/register', this.usuario, this.config)
                .then(response => {
                    if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.data
                        this.dialogUsuario = false
                        // Limpiar formulario
                        this.usuario = {}
                        this.obtenerDocentes()
                        this.obtenerUsuarios()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para consultar datos de un producto
            obtenerDocente(id, action){
                // Cambiar la visibilidad del modal ver/editar
                if(action==1){
                    this.dialogOne = true
                } 
                else {
                    this.dialogTwo = true
                }
                // Realizar petición para consultar datos de un docente
                axios.get(`http://127.0.0.1:8000/api/docentes/find/${id}`, this.config)
                .then(response => {
                    if(response.data.code==200){
                        let res = response.data
                        this.datos = res.data[0]
                        // console.log(this.datos)
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para modificar datos de un producto
            modificarDocente(id){
                axios.put(`http://127.0.0.1:8000/api/docentes/update/${id}`, this.datos, this.config)
                .then(response => {
                if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.message
                        // Ocultar cuadro de diálogo
                        this.dialogTwo = false
                        // Recargar tabla
                        this.obtenerDocentes()
                        this.obtenerUsuarios()                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para eliminar un producto
            eliminarDocente(id){
                axios.delete(`http://127.0.0.1:8000/api/docentes/delete/${id}`, this.config)
                .then(response => {
                    if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.message
                        // Recargar tabla
                        this.obtenerDocentes()
                        this.obtenerUsuarios()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            }
        },
        created(){
            this.obtenerUsuarios()
            this.obtenerDocentes()
            // console.log(this.docentes)
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