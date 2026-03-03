import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../app/constants";

const ContactUs = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response = await fetch(`${baseUrl}/conatctus/contactus`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    if (response) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-6 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 mt-6 lg:mt-0 text-center">
        <h1 className="text-4xl font-semibold text-gray-900">
          Contact Us
        </h1>
        <p className="text-base text-indigo-600 mt-1">
          We'd love to hear from you
        </p>
      </div>

      {/* Card */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-indigo-100 p-6 sm:p-8 shadow-sm">

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none 
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                         transition text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none 
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                         transition text-sm"
            />
          </div>

          {/* Query */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Your Concern
            </label>
            <textarea
              name="query"
              rows="4"
              placeholder="Ask what you want"
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none 
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                         transition resize-none text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600
                       py-3 text-sm font-semibold text-white
                       hover:opacity-90 transition"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-sm text-gray-600">
        <p className="font-medium">
          Registered Office: 105/5B, Dum Dum Road, Kolkata: 700074
        </p>
        <p className="mt-1">
          Phone Number: 7278848863
        </p>
      </div>
    </div>
  );
};

export default ContactUs;