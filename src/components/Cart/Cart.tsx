import React from "react";
import { Book } from "../../models/models";
import BookCard from "../BookCard/BookCard";

const Cart: React.FC<CartProps> = ({
  cartItems,
  addToCart,
  removeFromCart,
}) => {
  const calculateTotal = (items: Book[]) =>
    items.reduce((ack: number, item) => ack + item.quantity * item.price, 0);

  return (
    <>
      <p> Your Shopping Cart</p>
      {cartItems.length === 0 ? <p>No items in cart.</p> : null}
      {cartItems.map((item) => (
        <BookCard
          showQuantity={true}
          key={item.bookID}
          book={item}
          handleAddToCart={addToCart}
          handleRemoveFromCart={removeFromCart}
        />
      ))}
      <h2>Total: Rs. {calculateTotal(cartItems).toFixed(2)}</h2>
    </>
  );
};

interface CartProps {
  cartItems: Book[];
  addToCart: (clickedBook: Book) => void;
  removeFromCart: (id: number) => void;
}

export default Cart;
