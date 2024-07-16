<template>
  <div id="app">
    <nav>
      <router-link to="/">HomePage</router-link>
      <router-link to="/admin/dashboard">Admin Dashboard</router-link>
      <router-link to="/admin/section/create">Create Section</router-link>
      <router-link to="/admin/book/create">Create Book</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
