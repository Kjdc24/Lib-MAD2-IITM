export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 5vh">
        <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
            <h1>Register Page</h1>
            <label for="username" class="form-label mt-4">User Name: </label>
            <input type="text" class="form-control" id="username" placeholder="Username" v-model="newdetails.username">
            <label for="email" class="form-label mt-3">Email: </label>
            <input type="email" class="form-control" id="email" placeholder="name@email.com" v-model="newdetails.email">
            <label for="password" class="form-label mt-3">Password: </label>
            <input type="password" class="form-control" id="password" v-model="newdetails.password">
            <div>
                <button class="btn btn-success mt-3" style="margin-top: 10px" @click="register">Register</button>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            newdetails: {
                username: null,
                email: null,
                password: null,
            },
        }
    },
    methods: {
        async register() {
            const res = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.newdetails)
            })
            if (res.ok) {
                alert('Registered successfully! Redirecting to login...');
                this.$router.push('/login');
            } else {
                const error = await res.json()
                console.error('Error:', error)
            }
        }
    }
}
