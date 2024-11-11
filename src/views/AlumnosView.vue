<template>
    <v-container fluid>
        <h1>Producto</h1>
        <v-row>
            <!-- Formulario para agregar categoria -->
            <v-col xs="12" sm="3" md="3" lg="3" xl="3" xxl="3">
                <v-text-field 
                    label="Nombre" 
                    maxlength="50" 
                    counter 
                    color="indigo" 
                    clearable 
                    placeholder="Nombre del producto" 
                    v-model="producto.nombre">
                </v-text-field>
                <v-text-field label="Precio" 
                    maxlength="50" 
                    counter color="indigo" 
                    clearable 
                    placeholder="Precio del producto" 
                    v-model="producto.precio"
                >
                </v-text-field>
                <v-select
                    color="indigo"
                    label="Categoria"
                    :items="categorias"
                    item-value="id"
                    item-title="nombre"
                    v-model="producto.fk_categoria"
                >
                </v-select>
                <v-select
                    color="indigo"
                    label="Marca"
                    :items="marcas"
                    item-value="id"
                    item-title="nombre"
                    v-model="producto.fk_marca"
                >
                </v-select>
                <v-btn
                    prepend-icon="mdi-check"
                    color="indigo"
                    block
                    @click="agregarProducto"
                >
                    Agregar
                </v-btn>
            </v-col>
            <!-- Tabla para mostrar productos -->
            <v-col cols="9" xs="12" sm="9" md="9" lg="9" xl="9" xxl="9">
                <v-card>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Categoria</th>
                                    <th>Marca</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody  v-for="(producto, i) in productos" :key="i">
                                <tr>
                                    <th>{{producto.id}}</th>
                                    <th>{{producto.nombre}}</th>
                                    <th>$ {{producto.precio}}</th>
                                    <th>{{producto.fk_categoria}}</th>
                                    <th>{{producto.fk_marca}}</th>
                                    <th>
                                        <v-btn-group>
                                            <v-btn icon="mdi-eye" color="indigo" @click="obtenerProducto(producto.id, 1)"></v-btn>
                                            <v-btn icon="mdi-pencil" color="green" @click="obtenerProducto(producto.id, 2)"></v-btn>
                                            <v-btn icon="mdi-delete" color="red" @click="eliminarProducto(producto.id)"></v-btn>
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
        <v-card title="Ver" subtitle="Datos de la categoria">
            <v-card-text>
                <v-list>
                    <v-list-item prepend-icon="mdi-cart" :title="datos.nombre"></v-list-item>
                    <v-list-item prepend-icon="mdi-currency-usd" :title="datos.precio"></v-list-item>
                    <v-list-item prepend-icon="mdi-book-variant" :title="datos.categoria"></v-list-item>
                    <v-list-item prepend-icon="mdi-shape" :title="datos.marca"></v-list-item>
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
                <v-text-field label="Nombre" 
                    maxlength="50" 
                    counter color="indigo" 
                    clearable 
                    placeholder="Nombre del producto" 
                    v-model="datos.nombre"
                >
                </v-text-field>
                <v-text-field label="Precio" 
                    maxlength="50" 
                    counter color="indigo" 
                    clearable 
                    placeholder="Precio del producto" 
                    v-model="datos.precio"
                >
                </v-text-field>
                <v-select
                    color="indigo"
                    label="Categoria"
                    :items="categorias"
                    item-value="id"
                    item-title="nombre"
                    v-model="datos.fk_categoria"
                >
                </v-select>
                <v-select
                    color="indigo"
                    label="Marca"
                    :items="marcas"
                    item-value="id"
                    item-title="nombre"
                    v-model="datos.fk_marca"
                >
                </v-select>
                <v-btn
                    prepend-icon="mdi-check"
                    color="indigo"
                    block
                    @click="modificarProducto(datos.id)"
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
    name: 'AlumnosView',
    data(){
        return {
            dialogTwo: false,
            datos: {},
            dialogOne: false,
            marcas: [],
            categorias: [],
            producto: {},
            productos: [],
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
        // Petición para obtener marcas
        obtenerMarcas(){
            axios.get('http://127.0.0.1:8000/api/marca/select', this.config)
            .then(response => {
                if(response.data.code==200){
                    let res = response.data
                    this.marcas = res.data
                }
            })
            .catch(error => console.log('Ha ocurrido un error '+error))
        },
        // Petición para obtener categorias
        obtenerCategorias(){
            axios.get('http://127.0.0.1:8000/api/categoria/select', this.config)
            .then(response => {
                if(response.data.code==200){
                    let res = response.data
                    this.categorias = res.data
                }
            })
            .catch(error => console.log('Ha ocurrido un error '+error))
        },
        // Petición para obtener producto
        obtenerProductos(){
            axios.get('http://127.0.0.1:8000/api/producto/select', this.config)
            .then(response => {
                if(response.data.code==200){
                    let res = response.data
                    this.productos = res.data
                }
            })
            .catch(error => console.log('Ha ocurrido un error '+error))
        },
        // Petición para insertar un producto
        agregarProducto(){
            axios.post('http://127.0.0.1:8000/api/producto/store', this.producto, this.config)
            .then(response => {
                if(response.data.code==200){
                    // Cambiar mensaje y visilidad de alerta
                    this.alertaEstado = true
                    this.mensaje = response.data.data
                    // Limpiar formulario
                    this.producto = {}
                    this.obtenerProductos()
                }
            })
            .catch(error => console.log('Ha ocurrido un error '+error))
        },
        // Petición para consultar datos de un producto
        obtenerProducto(id, action){
            // Cambiar la visibilidad del modal ver/editar
            if(action==1){
                this.dialogOne = true
            } else {
                this.dialogTwo = true
            }
            // Realizar petición para consultar datos de un producto
            axios.get(`http://127.0.0.1:8000/api/producto/find/${id}`, this.config)
            .then(response => {
                if(response.data.code==200){
                    let res = response.data
                    this.datos = res.data
                }
            })
            .catch(error => console.log('Ha ocurrido un error '+error))
        },
        // Petición para modificar datos de un producto
        modificarProducto(id){
            axios.put(`http://127.0.0.1:8000/api/producto/update/${id}`, this.datos, this.config)
            .then(response => {
            if(response.data.code==200){
                    // Cambiar mensaje y visilidad de alerta
                    this.alertaEstado = true
                    this.mensaje = response.data.data
                    // Ocultar cuadro de diálogo
                    this.dialogTwo = false
                    // Recargar tabla
                    this.obtenerProductos()
                }
            })
            .catch(error => console.log('Ha ocurrido un error '+error))
        },
        // Petición para eliminar un producto
        eliminarProducto(id){
            axios.delete(`http://127.0.0.1:8000/api/producto/delete/${id}`, this.config)
            .then(response => {
                if(response.data.code==200){
                    // Cambiar mensaje y visilidad de alerta
                    this.alertaEstado = true
                    this.mensaje = response.data.data
                    // Recargar tabla
                    this.obtenerProductos()
                }
            })
            .catch(error => console.log('Ha ocurrido un error '+error))
        }
    },
    created(){
        this.obtenerProductos()
        this.obtenerMarcas()
        this.obtenerCategorias()
        console.log(this.productos)
    }
}


</script>