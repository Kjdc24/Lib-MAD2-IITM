export default {
  template: `
   <div class="d-flex justify-content-center" style="margin-top: 5vh">
      <div class="mb-2 p-5 text-center bg-light" style="border-radius: 10px;">
      <h1 class="text-center">User Books</h1>
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else>
        <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Section</th>
                <th>Return Date</th>
                <th>Approval Status</th>
                <th>Return Book</th>
              </tr>
            </thead>
            <tbody v-if="books.length > 0">
              <tr v-for="book in books" :key="book.id">
                <td>{{ book.title }}</td>
                <td>{{ book.author }}</td>
                <td>{{ book.section }}</td>
                <td>{{ book.date_return ? formatDate(book.date_return) : 'Not approved' }}</td>
                <td>
                  <span v-if="book.is_approved">
                    <i class="fas fa-check-circle" style="font-size: 1.5em; color: green;"></i>
                  </span>
                  <span v-else>
                    <i class="fas fa-clock" style="font-size: 1.5em;"></i>
                  </span>
                </td>
                <td v-if="book.date_return">
                  <button @click="returnBook(book.id)" class="btn btn-danger" style="font-size: 12px">Return</button>
                </td>
                <td v-else>
                    <button class="btn btn-secondary" style="font-size: 12px" disabled>Return</button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6" class="text-center">No books available.</td>
              </tr>
            </tbody>
          </table>
        </div> 
      </div>
    </div> 
  </div>
  `,
  data() {
    return {
      books: [],
      loading: true
    };
  },
  async created() {
    await this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      this.loading = true;
      try {
        const userId = localStorage.getItem('id'); // Retrieve user ID from local storage
        const response = await fetch(`/my-books?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          this.books = await response.json();
        } else {
          console.error('Failed to fetch books:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        this.loading = false;
      }
    },
    async returnBook(bookId) {
      try {
        const userId = localStorage.getItem('id'); // Retrieve user ID from local storage
        const response = await fetch('/return-book', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ bookId, userId })
        });
        if (response.ok) {
          // Refresh the book list after returning
          await this.fetchBooks();
        } else {
          console.error('Failed to return book:', response.statusText);
        }
      } catch (error) {
        console.error('Error returning book:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  }
};