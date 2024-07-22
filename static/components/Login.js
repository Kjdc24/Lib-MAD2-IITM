export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 10vh">
    <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
        <h1>Login Page</h1>
        <label for="email" class="form-label mt-4">Email: </label>
        <input type="email" class="form-control" id="email" placeholder="name@email.com" v-model="cred.email">
        <label for="password" class="form-label mt-3">Password: </label>
        <input type="password" class="form-control" id="password" v-model="cred.password">
        <div class="buttons mt-2"> <button class="btn btn-success me-3" @click='login' style="margin-top: 10px">Login</button>
        <button class="btn btn-primary" @click="$router.push('/register')" style="margin-top: 10px">Register</button>
        </div>
    </div></div>
    `,
    data() {
        return {
            cred: {
                email: null,
                password: null,
            },
        }
    },
    methods: {
        async login() {
            const res = await fetch('/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cred),
            })
            if (res.ok) {
                const data = await res.json()
                localStorage.setItem('token', data.token)
                localStorage.setItem('roles', data.roles)
                localStorage.setItem('id', data.id)
                if (data.roles.includes('admin')) {
                    this.$router.push('/admin')
                } else {
                    this.$router.push('/user')
                }
            } else {
                const error = await res.json();
                alert('Login failed: ' + error.message);
            }
        }
    }
}
