import { useState } from "react";
import { selectUserInfo, updateUserAsync } from "../../features/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { FaRegEdit } from "react-icons/fa";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import GridLoader from "../../app/GridLoader";

export const Addaddress = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const user = useSelector(selectUserInfo);

  const [openPopUp, setOpenPopUp] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const [cnfDltPopUp, setCnfDltPopUp] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(null);

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(data.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[4-9]\d{9}$/.test(data.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (!data.street.trim()) {
      newErrors.street = "Address line is required";
    }

    if (!data.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!data.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!data.pinCode.trim()) {
      newErrors.pinCode = "ZIP / Postal code is required";
    } else if (!/^[1-9][0-9]{5}$/.test(data.pinCode)) {
      newErrors.pinCode = "Enter a valid 6-digit ZIP code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    let updatedAddresses = [...(user?.addresses || [])];

    if (selectedAddressIndex !== null) {
      updatedAddresses[selectedAddressIndex] = data;
      alert.success("Address updated successfully!");
    } else {
      updatedAddresses.push(data);
      alert.success("Address added successfully!");
    }

    dispatch(
      updateUserAsync({
        ...user,
        addresses: updatedAddresses,
      })
    );

    setOpenPopUp(false);
    setSelectedAddressIndex(null);
    setErrors({});
    setData({
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pinCode: "",
    });
  };

  const handleEditAddress = (index) => {
    const addr = user.addresses[index];

    setData({
      name: addr.name || "",
      email: addr.email || "",
      phone: addr.phone || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      pinCode: addr.pinCode || "",
    });

    setSelectedAddressIndex(index);
    setOpenPopUp(true);
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = user.addresses.filter((_, i) => i !== index);

    dispatch(
      updateUserAsync({
        ...user,
        addresses: updatedAddresses,
      })
    );

    alert.success("Address removed successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 mt-6 lg:mt-0">
        <h1 className="text-4xl font-semibold text-gray-900">
          Your Addresses
        </h1>
        <p className="text-base text-indigo-600 mt-1">
          Manage and add delivery addresses
        </p>
      </div>

      {
        !user?.addresses ? <GridLoader /> :
          user?.addresses?.length > 0 ? (
            <div className="w-full flex flex-wrap gap-4">
              {user.addresses.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl border border-indigo-100 p-5
                         hover:shadow-lg hover:border-indigo-300 transition-all duration-200 min-w-[30%]"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-indigo-700">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.email}
                      </p>

                      <p className="text-sm text-gray-700 mt-2">
                        {item.street}, {item.city}
                      </p>

                      <p className="text-sm text-gray-700">
                        {item.state} - {item.pinCode}
                      </p>

                      <p className="text-sm text-gray-600 mt-2">
                        📞 {item.phone}
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => handleEditAddress(index)}
                          className="text-indigo-600 font-medium text-lg hover:text-xl"
                        >
                          <FaRegEdit />
                        </button>

                        <button
                          onClick={() => { setCurrentAddressIndex(index); setCnfDltPopUp(true) }}
                          className="text-red-600 font-medium text-xl hover:text-2xl"
                        >
                          <IoMdRemoveCircleOutline />
                        </button>
                      </div>
                    </div>

                    <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                      Saved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-indigo-100 p-10 text-center shadow-sm">
              <p className="text-gray-700 text-lg font-medium">
                No addresses added yet
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Add a delivery address to continue
              </p>
            </div>
          )
      }

      {
        user?.addresses &&
        <div className="mt-8">
          <button
            onClick={() => {
              setOpenPopUp(true);
              setSelectedAddressIndex(null);
              setData({
                name: "",
                email: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                pinCode: "",
              })
            }}
            className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600
                     px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            + Add New Address
          </button>
        </div>
      }

      {openPopUp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">
              {selectedAddressIndex !== null ? "Edit Address" : "Add New Address"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name", name: "name" },
                { label: "Email", name: "email" },
                { label: "Phone", name: "phone" },
                { label: "Street", name: "street" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Pin Code", name: "pinCode" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={data[field.name]}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-xl border border-indigo-200
                               focus:outline-none focus:ring-2 focus:ring-indigo-500
                               focus:border-transparent transition"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setOpenPopUp(false);
                  setErrors({});
                }}
                className="px-5 py-2 rounded-md border border-gray-300
                           text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-md bg-indigo-600
                           text-white hover:bg-indigo-700 transition"
              >
                {selectedAddressIndex !== null ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {cnfDltPopUp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-xl flex flex-col">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Confirm Delete Address
            </h2>
            <p className="text-gray-700">
              Are you sure you want to delete this address?
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setCnfDltPopUp(false)}
                className="px-5 py-2 rounded-md border border-gray-300
                           text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRemoveAddress(currentAddressIndex);
                  setCnfDltPopUp(false);
                }}
                className="px-6 py-2 rounded-md bg-red-600
                           text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};