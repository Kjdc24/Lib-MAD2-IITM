import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    isAuthenticated: false,
    isAdmin: false
  },
  mutations: {
    setAuthenticated(state, status) {
      state.isAuthenticated = status;
    },
    setIsAdmin(state, isAdmin) {
      state.isAdmin = isAdmin;
    },
    logoutUser(state) {
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('isAdmin');
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/login', { email, password });
        const { access_token, is_admin } = response.data;

        commit('setAuthenticated', true);
        commit('setIsAdmin', is_admin);

        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('isAdmin', is_admin);

        return is_admin;
      } catch (error) {
        throw new Error('Invalid email or password');
      }
    },
    logout({ commit }) {
      commit('logoutUser');
    },
  },
});
