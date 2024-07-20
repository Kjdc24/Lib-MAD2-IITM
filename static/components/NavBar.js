import { isAdmin, isAuthenticated, logout } from './auth.js';

export default {
    template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#/">
            <i class="fas fa-signature"></i></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto" v-if="isLoggedIn && !isAdmin">
                    <li class="nav-item">
                        <a class="nav-link" href="#/profile">Profile</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#/my-books">My Books</a>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto" v-if="isLoggedIn && isAdmin">
                    <li class="nav-item">
                        <a class="nav-link" href="#/all-requests">All Requests</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#/distribution">Distribution</a>
                    </li>
                </ul>
                <ul class="navbar-nav login-items ms-auto">
                    <li class="nav-item" v-if="!isLoggedIn">
                        <a class="nav-link" href="#/login">Login</a>
                    </li>
                    <li v-if="isLoggedIn" class="nav-item">
                        <a class="nav-link" href="#" @click="handleLogout">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `,
    computed: {
        isLoggedIn() {
            return isAuthenticated();
        },
        isAdmin() {
            return isAdmin();
        }
    },
    methods: {
        handleLogout(event) {
            event.preventDefault();
            logout(this.$router);
        }
    }
}
