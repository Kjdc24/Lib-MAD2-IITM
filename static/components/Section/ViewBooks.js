export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 10vh">
        <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
            <h1>{{ sectionName }} Details</h1>
            <div class="d-flex justify-content-between align-items-center mb-4 mt-5">
                <p class="mb-0">View all Books ({{ books.length }})</p>
                <div class="button-group">
                <button class="btn btn-dark" @click="addBook" style="font-size:7px;">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="btn btn-outline-secondary" @click="goBack" style="font-size:7px;">
                    <i class="fas fa-arrow-left"></i> </button>
                    </div>
            </div>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th class="px-3">Title</th>
                            <th class="px-3">Author</th>
                            <th class="px-3">Date Added</th>
                            <th class="px-3">Content</th>
                            <th class="px-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody v-if="books.length > 0">
                        <tr v-for="book in books" :key="book.id">
                            <td class="px-3">{{ book.title }}</td>
                            <td class="px-3">{{ book.author }}</td>
                            <td class="px-3">{{ formatDate(book.date_added) }}</td>
                            <td class="px-3">{{ book.content.substring(0, 50) }}...</td>
                            <td class="px-3">
                                <button class="btn btn-secondary" @click="editBook(book)" style="font-size:7px;"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-danger" @click="deleteBook(book)" style="font-size:7px;"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="5">
                                <p class="mt-2">No books available in this section.</p>
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
            sectionName: 'Section'
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
                    const data = await response.json();
                    this.books = data.books;
                    this.sectionName = data.section_name;
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
        },
        async goBack() {
            this.$router.push('/admin');
        },
        addBook() {
            this.$router.push(`/add-book/${this.$route.params.id}`);
        },
        editBook(book) {
            this.$router.push(`/edit-book/${book.id}`);
        },
        deleteBook(book) {
            this.$router.push(`/delete-book/${book.id}`);
        }
    }
};
