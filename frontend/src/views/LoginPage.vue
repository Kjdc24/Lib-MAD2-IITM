<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginComponent',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
  async login() {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email: this.email,
        password: this.password
      });
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      
      const user = JSON.parse(atob(token.split('.')[1]));
      if (user.roles.includes('admin')) {
        this.$router.push('/admin');
      } else {
        this.$router.push('/');
      }
    } catch (error) {
      this.error = 'Login failed. Please check your credentials and try again.';
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
</style>
