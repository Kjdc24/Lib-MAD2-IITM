export default {
    template: `
  <div class="container mt-5">
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else>
      <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
        <h1 class="text-center mb-4">All Requests</h1>
        <table class="table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>User Email</th>
              <th>Approved</th>
              <th>Date Requested</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody v-if="requests.length > 0">
            <tr v-for="request in requests" :key="request.id">
              <td>{{ request.book_title }}</td>
              <td>{{ request.user_email }}</td>
              <td>{{ request.is_approved ? 'Yes' : 'No' }}</td>
              <td>{{ request.date_requested ? formatDate(request.date_requested) : 'N/A' }}</td>
              <td>
                <button v-if="!request.is_approved" class="btn btn-success btn-sm" @click="approveRequest(request.id)">
                  <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-danger btn-sm" @click="removeRequest(request.id)">
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="5" class="text-center">No requests found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
    `,

  data() {
    return {
      requests: [],
      loading: true
    };
  },
  async created() {
    await this.fetchRequests();
  },
  methods: {
    async fetchRequests() {
      this.loading = true;
      try {
        const response = await fetch('/all-request', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          this.requests = await response.json();
        } else {
          console.error('Failed to fetch requests:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        this.loading = false;
      }
    },
    async approveRequest(requestId) {
      try {
        const response = await fetch(`/approve-request/${requestId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          // Update the local requests array
          this.requests = this.requests.map(request =>
            request.id === requestId ? { ...request, is_approved: true } : request
          );
        } else {
          console.error('Failed to approve request:', response.statusText);
        }
      } catch (error) {
        console.error('Error approving request:', error);
      }
    },
    async removeRequest(requestId) {
      try {
        const response = await fetch(`/remove-request/${requestId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          // Remove the request from the local array
          this.requests = this.requests.filter(request => request.id !== requestId);
        } else {
          console.error('Failed to remove request:', response.statusText);
        }
      } catch (error) {
        console.error('Error removing request:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  }
};