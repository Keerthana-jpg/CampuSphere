document.getElementById('discussionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    
    if (name && message) {
      const discussionList = document.getElementById('discussionList');
      
      const listItem = document.createElement('li');
      listItem.innerHTML = <strong>${name}:</strong> ${message};
      
      discussionList.appendChild(listItem);
  
      // Clear the form
      document.getElementById('discussionForm').reset();
    }
  });