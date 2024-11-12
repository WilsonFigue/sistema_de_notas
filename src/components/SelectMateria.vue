<template>
    <v-dialog width="auto" scrollable>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          color="brown"
          prepend-icon="mdi-earth"
          :text="btnText"
          variant="outlined"
          v-bind="activatorProps"
        ></v-btn>
      </template>
  
      <template v-slot:default="{ isActive }">
        <v-card :title="titulo">
          <v-divider class="mt-3"></v-divider>
  
          <v-card-text class="px-4" style="height: 300px;">
            <v-radio-group v-model="materiaSeleccionada" column>
              <v-radio
                v-for="(materia, index) in materias"
                :key="index"
                :label="materia.nombre_materia"
                :value="materia"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-btn text="Cerrar" @click="isActive.value = false"></v-btn>
            <v-spacer></v-spacer>
            <v-btn color="surface-variant" text="Guardar" variant="flat" @click="guardarSeleccion(isActive)"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      titulo: {
        type: String,
        default: 'Seleccionar Materia',
      },
      btnText: {
        type: String,
        default: 'Seleccionar Materia',
      },
      sectionData: {
        type: Object,
        default: () => ({
          sectionName: '',
          sectionId: 0,
          grade: '',
          subject: '',
          studentCount: 0,
        }),
      },
    },
    data() {
      return {
        materias: [],
        materiaSeleccionada: null,
        config: {
          headers: {
            'Authorization': 'Bearer ' + this.$store.getters.getToken,
          },
        },
      };
    },
    created() {
      this.fetchMaterias();
      console.log("Datos de sección recibidos:", this.sectionData);
    },
    methods: {
      async fetchMaterias() {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/materias/get-materias', this.config);
          if (response.data.code === 200) {
            this.materias = response.data.data;
          } else {
            console.error('Error al obtener materias');
          }
        } catch (error) {
          console.error('Error en la solicitud API', error);
        }
      },
      guardarSeleccion(isActive) {
           this.$emit('materia-seleccionada', this.materiaSeleccionada.id_materia, this.materiaSeleccionada.nombre_materia );
  
        // Cerrar el modal actual
        isActive.value = false;
  
        // Emitir el evento para abrir el modal de sección
        this.$emit('abrir-seccion-modal', this.sectionData);
      },
    },
  };
  </script>
  