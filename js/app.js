const app = Vue.createApp({
  data() {
    return {
      cart: []
    };
  },
  computed: {
    totalCartPrice() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    }
  },
  created() {
    this.loadCartFromStorage();
  },
  methods: {
loadCartFromStorage() {
const savedCart = localStorage.getItem('cart');
if (savedCart) {
  this.cart = JSON.parse(savedCart);
}
},
updateQuantity(index, quantity) {
if (quantity > 6) {
  alert('El límite por carta es 6 unidades.');
  this.cart[index].quantity = 6;
} else if (quantity > 0) {
  this.cart[index].quantity = quantity;
} else {
  this.removeFromCart(index);
}
this.saveCartToStorage();
},
removeFromCart(index) {
this.cart.splice(index, 1); // Eliminar carta del carrito
this.saveCartToStorage();
},
saveCartToStorage() {
localStorage.setItem('cart', JSON.stringify(this.cart));
},
goBack() {
window.location.href = './Principal.html'; // Redirige a la tienda principal
}
}

});

app.mount('#cartPage');