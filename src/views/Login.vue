<template>
  <div class="login">
    <h1>TalkSphere</h1>
    <p class="description">
      <h3>Rejoignez la conversation.</h3>
      Des questions brûlantes, des idées brillantes, une communauté qui vous écoute.
      Connectez-vous et faites entendre votre voix.
    </p>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Se connecter</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p>mot de passe oublié ? <router-link to="/reset">Renitialiser</router-link></p>
    <p>Pas de compte ? <router-link to="/register">Créer un compte</router-link></p>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/chat"); // Redirige vers la page d'accueil après connexion
      } catch (error) {
        this.errorMessage = "Échec de la connexion : " + error.message;
      }
    },
  },
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  margin-bottom: 10px;
  text-align: center;
  color: #333;
}

.description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
  text-align: center;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #444;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: #333;
}

input:focus {
  border-color: #007bff;
  outline: none;
  background-color: #fff;
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

.error {
  color: #d9534f;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>