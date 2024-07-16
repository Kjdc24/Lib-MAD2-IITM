<template>
  <div id="app">
    <LoginComponent v-if="!loggedIn" @login-success="handleLoginSuccess" />
    <DashboardComponent v-if="loggedIn" />
  </div>
</template>

<script>
import LoginComponent from './components/LoginComponent.vue';
import DashboardComponent from './components/DashboardComponent.vue';

export default {
  components: {
    LoginComponent,
    DashboardComponent
  },
  data() {
    return {
      loggedIn: false
    };
  },
  methods: {
    handleLoginSuccess() {
      this.loggedIn = true;
    }
  }
};
</script>
