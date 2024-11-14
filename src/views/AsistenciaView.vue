<template>
  <v-container fluid>
    <div class="titulo">
      <h1>Registro de asistencias</h1>
    </div>
    <v-row class="justify-center">
      <!-- Select para los grados -->
      <v-col cols="12" md="4" class="d-flex justify-center">
        <v-select
          color="indigo"
          label="Grado"
          :items="grados"
          item-value="id_grado"
          item-title="nombre_grado"
          v-model="selectedGradoId"
          @input="updateGradoInfo"
          :disabled="isDisabled"
        ></v-select>
      </v-col>

      <v-col cols="12" md="4" class="d-flex justify-center">
        <v-dialog width="auto" scrollable v-model="dialogVisible" :disabled="isDisabled">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              color="brown"
              prepend-icon="mdi-book"
              :text="formData.dialog ? `Materia: ${getMateriaNombre(formData.dialog)}` : 'Seleccionar Materia'"
              variant="outlined"
              v-bind="activatorProps"
              class="mt-2"
              :disabled="isDisabled"
            ></v-btn>
          </template>

          <template v-slot:default>
            <v-card title="Seleccionar Materia">
              <v-divider class="mt-3"></v-divider>

              <v-card-text class="px-4" style="height: 300px;">
                <v-radio-group
                  v-model="formData.dialog"
                  column
                  :disabled="isDisabled"
                >
                  <v-radio
                    v-for="materia in materias"
                    :key="materia.id_asignacion"
                    :label="materia.nombre_materia"
                    :value="materia.id_asignacion"
                  ></v-radio>
                </v-radio-group>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn text @click="dialogVisible = false" :disabled="isDisabled">Cerrar</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="surface-variant" text @click="guardarMateria" :disabled="isDisabled">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row class="justify-center">
      <v-col cols="12" md="8">
        <v-btn block @click="generarAsistencia" v-if="selectedGradoId !== null && formData.dialog !== null" :disabled="isDisabled">
          Generar notas
        </v-btn>
      </v-col>
    </v-row>

    <!-- Botón para restablecer todo -->
    <v-row class="justify-center" v-if="shouldShowComponent">
      <v-col cols="12" md="8">
        <v-btn block color="red" @click="resetView">
          Restablecer vista
        </v-btn>
      </v-col>
    </v-row>

    <!-- Solo se renderiza el componente AsistenciaForm si shouldShowComponent es true -->
    <AsistenciaForm v-if="shouldShowComponent" :idGrado="selectedGradoId" :idAsignacion="id_asignacion" />
  </v-container>
</template>


  
<script>
import AsistenciaForm from '@/components/AsistenciaForm.vue';
import axios from 'axios';

export default {
  name: 'AsistenciaView',
  components: {
    AsistenciaForm
  },
  data() {
    return {
      grados: [],
      selectedGradoId: null, // Aquí ahora está directamente en el data, no dentro de formData
      materias: [],
      dialogVisible: false,
      isDisabled: false,
      shouldShowComponent: false,
      id_asignacion: null,
      formData: {
        dialog: null,
        config: {
          headers: {
            Authorization: 'Bearer ' + this.$store.getters.getToken,
          },
        },
      },
    };
  },
  methods: {
    obtenerGrados() {
      axios
        .get(
          `http://127.0.0.1:8000/api/grados/select-grados/${this.$store.getters.getIdDocente}`,
          this.formData.config
        )
        .then((response) => {
          if (response.data.code === 200) {
            this.grados = response.data.data.map((grado) => ({
              id_grado: grado.id_grado,
              nombre_grado: grado.nombre_grado,
            }));
          }
        })
        .catch((error) => console.log('Ha ocurrido un error: ' + error));
    },
    obtenerMaterias() {
      if (this.selectedGradoId) {
        axios
          .get(
            `http://127.0.0.1:8000/api/materias/select-materias/${this.$store.getters.getIdDocente}/${this.selectedGradoId}`,
            this.formData.config
          )
          .then((response) => {
            if (response.data.code == 200) {
              this.materias = response.data.data;
            }
          })
          .catch((error) => console.log('Ha ocurrido un error ' + error));
      }
    },
    updateGradoInfo() {
      if (this.selectedGradoId) {
        this.obtenerMaterias();
      }
    },
    getMateriaNombre(id) {
      const materia = this.materias.find((materia) => materia.id_asignacion === id);
      this.id_asignacion = materia.id_asignacion;
      return materia ? materia.nombre_materia : 'Seleccionar Materia';
    },
    guardarMateria() {
      console.log('Materia seleccionada con ID:', this.formData.dialog);
      this.dialogVisible = false;
    },
    generarAsistencia() {
      if (!this.selectedGradoId || !this.formData.dialog) {
        alert('Debe seleccionar un grado y una materia antes de generar las notas.');
        return;
      }
      console.log('Generando asistencia...');
      console.log(this.selectedGradoId);
      this.isDisabled = true;
      this.shouldShowComponent = true; // Activar la visualización del componente
    },
    resetView() {
      // Restablecer el estado de la vista
      this.selectedGradoId = null;
      this.formData.dialog = null;
      this.isDisabled = false;
      this.shouldShowComponent = false;
    },
  },
  mounted() {
    this.obtenerGrados();
  },
  watch: {
    'selectedGradoId'(newValue) {
      console.log('Grado seleccionado con ID:', newValue);
      this.updateGradoInfo();
    },
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
  </style>
  

