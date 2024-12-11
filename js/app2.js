const app = Vue.createApp({
    data() {
      return {
        card: {}, // Datos de la carta seleccionada
        quantity: 1, // Cantidad inicial
        cart: [], // Carrito de compras
      };
    },
    created() {
      this.loadCardFromStorage();
    },
    methods: {
      // Aumentar cantidad
      increaseQuantity() {
        if (this.quantity < 6) {
          this.quantity++;
        }
      },
      // Disminuir cantidad
      decreaseQuantity() {
        if (this.quantity > 1) {
          this.quantity--;
        }
      },
      // Validar cantidad ingresada manualmente
      validateQuantity() {
        if (this.quantity < 1) {
          this.quantity = 1;
        } else if (this.quantity > 6) {
          this.quantity = 6;
        }
      },
      // Agregar al carrito
      addToCart() {
        // Buscar si la carta ya está en el carrito
        const existingItem = this.cart.find(item => item.id === this.card.id);
  
        if (existingItem) {
          // Si ya está en el carrito, actualizar la cantidad
          existingItem.quantity = Math.min(existingItem.quantity + this.quantity, 6);
          alert("Cantidad actualizada en el carrito.");
        } else {
          // Si no está, agregarla con la cantidad seleccionada
          this.cart.push({ ...this.card, quantity: this.quantity });
          alert("Carta añadida al carrito.");
        }
         // Guardar el carrito en el almacenamiento local
         localStorage.setItem('cart', JSON.stringify(this.cart));
        },
      loadCardFromStorage() {
        const savedCard = localStorage.getItem('selectedCard');
        if (savedCard) {
          this.card = JSON.parse(savedCard);
        }
      },
      // Navegar hacia atrás
      goBack() {
        window.location.href = './Principal.html';
      },
    },
    mounted() {
      // Cargar detalles de la carta desde el almacenamiento local
      const cardDetails = localStorage.getItem('selectedCard');
      if (cardDetails) {
        this.card = JSON.parse(cardDetails);
      } else {
        alert("No se encontraron detalles de la carta.");
      }
  
      // Cargar carrito desde el almacenamiento local
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      }
    },
  });
  
  app.mount('#details');


  ////
  
  