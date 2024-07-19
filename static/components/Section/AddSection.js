export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 20vh">
        <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
        <div class="container">
            <h1>Add Section</h1>
            <form @submit.prevent="addSection">
                <div class="form-group">
                    <label for="name">Section Name</label>
                    <input type="text" class="form-control" id="name" v-model="section.name">
                </div>
                    <button type="submit" class="btn btn-primary">Add Section</button>
            </form>
        </div> 
    </div></div>
    `,
    data() {
        return {
            section: {
                name: ''
            }
        };
    },
    methods: {
        async addSection() {
            const res = await fetch('/add-section', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(this.section)
            })
            if (res.ok) {
                this.$router.push('/admin')
            } else {
                const error = await res.json()
                console.error('Error:', error)
            }
        }
    }
}
