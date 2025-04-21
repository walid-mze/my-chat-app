<template>
  <div class="chat-container">
    <!-- Users List Sidebar -->
    <div class="users-sidebar">
      <div class="sidebar-header">
        <div class="user-profile" @click="onProfileClick">
          <img :src="currentUser.photoURL" alt="user" class="profile-image" />
          <span class="user-name">{{ currentUser.name }}</span>
        </div>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
      
      <div class="users-list">
        <div 
          v-for="user in users" 
          :key="user.id"
          class="user-item"
          :class="{ 'active': currentPeerUser && currentPeerUser.id === user.id }"
          @click="selectUser(user)"
        >
          <img :src="user.photoURL" alt="user" class="user-avatar" />
          <div class="user-info">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-status" :class="user.status">
              {{ user.status === 'online' ? 'Online' : 'Offline' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="chat-area">
      <div v-if="!currentPeerUser" class="welcome-screen">
        <img :src="currentUser.photoURL" class="welcome-avatar" />
        <h2>Welcome {{ currentUser.name }}</h2>
        <p>Select a user to start chatting</p>
      </div>
      <ChatBox v-else :currentPeerUser="currentPeerUser" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, query, getDocs, onSnapshot } from 'firebase/firestore';
import firebase from '../serviecs/firebase';
import ChatBox from './ChatBox.vue';
import { useRouter } from 'vue-router';

export default {
  name: "Chat",
  components: {
    ChatBox
  },
  setup() {
    const router = useRouter();
    const currentPeerUser = ref(null);
    const users = ref([]);
    const currentUser = ref({
      id: '',
      name: '',
      photoURL: 'https://via.placeholder.com/40'
    });

    // Initialize current user data
    const initCurrentUser = () => {
      const id = localStorage.getItem('id');
      const name = localStorage.getItem('name');
      const photoURL = localStorage.getItem('photoURL');

      if (!id) {
        router.push('/');
        return false;
      }

      currentUser.value = {
        id,
        name: name || 'User',
        photoURL: photoURL || 'https://via.placeholder.com/40'
      };
      return true;
    };

    const getUserList = async () => {
      try {
        console.log('Fetching users list...');
        const usersRef = collection(firebase.firestore, 'users');
        const q = query(usersRef);
        
        // Get initial users
        const querySnapshot = await getDocs(q);
        const usersList = [];
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          // Don't add current user to the list
          if (doc.id !== currentUser.value.id) {
            usersList.push({
              id: doc.id,
              name: userData.displayName || userData.email,
              email: userData.email,
              photoURL: userData.photoURL || 'https://via.placeholder.com/40',
              status: userData.status,
              lastSeen: userData.lastSeen
            });
          }
        });
        
        users.value = usersList;
        console.log('Users loaded:', users.value.length);

        // Set up real-time listener for user changes
        onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const userData = change.doc.data();
            if (change.type === 'added' || change.type === 'modified') {
              if (change.doc.id !== currentUser.value.id) {
                const userIndex = users.value.findIndex(u => u.id === change.doc.id);
                const updatedUser = {
                  id: change.doc.id,
                  name: userData.displayName || userData.email,
                  email: userData.email,
                  photoURL: userData.photoURL || 'https://via.placeholder.com/40',
                  status: userData.status,
                  lastSeen: userData.lastSeen
                };
                
                if (userIndex === -1) {
                  users.value.push(updatedUser);
                } else {
                  users.value[userIndex] = updatedUser;
                }
              }
            }
            if (change.type === 'removed' && change.doc.id !== currentUser.value.id) {
              users.value = users.value.filter(u => u.id !== change.doc.id);
            }
          });
        });

      } catch (error) {
        console.error('Error getting users:', error);
      }
    };

    const selectUser = (user) => {
      currentPeerUser.value = user;
    };

    const onProfileClick = () => {
      router.push('/profile');
    };

    const logout = () => {
      localStorage.clear();
      router.push('/');
    };

    onMounted(() => {
      // Initialize user data and fetch user list
      if (initCurrentUser()) {
        getUserList();
      }
    });

    return {
      currentUser,
      currentPeerUser,
      users,
      selectUser,
      logout,
      onProfileClick
    };
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.users-sidebar {
  width: 300px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #34495e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: white;
}

.user-name {
  font-weight: 600;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.users-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 5px;
  transition: background-color 0.3s;
}

.user-item:hover {
  background-color: #34495e;
}

.user-item.active {
  background-color: #3498db;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: white;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-status {
  font-size: 0.8rem;
  color: #bdc3c7;
}

.chat-area {
  flex: 1;
  background-color: #ecf0f1;
  display: flex;
  flex-direction: column;
}

.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.welcome-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
  background-color: white;
}

.welcome-screen h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.welcome-screen p {
  color: #7f8c8d;
}
</style>