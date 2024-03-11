import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProductDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProduct , setRelatedProducts] = useState([])

    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug]);


    //get product details
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProduct(data?.product._id,data?.product?.category._id);
        } catch (error) {
            console.log(error);
        }
    };

    //const get similar product details
    const getSimilarProduct = async(pid , cid)=>{
        try {
            const {data} =  await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products)
            console.log("this is you similar data" , data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <Layout>
            <h1>Product Details</h1>
            {product && Object.keys(product).length > 0 && (
                <div className="row container mt-2">
                    <div className="col-md-6">
                        <img
                            className="card-img-top"
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                            alt={product.name}
                            height="300"
                            width="300"
                        />
                    </div>
                    <div className="col-md-6">
                        <h1>Product Details</h1>
                        <h6>Name : {product.name}</h6>
                        <h6>Price : ${product.price}</h6>
                        <h6>Category : {product.category?.name}</h6>
                        <button className="btn btn-secondary ms-2">Add to Cart</button>
                    </div>
                </div>
            )}
            <hr />
            {!product && <p>Loading...</p>}
            <div className="row container">
                <h1>Similar Products</h1>
                {relatedProduct.length<1 && <p className='text-center'>No Similar Products Found</p>}
              
                <div className="d-flex flex-wrap">
                {relatedProduct?.map(p => (
                  <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                    <img
                      className="card-img-top"
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} alt={p.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description.substring(0, 30)}...</p>
                      <p className="card-text"> ${p.price}</p>
                      <button className="btn btn-primary ms-2" 
                      onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                  
                    <button className="btn btn-primary ms-2">Add to Cart</button>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;
