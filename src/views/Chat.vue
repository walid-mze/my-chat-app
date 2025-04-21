<template>
    <div class="chat">
      <div class="messages">
        <div v-for="msg in messages" :key="msg.id">
          <strong>{{ msg.user }}:</strong> {{ msg.text }}
        </div>
      </div>
  
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { db, auth } from '../firebase'
  import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
  } from 'firebase/firestore'
  
  const messages = ref([])
  const newMessage = ref('')
  const messagesCollection = collection(db, 'messages')
  
  onMounted(() => {
    const q = query(messagesCollection, orderBy('createdAt'))
    onSnapshot(q, snapshot => {
      messages.value = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
    })
  })
  
  const sendMessage = async () => {
    if (!newMessage.value.trim()) return
  
    await addDoc(messagesCollection, {
      text: newMessage.value,
      user: auth.currentUser.email,
      createdAt: serverTimestamp()
    })
  
    newMessage.value = ''
  }
  </script>
  
  <style scoped>
  .chat {
    max-width: 600px;
    margin: 40px auto;
  }
  .messages {
    border: 1px solid #ddd;
    padding: 1rem;
    height: 300px;
    overflow-y: auto;
    margin-bottom: 1rem;
  }
  </style>
  