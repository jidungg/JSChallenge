const API_KEY = "8cddd2c239a27606ee80045cfa21d01d";

const body = document.querySelector("body");

const userName = document.getElementById("userName");
const nameForm = document.getElementById("nameForm");

const geoLocation = document.getElementById("geoLocation");
const weather = document.getElementById("weather");

const clock = document.getElementById("clock");
let time = new Date();
let hour;
let minuite;
let second;

const pendingBox = document.getElementById("pending");
const finishedBox = document.getElementById("finished");
const inputForm = document.querySelector(".inputform");
const input = document.querySelector("input");

let pendingList = [];
let finishedList = [];
let maxPendingId=0;
let maxFinishedId =0;

function createTask(text,finished) {
  const span = document.createElement("span");
  span.innerText = text;
  const btn1 = document.createElement("button");
  btn1.innerText = "X";
  btn1.addEventListener("click", XBtnHandler);
  const btn2 = document.createElement("button");
  if(finished === true){
    btn2.innerText = "<<";
    btn2.addEventListener("click", revertBtnHandler);
  }else{
    btn2.innerText = "O";
    btn2.addEventListener("click", OBtnHandler);
  }
  const li = document.createElement("li");
  li.appendChild(span);
  li.appendChild(btn1);
  li.appendChild(btn2);

  return li;
}

function removeTask(li,finished){
  if(finished){
    const cleanedList = finishedList.filter(function(task) {
      return task.id !== li.id;
    });
    finishedList = cleanedList;
    localStorage.setItem("finishedList", JSON.stringify(finishedList));
    finishedBox.removeChild(li);
  }else{
    const cleanedList = pendingList.filter(function(task) {
      return task.id !== li.id;
    });
    pendingList = cleanedList;
    localStorage.setItem("pendingList", JSON.stringify(pendingList));
    pendingBox.removeChild(li);
  }

}

function addTask(text,finished) {
  if(finished){
    const li = createTask(text,finished);
    li.id = maxFinishedId++;
    finishedBox.appendChild(li);
    finishedList.push({ text: text, id: li.id });
    localStorage.setItem("finishedList", JSON.stringify(finishedList));
  }else{
    const li = createTask(text,finished);
    li.id = maxPendingId++;
    pendingBox.appendChild(li);
    pendingList.push({ text: text, id: li.id });
    localStorage.setItem("pendingList", JSON.stringify(pendingList));
  }
}

function XBtnHandler(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const section = li.parentNode;
  removeTask(li,section.id === "finished");

}

function OBtnHandler(event) {
  const btn = event.target;
  const li = btn.parentNode;
  removeTask(li,false);
  const text = li.querySelector("span").innerText;
  addTask(text,true);
}

function revertBtnHandler(event){
  const btn = event.target;
  const li = btn.parentNode;
  removeTask(li,true);
  const text = li.querySelector("span").innerText;
  addTask(text,false);
}


function inputHandler(event) {
  event.preventDefault();
  addTask(input.value);
}

function loadList() {
  let loadedList = localStorage.getItem("pendingList");
  if (loadedList !== null) {
    const parsedList = JSON.parse(loadedList);
    parsedList.forEach(function(task) {
      addTask(task.text,false);
    });
  }

  loadedList = localStorage.getItem("finishedList");
  if (loadedList !== null) {
    const parsedList = JSON.parse(loadedList);
    parsedList.forEach(function(task) {
      addTask(task.text,true);
    });
  }
}
function setTime(){
    time = new Date();
    hour = time.getHours();
    minuite = time.getMinutes();
    second = time.getSeconds();
    clock.innerText = ` ${hour}:${minuite}:${second}`;
}
function setName(){
    let name = localStorage.getItem("userName");
    if(name === null){
        const input = document.createElement("input");
        input.placeholder = "enter your name";
        nameForm.addEventListener("submit",function(){
            localStorage.setItem("userName", input.value)
        });
        nameForm.appendChild(input);
    }else{
        userName.innerText = name;
    }
}
function setBackground(){
    const image = new Image();
    image.src = "./image.png";
    image.classList.add("background");
    body.appendChild(image);
}

function locationSuccess(position){
    console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords ={
        latitude,
        longitude 
    };
    localStorage.setItem("geoLocation",JSON.stringify(coords) );
    geoLocation.innerText = coords;
    getWeather(coords.latitude,coords.longitude);
}
function loactionFailed(){
    console.log("location fail");
}
function getWeather(lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    ).then(function(response){
        return response.json();
    }).then(function(json){
        const temp = json.main.temp;
        const place = json.name;
        weather.innerText = `temperature: ${temp}, place: ${place}`;
    })
}
function setLocation(){
    let geolocation = localStorage.getItem("geoLocation");
    if(geolocation === null){
        navigator.geolocation.getCurrentPosition(locationSuccess,loactionFailed);
    }else{
        const parsedLocation = JSON.parse(geolocation);
        geoLocation.innerText = geolocation.toString();
        getWeather(parsedLocation.latitude,parsedLocation.longitude);
    }


}
function init() {
    setBackground();
    setName();
    setInterval(() => {
        setTime();
    }, 1000);
    setLocation();
    inputForm.addEventListener("submit", inputHandler);
    loadList();
}

init();