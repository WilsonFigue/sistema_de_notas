<template>
    <v-container fluid>
        <div class="titulo">
            <h1>Registro de notas</h1>
        </div>
        <v-dialog max-width="1000">
            <template v-slot:activator="{ props: activatorProps }">
                <v-row>
                    <!-- Input donde se mostrará el nombre completo del alumno seleccionado -->
                    <v-col>
                        <v-text-field
                            v-model="alumnoSeleccionado"
                            label="Alumno seleccionado"
                            readonly
                            :disabled="isDisabled"
                        ></v-text-field>
                    </v-col>

                    <!-- Botón para abrir el modal de búsqueda -->
                    <v-col class="mt-3">
                        <v-btn
                            v-bind="activatorProps" 
                            text="Buscar usuario"
                            :disabled="isDisabled"
                        ></v-btn>
                    </v-col>

                    <v-col>
                        <v-dialog v-model="dialogMateria" width="auto" scrollable>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn
                                    color="brown"
                                    prepend-icon="mdi-book"
                                    :text="tituloMateria"
                                    variant="outlined"
                                    v-bind="activatorProps"
                                    class="mt-3"
                                    :disabled="isDisabled"
                                ></v-btn>
                            </template>

                            <template v-slot:default>
                                <v-card :title="tituloMateria">
                                    <v-divider class="mt-3"></v-divider>

                                    <v-card-text class="px-4" style="height: 300px;">
                                        <v-radio-group
                                            v-model="materiaSeleccionada" 
                                            column
                                            :disabled="isDisabled"
                                        >
                                            <!-- Recorre las materias y genera un radio por cada una -->
                                            <v-radio
                                                v-for="materia in materias"
                                                :key="materia.id_asignacion"
                                                :label="materia.nombre_materia"
                                                :value="materia.id_asignacion"
                                                :disabled="isDisabled"
                                            ></v-radio>
                                        </v-radio-group>
                                    </v-card-text>

                                    <v-divider></v-divider>

                                    <v-card-actions>
                                        <v-btn text="Cerrar" @click="dialogMateria = false" :disabled="isDisabled"></v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            color="surface-variant"
                                            text="Guardar"
                                            variant="flat"
                                            @click="guardarMateriaSeleccionada" 
                                            :disabled="isDisabled"
                                        >Guardar</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </template>
                        </v-dialog>
                    </v-col>

                    <v-col>
                        <v-select
                            color="indigo"
                            label="Trimestre"
                            :items="trimestres"
                            item-value="id_trimestre"
                            item-title="name_trimestre"
                            v-model="formData.selectedTrimestreId"
                            @input="updateTrimestreInfo"
                            :disabled="isDisabled"
                        ></v-select>
                    </v-col>
                </v-row>

                <v-row class="justify-center">
                    <v-col cols="12" md="8">
                        <v-btn block @click="generarNotas"  v-if="selectedAlumnoId !== null && selectedMateriaId !== null && TrimestreId !== null" :disabled="isDisabled">Generar notas</v-btn>
                    </v-col>
                </v-row>

                <v-row class="justify-center">
                    <v-col cols="12" md="6">
                        <NotasForm
                        v-if="mostrarNotasForm" 
                        :idAlumno="selectedAlumnoId"  
                        :idAsignacion="selectedMateriaId" 
                        :idTrimestre="TrimestreId" 
                        :isDisabled="false"  
                        @notasGuardadas="handleNotasGuardadas"  
                        />
                    </v-col>
                </v-row>

                
            </template>

            <!-- Modal de búsqueda de usuario -->
            <template v-slot:default="{ isActive }">
                <v-card title="Seleccione un usuario">
                    <template v-slot:text>
                        <v-row>
                            <v-col cols="12">
                                <!-- Buscador -->
                                <v-text-field
                                    v-model="search"
                                    label="Buscar en la tabla"
                                    variant="outlined"
                                    prepend-inner-icon="mdi-magnify"
                                ></v-text-field>

                                <v-card>
                                    <v-card-text>
                                        <v-table>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Foto</th>
                                                    <th>Nombre</th>
                                                    <th>Apellido</th>
                                                    <th>Género</th>
                                                    <th>Observaciones</th>
                                                    <th>Grado</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Filtramos los alumnos según la búsqueda -->
                                                <tr 
                                                    v-for="(alumno, i) in filteredAlumnos" 
                                                    :key="i" 
                                                    :class="{ 'selected-row': selectedAlumnoId === alumno.id_alumno }" 
                                                    @click="seleccionarAlumno(alumno)"
                                                    class="cursor-pointer"
                                                >
                                                    <td>{{ alumno.id_alumno }}</td>
                                                    <td><img :src="alumno.foto_url" alt="Foto" width="50"></td>
                                                    <td>{{ alumno.nombre_alumno }}</td>
                                                    <td>{{ alumno.apellido_alumno }}</td>
                                                    <td>{{ alumno.genero_alumno }}</td>
                                                    <td>{{ alumno.observaciones_alumn }}</td>
                                                    <td>{{ alumno.nombre_grado }}</td>
                                                    <td v-if="alumno.estado_alumno == 1">Activo</td>
                                                    <td v-else>Inactivo</td>
                                                </tr>
                                            </tbody>
                                        </v-table>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" @click="isActive.value = false">Salir</v-btn>
                        <v-btn color="surface-variant" variant="flat" @click="isActive.value = false">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </v-container>
</template>

<script>
import NotasForm from '@/components/NotasForm.vue';
import axios from 'axios';

export default {
    name: 'NotasView',
    components:{
        NotasForm
    },
    data() {
        return {
            alumnos: [],
            materias: [],
            trimestres: [],
            isDisabled: false,
            search: '',
            selectedAlumnoId: null,
            selectedMateriaId: null,
            tituloMateria: 'Seleccionar Materias',
            TrimestreId: null,
            selectedGradoId: null,
            materiaSeleccionada: null,
            mostrarNotasForm: false, 
            formData: {
            selectedTrimestreId: null, // Almacenamos el ID del trimestre seleccionado
            },
            dialogMateria: false, 
            alumnoSeleccionado: '', 
            config: {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.getters.getToken
                }
            }
        };
    },
    methods: {
        generarNotas() {
            this.isDisabled = true;  // Deshabilitar elementos después de hacer clic
            this.mostrarNotasForm = true;
        },
        handleNotasGuardadas(message) {
            console.log(message); // Aquí puedes manejar lo que sucede después de que se guardan las notas
            this.isDisabled = false;  // Deshabilitar elementos después de hacer clic
            this.mostrarNotasForm = false;
        },
        updateTrimestreInfo() {
            this.TrimestreId = this.formData.selectedTrimestreId;
        
        },
        seleccionarAlumno(alumno) {
            this.selectedAlumnoId = alumno.id_alumno;
            this.selectedGradoId = alumno.id_grado;
            this.alumnoSeleccionado = `${alumno.nombre_alumno} ${alumno.apellido_alumno}`;

            console.log("Alumno seleccionado con ID:", this.selectedAlumnoId);
            console.log("Grado seleccionado con ID:", this.selectedGradoId);
            this.obtenerMaterias();
        },

        obtenerAlumnos() {
            axios.get(`http://127.0.0.1:8000/api/alumnos/select-alumnos/${this.$store.getters.getIdDocente}`, this.config)
                .then(response => {
                    if (response.data.code == 200) {
                        this.alumnos = response.data.data;
                    }
                })
                .catch(error => console.log('Ha ocurrido un error ' + error));
        },
        
        obtenerMaterias() {
            axios.get(`http://127.0.0.1:8000/api/materias/select-materias/${this.$store.getters.getIdDocente}/${this.selectedGradoId}`, this.config)
                .then(response => {
                    if (response.data.code == 200) {
                        this.materias = response.data.data;
                    }
                })
                .catch(error => console.log('Ha ocurrido un error ' + error));
        },

        obtenerTrimestres() {
    axios.get('http://127.0.0.1:8000/api/trimestres/get-trimestres', this.config)
      .then(response => {
        if (response.data.code === 200) {
          this.trimestres = response.data.data.map((trimestre) => ({
            id_trimestre: trimestre.id_trimestre,
            name_trimestre: trimestre.nombre_trimestre,
          }));
        }
      })
      .catch(error => console.log('Ha ocurrido un error ' + error));
  },

    guardarMateriaSeleccionada() {
        // Encuentra la materia seleccionada por su ID
        const materia = this.materias.find(m => m.id_asignacion === this.materiaSeleccionada);

        if (materia) {
            this.selectedMateriaId = materia.id_asignacion;
            this.selectedMateriaNombre = materia.nombre_materia;  // Guardar el nombre de la materia seleccionada

            // Actualizar el título con el nombre de la materia seleccionada
            this.tituloMateria = `Materia: ${this.selectedMateriaNombre}`;
            
            console.log("ID de materia(asignacion) seleccionada:", this.selectedMateriaId);
        }

        this.dialogMateria = false;  // Cerrar el modal
        }

    },

    computed: {
        filteredAlumnos() {
            const searchText = this.search.toLowerCase();
            if (!searchText) {
                return this.alumnos;
            }

            return this.alumnos.filter((alumno) => {
                const nombre = alumno.nombre_alumno?.toLowerCase() || '';
                const apellido = alumno.apellido_alumno?.toLowerCase() || '';
                const genero = alumno.genero_alumno?.toLowerCase() || '';
                const observaciones = alumno.observaciones_alumn?.toLowerCase() || '';
                const estado = alumno.estado_alumno?.toString() || '';
                
                return (
                    nombre.includes(searchText) ||
                    apellido.includes(searchText) ||
                    genero.includes(searchText) ||
                    observaciones.includes(searchText) ||
                    estado.includes(searchText)
                );
            });
        }
    },

    mounted() {
        this.obtenerAlumnos();
        this.obtenerTrimestres();
    },
    watch: {
    'formData.selectedTrimestreId'(newValue) {
      console.log("Trimestre seleccionado con ID:", newValue);
      this.updateTrimestreInfo();
    },
  },
    
};
</script>


<style scoped>
.titulo 
    {
        text-align: center;
        border: 0px;
        border-bottom: 2px;
        border-style: solid;
        border-color: blueviolet;
        margin-bottom: 15px;
    }
.cursor-pointer {
    cursor: pointer;
}

.selected-row {
    background-color: #630bd1 !important;
    color: white;
}
</style>

