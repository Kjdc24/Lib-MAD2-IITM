export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 20vh">
    <div class="mb-3 p-5 text-center bg-light" style="border-radius: 10px;">
    <h1 style="font-size: 40px;">Welcome to Lib</h1>
    <p style="font-size: 22px;"> Please login to continue </p>
    <button class="btn btn-success" style="background-color: black;font-size:12px;" @click="$router.push('/login')">Login</button>
    <button class="btn btn-success" style="background-color: black; font-size:12px;" @click="$router.push('/register')">Register</button>
    </div></div>
    `,
}