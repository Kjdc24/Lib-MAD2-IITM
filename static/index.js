import router from "./router.js"
import Nav from "./components/NavBar.js"

new Vue({
    el: '#app',
    template: `<div>
    <Nav />
    <router-view /></div>`,
    router,
    components: {Nav},
})