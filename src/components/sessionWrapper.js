"use client";
import { useState, createContext, useEffect} from "react";
import { SessionProvider } from "next-auth/react";

export const CartContext = createContext({});

export default function SessionWrapper({ children }) {

  const [cartProducts, setCartProducts] = useState([]);

  const ls = typeof window !== 'undefined' ? window.localStorage : null;

  function saveCartProductsToLocalStorage(cartProducts) {
    if(ls){
      ls.setItem('cart', JSON.stringify(cartProducts));
    }
  }

  useEffect(() => {
    if(ls && ls.getItem('cart')){
      setCartProducts( JSON.parse(ls.getItem('cart')));
    }
  }, []);

  function removeCartProducts(indexToRemove) {
    setCartProducts(prevCartProducts => {
      const newCartProducts = prevCartProducts.filter((v, index) => 
        index !== indexToRemove);
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
  }

  function clearCart (){
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function addToCart(product, size=null, extras=[]) {
    setCartProducts(prevProducts => {
      const cartProduct = {...product, size, extras};
      const newProducts = [...prevProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  }

  return <SessionProvider>
            <CartContext.Provider value={{
                cartProducts, setCartProducts, addToCart,
                removeCartProducts, clearCart}}>
              {children}
            </CartContext.Provider>
        </SessionProvider>
}
