import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import quoteUp from "../Assets/quoteUp.svg";
import quoteDown from "../Assets/quoteDown.svg";
import { baseUrl } from "../../../app/constants";
const ContactUs = () => {
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email:"",
    query: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let responce = await fetch(`${baseUrl}/conatctus/contactus`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    responce = await responce.json();
    if (responce) {
      Navigate("/");
    }
  };
  return (
    <div className="w-full h-full ">
      <div className="w-full lg:h-[100vh] bg-[#F4F8FB] ">
        <div className="flex flex-col items-center justify-center  md:flex-row">
          {/* Image Section */}
          <div className="lg:w-[25vw] w-[80vw] p-4 lg:mt-5 lg:mr-20">
            <div className="left-0 ">
              <img src={quoteUp} alt="" />
            </div>
            <div className=" font-bold text-[40px]  text-[#056E9C]">
              <p>The important thing is not to stop questining. </p>
            </div>
            <div>
              <img src={quoteDown} alt="" />
            </div>
            <div className=" text-[#056E9C] text-[15px]">
              <p>-Albert Einstein</p>
            </div>
          </div>
          {/* form Section */}
          <div className="lg:w-[25vw] lg:h-[75vh] h-[70vh] w-[80vw] bg-white lg:mt-14 rounded-xl shadow-sm mb-4 lg:mb-0 lg:ml-10 ">
            <form className="py-6 mx-2 " onSubmit={handleSubmit}>
              <h2 className="my-4 text-3xl font-semibold text-center text-gradient">
                Contact Us
              </h2>
              <div className="flex flex-col px-6">
                <label htmlFor="Name" className="text-gray-500 ">
                  Name
                </label>
                <input
                  className="px-2 py-2 border rounded-lg outline-none"
                  placeholder="Enter Your Name"
                  id="name"
                  type="name"
                  name="name"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col p-6">
                <label className="text-gray-500 ">Email</label>
                <input
                  className="px-2 py-2 border rounded-lg outline-none"
                  placeholder="Enter Your Email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col px-6 pb-4">
                <label className="text-gray-500 ">Your Concern</label>
                <textarea
                  className="h-20 px-2 py-2 border rounded-lg outline-none"
                  placeholder="Ask what you want"
                  name="query"
                  id="query"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-center p-6">
                <button
                  type="submit"
                  className="rounded-2xl w-full text-xl py-3 hover:bg-[#056E9C] text-white bg-[#056f9cf7]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="px-4 py-6 text-center">
        <p className="text-base font-medium text-center">Registered Office: 105/5B, Dum Dum Road, Kolkata: 700074 <br/>Phone Number: 7278848863</p>
      </div>
    </div>
  );
};

export default ContactUs;
