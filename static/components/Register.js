export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 20vh">
        <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
            <label for="username" class="form-label">User Name: </label>
            <input type="text" class="form-control" id="username" placeholder="Username" v-model="newdetails.username">
            <label for="email" class="form-label">Email: </label>
            <input type="email" class="form-control" id="email" placeholder="name@email.com" v-model="newdetails.email">
            <label for="password" class="form-label">Password: </label>
            <input type="password" class="form-control" id="password" v-model="newdetails.password">
            <div>
                <button class="btn btn-success" style="margin-top: 10px" @click="register">Register</button>
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
                const data = await res.json()
                console.log(data)
            } else {
                const error = await res.json()
                console.error('Error:', error)
            }
        }
    }
}
