export default {
    template: `<nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" >Lib</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" >Home</a>
                    </li>
                    <li class="nav-item" v-if="!isLoggedIn">
                        <a class="nav-link" href="login">Login</a>
                    </li>
                    <li v-if="isLoggedIn" class="nav-item">
                        <a class="nav-link" id="logout-link">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>`,
    mounted() {
        this.$nextTick(() => {
            const logoutLink = document.getElementById('logout-link');
            if (logoutLink) {
                logoutLink.addEventListener('click', this.logout);
            }
        });
    },
    computed: {
        isLoggedIn() {
            return localStorage.getItem('token') !== null;
        }
    },
    methods: {
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('roles');
            this.$router.push('/login');
        }
    },
    watch: {
        isLoggedIn(newVal, oldVal) {
            this.$nextTick(() => {
                const logoutLink = document.getElementById('logout-link');
                if (newVal && logoutLink) {
                    logoutLink.addEventListener('click', this.logout);
                } else if (oldVal && !newVal && logoutLink) {
                    logoutLink.removeEventListener('click', this.logout);
                }
            });
        }
    }
}
