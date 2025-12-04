import { baseUrl } from "../../app/constants";
export function fetchProductsByFilters(page) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      baseUrl+`/products?gender=men&pages=${page}` 
    );
    const data = await response.json();
    const totalItems = await response.headers.get('X-Total-Count');
    resolve({ data: {products: data, totalItems: +totalItems } });
  });
}

export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch(baseUrl+'/categories');
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchProductsOversized(page) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      baseUrl+'/products?gender=Male&category=TShirts&subcategory=Drop Shoulder&' + page
    );
    const data = await response.json();
    const totalItems = await response.headers.get('X-Total-Count');
    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}

export function fetchProductsWomen(page) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      baseUrl+'/products?gender=Female&' + page
    );
    const data = await response.json();
    const totalItems = await response.headers.get('X-Total-Count');
    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}

export function fetchProductByCrewneak( page) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      baseUrl+'/products?gender=Male&category=TShirts&subcategory=Classic Fit&' + page
    );
    const data = await response.json();
    const totalItems = await response.headers.get('X-Total-Count');
    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}

export function fetchCategoryProduct( pages,subcategories,gender) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      baseUrl+`/products?gender=${gender}&subcategory=${subcategories}&category=Hoodies&pages=${pages}` 
    );
    const data = await response.json();
    const totalItems = await response.headers.get('X-Total-Count');
    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}


export function fetchProductsWomencrewneak(page) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      baseUrl+'/products?gender=Female&category=TShirts&subcategory=Classic Fit&' + page
    );
    const data = await response.json();
    const totalItems = await response.headers.get('X-Total-Count');
    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}

export function fetchProductsWomenOversized(page) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      baseUrl+'/products?gender=Female&category=TShirts&subcategory=Drop Shoulder&' + page
    );
    const data = await response.json();
    const totalItems = await response.headers.get('X-Total-Count');
    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}