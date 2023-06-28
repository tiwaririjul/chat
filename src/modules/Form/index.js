import React, { useState } from "react";
import Input from "../../components/Input/Index";
import axios from "axios"
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
const Form = ({ isSignInPage }) => {
  const [data, setdata] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Heloo');
    console.log("data", data);
    const res = await axios.post(`http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`, { data })
    console.log(res);
    if (res.status == 400) {
      alert("Invalid Credentials")
    } else {
      const resData = await res.data
      if (resData.token) {
        localStorage.setItem('UserToken', resData.token)
        localStorage.setItem('UserDetail', JSON.stringify(resData.user))
        navigate('/');
      }
    }

    // console.log('Data >> ', resData);
  }

  return (
    <div className="bg-light h-screen flex justify-center items-center">
      <div className="bg-white w-[500px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className="text-4xl font-extrabold">
          Welcome {isSignInPage && "Back"}
        </div>
        <div className=" text-xl font-light mb-14">
          {isSignInPage ? "Sign in to get Explored" : "Sign up to get started"}
        </div>
        <form
          className="flex flex-col items-center w-full"
          onSubmit={(e) => { handleSubmit(e) }}
        >
          {!isSignInPage && (
            <Input
              lable="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              className="mb-6 w-[70%]"
              value={data.fullName}
              onChange={(e) => setdata({ ...data, fullName: e.target.value })}
            />
          )}
          <Input
            lable="Email address"
            name="email"
            placeholder="Enter your email"
            className="mb-6 w-[70%]"
            value={data.email}
            onChange={(e) => setdata({ ...data, email: e.target.value })}
          />
          <Input
            lable="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            className="mb-12 w-[70%]"
            value={data.password}
            onChange={(e) => setdata({ ...data, password: e.target.value })}
          />
          <Button
            label={isSignInPage ? "Sign in" : " Sign up"}
            className="w-[75%] mb-2"
            type="submit"
          />
        </form>
        <div>
          {" "}
          {isSignInPage
            ? "Don't have an account ?"
            : "Already have an accouny ?"}{" "}
          <span
            className="text-primary cursor-pointer underline"
            onClick={() =>
              navigate(`/users/${isSignInPage ? "sign_up" : "sign_in"}`)
            }
          >
            {isSignInPage ? "Sign up" : " Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Form;
