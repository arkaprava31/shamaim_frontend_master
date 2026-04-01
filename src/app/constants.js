export const ITEMS_PER_PAGE = 10;
// export const baseUrl = "http://localhost:8080";
export const baseUrl = "https://us-central1-shamaim-lifestyle.cloudfunctions.net/api";
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
