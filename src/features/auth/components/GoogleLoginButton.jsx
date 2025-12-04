import React, { useEffect } from "react";
import { baseUrl } from "../../../app/constants";
import { insertGoogleEmail } from "../authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
     
const GoogleLoginButton = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch(`${baseUrl}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
      });
  
      const data = await res.json();
  
      if (data) {
        const val = await dispatch(insertGoogleEmail({ email: data?.payload?.email })).unwrap();
         
        if(val?.data){
        navigate('/');
        }
      }
    } catch (error) {
      console.error("Error handling credential response:", error);
    }
  };
  

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "253251908610-1d8pm8fcsapoodmdpf4slat8a5eusrcg.apps.googleusercontent.com", 
      callback: handleCredentialResponse,
    },[]);

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      { theme: "outline", size: "large" } 
    );

    window.google.accounts.id.prompt(); 
  }, []);

  return <div id="google-login-button"></div>;
};

export default GoogleLoginButton;
