import React from "react";

const Input = ({
  lable = "",
  name = "",
  type = "text",
  className = "",
  inputClassname='',
  isRequired = true,
  placeholder = "",
  value = '',
  onChange = () => { },
}) => {
  return (
    <div className={`${className}`}>
      <label for={name} className="block text-sm font-medium text-gray-800">
        {lable}
      </label>
      <input
        type={type}
        id={name}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  block w-full p-2.5 ${inputClassname}`}
        placeholder={placeholder}
        required={isRequired}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
