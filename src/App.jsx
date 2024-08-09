import { useEffect, useState } from "react";
import { Guitar } from "./components/Guitar";
import { Header } from "./components/Header";
import { db } from "./data/db";

function App() {
  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 5;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    const itemExists = cart.findIndex((i) => i.id === item.id);
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      const newCart = [...cart];
      newCart[itemExists].quantity++;
      setCart(newCart);
    } else {
      item.quantity = 1;
      setCart([...cart, item]);
    }
  }

  function removeFromCart(id) {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
  }

  function decrementQuantity(id) {
    const updateCart = cart
      .map((item) => {
        if (item.id === id) {
          if (item.quantity > 1) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          } else {
            return null;
          }
        }
        return item;
      })
      .filter((item) => item !== null);
    setCart(updateCart);
  }

  function updateQuantity(id) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    });
    setCart(updateCart);
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        decrementQuantity={decrementQuantity}
        clearCart={clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar key={guitar.id} guitar={guitar} addToCart={addToCart} />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
