import { create } from 'zustand';
import { Product } from '../services/productService';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
  total: number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addToCart: (product) => {
    const items = get().items;
    const existingItem = items.find(item => item.product._id === product._id);

    if (existingItem) {
      set({
        items: items.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...items, { product, quantity: 1 }] });
    }
  },
  removeFromCart: (productId) => {
    set({ items: get().items.filter(item => item.product._id !== productId) });
  },
  incrementQuantity: (productId) => {
    set({
      items: get().items.map(item =>
        item.product._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    });
  },
  decrementQuantity: (productId) => {
    const item = get().items.find(cartItem => cartItem.product._id === productId);
    if (item && item.quantity > 1) {
      set({
        items: get().items.map(cartItem =>
          cartItem.product._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      });
    }
  },
  clearCart: () => set({ items: [] }),
  total: 0,
}));
