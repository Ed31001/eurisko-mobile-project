import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useCartStore } from '../store/useCartStore';
import { Swipeable } from 'react-native-gesture-handler';
import useCartScreenStyles from '../styles/CartScreenStyles';

const CartScreen = () => {
  const { items, removeFromCart, incrementQuantity, decrementQuantity } = useCartStore();
  const styles = useCartScreenStyles();

  const renderRightActions = (productId: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFromCart(productId)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  interface CartItem {
    product: {
      _id: string;
      title: string;
      price: number;
      images: Array<{ url: string }>;
    };
    quantity: number;
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.product._id)}
      rightThreshold={40}
    >
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.product.images[0]?.url }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.product.title}</Text>
          <Text style={styles.itemPrice}>${item.product.price}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => decrementQuantity(item.product._id)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => incrementQuantity(item.product._id)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Swipeable>
  );

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.product._id}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.footer}>
            <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      )}
    </View>
  );
};

export default CartScreen;
