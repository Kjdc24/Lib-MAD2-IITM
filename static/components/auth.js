// src/utils/auth.js
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (token !== null) {
        return true;
    } else {
        return false;
    }
}

export const requireAuth = (to, from, next) => {
    if (isAuthenticated()) {
        next();
    } else {
        next('/login');
    }
}

export const notAuthenticated = (to, from, next) => {
    if (!isAuthenticated()) {
        next();
    } else {
        if (isAdmin()) {
            next('/admin');
        } else {
            next('/user');
        }
    }
}

export const isAdmin = () => {
    const roles = localStorage.getItem('roles');
    return roles === 'admin'; // Returns true if role is admin, false otherwise
}

export const requireAdminAuth = (to, from, next) => {
    if (isAuthenticated() && isAdmin()) {
        next();
    } else {
        next('/login');
    }
}

export const logout = (router) => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('id');
    router.push('/login').then(() => {
        location.reload(); // Force a page reload after navigation
    });
}