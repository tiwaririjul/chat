import React from "react";
import Avatar from "../../assets/avatar1.jpg";

const DashBoard = () => {
  const contacts = [
    {
      name: "Dhoni",
      status: "Available",
      img: Avatar,
    },
    {
      name: "Virat",
      status: "Available",
      img: Avatar,
    },
    {
      name: "Sachin",
      status: "Available",
      img: Avatar,
    },
    {
      name: "Yuvraj",
      status: "Available",
      img: Avatar,
    },
    {
      name: "Kapil Dev",
      status: "Available",
      img: Avatar,
    },
  ];
  return (
    <div className="w-screen flex">
      <div className="w-[25%] h-screen bg-secondary">
        <div className="flex items-center my-8 mx-14">
          <div className="border border-primary p-[2px] rounded-full">
            <img src={Avatar} width={70} heigth={70} />
          </div>
          <div className="ml-8">
            <h3 className="text-2xl">Chat With</h3>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>
        <hr />
        <div className="mx-14 mt-10">
          <div className="text-primary text-lg">Messages</div>
          <div>
            {contacts.map(({ name, status, img }) => {
              return (
                <div className="flex items-center py-8 border-b border-b-gray-300">
                  <div className="cursor-pointer flex item-center">
                    <div className="border border-primary p-[2px] rounded-full">
                      <img src={img} width={50} heigth={50} />
                    </div>
                    <div className="ml-8">
                      <h3 className="text-xl font-semibold">{name}</h3>
                      <p className="text-lg font-light text-gray-600">
                        {status}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-[50%] border border-black h-screen"></div>
      <div className="w-[25%] border border-black h-screen"></div>
    </div>
  );
};

export default DashBoard;
