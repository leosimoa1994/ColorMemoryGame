import React, { useState, useEffect } from "react";

// Valor inicial cores a memorizar
const ARRAYCOLORS_START = 3;

function App() {
  //valores iniciais
  const [colors, setColors] = useState([]);
  const [userColors, setUserColors] = useState([]);
  const [start, setStart] = useState(false);
  const [plays, setPlays] = useState(1);
  const [level, setlevel] = useState(1);
  const [arrayStart, setArrayStart] = useState(ARRAYCOLORS_START);
  const [score, setScore] = useState(
    localStorage.getItem("score") === null ? 0 : localStorage.getItem("score")
  );
  const [state, setState] = useState(false);
  // array de cores Random
  let randomColors = [];
  // Variavel de Som
  let audio;

  //localStorage.setItem("score", 0);

  //função de para ligar as cores
  const colorsOn = (colorsArray, idArray, timeOn, timeOff, count = 1) => {
    //liga o a div
    document.getElementById(colorsArray[idArray]).style = "opacity: 1;";
    //vai buscar o som e faz play
    audio = document.getElementById(`Audio${colorsArray[idArray]}`);
    audio.play();

    //cria um timeout em que para um som e apaga a cor
    //se o count é menor que o array de cores corre a função outra vez com o count + 1 e o idArray + 1
    setTimeout(function () {
      audio.pause();
      audio.currentTime = 0;
      document.getElementById(colorsArray[idArray]).style = "opacity: 0.3;";
      if (count < colorsArray.length) {
        setTimeout(() => {
          colorsOn(colorsArray, idArray + 1, timeOn, timeOff, count + 1);
        }, timeOff);
      }
    }, timeOn);

    //se o count é igual ao array de cores guarda as cores no array principal
    if (count === colorsArray.length) {
      setColors([...colorsArray]);
    }
  };

  //função para ir buscar as cores e se já há cores no array principal adiciona uma cor
  const getcolors = (arraycolors, timeOn, timeOff, length, count) => {
    let color;

    setState(false);
    //se o length é maior que 0 adiciona mais um elemento ao array principal
    if (length > 0) {
      let tempArray = [];
      for (let i = count; i <= arraycolors; i++) {
        color = Math.floor(Math.random() * 4) + 1;
        tempArray.push(color);
      }
      randomColors = [...colors, ...tempArray];
    }
    //se o length é menor ou igual a 0 cria as primeiras 3 cores
    else {
      for (let i = 1; i <= arraycolors; i++) {
        color = Math.floor(Math.random() * 4) + 1;
        randomColors.push(color);
      }
    }
    colorsOn(randomColors, 0, timeOn, timeOff);
  };

  // verifica se o utilizador pode jogar
  useEffect(() => {
    if (arrayStart === colors.length) {
      setTimeout(() => {
        setStart(true);
        setState(true);
      }, 1000);
    }
  }, [colors]);

  //verifica a jogada do utilizador com a do array principal e verifica se ganhou ou nao
  const compareColors = (id) => {
    setStart(false);
    setPlays((prejogada) => prejogada + 1);
    document.getElementById(id).style = "opacity: 1;";
    let audio = document.getElementById(`Audio${id}`);
    audio.play();
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      document.getElementById(id).style = "opacity: 0.3;";
      let index = userColors.length;
      if (colors[index] === id) {
        setUserColors((prevUserColors) => {
          return [...prevUserColors, id];
        });
        setStart(true);
        if (plays === arrayStart) {
          document.getElementById(id).style = "opacity: 0.3;";
          //alert("Congratulations you go to the next level");
          setUserColors([]);
          setStart(false);
          setPlays(1);
          setlevel((prevLevel) => prevLevel + 1);
          setArrayStart(ARRAYCOLORS_START + level);
          if (score < level) {
            localStorage.setItem("score", level);
            setScore(level);
          }
          setTimeout(() => {
            getcolors(
              ARRAYCOLORS_START + level,
              500,
              500,
              ARRAYCOLORS_START + level,
              ARRAYCOLORS_START + level
            );
          }, 1000);
        }
      } else {
        //alert("You failed, try again!!!");
        setColors([]);
        setUserColors([]);
        setStart(false);
        setPlays(1);
        setlevel(1);
        setArrayStart(ARRAYCOLORS_START);
        setTimeout(() => {
          getcolors(ARRAYCOLORS_START, 500, 500, 0);
        }, 1000);
      }
    }, 500);
  };

  return (
    <div className="bodyGame">
      <div className="info">
        <span className="level">Score: {score}</span>
        <span className="level">Level: {level}</span>
      </div>
      <span className="level">
        {state === false ? `Pay Attention` : `It's your turn`}
      </span>
      <div className="board">
        <div className="top">
          {start === false ? (
            <div className="squad yellow" id="1"></div>
          ) : (
            <div
              className="squad yellow"
              id="1"
              onClick={() => {
                compareColors(1);
              }}
            ></div>
          )}
          {start === false ? (
            <div className="squad red" id="2"></div>
          ) : (
            <div
              className="squad red"
              id="2"
              onClick={() => {
                compareColors(2);
              }}
            ></div>
          )}
        </div>
        <div className="bottom">
          {start === false ? (
            <div className="squad blue" id="3"></div>
          ) : (
            <div
              className="squad blue"
              id="3"
              onClick={() => {
                compareColors(3);
              }}
            ></div>
          )}
          {start === false ? (
            <div className="squad green" id="4"></div>
          ) : (
            <div
              className="squad green"
              id="4"
              onClick={() => {
                compareColors(4);
              }}
            ></div>
          )}
        </div>
        <div className="center"></div>
      </div>
      <button
        className="buttonStart"
        id="buttonStart"
        onClick={() => {
          document.getElementById("buttonStart").disabled = true;
          getcolors(arrayStart, 500, 500, 0);
        }}
      >
        Start
      </button>
    </div>
  );
}

export default App;
