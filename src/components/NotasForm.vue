<template>
    <v-card class="ma-4" outlined>
      <v-card-title>
        <span class="headline">Generar Notas</span>
      </v-card-title>
  
      <v-card-text>
        <v-row>
          <!-- Nota 1 -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="nota1"
              label="Nota 1"
              type="number"
              min="0"
              max="100"
              :disabled="isDisabled"
              outlined
              required
            ></v-text-field>
          </v-col>
  
          <!-- Nota 2 -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="nota2"
              label="Nota 2"
              type="number"
              min="0"
              max="100"
              :disabled="isDisabled"
              outlined
              required
            ></v-text-field>
          </v-col>
  
          <!-- Nota 3 -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="nota3"
              label="Nota 3"
              type="number"
              min="0"
              max="100"
              :disabled="isDisabled"
              outlined
              required
            ></v-text-field>
          </v-col>
  
          <!-- Observaciones -->
          <v-col cols="12">
            <v-textarea
              v-model="observaciones"
              label="Observaciones"
              outlined
              :disabled="isDisabled"
            ></v-textarea>
          </v-col>
  
          <!-- Promedio Final -->
          <v-col cols="12">
            <v-text-field
              :value="promedioFinal"
              :label="'Promedio Final: ' + promedioFinal"
              readonly
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
  
      <v-divider></v-divider>
  
      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="enviarNotas"
          :disabled="isDisabled || !validarNotas"
        >
          Guardar Notas
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'NotasForm',
    props: {
      idAlumno: {
        type: Number,
        required: true
      },
      idAsignacion: {
        type: Number,
        required: true
      },
      idTrimestre: {
        type: Number,
        required: true
      },
      isDisabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        nota1: '',
        nota2: '',
        nota3: '',
        observaciones: '', // Campo de observaciones
        config: {
          headers: {
            'Authorization': 'Bearer ' + this.$store.getters.getToken,
          },
        },
      };
    },
    mounted() {
      if (this.idAlumno && this.idAsignacion && this.idTrimestre) {
        this.generarNotas();
      }
    },
    computed: {
      validarNotas() {
        return (
          this.nota1 !== '' &&
          this.nota2 !== '' &&
          this.nota3 !== ''
        );
      },
      promedioFinal() {
        const n1 = parseFloat(this.nota1) || 0;
        const n2 = parseFloat(this.nota2) || 0;
        const n3 = parseFloat(this.nota3) || 0;
        return ((n1 + n2 + n3) / 3).toFixed(2); // Promedio con 2 decimales
      }
    },
    methods: {
        
      enviarNotas() {
        const data = {
          id_alumno: this.idAlumno,
          id_asignacion: this.idAsignacion,
          id_trimestre: this.idTrimestre,
          nota_1: this.nota1, 
          nota_2: this.nota2,  
          nota_3: this.nota3,
          observaciones_not: this.observaciones
        };
  
        axios.post('http://127.0.0.1:8000/api/notas/update-create', data, this.config)
          .then(response => {
            if (response.data.code === 200 || response.data.code === 201) {
              this.$emit('notasGuardadas', response.data.data);
              // Limpiar campos después de guardar
              this.nota1 = '';
              this.nota2 = '';
              this.nota3 = '';
              this.observaciones = '';
            }
          })
          .catch(error => {
            console.error("Error al guardar las notas: ", error);
          });
      },
      generarNotas() {
        const url = `http://127.0.0.1:8000/api/notas/find-model/${this.idAlumno}/${this.idAsignacion}/${this.idTrimestre}`;
        axios.get(url, this.config)
          .then(response => {
            if (response.data.code === 200) {
              const notas = response.data.data;
              this.nota1 = notas.nota_1 || '';
              this.nota2 = notas.nota_2 || '';
              this.nota3 = notas.nota_3 || '';
              this.observaciones = notas.observaciones_not || '';
            } else {
              this.nota1 = '';
              this.nota2 = '';
              this.nota3 = '';
              this.observaciones = '';
            }
          })
          .catch(error => {
            console.error('Ha ocurrido un error al generar las notas:', error);
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .v-card {
    max-width: 600px;
  }
  </style>
  