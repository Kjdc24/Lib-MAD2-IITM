export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 15vh">
    <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
        <h1>Change Profile</h1>
        <label for="username" class="form-label mt-3">Username: </label>
        <input type="text" class="form-control" id="username" placeholder="username" v-model="cred.username">
        <label for="email" class="form-label mt-3">Email: </label>
        <input type="email" class="form-control" id="email" placeholder="name@email.com" v-model="cred.email">
        <label for="password" class="form-label mt-3">Password: </label>
        <input type="password" class="form-control" id="password" v-model="cred.password">
        <div> <button class="btn btn-success mt-3" @click='change' style="margin-top: 10px">Change Profile</button>
        </div>
    </div></div>
    `,
    data() {
        return {
            cred: {
                username: null,
                email: null,
                password: null,
                userId: localStorage.getItem('id'),
            },
        }
    },
    methods: {
        async change() {
            try {
                const res = await fetch('/user-change', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.cred),
                })
                if (res.ok) {
                    this.$router.push('/user')
                }
            } catch (error) {
                console.error('Error changing profile:', error);
                this.$router.push('/login');
            }
        }
    }
}