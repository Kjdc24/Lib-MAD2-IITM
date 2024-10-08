export default{
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 20vh">
    <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
    <h1>Delete Section</h1>
    <p>Are you sure you want to delete this section?</p>
    <div class="align-items-center mt-4">
    <button class="btn btn-danger me-4"  @click="deleteSection">Delete</button>
    <button class="btn btn-primary"  @click="$router.push('/admin')">Cancel</button>
    </div> </div> </div>
    `,
    data(){
        return{
            section: {
                name: '',
                id: null
            }
        }
    },
    created(){
        this.section.id = this.$route.params.id;
    },
    methods: {
        async deleteSection(){
            try{
                console.log(this.section.id);
                const response = await fetch(`/delete-section/${this.section.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(response.ok){
                    const data = await response.json();
                    console.log(data);
                    this.$router.push('/admin');
                } else {
                    const error = await response.json();
                    console.error('Error:', error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
}