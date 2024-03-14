import React from 'react'
import { useSearch } from '../../context/search'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
    const [values , setValues]=useSearch();
    const navigate = useNavigate(); 

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/search/${values.keyword}`)
            setValues({...values , results:data.results})
            navigate('/search')
        } catch (error) {
            console.log(error);
        }
    }
    

  return (
    <div>
        <form action="" className="d-flex" role="search" onSubmit={handleSubmit}>
            <input 
                type="search" 
                placeholder='Search'
                aria-label='Search'
                value={values.keyword}
                onChange={(e)=>setValues({...values , keyword:e.target.value})}
            />
            <button className="btn btn-outline-success" type="submit">
                Search
            </button>
        </form>
    </div>
  )
}

export default SearchInput