export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 20vh">
    <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
        <label for="email" class="form-label">Email: </label>
        <input type="email" class="form-control" id="email" placeholder="name@email.com" v-model="cred.email">
        <label for="password" class="form-label">Password: </label>
        <input type="password" class="form-control" id="password" v-model="cred.password">
        <div> <button class="btn btn-success" @click='login' style="margin-top: 10px">Login</button>
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
                if (data.roles.includes('admin')) {
                    this.$router.push('/admin')
                } else {
                    this.$router.push('/')
                }
            }
        }
    }
}
