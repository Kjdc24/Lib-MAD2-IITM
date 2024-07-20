export default{
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 20vh">
    <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
    <h1>Delete Book</h1>
    <p>Are you sure you want to delete this book?</p>
    <div class="align-items-center mt-4">
    <button class="btn btn-danger me-4"  @click="deleteBook">Delete</button>
    <button class="btn btn-primary"  @click="goBack">Cancel</button>
    </div> </div> </div>
    `,
    data(){
        return{
            book: {
                title: '',
                id: null
            }
        }
    },
    created(){
        this.book.id = this.$route.params.id;
    },
    methods: {
        async deleteBook(){
            try{
                console.log(this.book.id);
                const response = await fetch(`/delete-book/${this.book.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(response.ok){
                    const data = await response.json();
                    const sectionId = data.section_id;
                    this.$router.push(`/view-books/${sectionId}`);
                } else {
                    const error = await response.json();
                    console.error('Error:', error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        goBack(){
            this.$router.go(-1);
        }
    }
}