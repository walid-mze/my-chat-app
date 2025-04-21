<template>
  <div class="w-100 mt-3">
    <h2 class="fw-600">Welcome to Profile section</h2>
    <div class="profile">
      <img class="br-06" :src="photoURL" width="100%" height="100%" />
      <label class="avatar">
        <font-awesome-icon icon="pencil-alt" />
        <input type="file" name="upload" class="w-0" @change="changeAvatar" />
      </label>
    </div>
    <div class="form-group">
      <label>Name</label>
      <input type="text" name="name" class="form-control" v-model="name" />
    </div>
    <div class="form-group">
      <label>Tell me about yourself</label>
      <input type="text" name="aboutMe" class="form-control" v-model="aboutMe" />
    </div>
    <button type="button" class="btn btn-primary" @click="saveProfile">Save</button>
    <button type="button" class="btn btn-info" @click="goBack">Back</button>
  </div>
</template>

<script>
import firebase from '../firebase.js';

export default {
  data() {
    return {
      firebaseDocId: localStorage.getItem('firebaseDocId'),
      name: '',
      aboutMe: '',
      photoURL: '',
      user: null,
    };
  },
  methods: {
    async fetchUserData() {
      try {
        const userDoc = await firebase.firestore().collection('users').doc(this.firebaseDocId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          this.name = userData.displayName || '';
          this.photoURL = userData.photoURL || '';
          this.aboutMe = userData.status || '';
        } else {
          console.error('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async saveProfile() {
      try {
        await firebase.firestore().collection('users').doc(this.firebaseDocId).update({
          displayName: this.name,
          status: this.aboutMe,
          photoURL: this.photoURL,
          lastSeen: new Date().toISOString(),
        });
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      }
    },
    changeAvatar(event) {
      const file = event.target.files[0];
      if (file) {
        const storageRef = firebase.storage().ref();
        const avatarRef = storageRef.child(`avatars/${this.firebaseDocId}`);
        avatarRef.put(file).then(async () => {
          const downloadURL = await avatarRef.getDownloadURL();
          this.photoURL = downloadURL;
        }).catch(error => {
          console.error('Error uploading avatar:', error);
        });
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.fetchUserData();
  },
};
</script>

<style scoped>
input[type="text"] {
  margin: 0 auto;
  width: 25%;
}
label {
  font-size: 18px;
  font-weight: 600;
}
.fw-600 {
  font-weight: 600;
}
.w-100 {
  width: 100vw;
}
.w-0 {
  width: 0;
}
.br-06 {
  border-radius: 0.6rem;
}
.profile {
  margin: 20px auto;
  width: 150px;
  height: 150px;
  background-color: royalblue;
  position: relative;
  border-radius: 0.6rem;
}
.avatar {
  width: 35px;
  height: 35px;
  background: #f46e13;
  border-radius: 0.6rem;
  position: absolute;
  top: 115px;
  right: 0px;
  padding: 2px 0px 0px 7px;
}
</style>