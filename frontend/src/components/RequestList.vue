<template>
    <div>
      <h1>Request List</h1>
      <ul>
        <li v-for="request in requests" :key="request.id">
          Book ID: {{ request.book_id }}, User ID: {{ request.user_id }}, Approved: {{ request.is_approved }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        requests: []
      }
    },
    created() {
      this.fetchRequests();
    },
    methods: {
      async fetchRequests() {
        try {
          const response = await axios.get('/api/request');
          this.requests = response.data;
        } catch (error) {
          console.error('Error fetching requests:', error);
        }
      }
    }
  }
  </script>
  