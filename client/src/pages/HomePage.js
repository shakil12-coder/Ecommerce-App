import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auth'
import { Checkbox, Radio } from "antd";
import axios from 'axios'
import { Link } from 'react-router-dom';
import { Prices } from '../components/Prices';

const HomePage = () => {
  // const [auth , setAuth] = useAuth();
  // console.log(auth);

  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [products, setProducts] = useState([]);
  const [radio , setRadio] = useState([]);
  const [total , setTotal] = useState(0);
  const [page , setPage] = useState(1);
  const [loading , setLoading] = useState(false);


 

  //get all catgories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-categories`)
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllCategory();
    getTotal();
  }, [])


  //get all product
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const  {data}  = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
      setLoading(false)
      setProducts(data.products);
      console.log("this is you current data", data);
    } catch (error) {
      setLoading(false);
      console.log(error);

    }
  }



   //get total 
   const getTotal = async()=> {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  }


  //load more

  const loadMore = async()=>{
    try {
      setLoading(true);
      const  {data}  = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`); 
      setLoading(false)
      setProducts([...products , ...data?.products]);
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(()=> {
     if(page===1) return ;
     loadMore();
  } , [page])



  //filter by category
  const handleFilter = (value, id) => {
    console.log("value is : ", value, " id is : ", id)
    let all = [...checked];
    if (value) {
      all.push(id);
    }
    else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  }

  useEffect(() => {
    if(!checked.length || !radio.length) getAllProducts();
  }, [checked.length])

  useEffect(()=> {
    if(checked.length || radio.length) filterProduct();
  } ,[checked , radio])

  console.log(products)


  const filterProduct = async () => {
    try {
      const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters` ,{
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };




  return (
    <Layout title={'Best offers'}>

    

      <div className="row mt-3">
      {JSON.stringify(radio  , null , 4)}
      
        <div className="col-md-2">

        {/*Filter By Category */} 
          <h6 className="text-center">Filter By Category</h6>
          
          <div className="d-flex flex-column">
            {
              
              categories?.map((c)=>(
                <Checkbox 
                  key={c._id}
                  onChange={(e)=>{handleFilter(e.target.checked , c._id)}}
                >
                {c.name}
                </Checkbox>
              ))
            }
          </div>


          {/*Filter By price */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>

          
        </div>
        <div className="col md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map(p => (
              <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                <img
                  className="card-img-top"
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 30)}...</p>
                  <p className="card-text"> ${p.price}</p>
                  <button className="btn btn-primary ms-2">See More</button>
                <button className="btn btn-primary ms-2">Add to Cart</button>
                </div>
                
              </div>
            ))}
          </div>
              

          {products && products.length < total && (
            <button
                className="btn btn-warning"
                onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                }}
            >
                {loading ? "Loading..." : "Load More"}
            </button>
        )}
        

        </div>
      </div>


    </Layout>
  )
}

export default HomePage