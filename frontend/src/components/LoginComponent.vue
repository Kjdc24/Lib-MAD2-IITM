<template>
    <b-container>
      <b-row>
        <b-col>
          <b-form @submit.prevent="login">
            <b-form-group label="Username" label-for="username">
              <b-form-input id="username" v-model="username" required></b-form-input>
            </b-form-group>
            <b-form-group label="Password" label-for="password">
              <b-form-input type="password" id="password" v-model="password" required></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">Login</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      login() {
        // Handle login
      }
    }
  };
  </script>
  