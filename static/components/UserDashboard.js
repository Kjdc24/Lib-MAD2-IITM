export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 5vh">
        <div class="mb-2 p-5 text-center bg-light" style="border-radius: 10px;">
        <h1 class="text-center">Lib Dashboard</h1>
        <div class="mb-1 mt-4">
            <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Search books by title, author, or section"
            />
        </div>
        <div v-if="loading" class="text-center">Loading...</div>
        <div v-else>
            <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Section</th>
                            <th>Content</th>
                            <th>Request</th>
                        </tr>
                    </thead>
                    <tbody v-if="filteredBooks.length > 0">
                        <tr v-for="book in filteredBooks" :key="book.id">
                            <td>{{ book.title }}</td>
                            <td>{{ book.author }}</td>
                            <td>{{ book.section }}</td>
                            <td>{{ book.content.substring(0, 50) }}...</td>
                            <td>
                                <button 
                                    class="btn btn-secondary" 
                                    style="font-size:6px;" 
                                    @click="requestBook(book)"
                                    :disabled="book.is_requested"
                                >
                                    <i :class="book.is_requested ? 'fas fa-check' : 'fas fa-plus'"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="5" class="text-center">No books available.</td>
                        </tr>
                    </tbody>
                </table>
            </div> 
        </div>
    </div> </div>
    `,
    data() {
        return {
            books: [],
            searchQuery: '',
            loading: true
        };
    },
    computed: {
        filteredBooks() {
            const query = this.searchQuery.toLowerCase();
            return this.books.filter(book => 
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.section.toLowerCase().includes(query)
            );
        }
    },
    async created() {
        await this.fetchBooks();
    },
    methods: {
        async fetchBooks() {
            this.loading = true;
            try {
                const userId = localStorage.getItem('id'); // Retrieve user ID from local storage
                const response = await fetch(`/user?userId=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log(response);
                if (response.ok) {
                    this.books = await response.json();
                } else {
                    console.error('Failed to fetch books:', response.statusText);
                    alert('Failed to fetch books. Redirecting to login.');
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                alert('Error fetching books. Redirecting to login.');
            } finally {
                this.loading = false;
            }
        },
        async requestBook(book) {
            try {
                const userId = localStorage.getItem('id'); // Retrieve user ID from local storage
                const response = await fetch('/request-book', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        bookId: book.id,
                        userId: userId
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    if (result.message === 'You can only request a maximum of 5 books') {
                        alert(result.message);
                    } else {
                        alert('Book request submitted successfully.');
                        book.is_requested = true; // Update the local state to reflect the request
                    }
                } else {
                    const result = await response.json();
                    if (result.message === 'You can only request a maximum of 5 books') {
                        alert(result.message);
                    }else{
                        console.error('Failed to request book:', response.statusText);
                        alert('Failed to request book.');
                    }
                }
            } catch (error) {
                console.error('Error requesting book:', error);
                alert('Error requesting book.');
            }
        }
    }
};
