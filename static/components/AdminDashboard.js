export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 10vh">
        <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
            <h1>Admin Dashboard</h1>
            <div class="d-flex justify-content-between align-items-center mb-4 mt-5">
                <p class="mb-0">View Sections</p>
                <button class="btn btn-dark" @click="addSection" style="font-size:7px;">
                    <i class="fas fa-plus"></i>
                </button> 
            </div><div>
        <table class="table" >
            <thead>
                <tr>
                    <th class="px-3">Section Name</th>
                    <th class="px-3">Date Created</th>
                    <th class="px-3">Number of Books</th>
                    <th class="px-3">Actions</th>
                    <th class="px-3">View Books</th>
                </tr>
            </thead>
            <tbody v-if="sections.length > 0">
                <tr v-for="section in sections" :key="section.id">
                    <td class="px-3">{{ section.name }}</td>
                    <td class="px-3">{{ formatDate(section.date_created) }}</td>
                    <td class="px-3">{{ section.num_books }}</td>
                    <td class="px-3">
                        <button class="btn btn-secondary" @click="editSection(section)" style="font-size:7px;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger" @click="deleteSection(section)" style="font-size:7px;"><i class="fas fa-trash"></i></button>
                    </td>
                    <td class="px-3">
                        <button class="btn btn-info" @click="viewSection(section)" style="font-size:7px;"><i class="fas fa-eye"></i></button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="5" style="font-size:30px;">
                        <p>No sections available.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div> 
        </div>
    </div>`,
    data() {
        return {
            sections: [],
        };
    },
    created() {
        this.fetchSections();
    },
    methods: {
        async fetchSections() {
            try {
                const response = await fetch('/admin', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    this.sections = await response.json();
                } else {
                    console.error('Failed to fetch sections:', response.statusText);
                    this.$router.push('/login'); // Redirect to login if unauthorized
                }
            } catch (error) {
                console.error('Error fetching sections:', error);
                this.$router.push('/login'); // Redirect to login if unauthorized
            }
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
        addSection() {
            this.$router.push('/add-section');
        },
        editSection(section) {
            this.$router.push(`/edit-section/${section.id}`);
        },
        deleteSection(section) {
            this.$router.push(`/delete-section/${section.id}`);
        },
        viewSection(section) {
            this.$router.push(`/view-books/${section.id}`);
        },
    }
};
