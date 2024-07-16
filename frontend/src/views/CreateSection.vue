<template>
    <div>
      <h1>Create Section</h1>
      <form @submit.prevent="createSection">
        <div>
          <label>Name:</label>
          <input v-model="name" required />
        </div>
        <div>
          <label>Description:</label>
          <input v-model="description" />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'CreateSection',
    data() {
      return {
        name: '',
        description: ''
      }
    },
    methods: {
      async createSection() {
        try {
          await axios.post('/api/sections', {
            name: this.name,
            description: this.description
          });
          alert('Section created successfully');
        } catch (error) {
          alert('Failed to create section');
        }
      }
    }
  }
  </script>
  