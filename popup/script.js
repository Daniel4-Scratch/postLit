fetch('https://www.postlit.dev/messages/count')
  .then(response => response.json())
  .then(data => console.log(data));