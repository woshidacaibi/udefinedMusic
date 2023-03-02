import { defineStore } from 'pinia';
import { ref } from 'vue';

export const loginStore = defineStore('loginStore', () => {
  const showLogin = ref(false);
  const loginStatus = ref(false);
  return { showLogin, loginStatus };
});
