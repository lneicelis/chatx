function Client() {
  this.socket = io.connect(`http://185.5.54.166:${port}`, {
    query: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyY2VmZmJiYS1kYTAxLTRmZjctYTA3NC0wNWI4YTUyNDRmYTMiLCJpYXQiOjE0Njc3NDIzNzF9.HEAZ0R588Q8Ww0XnxixT4V6lLsPwpg6QWm0ue8g4tqg'
  });

  this.socket.on('action', action => {
    console.log('S2C ACTION', action);
  });
}

Client.prototype.send = function (actionType, payload) {
  this.socket.emit('action', {
    type: actionType,
    payload: payload
  })
};