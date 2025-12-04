import { useState } from "react";
import { getEmail } from "../authSlice";
import { useDispatch } from "react-redux";
import GoogleLoginButton from "./GoogleLoginButton";
import { OtpVerification } from "./otpVerificationPopUp"; // Import OTP Verification

export const LoginPopUp = () => {
  const [email, setEmail] = useState("");
  const [isOtpVisible, setIsOtpVisible] = useState(false); // Track OTP visibility
  const dispatch = useDispatch();

  const handleLogin = async () => {
    await dispatch(getEmail(email));
    localStorage.setItem("email", email); // Store email dynamically
    setIsOtpVisible(true); // Show OTP Verification
  };

  return (
    <div className="relative top-96 md:top-0 w-screen h-screen flex justify-center items-center bg-gray-100">
      {isOtpVisible ? (
        <OtpVerification /> 
      ) : (
        <div className=" bg-white w-full max-w-sm p-6 rounded-t-3xl shadow-lg md:max-w-md">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xl font-bold text-gray-800">Login / Signup</p>
              <p className="text-sm text-gray-600">
                Join us now to be a part of the Shamaim family.
              </p>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <input
                type="email"
                value={email}
                placeholder="Enter your email address"
                className="h-12 p-3 border rounded-md text-gray-800"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="w-full h-12 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600"
                onClick={handleLogin}
              >
                CONTINUE
              </button>
            </div>
            <p className="text-center text-gray-500">or</p>
            <div className="flex justify-center">
              <GoogleLoginButton />
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              By creating an account or logging in, you agree with Shamaim's{" "}
              <span className="text-blue-500">Terms and Conditions</span> and{" "}
              <span className="text-blue-500">Privacy Policy</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
