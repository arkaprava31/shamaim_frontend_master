export const ITEMS_PER_PAGE = 10;
// export const baseUrl = "https://helloworld-j376pdtdya-uc.a.run.app";
// export const baseUrl="http://127.0.0.1:5001/shamaim-lifestyle/us-central1/helloWorld";
export const baseUrl = "http://localhost:8080";
// export const baseUrl = "https://shamaim-backend-dev2-0.onrender.com";
// key: "rzp_test_UanPsB91bqtxk7",


// export function getId() {
//   const data = localStorage.getItem("id")
//   const id = JSON.parse(data);
//   return id;
// };

export function getId() {
  const id = localStorage.getItem("id");
  return id;
};

export function getGuestUserId() {
  const id = localStorage.getItem("guestUserId");
  return id;
};
