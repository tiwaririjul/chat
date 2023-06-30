import React, { useEffect, useState } from "react";
import Avatar from "../../assets/avatar1.jpg";
import Input from "../../components/Input/Index";
import axios from "axios";
import { io } from "socket.io-client";
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
  ];
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io(`http://localhost:4000`));
  }, []);

  // useEffect(() => {
  //   const socket = io("http://localhost:3000"); // Replace with your server URL

  //   socket.on("connect", () => {
  //     console.log("Connected to Socket.io server");
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Disconnected from Socket.io server");
  //   });

  //   socket.on("chat message", (message) => {
  //     console.log("Received message:", message);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    const loggenInUser = JSON.parse(localStorage.getItem("UserDetail"));
    //  console.log(loggenInUser);
    const fetchConversations = async () => {
      const res = await axios.get(
        `http://localhost:8000/api/conversation/${loggenInUser.id}`
      );
      const resData = await res.data;
      setconversation(resData);
    };
    // console.log(conversation);
    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(
        `http://localhost:8000/api/users/${user?.id}`
      );

      const resData = await res.data;
      setUsers(resData);
    };
    fetchUsers();
  }, []);

  const [user, setuser] = useState(
    JSON.parse(localStorage.getItem("UserDetail"))
  );
  const [conversation, setconversation] = useState([]);
  const [msg, sendmsg] = useState("");
  const [messages, setMessages] = useState({});

  const fetchMessages = async (conversation_id, receiver) => {
    console.log("message ", messages);
    // console.log("Conversation ", <conversation_i></conversation_i>d);
    // const res = await axios.get(
    //   `http://localhost:8000/api/message/${conversation_id}`
    // );
    // console.log(res);
    // const resData = await res.data;
    // setMessages({ messages: resData, receiver: user, conversation_id });
    // console.log(messages);
    // console.log("message ", messages);
    // ----------------------------------------------
    const res = await fetch(
      `http://localhost:8000/api/message/${conversation_id}?senderId=${user.id}&&receiverId=${receiver.receiverId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    setMessages({ messages: resData, receiver, conversation_id });
  };
  const SendMessage = async (e) => {
    // const res = await fetch("http://localhost:8000/api/message", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     conversationId: messages.conversation_id,
    //     senderId: user.id,
    //     message: msg,
    //     receiverId: messages.receiver.id,
    //   }),
    // });
    // console.log("res ", res);
    // const response = await res.data;
    // console.log("response ", response);
    // sendmsg("");

    const res = await axios.post("http://localhost:8000/api/message", {
      conversationId: messages.conversation_id,
      senderId: user.id,
      message: msg,
      receiverId: messages.receiver.receiverId,
    });

    console.log("res ", res.data);
    sendmsg("");
  };
  return (
    <div className="w-screen flex">
      <div className="w-[25%] h-screen bg-secondary">
        <div className="flex items-center my-8 mx-14">
          <div className="border border-primary p-[2px] rounded-full">
            <img src={Avatar} width={70} heigth={70} />
          </div>
          <div className="ml-8">
            <h3 className="text-2xl">{user.fullName}</h3>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>
        <hr />
        <div className="mx-14 mt-10">
          <div className="text-primary text-lg">Messages</div>
          <div>
            {conversation.length > 0 ? (
              conversation.map(({ conversationId, user }) => {
                return (
                  <div className="flex items-center py-8 border-b border-b-gray-300">
                    <div
                      className="cursor-pointer flex item-center"
                      onClick={() => {
                        fetchMessages(conversationId, user);
                      }}
                    >
                      <div className="border border-primary p-[2px] rounded-full">
                        <img src={Avatar} width={50} heigth={50} />
                      </div>
                      <div className="ml-8">
                        <h3 className="text-xl font-semibold">
                          {user.fullName}
                        </h3>
                        {/* <p className="text-lg font-light text-gray-600">
                            {user.email}
                          </p> */}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Conversation
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[50%] h-screen bg-white flex flex-col items-center">
        {messages?.receiver?.fullName && (
          <div className="w-[75%] bg-secondary h-[80px] my-14 rounded-full flex items-center px-14 py-2">
            <div className="cursor-pointer">
              {" "}
              <img src={Avatar} width={50} heigth={50} />
            </div>
            <div className="ml-6 mr-auto">
              <h3 className="text-lg">{messages?.receiver?.fullName}</h3>
              <p className="text-sm font-light text-gray-600">
                {messages?.receiver?.email}
              </p>
            </div>
            <div className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-phone-outgoing"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="black"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                <path d="M15 9l5 -5" />
                <path d="M16 4l4 0l0 4" />
              </svg>
            </div>
          </div>
        )}
        <div className="h-[75%]  w-full overflow-scroll  shadow-md">
          <div className=" p-14">
            {/* <div className="max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 m-6">
              Lorem ipsum dolor sit amet consectetur adipisicing
            </div>
            <div className="max-w-[40%] bg-primary rounded-b-xl rounded-tr-xl ml-auto p-4 text-white mb-6">
              Lorem ipsum dolor sit amet consectetur adipisicing
            </div> */}
            {messages?.messages?.length > 0 ? (
              messages.messages.map(({ message, user: { id } = {} }) => {
                // console.log(message);
                if (id == user.id) {
                  return (
                    <div className="max-w-[40%] bg-primary rounded-b-xl rounded-tr-xl ml-auto p-4 text-white mb-6">
                      {message}
                    </div>
                  );
                } else {
                  return (
                    <div className="max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 m-6">
                      {message}
                    </div>
                  );
                }
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Messages or Conversation Found..
                <p className="text-lg font-light text-gray-600">
                  Select Account to Start Messaging..
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="p-14 w-full flex items-center">
          <Input
            placeholder="Type a message"
            value={msg}
            onChange={(e) => sendmsg(e.target.value)}
            className="w-[75%]"
            inputClassname="p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none"
          />
          <div
            className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${
              !msg && "pointer-events-none"
            }`}
            onClick={() => SendMessage()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-send"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 14l11 -11" />
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
            </svg>
          </div>
          <div className="ml-4 p-2 cursor-pointer bg-light rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-circle-plus"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M9 12l6 0" />
              <path d="M12 9l0 6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="w-[25%] h-screen bg-light px-8 py-16">
        <div className="text-primary text-lg">people</div>
        <div>
          {users.length > 0 ? (
            users.map(({ userId, user }) => {
              return (
                <div className="flex items-center py-8 border-b border-b-gray-300">
                  <div
                    className="cursor-pointer flex item-center"
                    onClick={() => {
                      fetchMessages("new", user);
                    }}
                  >
                    <div className="border border-primary p-[2px] rounded-full">
                      <img src={Avatar} width={50} heigth={50} />
                    </div>
                    <div className="ml-8">
                      <h3 className="text-xl font-semibold">{user.fullName}</h3>
                      <p className="text-lg font-light text-gray-600">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-lg font-semibold mt-24">
              No Conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
