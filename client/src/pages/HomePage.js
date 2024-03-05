import React from 'react'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auth'

const HomePage = () => {

  const [auth , setAuth] = useAuth();
  console.log(auth);

  return (
    <Layout title={'Best offers' }>
        <pre>
          {JSON.stringify(auth , null , 4)}
        </pre>
        <h1>HomePage</h1>
    </Layout>
  )
}

export default HomePage