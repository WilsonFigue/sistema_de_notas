<template>
    <v-container fluid>
        <div class="titulo">
            <h1>Registro de alumnos</h1>
        </div>
        <v-row>
            <!-- Formulario para agregar alumno -->
            <v-col xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                <v-form style="margin: 15px;">
                    <v-row>
                        <v-col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                            <v-text-field 
                                label="Nombre" 
                                maxlength="50" 
                                counter 
                                color="indigo" 
                                clearable 
                                placeholder="Nombre del alumno" 
                                v-model="alumno.nombre_alumno"
                            >
                            </v-text-field>
                            <v-text-field 
                                label="Apellido" 
                                maxlength="50" 
                                counter 
                                color="indigo" 
                                clearable 
                                placeholder="Apellido del alumno" 
                                v-model="alumno.apellido_alumno"
                            >
                            </v-text-field>
                            <v-select
                                color="indigo"
                                label="Género del estudiante"
                                :items="generos"
                                item-value="valor"
                                item-title="titulo"
                                v-model="alumno.genero_alumno"
                            >
                            </v-select>
                            <v-text-field 
                                label="Información adicional" 
                                maxlength="50" 
                                counter 
                                color="indigo" 
                                clearable 
                                placeholder="Información del estudiante" 
                                v-model="alumno.observaciones_alumn"
                            >
                            </v-text-field>
                            <v-select
                                color="indigo"
                                label="Encargado"
                                :items="encargados"
                                item-value="id_encargado"
                                item-title="correo_encargado"
                                v-model="alumno.id_encargado"
                            >
                            </v-select>
                            <v-btn
                                prepend-icon="mdi-account-plus"
                                color="indigo"
                                block
                                style="margin-bottom: 20px;"
                                @click="obtenerEncargado"
                            >
                                Registrar encargado
                            </v-btn>
                            <v-select
                                color="indigo"
                                label="Grado"
                                :items="grados"
                                item-value="id_grado"
                                item-title="nombre_grado"
                                v-model="alumno.id_grado"
                            >
                            </v-select>
                            <v-file-input
                                :rules="rules"
                                accept="image/png, image/jpeg, image/bmp, image/jpg"
                                label="Fotografía del estudiante"
                                placeholder=""
                                prepend-icon="mdi-camera"
                                v-model="selectedFile" 
                                @change="getFileName"
                                :multiple="false"
                            >
                            </v-file-input>
                        </v-col>
                        <v-col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                            <h4 style="text-align: center;">Fecha de nacimiento</h4>
                            <v-date-picker
                                color="deep-purple-darken-1" 
                                width="100%"
                                show-adjacent-months
                                style="margin: auto;"
                                v-model="selectedDate" 
                                @input="formatDate"
                            >
                            </v-date-picker>
                        </v-col>
                    </v-row>
                    <v-btn
                        prepend-icon="mdi-check"
                        color="indigo"
                        block
                        @click="agregarAlumno"
                    >
                        Agregar estudiante
                    </v-btn>
                </v-form>
                <v-row>
                    <v-col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">

                    </v-col>
                </v-row>
            </v-col>
            <!-- Tabla para mostrar alumnos -->
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                <v-card>
                    <v-card-text>
                        <v-table>
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
                            <tbody  v-for="(alumno, i) in alumnos" :key="i">
                                <tr>
                                    <th>{{alumno.id_alumno}}</th>
                                    <th>
                                        <!-- <template>
                                            <v-img :src="getImageSrc(alumno.foto_alumnos)" min-width="100%" alt=""></v-img>
                                        </template> -->
                                    </th>
                                    <th>{{alumno.nombre_alumno}}</th>
                                    <th>{{alumno.apellido_alumno}}</th>
                                    <th>{{alumno.genero_alumno}}</th>
                                    <th>{{alumno.observaciones_alumn}}</th>
                                    <th>{{alumno.nombre_grado}}</th>
                                    <th v-if="alumno.estado_alumno == 1">Activo</th>
                                    <th v-if="alumno.estado_alumno !== 1">Inactivo</th>
                                    <th>{{alumno.nombre_encargado}}</th>
                                    <th>{{alumno.apellido_encargado}}</th>
                                    <th>
                                        <v-btn-group>
                                            <!-- <v-btn icon="mdi-eye" color="indigo" @click="obtenerAlumno(alumno.id_alumno, 1)"></v-btn> -->
                                            <v-btn icon="mdi-pencil" color="green" @click="obtenerAlumno(alumno.id_alumno, 2)"></v-btn>
                                            <v-btn icon="mdi-delete" color="red" @click="elimniarAlumno(alumno.id_alumno)"></v-btn>
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
    <!-- Cuadro de diálogo para ver registro -->
    <v-dialog
        v-model="dialogOne"
        transition="dialog-top-transition"
        width="500"
        >
        <v-card title="Ver" subtitle="Datos del alumno">
            <v-card-text>
                <v-list>
                    <v-list-item prepend-icon="mdi-account" :title="datos.nombre_alumno"></v-list-item>
                    <v-list-item prepend-icon="mdi-currency-usd" :title="datos.apellido_alumno"></v-list-item>
                    <v-list-item prepend-icon="mdi-book-variant" :title="datos.genero_alumno"></v-list-item>
                    <v-list-item prepend-icon="mdi-shape" :title="datos.nombre_grado"></v-list-item>
                    <v-list-item prepend-icon="mdi-shape" :title="datos.nombre_encargado"></v-list-item>
                    <v-list-item prepend-icon="mdi-shape" :title="datos.apellido_encargado"></v-list-item>
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
        <v-card title="Editar" subtitle="Datos del producto">
            <v-card-text>
                <v-text-field 
                    label="Nombre" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Nombre del alumno" 
                    v-model="datos.nombre_alumno"
                >
                </v-text-field>
                <v-text-field 
                    label="Apellido" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Apellido del alumno" 
                    v-model="datos.apellido_alumno"
                >
                </v-text-field>
                <v-text-field 
                    label="Fecha de nacimiento" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Fecha de nacimiento del alumno" 
                    v-model="datos.fecha_nacimiento"
                >
                </v-text-field>
                <v-select
                    color="indigo"
                    label="Género del estudiante"
                    :items="generos"
                    item-value="valor"
                    item-title="titulo"
                    v-model="datos.genero_alumno"
                >
                </v-select>
                <v-text-field 
                    label="Información adicional" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Información del estudiante" 
                    v-model="datos.observaciones_alumn"
                >
                </v-text-field>
                <v-select
                    color="indigo"
                    label="Encargado"
                    :items="encargados"
                    item-value="id_encargado"
                    item-title="correo_encargado"
                    v-model="datos.id_encargado"
                >
                </v-select>
                <v-select
                    color="indigo"
                    label="Grado"
                    :items="grados"
                    item-value="id_grado"
                    item-title="nombre_grado"
                    v-model="datos.id_grado"
                >
                </v-select>
                <v-select
                    color="indigo"
                    label="Grado"
                    :items="estados"
                    item-value="valor"
                    item-title="titulo"
                    v-model="datos.estado_alumno"
                >
                </v-select>
                <v-btn
                    prepend-icon="mdi-check"
                    color="indigo"
                    block
                    @click="modificarAlumno(datos.id_alumno)"
                >
                    Guardar
                </v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog
        v-model="dialogEncargado"
        transition="dialog-top-transition"
        width="500"
    >
        <v-card title="Registrar encargado" subtitle="Datos del encargado">
            <v-card-text>
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
                dialogEncargado: false,
                generos: [
                      { titulo: 'Masculino', valor: 'Masculino' },
                      { titulo: 'Femenino', valor: 'Femenino' },
                ],
                parentescos: [
                  { titulo: 'Padre', valor: 'Padre' },
                  { titulo: 'Madre', valor: 'Madre' },
                  { titulo: 'Otro familiar', valor: 'Otro' },
                ],
                estados: [
                  { titulo: 'Activo', valor: true },
                  { titulo: 'Inactivo', valor: false },
                ],
                datos: {},
                dialogOne: false,
                encargado: {},
                encargados: [],
                grados: [],
                alumno: {
                    nombre_alumno: '',
                    apellido_alumno: '',
                    genero_alumno: '',
                    observaciones_alumn: '',
                    estado_alumno: true,
                    foto_alumnos: '',
                    id_encargado: '',
                    id_grado: '',
                    // fecha_nacimiento: ''
                },
                alumnos: [],
                alertaEstado: false,
                mensaje: '',
                rules: [
                    value => {
                        return !value || !value.length || value[0].size < 50000000 || 'La imagen debe pesar menos de 50 MB!'
                    },
                ],
                selectedDate: null,
                formattedDate: null,
                selectedFile: null,
                fileName: '',
                headers: [//esto es para el data table
                    { title: 'ID', value: 'id_user' },
                    { title: 'Nombre', value: 'name_user' },
                    { title: 'Correo', value: 'email_user' },
                    { title: 'Rol', value: 'rol' },
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
            // Petición para obtener alumnos
            obtenerAlumnos(){
                axios.get('http://127.0.0.1:8000/api/alumnos/select', this.config)
                .then(response => {
                    if(response.data.code==200){
                        let res = response.data
                        this.alumnos = res.data
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
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
            // Petición para obtener grados
            obtenerGrados(){
                axios.get('http://127.0.0.1:8000/api/grados/get-grados', this.config)
                .then(response => {
                    if(response.data.code==200){
                        let res = response.data
                        this.grados = res.data
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para insertar un alumno
            agregarAlumno(){
                this.formatDate()
                this.alumno.fecha_nacimiento = this.formattedDate
                this.alumno.foto_alumnos = this.fileName
                this.alumno.foto_alumnos = '../assets/alumnos/'+this.fileName
                // console.log(this.alumno.foto_alumnos)
                this.alumno.estado_alumno = true
                axios.post('http://127.0.0.1:8000/api/alumnos/store', this.alumno, this.config)
                .then(response => {
                    if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.data
                        // Limpiar formulario
                        this.alumno = {}
                        this.obtenerAlumnos()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para insertar un encargado
            obtenerEncargado(){
                this.dialogEncargado = true
            },
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
            // Petición para consultar datos de un producto
            obtenerAlumno(id, action){
                // Cambiar la visibilidad del modal ver/editar
                if(action==1){
                    this.dialogOne = true
                } 
                else {
                    this.dialogTwo = true
                }
                // Realizar petición para consultar datos de un alumno
                axios.get(`http://127.0.0.1:8000/api/alumnos/find/${id}`, this.config)
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
            modificarAlumno(id){
                axios.put(`http://127.0.0.1:8000/api/alumnos/update/${id}`, this.datos, this.config)
                .then(response => {
                if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.data
                        // Ocultar cuadro de diálogo
                        this.dialogTwo = false
                        // Recargar tabla
                        this.obtenerAlumnos()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            // Petición para eliminar un producto
            elimniarAlumno(id){
                axios.delete(`http://127.0.0.1:8000/api/alumnos/delete/${id}`, this.config)
                .then(response => {
                    if(response.data.code==200){
                        // Cambiar mensaje y visilidad de alerta
                        this.alertaEstado = true
                        this.mensaje = response.data.data
                        // Recargar tabla
                        this.obtenerAlumnos()
                    }
                })
                .catch(error => console.log('Ha ocurrido un error '+error))
            },
            formatDate() {
                // Asegúrate de que selectedDate tenga un valor antes de formatearlo
                if (this.selectedDate) {
                    // Convierte la fecha a formato "YYYY-MM-DD"
                    const date = new Date(this.selectedDate);
                    this.formattedDate = date.toISOString().split('T')[0];
                }
            },
            getFileName() {
                // Verifica que selectedFile no esté vacío y que sea un array
                if (this.selectedFile) {
                    this.fileName = this.selectedFile.name; // Solo el nombre del archivo
                }
            },
            // getImageSrc(imagePath) {
            //     try {
            //         return require(`${imagePath}`);
            //     } catch (error) {
            //         console.error("Error loading image:", error);
            //         return ''; // Retorna una imagen alternativa o deja vacío
            //     }
            // }
        },
        created(){
            this.obtenerEncargados()
            this.obtenerGrados()
            this.obtenerAlumnos()
            // console.log(this.alumnos)
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