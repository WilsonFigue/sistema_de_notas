<template>
  <v-container fluid>
    <v-row justify="center">
      <!-- Título -->
      <v-col cols="12">
        <v-row justify="center">
          <v-btn color="indigo" @click="toggleForm" class="mb-4" large>
            Generar formulario de asistencia
          </v-btn>
        </v-row>
      </v-col>

      <!-- Tabla de alumnos -->
      <v-col cols="12" v-if="showForm">
        <v-card>
          <v-card-title>
            <span class="headline">Formulario de Asistencia</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <!-- Mensaje de estado -->
            
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="3"
                v-for="(alumno, index) in alumnos"
                :key="alumno.id_alumno"
              >
                <v-card>
                  <v-img
                    :src="alumno.foto_alumnos || 'https://via.placeholder.com/150'"
                    height="150px"
                  ></v-img>
                  <v-card-title class="text-center">
                    {{ alumno.nombre_alumno }} {{ alumno.apellido_alumno }}
                  </v-card-title>
                  <v-card-subtitle class="text-center">
                    {{ alumno.nombre_grado }}
                  </v-card-subtitle>

                  <!-- Botones para marcar asistencia -->
                  <v-card-actions>
                    <!-- Botón de Asistió -->
                    <v-btn
                      block
                      :color="alumno.asistencia === 1 ? 'green' : 'grey'"
                      @click="toggleAsistencia(index, 1)"
                    >
                      {{ alumno.asistencia === 1 ? 'Asistió' : 'Marcar Asistió' }}
                    </v-btn>

                    <!-- Botón de Faltó -->
                    <v-btn
                      block
                      :color="alumno.asistencia === 0 ? 'red' : 'grey'"
                      @click="toggleAsistencia(index, 0)"
                    >
                      {{ alumno.asistencia === 0 ? 'Faltó' : 'Marcar Faltó' }}
                    </v-btn>
                  </v-card-actions>
                  <v-divider></v-divider>

                  <!-- Observaciones -->
                  <v-text-field
                    label="Observaciones"
                    v-model="alumno.observaciones"
                    :disabled="isSubmitted"
                  ></v-text-field>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Botón para enviar la asistencia -->
          <v-card-actions>
            <v-btn
              color="primary"
              @click="submitAsistencias"
              :disabled="isSubmitted"
            >
              Enviar Asistencia
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "AsistenciaForm",
  props: {
    idGrado: {
      type: Number,
      required: true,
    },
    idAsignacion: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      alumnos: [], // Aquí guardaremos la lista de alumnos
      showForm: false,
      isSubmitted: false,
      foundAlumnos: true, // Variable para saber si se encontraron alumnos
      fechaAsistencia: new Date().toISOString().split("T")[0], // Obtiene solo la parte de la fecha (sin hora)
      config: {
        headers: {
          Authorization: "Bearer " + this.$store.getters.getToken,
        },
      },
    };
  },
  mounted() {
    if (this.idGrado) {
      this.fetchAlumnos(); // Cargar los alumnos cuando el componente se monte
    } else {
      console.error("No se ha proporcionado un idGrado válido.");
    }
  },
  methods: {
    // Obtener alumnos de la API para el grado específico
    async fetchAlumnos() {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/asistencias/find-model/${this.idAsignacion}/${this.fechaAsistencia}`,
          this.config
        );

        console.log("Respuesta completa de la API:", response);

        const alumnos = response.data.data;

        if (alumnos && Array.isArray(alumnos) && alumnos.length > 0) {
          this.alumnos = alumnos.map((alumno) => ({
            id_asistencia: alumno.id_asistencia,
            id_alumno: alumno.id_alumno,
            id_asignacion: alumno.id_asignacion,
            fecha_asistencia: alumno.fecha_asistencia,
            asistencia: alumno.hasOwnProperty('asistencia') ? alumno.asistencia : 0,
            observaciones: alumno.hasOwnProperty('observaciones') ? alumno.observaciones : ""
          }));

          this.foundAlumnos = true;
          console.log("Asistencias encontradas:", this.alumnos);
        } else {
          // Si no se encuentra asistencia, obtenemos los alumnos del grado
          this.getAlumnosDelGrado();
          this.foundAlumnos = false;
          console.log("No se encontraron asistencias para los criterios dados");
        }
      } catch (error) {
        console.error("Error en la solicitud de la API:", error);
        this.getAlumnosDelGrado();
        this.foundAlumnos = false;
      }
    },

    // Obtener alumnos del grado para insertar asistencia
    async getAlumnosDelGrado() {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/alumnos/select-asistencia/${this.idGrado}`,
          this.config
        );

        console.log("Alumnos del grado:", response.data.data);
        this.alumnos = response.data.data.map((alumno) => ({
          id_alumno: alumno.id_alumno,
          nombre_alumno: alumno.nombre_alumno,
          apellido_alumno: alumno.apellido_alumno,
          nombre_grado: alumno.nombre_grado,
          foto_alumnos: alumno.foto_alumnos,
          asistencia: 0, // Faltó por defecto
          observaciones: "",
        }));

        this.showForm = true;
      } catch (error) {
        console.error("Error al obtener alumnos del grado:", error);
      }
    },

    // Cambiar el estado de asistencia (1 para Asistió, 0 para Faltó)
    toggleAsistencia(index, estado) {
      this.alumnos[index].asistencia = this.alumnos[index].asistencia === estado ? null : estado;
    },

    // Enviar la asistencia (insertar o actualizar)
    async submitAsistencias() {
      const asistencias = this.alumnos.map((alumno) => ({
        id_alumno: alumno.id_alumno,
        id_asignacion: this.idAsignacion,
        fecha_asistencia: this.fechaAsistencia,
        asistencia: alumno.asistencia !== null ? alumno.asistencia : 0,
        observaciones: alumno.observaciones || "",
      }));

      const data = { asistencias };

      axios
        .post(
          "http://127.0.0.1:8000/api/asistencias/update-create",
          data,
          this.config
        )
        .then((response) => {
          if (response.data.code === 200 || response.data.code === 201) {
            this.$emit("asistenciasGuardadas", response.data.data);
            this.isSubmitted = true;
            alert("Asistencias enviadas con éxito.");

            this.alumnos = [];
            this.showForm = false;
          } else {
            console.error("Error al enviar las asistencias:", response.data.message);
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },

    toggleForm() {
      this.showForm = !this.showForm;
    },
  },
};
</script>





<style scoped>
/* Estilos para darle un toque bonito */
.headline {
  font-size: 1.5rem;
  font-weight: bold;
  color: #630bd1;
}

.v-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.v-img {
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.v-btn {
  background-color: #630bd1;
  color: white;
  font-weight: bold;
}

.v-btn:disabled {
  background-color: #d1c4e9;
  color: #a6a6a6;
}

.v-divider {
  margin-top: 15px;
}
</style>
