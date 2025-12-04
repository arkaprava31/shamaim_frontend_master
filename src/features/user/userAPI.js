import { baseUrl } from "../../app/constants";
import { getId } from "../../app/constants";



export function fetchLoggedInUserOrders() {

  return new Promise(async (resolve) =>{
    const response = await fetch(baseUrl+`/orders/own/${getId()}`) 
    const data = await response.json()
    resolve({data})
  }
  );
}


export function fetchLoggedInUser() {
  return new Promise(async (resolve) =>{
    const response = await fetch(baseUrl+`/users/own/${getId()}`) 
    const data = await response.json()
    resolve({data})
  }
  );
}

export function updateUser(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(baseUrl+`/users/${getId()}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    resolve({ data });
  });
}


export function cancelOrder(orderId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(baseUrl+`/orders/${orderId}/cancel`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel the order');
      }

      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

export function returnOrder(order,orederId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(baseUrl+`/orders/${orederId}/return`, {
        method: 'POST',
        body:JSON.stringify(order),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to return the order');
      }
      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}


// userAPI.js

// export function returnOrder(orderId) {
//   return fetch(baseUrl+`/orders/${orderId}/return`, {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json'
//       },
//       // Optionally, include a request body if needed
//       // body: JSON.stringify({ /* any additional data */ })
//   })
//   .then(response => {
//       if (!response.ok) {
//           throw new Error('Failed to return the order');
//       }
//       return response.json();
//   });
// }


export function fetchproductstatusbyid(productId){
  return new Promise(async(resolve,reject)=>{
    try{
      const response = await fetch(baseUrl+`/orders/product/${productId}`) 
      const data =await response.json();
      resolve({data});  
      }
    catch(err){
      reject(err);
    }
  })
}


export function fetchorderbyid(id){
  return new Promise(async(resolve,reject)=>{
    try{
      const responce=await fetch(baseUrl+`/orders/productOrder/${id}`)
      const data=await responce.json();
      resolve({data})
    }
    catch(err){
      reject(err)
    }
  })
}



