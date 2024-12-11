const app = Vue.createApp({
    data() {
      return {
        cards: [],
        cart: [],
        currentPage: 1,
        cardsPerPage: 9,
        itemsPerPage: 9,
        totalPages: 1,
        isCartVisible: false,
        selectedCategory: '',
        searchQuery: '',
        filteredCards: [],
      };
    },
    computed: {
      currentPageCards() {
        const startIndex = (this.currentPage - 1) * this.cardsPerPage;
        return this.filteredCards.slice(startIndex, startIndex + this.cardsPerPage);
      },
      totalCartItems() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    totalCartPrice() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    }
    },
    created() {
      this.loadCartFromStorage();
      this.fetchCards();
    },
    methods: {
      fetchCards() {
    axios
      .get(`https://db.ygoprodeck.com/api/v7/cardinfo.php`)
      .then(response => {
        this.cards = response.data.data.map(card => ({
          ...card,
          price: card.card_prices && card.card_prices.length > 0 
            ? parseFloat(card.card_prices[0].cardmarket_price).toFixed(2) 
            : "0.00" // Precio predeterminado si no está disponible
        }));
        this.filteredCards = this.cards;
        this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
      })
      .catch(error => console.error('Error fetching cards:', error));
      },
      goToCartPage() {
      this.saveCartToStorage();
      window.location.href = './cart.html'; // Redirige a la página de carrito
    },
      filterCards() {
        this.filteredCards = this.cards.filter(card => {
          const matchesCategory = this.selectedCategory ? card.type.includes(this.selectedCategory) : true;
          const matchesName = this.searchQuery ? card.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true;
          return matchesCategory && matchesName;
        });
        this.totalPages = Math.ceil(this.filteredCards.length / this.cardsPerPage);
        this.currentPage = 1; // Reiniciar a la primera página
      },
      addToCart(card) {
    const existingItem = this.cart.find(item => item.id === card.id);
    if (existingItem) {
      if (existingItem.quantity < 6) {
        existingItem.quantity++;
      } else {
        alert('El límite de 6 unidades por carta ha sido alcanzado.');
      }
    } else {
      this.cart.push({ ...card, quantity: 1 });
    }
    this.saveCartToStorage();
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
      this.cart.splice(index, 1);
      this.saveCartToStorage();
    },
      toggleCart() {
        this.isCartVisible = !this.isCartVisible;
      },
      prevPage() {
        if (this.currentPage > 1) this.currentPage--;
      },
      nextPage() {
        if (this.currentPage < this.totalPages) this.currentPage++;
      },
      goToDetails(cardId) {
        const selectedCard = this.cards.find(card => card.id === cardId);
        if (selectedCard) {
          localStorage.setItem('selectedCard', JSON.stringify(selectedCard));
          window.location.href = './details.html';
        }
      },
      saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
      },
      loadCartFromStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          this.cart = JSON.parse(savedCart);
        }
      }
    }
  });
  
  app.mount('#app');