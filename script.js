// Your existing functions here

function setupPrivateChatListener() {
  const privateChatRef = database.ref('privateChats');
  privateChatRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    displayMessage('privateChat', message);
  });
}

setupPrivateChatListener();
