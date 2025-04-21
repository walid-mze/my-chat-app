<template>
  <div class="register">
    <h1>Créer un compte</h1>
    <p class="description">
      Remplissez le formulaire ci-dessous pour créer un compte et rejoindre notre communauté.
    </p>
    <form @submit.prevent="register">
      <div>
        <label for="username">Nom d'utilisateur : </label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          required
          :disabled="loading"
        />
      </div>
      <div>
        <label for="email">Email : </label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required
          :disabled="loading"
        />
      </div>
      <div>
        <label for="password">Mot de passe : </label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required
          :disabled="loading"
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Création en cours...' : 'Créer un compte' }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import firebase from "../serviecs/firebase";

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const username = ref('');
    const errorMessage = ref('');
    const loading = ref(false);

    const register = async () => {
      if (loading.value) return;
      
      loading.value = true;
      errorMessage.value = '';
      
      try {
        console.log('Starting registration process...'); // Debug log
        const auth = getAuth();
        
        // Create auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        
        console.log('User created in Auth:', userCredential.user.uid); // Debug log
        
        // Generate avatar URL
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username.value)}&background=random&size=200`;
        
        // Update auth profile
        await updateProfile(userCredential.user, {
          displayName: username.value,
          photoURL: avatarUrl
        });
        
        console.log('Auth profile updated'); // Debug log

        // Store user data in Firestore
        const userData = {
          email: email.value,
          displayName: username.value,
          photoURL: avatarUrl,
          createdAt: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          status: 'online'
        };

        const userDocRef = firebase.doc(firebase.firestore, 'users', userCredential.user.uid);
        await firebase.setDoc(userDocRef, userData);
        
        console.log('User data stored in Firestore'); // Debug log

        // Store user info in localStorage
        localStorage.setItem('id', userCredential.user.uid);
        localStorage.setItem('name', username.value);
        localStorage.setItem('photoURL', avatarUrl);

        // Navigate to chat
        window.location.href = '/chat';
      } catch (error) {
        console.error('Registration error:', error); // Debug log
        errorMessage.value = "Erreur lors de l'inscription : " + error.message;
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      username,
      errorMessage,
      loading,
      register
    };
  }
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #333;
}

.description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #444;
  text-align: left;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  margin-bottom: 15px;
}

input:focus {
  border-color: #007bff;
  outline: none;
  background-color: #f9f9f9;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  margin-top: 15px;
  padding: 10px;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  color: #c62828;
}
</style>