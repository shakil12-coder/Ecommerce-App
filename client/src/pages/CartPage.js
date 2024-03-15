import React from 'react'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auth'
import { useCart } from '../context/cart'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "../style/CartStyles.css";


const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const navigate = useNavigate();

    //delte item from cart
    const removeCartItem = (pid) => {
        let myCart = [...cart]
        let index = myCart.findIndex(item => item._id === pid);
        myCart.splice(index, 1);
        setCart(myCart);
        localStorage.setItem('cart', JSON.stringify(myCart))
    }

    const totalPrice = () => {
        let total = 0;
        cart.map(item => (
            total += item.price
        ))
        return total.toLocaleString("en-US", {
            style: "currency",
            currency: 'USD'
        });
    }

    const handlePayment = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/payment`, {
                cart
            })
            console.log("this is after payment", data);
            if (data?.success) {
                localStorage.removeItem('cart');
                setCart([]);
                toast.success("Payment completed successfully");
                window.location = data.url;
            }
            else {
                toast.error("Payment failed")
            }

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Layout>
            <div className="cart-page">
                <div className="row">
                    <div className="col-md-12">

                        <h1 className="text-center bg-light p-2 mb-1">
                            {!auth?.user
                                ? "Hello Guest"
                                : `Hello  ${auth?.token && auth?.user?.name}`}
                            <p className="text-center">
                                {cart?.length
                                    ? `You Have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout !"
                                    }`
                                    : " Your Cart Is Empty"}
                            </p>
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-7 p-0 m-0">
                            {
                                cart?.map(p => (
                                    <div className="row card flex-row" key={p._id}>
                                        <div className="col-md-4">
                                            <img
                                                className="card-img-top"
                                                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} alt={p.name}
                                                height="100"
                                                width="100"
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <p>{p.name}</p>
                                            <p>{p.description.substring(0, 30)}</p>
                                            <p>Price : {p.price}</p>
                                        </div>
                                        <div className="col-md-4 cart-remove-btn">
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => removeCartItem(p._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="col-md-5 text-center cart-summary">
                            <h4>Cart Summary</h4>
                            <p>Total | Checkout | Payment</p>
                            <hr />
                            <h4>Total : {totalPrice()}</h4>
                            {auth?.user?.address ? (
                                <>
                                    <div className="mb-3">
                                        <h4>Current Address</h4>
                                        <h5>{auth?.user?.address}</h5>
                                        <button
                                            className="btn btn-outline-warning"
                                            onClick={() => navigate("/dashboard/user/profile")}
                                        >
                                            Update Address
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="mb-3">
                                    {auth?.token ? (
                                        <button
                                            className="btn btn-outline-warning"
                                            onClick={() => navigate("/dashboard/user/profile")}
                                        >
                                            Update Address
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-outline-warning"
                                            onClick={() =>
                                                navigate("/login", {
                                                    state: "/cart",
                                                })
                                            }
                                        >
                                            Plase Login to checkout
                                        </button>
                                    )}

                                </div>

                            )}
                            <button className="btn btn-primary" onClick={() => handlePayment()} disabled={!auth?.user?.address}>Make payment</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage