import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadIntveral;

function loader(element){
  element.textContent = '';
  loadIntveral = setInterval(() => {
    element.textContent += '.';

    if(element.textContent === '....'){
      element.textContent = '';
    }

  }, 300)
}

function typeText(element, text){
  let index = 0; 
  let interval = setInterval(() => {
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }
    else{
      clearInterval(interval);
    }
  }, 19)
}

function generateUniqueID(){
  const timeStamp = Date.now();
  const rand = Math.random();
  const hexDecimalString = rand.toString(16);

  return `id-${timeStamp}-${hexDecimalString}`;
}

function chatStripe(isAI, value, uniqueID){
  return(
    `
       <div class = "wrapper ${isAI && 'ai'}">
        <div class = "chat">
          <div class = "profile">
            <img src = "${isAI ? bot : user}" alt = "${isAI ? "bot" : "user "}"
            />
          </div>
          <div class = "message" id = ${uniqueID}> ${value} </div>
        </div>
       </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  //generate user's chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  //generate bot's chat stripe
  const uniqueID = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueID);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueID);
  loader(messageDiv);

  //fetch data from server (bot's response)

  const response = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: data.get('prompt')
      })
  })

  clearInterval(loadIntveral);
  messageDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  }
  else{
    const error = await response.text();
    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13)
  handleSubmit(e);
})