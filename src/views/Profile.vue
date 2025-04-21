<!-- Welcome.vue -->
<template>
    <div class="p-4 text-center">
      <h1 class="text-3xl font-bold text-blue-600">Welcome to the Chat App!</h1>
      <p class="text-gray-700 mt-2">Join the conversation and connect in real time.</p>
      <button @click ="logout"> Sign Out</button>
    </div>
  </template>
  
  <script setup>
  import { auth } from "@/firebase";
  
  const logout = () => {
    auth.signOut()
      .then(() => {
        console.log("User signed out successfully.");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };
  // No need for props or script logic here for a static welcome
  </script>
  
  <style scoped>
  /* Optional scoped styles */
  </style>