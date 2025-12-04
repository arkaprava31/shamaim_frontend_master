import { useState } from "react";
import { selectUserInfo, updateUserAsync } from "../../features/user/userSlice";
import { useSelector, useDispatch } from "react-redux";

export const Addaddress = () => {
  const dispatch = useDispatch();
  let user = useSelector(selectUserInfo);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: ""
  });

  const handlePopUp = () => {
    setOpenPopUp(true);
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setOpenPopUp(false);
    dispatch(updateUserAsync({
      ...user,
      addresses: [...user.addresses, data]
    }));
  };

  return (
    <>
      <div className=" h-full">
      <div className="bg-white shadow-md py-6">
          <p
            className=" text-lg  text-blue-500 px-3 "
            onClick={handlePopUp}
          >
           <span className=" text-2xl">+</span> Add a new  address
          </p>
        </div>        <div>
          {user?.addresses.map((item, index) => {
            return (
              <div key={index} className="flex flex-col border bg-white shadow-md gap-1 mt-4 px-2 rounded-t-lg mb-4">
                <p className="py-2">{item.name}</p>
                <p>Phone no: {item.phone}</p>
                <p>{item.state}: {item.pinCode}</p>
                <p>{item.city}</p>
                <p className="pb-4">{item.street}</p>
              </div>
            );
          })}
        </div>
      
        {openPopUp ? (
          <div className="z-50 absolute top-16 px-2">
            <div className="bg-[#b4b4b4] shadow-md h-full w-[96vw] px-8 rounded-lg py-3">
              <p>Full Name</p>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="w-full py-2 rounded-lg"
              />
              <p>Email address</p>
              <input
                type="text"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full py-2 rounded-lg"
              />
              <p>Phone number</p>
              <input
                type="text"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                className="w-full py-2 rounded-lg"
              />
              <p>Street address</p>
              <input
                type="text"
                name="street"
                value={data.street}
                onChange={handleChange}
                className="w-full py-2 rounded-lg"
              />
              <p>City</p>
              <input
                type="text"
                name="city"
                value={data.city}
                onChange={handleChange}
                className="w-full py-2 rounded-lg"
              />
              <p>State/Province</p>
              <input
                type="text"
                name="state"
                value={data.state}
                onChange={handleChange}
                className="w-full py-2 rounded-lg"
              />
              <p>Zip/Postal Code</p>
              <input
                type="text"
                name="pinCode"
                value={data.pinCode}
                onChange={handleChange}
                className="w-full py-2 rounded-lg"
              />
              <div className="flex justify-end items-end py-2 px-6">
                <button onClick={handleSave} className="bg-white py-2 px-4 rounded-lg">Save</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};
