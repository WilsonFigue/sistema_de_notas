import { createStore } from 'vuex'

export default createStore({
  state: {
    // Variables de estado global en la aplicación
    usuario: null,
    rol: null,
    token: null
  },
  getters: {
    // Retorna el usuario
    getUsuario(state){
      return state.usuario
    },
    // Retorna el rol
    getRol(state){
      return state.rol
    },
    // Retorna el token
    getToken(state){
      return state.token
    }
  },
  mutations: {
    // Modifica el valor del usuario
    setUsuario(state, usuario){
      state.usuario = usuario
    },
    // Modifica el valor del rol
    setRol(state, rol){
      state.rol = rol
    },
    // Modifica el valor del token
    setToken(state, token){
      state.token = token
    }  
  },
  actions: {
    // Acción para realizar el login
    login(context, data){
      // Llenar variables de estado
      context.commit('setUsuario', data.usuario)
      context.commit('setRol', data.rol)
      context.commit('setToken', data.token)
      // Guardar data en el local storage
      localStorage.setItem('userData', JSON.stringify(data))
    },
    // Acción para realizar el logout
    logout(context){
      // Vaciar variables de estado
      context.commit('setUsuario', null)
      context.commit('setRol', null)
      context.commit('setToken', null)
      // Eliminar data de local storage
      localStorage.removeItem('userData')
    }
  },
  modules: {
  }
})
