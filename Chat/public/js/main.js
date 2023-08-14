const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const groupName = document.getElementById('group-name');
const userList = document.getElementById('users');

const { username, group } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit('joinGroup', { username, group });

socket.on('groupUsers',({group, users}) => {
    outputGroupName(group);
    outputUsers(users)
});

socket.on('message',(message)=> {
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    let message = e.target.elements.message.value;

    message = message.trim();

    if (!message){
        return false;
    }

    socket.emit('chatMessage', message);

    e.target.elements.message.value = '';
    e.target.elements.message.focus();
});

function  outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
  
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    
    document.querySelector('.chat-messages').appendChild(div);
}

function outputGroupName(group) {
    groupName.innerText = group;
  }

  function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }

  document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveGroup = confirm('Are you sure you want to leave?');
  
    if (leaveGroup) {
      window.location = '../index.html';
    }
  });