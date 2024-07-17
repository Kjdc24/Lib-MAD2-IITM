<template>
  <div class="login">
    <h2>User Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'UserLoginPage',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        const isAdmin = await this.login({ email: this.email, password: this.password });
        console.log(isAdmin);
        if (isAdmin) {
          this.$router.push('/admin');
        } else {
          this.$router.push('/');
        }
      } catch (error) {
        this.error = error.message;
      }
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 300px;
  margin: auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.login div {
  margin-bottom: 1rem;
}
.login label {
  display: block;
}
.error {
  color: red;
}
</style>
