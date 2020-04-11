import React, { useState, useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD2KCjdds6S99QiRIlMWd4pfv8n14vhbvM",
  authDomain: "deduce-chat.firebaseapp.com",
  databaseURL: "https://deduce-chat.firebaseio.com",
  projectId: "deduce-chat",
  storageBucket: "deduce-chat.appspot.com",
  messagingSenderId: "1097746995795",
  appId: "1:1097746995795:web:65419f51731006db8584a6",
  measurementId: "G-KV6BJD90PY",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function App() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState({});
  const [scrolled, setScrolled] = useState(false);

  const chatRoom = db.ref().child("chatrooms").child("global");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current && !scrolled) {
      console.log(scrolled, "qweqweqwe");
      messagesEndRef.current.scrollIntoView();
    }
  };
  useEffect(scrollToBottom, [messages]);
  useEffect(() => {
    const handleNewMessages = (snap) => {
      if (snap.val()) {
        setMessages(snap.val());
      }
    };
    chatRoom.on("value", handleNewMessages);
    return () => {
      chatRoom.off("value", handleNewMessages);
    };
  });

  const handleNameChange = (e) => setNickname(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleClick = (e) => {
    db.ref().child("nicknames").push({
      nickname,
      email,
    });
    setJoined(true);
  };

  const handleMsgChange = (e) => setMsg(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      chatRoom.push({
        sender: nickname,
        msg,
      });
      setMsg("");
    }
  };

  return (
    <div className="App">
      {!joined ? (
        <div className="joinForm">
          <input
            placeholder="Nickname"
            value={nickname}
            onChange={handleNameChange}
          />
          <br />
          <input
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <br />
          <button onClick={handleClick}>Join</button>
        </div>
      ) : (
        <div className="chat">
          <div
            className="messages"
            onWheel={(e) => {
              setScrolled(true);
            }}
          >
            {Object.keys(messages).map((message) => {
              if (messages[message]["sender"] === nickname)
                return (
                  <div className="message">
                    <span id="me">{messages[message]["sender"]} :</span>
                    <br />
                    {messages[message]["msg"]}
                  </div>
                );
              else
                return (
                  <div className="message">
                    <span id="sender">{messages[message]["sender"]} :</span>
                    <br />
                    {messages[message]["msg"]}
                  </div>
                );
            })}
            <div ref={messagesEndRef} />
          </div>
          {scrolled ? (
            <button
              id="scrollbutton"
              onClick={(e) => {
                setScrolled(false);
              }}
            >
              Scroll to bottom
            </button>
          ) : (
            ""
          )}
          <input
            placeholder="msg"
            onChange={handleMsgChange}
            onKeyDown={handleKeyDown}
            value={msg}
          />
          <br />
        </div>
      )}
    </div>
  );
}
export default App;
