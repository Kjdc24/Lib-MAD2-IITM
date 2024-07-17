<!-- src/App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
    </nav>
    <router-link to="/admin">Admin</router-link> 
    <router-view>    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
nav {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
body {
  font-family: cursive;
  background: #8b8b8b;
}
</style>
