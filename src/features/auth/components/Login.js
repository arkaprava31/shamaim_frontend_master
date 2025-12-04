import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { baseUrl } from "../../../app/constants";
import GoogleLoginButton from "./GoogleLoginButton";
import { selectLoggedInUser,getOtpResponce,fetchAuthStatus } from "../authSlice";
import { LoginPopUp } from "./loginPop";
import { OtpVerification } from "./otpVerificationPopUp";
import { useEffect, useState } from "react";
export default function Login() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState("false");

  const otpResponce = useSelector(selectLoggedInUser);
  const data=useSelector(getOtpResponce);
   
  useEffect(()=>{
    dispatch(fetchAuthStatus());
  },[dispatch,otpResponce])

  return (
    <>
      {otpResponce && <Navigate to="/" replace={true}></Navigate>}
      <div className="">
        <div className=" relative">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/homepage%20video%2FLanding%20page%20c%201.png?alt=media&token=483abd31-dea2-482a-8c78-d72adbaceb37"
            className=" w-screen h-full"
          />
          {data == "OTP sent successfully" ? (
            <div className=" absolute  -bottom-4">
              <OtpVerification setIsOpen={setIsOpen} />
            </div>
          ) : (
            <div className=" absolute  -bottom-4">
              <LoginPopUp />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
