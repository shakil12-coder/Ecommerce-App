import React from 'react'
import Layout from "./../components/Layout/Layout";
import { useSearch } from '../context/search';
const Search = () => {
    const [values , setValues] = useSearch();
    console.log("this is you search values lenghtn " , values)
  return (
    <Layout>
        <div className="container">
            <div className="text-center">
                <h1>Search Results</h1>
                <h6>{values && values.results.length < 1 ? 'No Products Found' : `Found ${values && values.results.length}`}</h6>
                <div className="d-flex flex-wrap">
            {values.results?.map(p => (
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
            </div>
        </div>
    </Layout>
  )
}

export default Search