const socket = io()

const productDiv = document.getElementById("products")

socket.on('product_update_add', data => {
    const newProductDiv = document.createElement("div")
    newProductDiv.classList.add("col-md-4", "mb-3", "d-flex", "align-items-stretch", "mx-auto")
    newProductDiv.innerHTML = `
        <div id=${data.id} class="col-md-4 mb-3 d-flex align-items-stretch mx-auto">
            <div class="card" style="width: 18rem;">
                <img src=${data.thumbnails[0]} class="card-img-top" alt="Product image" />
                <div class="card-body d-flex flex-column">
                <h5 class="card-title">${data.title}</h5>
                <p class="card-text mb-4">${data.description}</p>
                <a href="" class="btn btn-dark mt-auto align-self-start">Shop</a>
                </div>
            </div>
        </div>
    `
    productDiv.appendChild(newProductDiv)
})


socket.on('product_update_remove', data => {
    const productToBeRemoved = document.getElementById(data)
    productToBeRemoved.remove()
})