<template>
  <div id="app">
    <RequestList />
  </div>
</template>

<script>
import RequestList from './components/RequestList.vue';

export default {
  name: 'App',
  components: {
    RequestList
  }
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
