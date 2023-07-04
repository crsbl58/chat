import io from "socket.io-client";

import { useEffect, useState, useRef } from "react";
import imgMsgSvg from "./img/talking_icon.svg";
import imgUserSvg from "./img/profile.svg";
import "./App.css";
import "./constant.css";
let socket = io("http://localhost:3001/", {
  transportOptions: {
    polling: {
      extraHeaders: {
        'id': 'bf43916b-fb1c-4a4c-8d3c-c73ebe4dbf39',
      },
    },
  },
});
/* let socket = io("https://chatbackend00.osc-fr1.scalingo.io"); */

function App() {
  const containerRef = useRef(null);

  const [messengersUsers, setMessengersUsers] = useState([{}]);

  const [colorCode] = useState([
    { codecolor: "#3a6c94" },
    { codecolor: "brown" },
    { codecolor: "coral" },
    { codecolor: "blueviolet" },
    { codecolor: "rgb(107, 107, 52)" },
    { codecolor: "rgb(40, 129, 120)" },
    { codecolor: "tomato" },
    { codecolor: "teal" },
    { codecolor: "slateblue" },
    { codecolor: "sienna" },
    { codecolor: "crimson" },
    { codecolor: "darkgreen" },
  ]);

  const [stateComboBox, setStateComboBox] = useState(false);
  const [stateColor, setStateColor] = useState({ stateColor: "#3a6c94" });
  const [inputUser, setInputUser] = useState({
    inputUserName: "",
    inputMessenger: "",
  });
  const [stateChat, setStateChat] = useState(false);
  const [stateCount, setStateCount] = useState(0);

  const changeValueInputId = (e) => {
    setInputUser({
      ...inputUser,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const ComboBoxColor = ({ hookColorCode, stateComboBox, hookStateColor }) => {
    return (
      <div className="divContainerComboBoxColor00 flexColumn">
        <div
          onClick={() => {
            if (stateComboBox[0] === true) {
              stateComboBox[1](false);
            } else {
              stateComboBox[1](true);
            }
          }}
          style={{ backgroundColor: hookStateColor[0].stateColor }}
          className="divContainerColorSelection00"
        ></div>
        <div
          className="divContainerComboBoxColor01"
          style={stateComboBox[0] ? { display: "block" } : { display: "none" }}
        >
          {hookColorCode.map((list) => {
            return (
              <div
                onClick={() => {
                  hookStateColor[1]({ stateColor: list.codecolor });
                  stateComboBox[1](false);
                }}
              >
                <div style={{ backgroundColor: list.codecolor }}></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    socket.on("messagesUsers", (messengersUsers) => {
      setMessengersUsers(messengersUsers);
    });
  }, []);

  useEffect(() => {
    socket.on("updateNumConnections", (countUser) => {
      setStateCount(countUser);
    });
  }, []);

  useEffect(() => {
    let totalHeightScroll =
      containerRef.current.scrollHeight - containerRef.current.offsetHeight;
    containerRef.current.scrollTop = totalHeightScroll;
  }, [messengersUsers]);

  return (
    <div className="App">
      <header>
        <img src={imgMsgSvg}></img>
        <h1>Chat publico en proceso</h1>
      </header>
      <main>
        <div className="divContainerChat00 flexColumn">
          <div className="divContainerChat01">
          <div><img src={imgUserSvg}></img><h1>{stateCount}</h1></div>  
            <form
              className="flexRow"
              onSubmit={(e) => {
                e.preventDefault();

                /*      let stateName = messengersUsers.filter(
                  (list) => list.name === inputUser.inputUserName
                ); */
              }}
            >
              <h3>Usuario</h3>
              <div>
                <input
                  style={{ color: stateColor.stateColor }}
                  name="inputUserName"
                  onChange={changeValueInputId}
                  value={inputUser.inputUserName}
                ></input>
                <ComboBoxColor
                  hookStateColor={[stateColor, setStateColor]}
                  hookColorCode={colorCode}
                  stateComboBox={[stateComboBox, setStateComboBox]}
                />
              </div>
            </form>
          </div>
          <div ref={containerRef} className="divContainerChat02 flexColumn">
       {/*      {messengersUsers.map((messengers) => {
              return (
                <div>
                  <h4 style={{ color: messengers.colorCode }}>
                    {messengers.name}
                  </h4>
                  <p>{messengers.message}</p>
                </div>
              );
            })} */}
          </div>
          <div className="divContainerChat03">
            <form
              className="flexRow"
              onSubmit={(e) => {
                e.preventDefault();

                if (inputUser.inputUserName.length > 3 && inputUser.inputMessenger.length > 0) {
                  socket.emit("sendMessages", {
                    colorCode: stateColor.stateColor,
                    name: inputUser.inputUserName,
                    message: inputUser.inputMessenger,
                  });
                } else {
                  alert("usuario debe ser mayor a 3 caracteres o falta escribir mensaje");
                }

                setInputUser({ ...inputUser, inputMessenger: "" });
              }}
            >
              <input
                readOnly={stateChat}
                name="inputMessenger"
                onChange={changeValueInputId}
                value={inputUser.inputMessenger}
              ></input>
              <button></button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
