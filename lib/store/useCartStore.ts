import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  breakageGuarantee: boolean;
  freeDeliveryThreshold: number;
  deliveryCharge: number;
  breakageGuaranteeFee: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (product: Product, packagingId: '6pack' | '12pack' | '30tray', quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleBreakageGuarantee: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      breakageGuarantee: true,
      freeDeliveryThreshold: 2500,
      deliveryCharge: 180,
      breakageGuaranteeFee: 80,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (product, packagingId, quantity = 1) => {
        const stockCount = Number(product.stockQuantity) || 0;
        if (!product.isActive || stockCount <= 0) {
          return;
        }

        const itemId = `${product.id}-${packagingId}`;
        let unitPrice = product.price12Pack;
        let packagingLabel = product.boxLabel || '12-Egg Box';

        if (packagingId === '6pack') {
          unitPrice = product.price6Pack;
          packagingLabel = product.boxLabel || '6-Egg Box';
        } else if (packagingId === '30tray') {
          unitPrice = product.price30Tray;
          packagingLabel = product.boxLabel || '30-Tray Box';
        } else if (packagingId === '12pack') {
          packagingLabel = product.boxLabel || '12-Egg Box';
        }

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === itemId);
          if (existingIndex > -1) {
            const updated = [...state.items];
            const safeQty = Math.min(stockCount, updated[existingIndex].quantity + quantity);
            updated[existingIndex].quantity = safeQty;
            return { items: updated, isDrawerOpen: true };
          }

          const safeQty = Math.min(stockCount, quantity);
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            title: product.title,
            packagingId,
            packagingLabel,
            unitPrice,
            quantity: safeQty,
            imageUrl: product.imageUrl,
            eggType: product.eggType,
          };

          return { items: [...state.items, newItem], isDrawerOpen: true };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity: Math.min(50, quantity) } : item
          ),
        }));
      },

      toggleBreakageGuarantee: () => {
        set((state) => ({ breakageGuarantee: !state.breakageGuarantee }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= get().freeDeliveryThreshold ? 0 : get().deliveryCharge;
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const deliveryFee = get().getDeliveryFee();
        const guarantee = get().breakageGuarantee ? get().breakageGuaranteeFee : 0;
        return subtotal + deliveryFee + guarantee;
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'zardi-basket-cart',
      partialize: (state) => ({
        items: state.items,
        breakageGuarantee: state.breakageGuarantee,
      }),
    }
  )
);
