<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-school</v-icon>
        {{ `${title} - ${formData.sectionName}` }}
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <!-- Campos ocultos con el ID de la materia -->
          <input type="hidden" v-model="formData.sectionId" />
          <input type="hidden" :value="subjectId" />

          <!-- Campo para Nombre de la Materia (Solo lectura) -->
          <v-col cols="12" md="6" sm="12">
            <v-text-field
              v-model="formData.subject"
              label="Materia seleccionada:"
              readonly
              :value="nombre_materia"
            ></v-text-field>
          </v-col>

          <!-- V-Select para seleccionar el docente -->
          <v-col cols="12" md="6" sm="12">
            <v-select
              color="indigo"
              label="Docente"
              :items="docentes"
              item-value="id_docente"
              item-title="name_user"
              v-model="formData.selectedDocenteId"
              @input="updateDocenteInfo"
            ></v-select>
          </v-col>

          <!-- Campo para Nombre del Docente (Solo lectura) -->
          <v-col cols="12" md="6" sm="12">
            <v-text-field
              ref="nombreDocenteField"
              :label="docenteName ? 'Nombre del docente: ' + docenteName : 'Nombre del Docente'"
              :value="docenteName || ''"
              readonly
            ></v-text-field>
          </v-col>

          <!-- Campo para Apellido del Docente (Solo lectura) -->
          <v-col cols="12" md="6" sm="12">
            <v-text-field
              ref="apellidoDocenteField"
              :label="docenteLastName ? 'Apellido del docente: ' + docenteLastName : 'Apellido del Docente'"
              :value="docenteLastName || ''"
              readonly
            ></v-text-field>
          </v-col>

          <!-- Campo para Número de Alumnos -->
          <v-col cols="12" md="6" sm="12">
            <v-text-field
              v-model="formData.studentCount"
              :label="'Alumnos registrados: ' + cantidadAlumnos "
              type="number"
              :value="cantidadAlumnos"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cerrar</v-btn>
        <v-btn color="primary" @click="saveSection">
          {{ isEditMode ? 'Actualizar' : 'Crear' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    sectionData: Object,
    subjectId: Number,
    nombre_materia: String,
    title: String,
  },
  data() {
    return {
      dialog: false,
      docentes: [], // Lista de docentes desde la API
      formData: {
        sectionId: this.sectionData?.sectionId || 0,
        subjectId: this.subjectId,
        subject: '',
        studentCount: 0,
        selectedDocenteId: null, // Almacenamos el ID del docente seleccionado
        id_asignacion: 0,
      },
      config: {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters.getToken,
        },
      },
      docenteName: '', // Nombre del docente seleccionado
      docenteLastName: '', // Apellido del docente seleccionado
      isEditMode: false, // Determina si el formulario está en modo de edición
      cantidadAlumnos: 0, // Cantidad de alumnos
    };
  },
  mounted() {
    this.getDocentes();
    if (this.sectionData && this.sectionData.id_docente) {
      this.formData.selectedDocenteId = this.sectionData.id_docente;
      this.isEditMode = true; // Si hay datos de sección, estamos en modo edición
    }
  },
  watch: {
    // Observar cambios en el ID del docente seleccionado
    'formData.selectedDocenteId'(newValue) {
      console.log(newValue);
      this.updateDocenteInfo();
    },
  },
  methods: {
    // Método para obtener la lista de docentes desde la API
    getDocentes() {
      axios
        .get('http://127.0.0.1:8000/api/docentes/get-docentes', this.config)
        .then((response) => {
          if (response.data.code === 200) {
            this.docentes = response.data.data.map((docente) => ({
              id_docente: docente.id_docente,
              name_user: docente.name_user,
              nombre_docente: docente.nombre_docente,
              apellido_docente: docente.apellido_docente,
            }));
          }
        })
        .catch((error) => {
          console.error('Error al cargar los docentes:', error);
          alert('Error al cargar los docentes.');
        });
    },

    // Método para obtener la asignación
    getAsignacion() {
      axios
      .get(`http://127.0.0.1:8000/api/aginaciones/find/${this.formData.sectionId}/${this.subjectId}`, this.config)
        .then((response) => {
          if (response.data.code !== 200) { // Verifica si la respuesta es exitosa
            const asignacion = response.data.data;
            // Asigna los valores de la asignación a formData
            this.formData.studentCount = asignacion.studentCount;
            this.formData.selectedDocenteId = asignacion.id_docente;
            this.formData.id_asignacion = asignacion.id_asignacion;
            this.cantidadAlumnos = response.data.cantidad_alumnos; // Asigna la cantidad de alumnos
            this.updateDocenteInfo(); // Actualiza la información del docente
            this.isEditMode = true; // Entra en modo de edición
          } else {
            this.cantidadAlumnos = response.data.cantidad_alumnos;
          }
        })
        .catch((error) => {
          console.error('Error al obtener la asignación:', error);
          this.isEditMode = false; 
          if (error.response && error.response.data) {
            this.cantidadAlumnos = error.response.data.cantidad_alumnos;
          } 
        });
    },

    // Método para actualizar la información del docente seleccionado
    updateDocenteInfo() {
      const selectedDocente = this.docentes.find(
        (d) => d.id_docente === this.formData.selectedDocenteId
      );

      if (selectedDocente) {
        this.docenteName = selectedDocente.nombre_docente;
        this.docenteLastName = selectedDocente.apellido_docente;
      } else {
        this.docenteName = '';
        this.docenteLastName = '';
      }
    },

    // Método para abrir el diálogo
    openDialog() {
      if (this.sectionData) {
        this.formData = { ...this.sectionData };
        this.dialog = true;
        this.getAsignacion(); // Llamar a la API para obtener la asignación
      } else {
        console.error('sectionData no está definido');
      }
    },

    // Método para guardar la sección
    saveSection() {
      // Validación de los campos requeridos
      if (!this.formData.selectedDocenteId) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
      }

      // Emitir el evento de materia seleccionada
      this.$emit('materia-seleccionada', this.formData.selectedDocenteId, this.docenteName);

      const formDataToSend = {
        id_materia: this.subjectId,
        id_grado: this.formData.sectionId,
        id_docente: this.formData.selectedDocenteId,
      };

      // Mostrar indicador de carga
      this.isLoading = true;

      // Si ya existe una asignación, hacemos la actualización
      if (this.isEditMode) {
        this.updateAsignacion(this.formData.id_asignacion, formDataToSend);
      } else {
        // Si no existe, creamos una nueva asignación
        this.createAsignacion(formDataToSend);
      }
    },

    // Método para actualizar la asignación
    updateAsignacion(idAsignacion, formDataToSend) {
      axios
        .put(`http://127.0.0.1:8000/api/aginaciones/update/${idAsignacion}`, formDataToSend, this.config)
        .then((response) => {
          if (response.data.code !== 200) {
            alert('Asignación actualizada correctamente.');
            this.dialog = false;
          } else {
            alert('Error al actualizar la asignación.');
          }
        })
        .catch((error) => {
          console.error('Error al actualizar la asignación:', error);
          alert('Error al actualizar la asignación.');
        });
    },

    // Método para crear una nueva asignación
    createAsignacion(formDataToSend) {
      axios
        .post('http://127.0.0.1:8000/api/aginaciones/store', formDataToSend, this.config)
        .then((response) => {
          if (response.data.code !== 200) {
            alert('Asignación creada correctamente.');
            this.dialog = false;
          } else {
            alert('Error al crear la asignación.');
          }
        })
        .catch((error) => {
          console.error('Error al crear la asignación:', error);
          alert('Error al crear la asignación.');
        });
    },
  },
};
</script>
