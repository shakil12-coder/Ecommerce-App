import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useState , useEffect} from 'react'
import axios from 'axios'
import { useAuth } from '../../context/auth'
import moment from 'moment'

const Orders = () => {
  const [orders , setOrders] = useState([])
  const [auth , setAuth] = useAuth();

  const getOrders = async()=>{
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/orders`);
      setOrders(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    if(auth?.token) getOrders();
  } , [auth?.token])

  return (
    <Layout>
    <div className="container-fluid p-3 m-3">
        <div className="row">
            <div className="col-md-3">
                <UserMenu />
            </div>
            <div className="col-md-9">
                <h1 className='text-center'>All Orders</h1>
                <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{o?.status}</td>
                          <td>{o?.buyer?.name}</td>
                          <td>{moment(o?.createAt).fromNow()}</td>
                          <td>{o?.products?.length}</td>
                        </tr>
                      ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </Layout>
  )
}

export default Orders;
