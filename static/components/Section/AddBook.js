export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 20vh">
        <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
            <h1>Add New Book</h1>
            <form @submit.prevent="addBook">
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
                <button type="submit" class="btn btn-dark">Add Book</button>
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
    methods: {
        async addBook() {
            const sectionId = this.$route.params.id;
            try {
                const response = await fetch(`/add-book`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        title: this.title,
                        author: this.author,
                        content: this.content,
                        section_id: sectionId
                    })
                });
                if (response.ok) {
                    this.$router.push(`/view-books/${sectionId}`);
                } else {
                    const errorData = await response.json();
                    console.error('Failed to add book:', errorData.message);
                }
            } catch (error) {
                console.error('Error adding book:', error);
            }
        }
    }
};
