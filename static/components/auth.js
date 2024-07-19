// src/utils/auth.js
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists, false otherwise
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
    router.push('/login');
}
