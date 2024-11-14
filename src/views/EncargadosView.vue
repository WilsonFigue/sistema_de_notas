<template>
    <v-container fluid>
        <div class="titulo">
            <h1>Gestión de encargados</h1>
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
                    placeholder="Nombre del encargado" 
                    v-model="encargado.nombre_encargado"
                >
                </v-text-field>
                <v-text-field 
                    label="Apellido" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Apellido del encargado" 
                    v-model="encargado.apellido_encargado"
                >
                </v-text-field>
                <v-text-field 
                    label="Teléfono" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Teléfono del encargado" 
                    v-model="encargado.telefono_encargado"
                >
                </v-text-field>
                <v-text-field 
                    label="Correo electrónico" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Correo del encargado" 
                    v-model="encargado.correo_encargado"
                >
                </v-text-field>
                <v-text-field 
                    label="Dirección de vivienda" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Dirección del encargado" 
                    v-model="encargado.direccion_encargado"
                >
                </v-text-field>
                <v-text-field 
                    label="DUI" 
                    maxlength="10" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="DUI del encargado" 
                    v-model="encargado.DUI_encargado"
                >
                </v-text-field>
                <v-select
                    color="indigo"
                    label="Relación con el estudiante"
                    :items="parentescos"
                    item-value="valor"
                    item-title="titulo"
                    v-model="encargado.relacion_estudiante"
                >
                </v-select>
                <v-btn
                    prepend-icon="mdi-check"
                    color="indigo"
                    block
                    @click="agregarEncargado()"
                >
                    Agregar
                </v-btn>
            </v-col>
            <!-- Tabla para mostrar usuarios -->
            <v-col cols="9" xs="12" sm="9" md="9" lg="9" xl="9" xxl="9">
                <v-card>
                    <v-card-text>
                        <!-- implementando data table -->                        
                        <v-data-table :headers="headers" :items="encargados" class="elevation-1"
                        :items-per-page="10" :search="search" loading-text="Loading... Please wait">
                            <template v-slot:top> <!-- Cabecera de la tabla -->
                                <v-toolbar flat>
                                <v-toolbar-title>LISTADO DE ENCARGADOS</v-toolbar-title>
                                </v-toolbar>
                                <!-- para el filtro de busqueda -->
                                <v-text-field color="indigo" label="Buscar" clearable v-model="search"></v-text-field>
                            </template>
                            <template v-slot:[`item.actions`]="{ item }"> <!-- botones de la tabla -->
                                <div class="text-center">
                                <v-btn-group>
                                    <!-- <v-btn icon="mdi-eye" color="indigo" @click="obtenerEncargado(item.id_encargado, 1)"></v-btn> -->
                                    <v-btn icon="mdi-pencil" color="green" @click="obtenerEncargado(item.id_encargado, 2)"></v-btn>
                                    <v-btn icon="mdi-delete" color="red" @click="eliminarEncargado(item.id_encargado)"></v-btn>
                                </v-btn-group>
                                </div>
                            </template>
                        </v-data-table>
                        <!-- <v-table>
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
                                             <v-btn icon="mdi-eye" color="indigo" @click="obtenerUsuario(usuario.id_user, 1)"></v-btn>
                                            <v-btn icon="mdi-pencil" color="green" @click="obtenerUsuario(usuario.id_user, 2)"></v-btn>
                                            <v-btn icon="mdi-delete" color="red" @click="eliminarUsuario(usuario.id_user)"></v-btn>
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
    <!-- Cuadro de diálogo para ver usuario -->
    <!-- <v-dialog
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
    </v-dialog> -->
    <!-- Cuadro de diálogo para editar registro -->
    <v-dialog
        v-model="dialogTwo"
        transition="dialog-top-transition"
        width="500"
        >
        <v-card title="Editar contraseña" subtitle="Escribir nueva contraseña">
            <v-card-text>
                <v-text-field 
                    label="Nombre" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Nombre del encargado" 
                    v-model="datos.nombre_encargado"
                >
                </v-text-field>
                <v-text-field 
                    label="Apellido" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Apellido del encargado" 
                    v-model="datos.apellido_encargado"
                >
                </v-text-field>
                <v-text-field 
                    label="Teléfono" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Teléfono del encargado" 
                    v-model="datos.telefono_encargado"
                >
                </v-text-field>
                <v-text-field 
                    label="Correo electrónico" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Correo del encargado" 
                    v-model="datos.correo_encargado"
                >
                </v-text-field>
                <v-text-field 
                    label="Dirección de vivienda" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Dirección del encargado" 
                    v-model="datos.direccion_encargado"
                >
                </v-text-field>
                <v-text-field 
                    label="DUI" 
                    maxlength="10" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="DUI del encargado" 
                    v-model="datos.DUI_encargado"
                >
                </v-text-field>
                <v-select
                    color="indigo"
                    label="Relación con el estudiante"
                    :items="parentescos"
                    item-value="valor"
                    item-title="titulo"
                    v-model="datos.relacion_estudiante"
                >
                </v-select>
                <v-btn
                    prepend-icon="mdi-check"
                    color="indigo"
                    block
                    @click="modificarEncargado(datos.id_encargado)"
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
        name: 'EncargadosView',
        data(){
            return {
                dialogTwo: false,
                dialogOne: false,
                parentescos: [
                    { titulo: 'Padre', valor: 'Padre' },
                    { titulo: 'Madre', valor: 'Madre' },
                    { titulo: 'Otro familiar', valor: 'Otro' },
                ],
                datos: {},
                encargado: {},
                encargados: [],
                alertaEstado: false,
                mensaje: '',
                headers: [//esto es para el data table
                    { title: 'ID', value: 'id_encargado' },
                    { title: 'Nombre', value: 'nombre_encargado' },
                    { title: 'Apellido', value: 'apellido_encargado' },
                    { title: 'Teléfono', value: 'telefono_encargado' },
                    { title: 'Correo', value: 'correo_encargado' },
                    { title: 'Dirección', value: 'direccion_encargado' },
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
            // Petición para obtener encargados
            obtenerEncargados(){
                axios.get('http://127.0.0.1:8000/api/encargados/select', this.config)
                .then(response => {
                    if(response.data.code==200){
                        let res = response.data
                        this.encargados = res.data
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para insertar un encargado
            agregarEncargado(){
                axios.post('http://127.0.0.1:8000/api/encargados/store', this.encargado, this.config)
                .then(response => {
                    if(response.data.code==201){
                        this.dialogEncargado = false
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.data
                        // Limpiar formulario
                        this.encargado = {}
                        this.obtenerEncargados()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para consultar datos de un encargado
            obtenerEncargado(id, action){
                // Cambiar la visibilidad del modal ver/editar
                if(action==1){
                    this.dialogOne = true
                } else {
                    this.dialogTwo = true
                }
                // Realizar petición para consultar datos de un alumno
                axios.get(`http://127.0.0.1:8000/api/encargados/find/${id}`, this.config)
                .then(response => {
                    if(response.data.code==200){
                        let res = response.data
                        this.datos = res.data
                        console.log(this.datos)
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))            },
            // Petición para modificar datos de un encargado
            modificarEncargado(id){
                axios.put(`http://127.0.0.1:8000/api/encargados/update/${id}`, this.datos, this.config)
                .then(response => {
                if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.message
                        // Ocultar cuadro de diálogo
                        this.dialogTwo = false
                        // Recargar tabla
                        this.obtenerEncargados()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para eliminar un encargado
            eliminarEncargado(id){
                axios.delete(`http://127.0.0.1:8000/api/encargados/delete/${id}`, this.config)
                .then(response => {
                    if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.message
                        // Recargar tabla
                        this.obtenerEncargados()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            }
        },
        created(){
            this.obtenerEncargados()
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