
import { baseUrl } from "../../app/constants";
// for sports
export function fetchProductSports(filter, sort, pagination, admin) {

    filter = {"category":["Sports"]}
 
  
    let queryString = '';
    for (let key in filter) {
      const categoryValues = filter[key];
      if (categoryValues.length) {
        queryString += `${key}=${categoryValues}&`;
      }
    }
  

    for (let key in sort) {
      queryString += `${key}=${sort[key]}&`;
    }
   
    if(admin){
      queryString += `admin=true`;
    }
  
    return new Promise(async (resolve) => {
      const response = await fetch(
        baseUrl+'/products?'+queryString
      );
      const data = await response.json();
      const totalItems = await response.headers.get('X-Total-Count');
      resolve({ data: { products: data, totalItems: +totalItems } });
    });
  }

  // for Movie
  export function fetchProductMovie(filter, sort, pagination, admin) {

    filter = {"category":["movies"]}
 
  
    let queryString = '';
    for (let key in filter) {
      const categoryValues = filter[key];
      if (categoryValues.length) {
        queryString += `${key}=${categoryValues}&`;
      }
    }
  

    for (let key in sort) {
      queryString += `${key}=${sort[key]}&`;
    }
   
    if(admin){
      queryString += `admin=true`;
    }
  
    return new Promise(async (resolve) => {
      const response = await fetch(
        baseUrl+'/products?'+queryString
      );
      const data = await response.json();
      const totalItems = await response.headers.get('X-Total-Count');
      resolve({ data: { products: data, totalItems: +totalItems } });
    });
  }

  // for DoodleProducts
  export function fetchProdctDoodle(filter, sort, pagination, admin) {

    filter = {"category":["Doodle Drip"]}
 
  
    let queryString = '';
    for (let key in filter) {
      const categoryValues = filter[key];
      if (categoryValues.length) {
        queryString += `${key}=${categoryValues}&`;
      }
    }
  

    for (let key in sort) {
      queryString += `${key}=${sort[key]}&`;
    }
   
    if(admin){
      queryString += `admin=true`;
    }
  
    return new Promise(async (resolve) => {
      const response = await fetch(
        baseUrl+'/products?'+queryString
      );
      const data = await response.json();
      const totalItems = await response.headers.get('X-Total-Count');
      resolve({ data: { products: data, totalItems: +totalItems } });
    });
  }

  // for Bangla
  export function fetchProductsBangla(filter, sort, pagination, admin) {

    filter = {"":["Bangla o Bangali"]}
 
  
    let queryString = '';
    for (let key in filter) {
      const categoryValues = filter[key];
      if (categoryValues.length) {
        queryString += `${key}=${categoryValues}&`;
      }
    }
 

    for (let key in sort) {
      queryString += `${key}=${sort[key]}&`;
    }
   
    if(admin){
      queryString += `admin=true`;
    }
  
    return new Promise(async (resolve) => {
      const response = await fetch(
        baseUrl+'/products?'+queryString
      );
      const data = await response.json();
      const totalItems = await response.headers.get('X-Total-Count');
      resolve({ data: { products: data, totalItems: +totalItems } });
    });
  }

  // AbstractTypo
  export function fetchProductAbstractTypo(filter, sort, pagination, admin) {

    filter = {"category":["Abstract"]}
 
  
    let queryString = '';
    for (let key in filter) {
      const categoryValues = filter[key];
      if (categoryValues.length) {
        queryString += `${key}=${categoryValues}&`;
      }
    }
  

    for (let key in sort) {
      queryString += `${key}=${sort[key]}&`;
    }
   
    if(admin){
      queryString += `admin=true`;
    }
  
    return new Promise(async (resolve) => {
      const response = await fetch(
        baseUrl+'/products?'+queryString
      );
      const data = await response.json();
      const totalItems = await response.headers.get('X-Total-Count');
      resolve({ data: { products: data, totalItems: +totalItems } });
    });
  }

  // for Music
  export function fetchProductMusic(filter, sort, pagination, admin) {

    filter = {"category":["Music Band"]}
 
  
    let queryString = '';
    for (let key in filter) {
      const categoryValues = filter[key];
      if (categoryValues.length) {
        queryString += `${key}=${categoryValues}&`;
      }
    }
  

    for (let key in sort) {
      queryString += `${key}=${sort[key]}&`;
    }
   
    if(admin){
      queryString += `admin=true`;
    }
  
    return new Promise(async (resolve) => {
      const response = await fetch(
        baseUrl+'/products?'+queryString
      );
      const data = await response.json();
      const totalItems = await response.headers.get('X-Total-Count');
      resolve({ data: { products: data, totalItems: +totalItems } });
    });
  }

  // for Anime
  export function fetchProductAnime(filter, sort, pagination, admin) {

    filter = {"category":["Anime"]}
 
  
    let queryString = '';
    for (let key in filter) {
      const categoryValues = filter[key];
      if (categoryValues.length) {
        queryString += `${key}=${categoryValues}&`;
      }
    }
  

    for (let key in sort) {
      queryString += `${key}=${sort[key]}&`;
    }
   
    if(admin){
      queryString += `admin=true`;
    }
  
    return new Promise(async (resolve) => {
      const response = await fetch(
        baseUrl+'/products?'+queryString
      );
      const data = await response.json();
      const totalItems = await response.headers.get('X-Total-Count');
      resolve({ data: { products: data, totalItems: +totalItems } });
    });
  }

  export function fetchProductSuperHero(filter, sort, pagination, admin) {

    filter = {"category":["superhero"]}

    let queryString = '';
    for (let key in filter) {
      const categoryValues = filter[key];
      if (categoryValues.length) {
        queryString += `${key}=${categoryValues}&`;
      }
    }
  

    for (let key in sort) {
      queryString += `${key}=${sort[key]}&`;
    }
   
    if(admin){
      queryString += `admin=true`;
    }
  
    return new Promise(async (resolve) => {
      const response = await fetch(
        baseUrl+'/products?'+queryString
      );
      const data = await response.json();
      const totalItems = await response.headers.get('X-Total-Count');
      resolve({ data: { products: data, totalItems: +totalItems } });
    });
  }