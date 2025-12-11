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
const addToCartBtn = document.querySelectorAll(".add-to-cart");
const listCartItem = document.getElementById("list-cart-item");
const totalElement = document.querySelector(".payment-total-value");

let storage = [];

const isItemExits = (id) => {
    if (storage.length === 0) return false;
    const check = storage.find((currItem) => currItem.id === id)
    if (check) return true;
    return false;
}

const handleIfItemExist = (id) => {
    storage.forEach((currItem) => {
        if (currItem.id == id) {
            currItem.quality++;
        }
    })
}

const cardHandle = () => {
    cartBtn.addEventListener("click", () => {
        console.log(storage)
        storage.map((item, index) => {
            addRow(index, item.name, item.price, item.quality);
        })
        totalElement.innerHTML = `${totalCalculator().toLocaleString("vi-VN")}₫`;
        modalShow(cartModal);
    });
    cartClose.addEventListener("click", () => {
        modalClose(cartModal);
        listCartItem.innerHTML = "";
    });
    const listAddToCartBtn = Array.from(addToCartBtn);
    listAddToCartBtn.forEach((button) => {
        button.addEventListener("click", e => {
            const id = e.target.dataset.id;
            const name = e.target.dataset.title;
            const price = e.target.dataset.price;
            const checkExits = isItemExits(id);
            if (checkExits) handleIfItemExist(id);
            if (!checkExits) {
                storage = [...storage, { id, name, price, quality: 1 }]
            }
            cartBtn.innerHTML = `Giỏ hàng (${storage.length})`;
            localStorage.setItem('cart', JSON.stringify(storage));
            console.log(storage)
        })
    })

    function addRow(stt, ten, gia, soLuong) {
        const tr = document.createElement("tr");
        const tong = +gia * soLuong;
        tr.innerHTML = `
            <td>${stt + 1}</td>
            <td>${ten}</td>
            <td>${+gia.toLocaleString("vi-VN")}₫</td>
            <td>${soLuong}</td>
            <td>${tong.toLocaleString("vi-VN")}₫</td>
        `;
        listCartItem.appendChild(tr);
    }

    const totalCalculator = () => {
        let result = 0;
        storage.forEach((item) => {
            result = result + (+item.quality * item.price);
        })
        return result;
    }
}

const productListElement = document.querySelector(".product-grid");

// const renderListProduct = () => {
//     const addProduct = (id, title, image, decs, price) => {
//         const productElement = document.createElement("article");
//         productElement.classList.add("product-card");
//         productElement.innerHTML = `
//                         <div class="product-img">
//                             <img src="${image}" alt="${title}">
//                         </div>
//                         <h3>${title}</h3>
//                         <p class="product-spec">${decs}</p>
//                         <p class="product-price">${price}</p>
//                         <button class="btn full-width add-to-cart" data-id="${id}" data-title="${title}"
//                             data-price="${price}">
//                             Thêm vào giỏ
//                         </button>
//         `
//         productListElement.appendChild(productElement);
//     }
//     productList.forEach((item) => addProduct(item.id, item.title, item.image, item.description, item.price))
// }



document.addEventListener("DOMContentLoaded", () => {
    loadLogin();
    cardHandle();
    // renderListProduct();
});

