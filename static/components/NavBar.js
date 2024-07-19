import { isAuthenticated, logout } from './auth.js';

export default {
    template: `<nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#/">Lib</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#/">Home</a>
                    </li>
                    <li class="nav-item" v-if="!isLoggedIn">
                        <a class="nav-link" href="#/login">Login</a>
                    </li>
                    <li v-if="isLoggedIn" class="nav-item">
                        <a class="nav-link" href="#" @click="handleLogout">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>`,
    computed: {
        isLoggedIn() {
            return isAuthenticated();
        }
    },
    methods: {
        handleLogout(event) {
            event.preventDefault();
            logout(this.$router);
        }
    }
}
