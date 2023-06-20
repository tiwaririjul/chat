import React from "react";
import Input from "../../components/Input/Index";

const Form = () => {
  return (
    <div className="bg-white w-[450px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
      <div className="text-4xl font-extrabold">Welcome</div>
      <div className=" text-xl font-light mb-14">
        Sign up now to get started
      </div>
      <Input
        lable="Full Name"
        name="name"
        placeholder="Enter your full name"
        className="mb-6"
      />
      <Input
        lable="Email address"
        name="email"
        placeholder="Enter your email"
        className="mb-6"
      />
      <Input
        lable="password"
        type="password"
        name="password"
        placeholder="Enter your password"
        className="mb-6"
      />
    </div>
  );
};

export default Form;
