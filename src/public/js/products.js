const addToCart = async (id) => {
    // ONE SAME CART
    const response = await fetch(`http://localhost:8080/api/carts/649a06c03e3abd71670aa1af/products/${id}`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache", 
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify({ quantityToAdd: 1 }),
    });
    console.log(await response.json()) 
}
