import React from 'react'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auth'
import { useCart } from '../context/cart'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const navigate= useNavigate();

    //delte item from cart
    const removeCartItem = (pid)=>{
        let myCart = [...cart]
        let index = myCart.findIndex(item=>item._id===pid);
        myCart.splice(index , 1);
        setCart(myCart);
        localStorage.setItem('cart' , JSON.stringify(myCart))
    }

    const totalPrice = ()=> {
        let total=0;
        cart.map(item=>(
            total+=item.price
        ))
        return total.toLocaleString("en-US" , {
            style:"currency",
            currency:'USD'
        });
    }

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                   
                        <h4 className="text-center">
                            {cart?.length ?
                                `You have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout"}` :
                                "Your cart is Empty"
                            }
                        </h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8"> 
                    {
                        cart?.map(p=>(
                            <div className="row m-2 card flex-row">
                                <div className="col-md-4">
                                <img
                                    className="card-img-top"
                                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} alt={p.name}
                                    height="100"
                                    width="100"
                                />
                                </div>
                                <div className="col-md-8">
                                <p>{p.name}</p>
                                <p>{p.description}</p>
                                <p>Price : $ {p.price}</p>
                                <button className="btn btn-danger" onClick={()=>removeCartItem(p._id)}>Remove</button>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                    <div className="col-md-4 text-center">
                        <h4>Cart Summary</h4>
                        <p>Total | Checkout | Payment</p>
                        <hr/>
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
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage