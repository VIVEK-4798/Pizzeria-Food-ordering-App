'use client'
import React, { useEffect, useContext, useState, useRef } from 'react';
import SectionHeaders from "@/components/layout/sectionHeaders";
import { CartContext, cartProductPrice } from '@/components/sessionWrapper';
import { useParams } from 'next/navigation';
import AddressInput from '@/components/layout/AddressInput';
import CartProduct from '@/components/Menu/CartProduct';
import Loader from '@/components/loader';

const OrderPage = () => {
  const { clearCart } = useContext(CartContext);
  const { id } = useParams();
  const [order, setOrder] = useState(null); 
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  const hasClearedCart = useRef(false); // Prevent multiple calls

  useEffect(() => {
    if (window?.location?.href.includes('clear-cart=1') && !hasClearedCart.current) {
      clearCart();
      hasClearedCart.current = true;
    }

    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoadingOrders(true);
        const res = await fetch('/api/orders?_id=' + id);
        if (!res.ok) throw new Error("Failed to fetch order");
        const orderData = await res.json();
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order. Please try again.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrder();
  }, [id]); // Removed `clearCart` from dependency to avoid re-renders

  let subtotal = 0;
  if (order?.cartProducts) {
    for (const product of order?.cartProducts) {
      subtotal += cartProductPrice(product);
    }
  }

  return (
    <section className='max-w-4xl mx-auto mt-8'>
      <div className='text-center'>
        <SectionHeaders mainHeader="Your Order"/>
        <div className='mt-4 mb-8'>
          <p>Thanks for your order</p>
          <p>We will call you when your order is ready.</p>
        </div>
      </div>

      {loadingOrders && <Loader />}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {order && (
        <div className='grid md:grid-cols-2 md:gap-16'>
          <div className='max-md:mb-8'>
            {order.cartProducts.map((product, index) => (
              <CartProduct key={product._id || index} product={product} />
            ))}
            <div className='text-right py-2 text-gray-500'>
              <p>Subtotal: ₹{subtotal}</p>
              <p>Delivery: ₹100</p>
              <p>Total: ₹{subtotal + 100}</p>
            </div>
          </div>
          <div>
            <h2 className='font-semibold mb-1 text-gray-700 text-lg max-md:ml-1'>Delivery address</h2>
            <div className='bg-gray-100 p-4 rounded-lg'>
              <AddressInput disabled={true} userInfo={order} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderPage;
