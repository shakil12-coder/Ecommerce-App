import React from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import CategoryForm from '../../components/Form/CategoryForm'


const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");



  //handle form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/category/create-category`, {
        name
      })
      if (data?.success) {
        toast.success(`${name} is created`);
        getAllCategory();
      }
    } catch (error) {
      console.log(error);
      toast.error('something went wrong in input form')
    }
  }


  //handle delete 
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`);
      if (data.success) {
        toast.success(`${data.category.name} is deleted`);
        getAllCategory();
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('something went wrong in deleting category')
    }
  }

  const getAllCategory = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-categories`)

      console.log("entered");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting Category");
    }
  }

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3"><AdminMenu /></div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className='w-75'>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories && categories.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button className="btn btn-primary ms-2">Edit</button>
                        <button className="btn btn-danger ms-2" onClick={() => handleDelete(c._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateCategory