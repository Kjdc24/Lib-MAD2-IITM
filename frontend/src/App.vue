<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <div class="collapsible">
        <button @click="toggleCollapse">Admin Panel</button>
        <div v-if="isCollapsed">
          <router-link to="/login">User Login</router-link>
          <router-link to="/admin">Panel</router-link>
          <!-- Add more admin links here -->
        </div>
      </div>
    </nav> 
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isCollapsed: false
    };
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
};
</script>

<style>
nav {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
.collapsible {
  display: flex;
  flex-direction: column;
}
.collapsible button {
  background: opaque;
  border: cadetblue;
  cursor: pointer;
  font-size: 1rem;
}
.collapsible div {
  display: flex;
  flex-direction: column;
}
body {
  font-family: cursive;
  background: #8b8b8b;
}
</style>
