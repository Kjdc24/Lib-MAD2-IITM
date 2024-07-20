export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 20vh">
        <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
            <h1>Edit Book</h1>
            <form @submit.prevent="editBook">
                <div class="form-group mb-3 mt-4">
                    <label for="title">Title</label>
                    <input type="text" class="form-control" id="title" v-model="title" required>
                </div>
                <div class="form-group mb-3">
                    <label for="author">Author</label>
                    <input type="text" class="form-control" id="author" v-model="author" required>
                </div>
                <div class="form-group mb-3">
                    <label for="content">Content</label>
                    <textarea class="form-control" id="content" v-model="content" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-dark">Edit Book</button>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            title: '',
            author: '',
            content: ''
        };
    },
    created() {
        this.bookId = this.$route.params.id;
    },
    methods: {
        async editBook() {
            try {
                const response = await fetch(`/edit-book/${this.bookId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        title: this.title,
                        author: this.author,
                        content: this.content
                    })
                });
                if (response.ok) {
                    const responseData = await response.json();
                    const sectionId = responseData.section_id; // Get section ID from response
                    this.$router.push(`/view-books/${sectionId}`);
                } else {
                    const errorData = await response.json();
                    console.error('Failed to edit book:', errorData.message);
                }
            } catch (error) {
                console.error('Error editing book:', error);
            }
        }
    }
};
