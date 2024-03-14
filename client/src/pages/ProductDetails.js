import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../style/ProductDetailsStyles.css";

const ProductDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProducts] = useState([])

    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug]);


    //get product details
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product?.category._id);
        } catch (error) {
            console.log(error);
        }
    };

    //const get similar product details
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products)
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <Layout>

            {product && Object.keys(product).length > 0 && (
                <div className="row container product-details">
                    <div className="col-md-6">
                        <img
                            className="card-img-top"
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                            alt={product.name}
                            height="300"
                            width={"350px"}
                        />
                    </div>
                    <div className="col-md-6 product-details-info">
                        <h1 className="text-center">Product Details</h1>
                        <hr />
                        <h6>Name : {product.name}</h6>
                        <h6>Price : {product?.price?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}</h6>
                        <h6>Category : {product.category?.name}</h6>
                        <button className="btn btn-secondary ms-1">Add to Cart</button>
                    </div>
                </div>
            )}
            <hr />
            {!product && <p>Loading...</p>}
            <div className="row container similar-products">
                <h1>Similar Products</h1>
                {relatedProduct.length < 1 && <p className='text-center'>No Similar Products Found</p>}

                <div className="d-flex flex-wrap">
                    {relatedProduct?.map(p => (
                        <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                            <img
                                className="card-img-top"
                                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} alt={p.name}
                            />
                            <div className="card-body">
                                <div className="card-name-price">
                                    <h5 className="card-title">{p.name}</h5>
                                    <h5 className="card-title card-price">
                                        {p.price.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        })}
                                    </h5>
                                </div>
                                <p className="card-text">{p.description.substring(0, 30)}...</p>


                                <p className="card-text"> ${p.price}</p>
                                <div className="card-name-price">

                                    <button className="btn btn-primary ms-2"
                                        onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>

                                    <button className="btn btn-primary ms-2">Add to Cart</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;
