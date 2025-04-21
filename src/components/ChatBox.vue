<template>
  <div class="chat-box">
    <!-- Header with peer user info -->
    <header class="chat-header">
      <div class="peer-info">
        <img :src="currentPeerUser.photoURL" alt="user" class="peer-avatar" />
        <div class="peer-details">
          <h6>{{ currentPeerUser.name }}</h6>
          <span class="status">{{ currentPeerUser.status || 'Online' }}</span>
        </div>
      </div>
    </header>

    <!-- Messages area -->
    <div class="messages-container" ref="messagesContainer">
      <div v-if="listMessage.length === 0" class="no-messages">
        <p>No messages yet. Start the conversation!</p>
      </div>
      <div v-else class="messages-list">
        <div
          v-for="message in listMessage"
          :key="message.id"
          :class="['message', message.idFrom === currentUserId ? 'sent' : 'received']"
        >
          <div class="message-content">
            <p>{{ message.content }}</p>
            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Message input area -->
    <footer class="chat-footer">
      <form class="input-container" @submit.prevent="handleSend">
        <input
          type="text"
          v-model="inputValue"
          placeholder="Type a message..."
          class="message-input"
        />
        <button type="submit" class="send-button" :disabled="!inputValue.trim()">
          Send
        </button>
      </form>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import firebase from '../serviecs/firebase';
import moment from 'moment';

export default {
  name: 'ChatBox',
  props: {
    currentPeerUser: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const currentUserId = localStorage.getItem('id');
    const inputValue = ref('');
    const listMessage = ref([]);
    const messagesContainer = ref(null);

    const generateChatId = () => {
      const sortedIds = [currentUserId, props.currentPeerUser.id].sort();
      return `${sortedIds[0]}_${sortedIds[1]}`;
    };

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        setTimeout(() => {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }, 100);
      }
    };

    const loadMessages = async () => {
      try {
        const chatId = generateChatId();
        const messagesRef = collection(firebase.firestore, 'messages');
        const q = query(
          messagesRef,
          where('chatId', '==', chatId),
          orderBy('timestamp', 'asc')
        );

        // Clear existing messages
        listMessage.value = [];

        // First, get all existing messages
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          listMessage.value.push({
            id: doc.id,
            ...messageData,
          });
        });

        // Then set up real-time listener for new messages
        onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              // Check if message already exists to avoid duplicates
              const messageExists = listMessage.value.some(
                (msg) => msg.id === change.doc.id
              );
              if (!messageExists) {
                const message = {
                  id: change.doc.id,
                  ...change.doc.data(),
                };
                listMessage.value.push(message);
              }
            }
          });
          scrollToBottom();
        });

        // Initial scroll to bottom
        scrollToBottom();
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    const handleSend = async () => {
      if (!inputValue.value.trim()) return;

      try {
        const chatId = generateChatId();
        const messagesRef = collection(firebase.firestore, 'messages');

        const messageData = {
          chatId: chatId,
          content: inputValue.value.trim(),
          idFrom: currentUserId,
          idTo: props.currentPeerUser.id,
          timestamp: serverTimestamp(),
        };

        await addDoc(messagesRef, messageData);
        inputValue.value = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      if (timestamp.seconds) {
        return moment(timestamp.seconds * 1000).format('h:mm A');
      }
      return moment(timestamp).format('h:mm A');
    };

    // Watch for changes in currentPeerUser
    watch(
      () => props.currentPeerUser,
      () => {
        listMessage.value = []; // Clear previous messages
        loadMessages(); // Load messages for new peer
      },
      { immediate: true }
    );

    return {
      inputValue,
      listMessage,
      messagesContainer,
      handleSend,
      formatTime,
      currentUserId,
    };
  },
};
</script>


<style scoped>
.chat-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #007bff;
  color: white;
}

.peer-info {
  display: flex;
  align-items: center;
}

.peer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.peer-details h6 {
  margin: 0;
  font-size: 16px;
}

.peer-details .status {
  font-size: 12px;
  color: #d4d4d4;
}

.messages-container {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #ffffff;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.sent {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
}

.message.received {
  align-self: flex-start;
  background-color: #f1f1f1;
  color: #333;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-time {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
  align-self: flex-end;
}

.chat-footer {
  display: flex;
  padding: 10px;
  background-color: #f1f1f1;
  border-top: 1px solid #ddd;
}

.input-container {
  display: flex;
  width: 100%;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
}

.send-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>