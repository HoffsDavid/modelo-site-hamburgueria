const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const adressInput = document.getElementById('adress')
const adressWarn = document.getElementById('adress-warn')


let cart = []

// Abrir o Modal
cartBtn.addEventListener('click', function () {
    cartModal.style.display = 'flex'
    updateCartModal()
})

// Fechar modal quando clicar fora
cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
})

// Fechar pelo botão 'fechar'
closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', function (event) {
    let parentButton = event.target.closest('.add-to-cart-btn')

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        // Adicionar ao carrinho
        addToCart(name, price)
    }
})

// Function add to cart
function addToCart(name, price) {
    const existinItem = cart.find(item => item.name === name)

    if (existinItem) {
        // Se o item existir, aumenta a quantidade
        existinItem.quantity += 1
    } else {
        cart.push({
            name, price, quantity: 1
        })
    }
    updateCartModal()
}

// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ""
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">
                    ${item.name}
                </p>
                <p>
                    Qtd: ${item.quantity}
                </p>
                <p class="font-medium mt-2">
                    R$ ${item.price}
                </p>
            </div>

            <div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        </div>
        `
        total += item.price * item.quantity
        


        cartItemsContainer.appendChild(cartItemElement)
    })
    cartTotal.textContent = total.toLocaleString("pt-BR",{ style:"currency", currency:"BRL"})
    cartCounter.innerHTML = cart.length
}

// Função para remover itens

cartItemsContainer.addEventListener('click', function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name)
    }

})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]

        if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal()
            return
        }
        cart.splice(index, 1)
        updateCartModal()
    }
}

adressInput.addEventListener('input', function(event){
    let inputValue = event.target.value

    if(inputValue !== ""){
        adressInput.classList.remove('border-red-500')
        adressInput.classList.add('border-slate-400')
        adressWarn.classList.add('hidden')
    }

})

checkoutBtn.addEventListener('click', function(){

    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        Toastify({
            text: "OPS, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "red",
            },
        }).showToast()
        return
        }
    if(cart.length === 0) return
    if(adressInput.value === ""){
        adressWarn.classList.remove('hidden')
        adressInput.classList.remove('border-slate-400')
        adressInput.classList.add('border-red-500')
        return
    }
    
    const cartItems = cart.map((item) => {
        return (
            `| ${item.name} Quantidade: ${item.quantity} Preço: R$${item.price} |`
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone = '47991066944'

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, "_blank")

    cart = []
    updateCartModal()

})

// API Whatsapp



function checkRestaurantOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
}else{
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}