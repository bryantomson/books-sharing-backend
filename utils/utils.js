const formatConversations = (username, messages) => {
  if (!username.length || !messages.length) {
    return [];
  }

  const conversations = [];
  const conversationsWith = [];

  messages.forEach((message) => {
    const person = message.between.filter((user) => user !== username)[0];
    if (!conversationsWith.includes(person)) {
      conversationsWith.push(person);
    }
  });

  conversationsWith.forEach((person) => {
    const messagesWithThatPerson = messages.filter((message) => {
      return message.between.includes(person);
    });
    const mostRecentTimestamp = messagesWithThatPerson.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    })[0].timestamp;
    conversations.push({
      with: person,
      timestamp: mostRecentTimestamp,
    });
  });

  conversations.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return conversations;
};

module.exports = { formatConversations };
