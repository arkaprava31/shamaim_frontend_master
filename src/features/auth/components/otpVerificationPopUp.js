import { useState, useEffect } from "react";
import { VarifyOtp, getEmail } from "../authSlice"; // Adjust action imports
import { useDispatch } from "react-redux";

export const OtpVerification = ({ setIsOpen }) => {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const [resendCooldown, setResendCooldown] = useState(0);
    const dispatch = useDispatch();
  
    // Update OTP
    const handleOtpChange = (value, index) => {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    };
  
    // Verify OTP
    const handleVerification = () => {
      const otpValue = otp.join("");
      dispatch(VarifyOtp({ email, otp: otpValue }));
    };
  
    // Resend OTP with Cooldown
    const handleResendOtp = async () => {
      if (resendCooldown === 0) {
        await dispatch(getEmail(email));
        setResendCooldown(30); // Cooldown time
      }
    };
  
    // Cooldown Timer
    useEffect(() => {
      if (resendCooldown > 0) {
        const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [resendCooldown]);
  
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
        <div className=" relative top-96 md:top-0 bg-white w-full max-w-sm p-6 rounded-xl shadow-lg md:max-w-md">
          <p className="text-xl font-semibold text-gray-800 text-center">OTP Verification</p>
  
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">We have sent a verification code to</p>
            <p className="text-sm text-gray-800 font-medium">
              {email}{" "}
              <span
                className="text-blue-500 cursor-pointer font-semibold"
                onClick={() => setIsOpen(true)}
              >
                Edit
              </span>
            </p>
          </div>
  
          <div className="flex justify-center gap-2 mt-5">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-10 h-12 border text-center rounded-md text-lg"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
              />
            ))}
          </div>
  
          <p
            className={`mt-4 text-sm font-semibold text-blue-500 cursor-pointer ${
              resendCooldown > 0 && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleResendOtp}
          >
            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
          </p>
  
          <button
            className="mt-6 w-full h-12 bg-blue-500 text-white rounded-md text-lg font-semibold hover:bg-blue-600"
            onClick={handleVerification}
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  };
  