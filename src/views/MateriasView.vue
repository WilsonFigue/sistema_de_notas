<template>
    <v-container fluid>
        <div class="titulo">
            <h1>Registro de Secciones</h1>
        </div>
        <v-expansion-panels>
            <v-expansion-panel
                v-for="(grado, index) in grados"
                :key="index"
            >
                <v-expansion-panel-title>
                    <v-icon left class="titulo-icono">mdi-school-outline</v-icon>
                    {{ grado.nombre_grado }}
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                    <v-row justify="center">
                        <v-col
                        v-for="(section, secIndex) in grado.secciones"
                        :key="secIndex"
                        >
                            <select-materia
                                :titulo="'¿Qué materia desea gestionar?'"
                                :btnText="'Gestionar ' + section.nombre_grado"
                                :sectionData="{
                                    sectionName: section.nombre_grado,
                                    sectionId: section.id_grado,
                                    grade: grado.nombre_grado,
                                    subject: section.descripcion_grado,
                                    studentCount: section.capacidad_grado
                                }"
                                @materia-seleccionada="manejarMateriaSeleccionada"
                                @abrir-seccion-modal="abrirModalSeccion"
                            />
                        </v-col>
                    </v-row>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

        <!-- Modal de SectionModal -->
        <section-modal
            v-if="sectionData"
            :sectionData="sectionData"
            :subjectId="subjectId"  
            :nombre_materia="nombre_materia" 
            :title="'Sección'"
            ref="sectionModal"
        />
    </v-container>
</template>

<script>
import SelectMateria from '@/components/SelectMateria.vue';
import SectionModal from '@/components/SectionModal.vue';
import axios from 'axios';

export default {
    components: {
        SelectMateria,
        SectionModal,
    },
    data() {
        return {
            grados: [],
            sectionData: null,  // Aquí almacenaremos los datos de la sección seleccionada
            subjectId: null,    // ID de la materia, que es independiente
            nombre_materia: null,
            config: {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.getters.getToken,
                },
            },
        };
    },
    created() {
        this.fetchGrados();
    },
    methods: {
        async fetchGrados() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/grados/select', this.config);
                if (response.data.code === 200) {
                    this.grados = this.formatGrados(response.data.data);
                } else {
                    console.error('Error al obtener los grados');
                }
            } catch (error) {
                console.error('Error en la solicitud API', error);
            }
        },
        manejarMateriaSeleccionada(idMateria, nombre_materia) {
    // Asignamos el ID de la materia seleccionada
    this.subjectId = idMateria;
    this.nombre_materia = nombre_materia;
    console.log("Materia seleccionada:", idMateria);
  },
        formatGrados(data) {
            const grados = [];
            const gradosAgrupados = data.reduce((acc, curr) => {
                const grado = curr.nombre_grado.split(' ')[0];
                if (!acc[grado]) {
                    acc[grado] = [];
                }
                acc[grado].push({
                    id_grado: curr.id_grado,
                    nombre_grado: curr.nombre_grado,
                    capacidad_grado: curr.capacidad_grado,
                    descripcion_grado: curr.descripcion_grado
                });
                return acc;
            }, {});

            for (const grado in gradosAgrupados) {
                grados.push({
                    nombre_grado: grado,
                    secciones: gradosAgrupados[grado],
                });
            }

            return grados;
        },
        abrirModalSeccion(sectionData) {
    if (sectionData) {
            this.sectionData = { ...sectionData }; // Usamos un spread operator para asegurarnos que no sea una referencia directa
            this.$nextTick(() => {
                this.$refs.sectionModal.openDialog();  // Abrimos el modal
            });
            }
        }
    },
    
};
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

    .titulo-icono {
    font-size: 24px; /* Tamaño del ícono */
    color: #9984e4; /* Color del ícono */
    margin-right: 10px; /* Espacio entre ícono y texto */
    }
</style>

