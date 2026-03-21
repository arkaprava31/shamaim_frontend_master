import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../app/constants";
import { useAlert } from "react-alert";
import GridLoader from "../../../app/GridLoader";

const ContactUs = () => {
  const navigate = useNavigate();
  const alert = useAlert();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.query.trim()) {
      newErrors.query = "Please enter your concern";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Remove error while typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!validate()) return;

    try {
      let response = await fetch(`${baseUrl}/contactus`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert.success(
          "Your query has been submitted successfully, our team will reach out to you shortly!"
        );
        navigate("/");
        setLoading(false);
      } else {
        alert.error("Something went wrong. Please try again!");
        setLoading(false);
      }
    } catch (error) {
      alert.error("Server error. Please try again later!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-6 sm:px-6 lg:px-8">

      <div className="mb-8 mt-6 lg:mt-0 text-center">
        <h1 className="text-4xl font-semibold text-gray-900">
          Contact Us
        </h1>
        <p className="text-base text-indigo-600 mt-1">
          We'd love to hear from you
        </p>
      </div>

      {
        loading ? <GridLoader bgHeight="h-[50vh]" /> :
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
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition text-sm"
                />
                {errors.name && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.name}
                  </span>
                )}
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
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition text-sm"
                />
                {errors.email && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.email}
                  </span>
                )}
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
                         focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition text-sm resize-none"
                />
                {errors.query && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.query}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600
                       py-3 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Submit
              </button>
            </form>
          </div>
      }

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