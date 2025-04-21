<template>
    <div class="reset">
        <h1>Réinitialiser le mot de passe</h1>
        <p class="description">
            Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
        </p>
        <div>
            <label for="email">Email : </label>
            <input type="text" id="email" v-model="email" />
        </div>
        <button @click="resetPassword">Réinitialiser</button>
        <p v-if="message" class="message">{{ message }}</p>
    </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
export default {
    data() {
        return {
            email: "",
            message: "",
        };
    },
    methods: {
        async resetPassword() {
            const auth = getAuth();
            try {
                await sendPasswordResetEmail(auth, this.email);
                this.message = "Un email de réinitialisation a été envoyé à " + this.email;
            } catch (error) {
                this.message = "Erreur : " + error.message;
            }
        },
    },
};
</script>

<style scoped>
.reset {
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
    font-size: 1.8rem;
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

.message {
    margin-top: 15px;
    font-size: 0.9rem;
    color: #28a745; /* Vert pour succès */
}

.message.error {
    color: #d9534f; /* Rouge pour erreur */
}
</style>