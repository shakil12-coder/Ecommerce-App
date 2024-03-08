import React from 'react'
import { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
const Products = () => {

    const [products, setProducts] = useState([]);

    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
            console.log("All products data are fetched", data);
            setProducts(data.products)
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong on getting all products")

        }
    }

    useEffect(() => {
        getAllProducts()
    }, [])


    return (
        <Layout>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-center">All Products List</h1>
                        <div className="d-flex">
                        {products?.map(p => (

                            <Link key = {p._id} to = {`/dashboard/admin/products/${p.slug}`} className='product-link'>

                            <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                <img 
                                    className="card-img-top" 
                                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} alt={p.name} 
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description}</p>
                                    <a href="#" className="btn btn-primary">Go somewhere</a>
                                </div>
                            </div>

                            </Link>

                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Products