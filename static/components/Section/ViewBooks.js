export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 20vh">
        <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
            <h1>{{ sectionName }} Details</h1>
            <p>Here are your section details and information</p>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th class="px-3">Title</th>
                            <th class="px-3">Author</th>
                            <th class="px-3">Date Added</th>
                            <th class="px-3">Content</th>
                        </tr>
                    </thead>
                    <tbody v-if="books.length > 0">
                        <tr v-for="book in books" :key="book.id">
                            <td class="px-3">{{ book.title }}</td>
                            <td class="px-3">{{ book.author }}</td>
                            <td class="px-3">{{ formatDate(book.date_added) }}</td>
                            <td class="px-3">{{ book.content }}</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="4">
                                <p>No books available in this section.</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            books: [],
            sectionName: ''
        };
    },
    created() {
        this.fetchBooks();
    },
    methods: {
        async fetchBooks() {
            const sectionId = this.$route.params.id;
            try {
                const response = await fetch(`/view-books/${sectionId}`, {
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
            }
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }
    }
};
