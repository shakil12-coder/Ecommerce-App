import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const CategoryProduct = () => {
    const navigate = useNavigate();
    const params = useParams()
    const [products , setProducts] = useState([])
    const [category , setCategory] = useState([])

    console.log("category is ", category);
    console.log("products is ", products);
    


    useEffect(()=> {
        if(params?.slug) 
        {
            getProductsByCat();
            console.log("calling ", params.slug);
        }
    } , [params?.slug])
    // console.log("hkjdsfj");

    const getProductsByCat = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`)
            console.log(data);
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <Layout>
        <div className="container">
        <h1 className="text-center">Category : {category[0]?.name}</h1>
        <h6 className="text-center">{products?.length} products found</h6>
        <div className="row">
            <div className="col-md-9 offset-1">
                <div className="d-flex flex-wrap">
                {products?.map((p) => (
                    <div
                      className="card m-2"
                      style={{ width: "18rem" }}
                      key={p._id}
                    >
                    <img
                    className="card-img-top"
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} alt={p.name}
                  />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">
                          {p.description.substring(0, 30)}...
                        </p>
                        <p className="card-text"> $ {p.price}</p>
                        <button
                          className="btn btn-primary ms-1"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </button>
                        <button className="btn btn-secondary ms-1">
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
        </div>

        </div>
    </Layout>
  )
}

export default CategoryProduct