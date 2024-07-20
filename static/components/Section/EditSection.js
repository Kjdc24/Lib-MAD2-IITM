export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 20vh">
        <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
            <div class="container">
                <h1>Edit Section</h1>
                <form @submit.prevent="editSection">
                    <div class="form-group">
                        <label for="name"></label>
                        <input type="text" class="form-control" id="name" v-model="section.name" placeholder="Section Name">
                    </div>
                    <button type="submit" class="btn btn-primary mt-4">Edit Section</button>
                </form>
            </div> 
        </div>
    </div>
    `,
    data() {
        return {
            section: {
                name: '',
                id: null
            }
        };
    },
    created() {
        this.section.id = this.$route.params.id; // Set the id from route params
    },
    methods: {
        async editSection() {
            try {
                const response = await fetch(`/edit-section/${this.section.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ name: this.section.name })
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    this.$router.push('/admin');  // Redirect to admin dashboard after successful edit
                } else {
                    const error = await response.json();
                    console.error('Error:', error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
};
