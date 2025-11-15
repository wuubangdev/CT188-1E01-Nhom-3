import { useLogin, productList } from "./const.js";

const modalShow = (modal) => {
    modal.classList.remove("hidden");
}
const modalClose = (modal) => {
    modal.classList.add("hidden");
}

// Xu ly dang nhap:
const loginModal = document.querySelector(".login-modal");
const userNameInput = document.getElementById("login-username");
const passwordInput = document.getElementById("login-password");
const loginSubmitBtn = document.querySelector(".login-submit");
const loginCloseBtn = document.querySelector(".login-close");
const loginBtn = document.querySelector(".login-btn");
const loginAlert = document.querySelector(".login-alert");

let username;
let password;

const loadLogin = () => {

    userNameInput.addEventListener("input", (e) => {
        username = e.target.value;
    })

    passwordInput.addEventListener("input", (e) => {
        password = e.target.value;
    })

    loginSubmitBtn.addEventListener('click', () => {
        if (username === useLogin.username && password == useLogin.password) {
            modalClose(loginModal);
            loginBtn.innerHTML = "Xin chào, User"
            return;
        }
        loginAlert.innerHTML = "Đăng nhập thất bại vui lòng đăng nhập lại";
    })

    loginCloseBtn.addEventListener("click", () => modalClose(loginModal))

    loginBtn.addEventListener("click", () => modalShow(loginModal))
}

// Xu ly gio hang
const cartModal = document.querySelector(".cart-modal");
const cartBtn = document.querySelector(".cart-btn");
const cartClose = document.querySelector(".cart-close");
const cartSubmit = document.querySelector(".cart-submit");



const cardHandle = () => {
    cartBtn.addEventListener("click", () => modalShow(cartModal));
    cartClose.addEventListener("click", () => modalClose(cartModal));
}


document.addEventListener("DOMContentLoaded", () => {
    loadLogin();
    cardHandle();
});

