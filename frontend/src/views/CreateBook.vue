<template>
    <div>
      <h1>Create Book</h1>
      <form @submit.prevent="createBook">
        <div>
          <label>Title:</label>
          <input v-model="title" required />
        </div>
        <div>
          <label>Content:</label>
          <input v-model="content" />
        </div>
        <div>
          <label>Author:</label>
          <input v-model="author" required />
        </div>
        <div>
          <label>Section ID:</label>
          <input v-model="section_id" required />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'CreateBook',
    data() {
      return {
        title: '',
        content: '',
        author: '',
        section_id: ''
      }
    },
    methods: {
      async createBook() {
        try {
          await axios.post('/api/books', {
            title: this.title,
            content: this.content,
            author: this.author,
            section_id: this.section_id
          });
          alert('Book created successfully');
        } catch (error) {
          alert('Failed to create book');
        }
      }
    }
  }
  </script>
  