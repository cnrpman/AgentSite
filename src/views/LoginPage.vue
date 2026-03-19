<template>
  <div class="login-page">
    <div class="card">
      <h1>Sign in</h1>
      <p class="hint">Enter the site password to view content and downloads.</p>
      <form @submit.prevent="onSubmit">
        <label class="field">
          <span>Password</span>
          <input
            v-model="password"
            type="password"
            name="password"
            autocomplete="current-password"
            required
          />
        </label>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <button type="submit" class="btn" :disabled="submitting">Continue</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store';

const store = useStore();
const route = useRoute();
const router = useRouter();

const password = ref('');
const error = ref('');
const submitting = ref(false);

function redirectTarget(): string {
  const r = route.query.redirect;
  if (typeof r === 'string' && r.startsWith('/') && !r.startsWith('//')) return r;
  return '/';
}

async function onSubmit() {
  error.value = '';
  submitting.value = true;
  try {
    const ok = await store.dispatch('login', password.value);
    if (!ok) {
      error.value = 'Incorrect password or server not configured (set SITE_PASSWORD).';
      return;
    }
    await router.replace(redirectTarget());
  } catch (e) {
    error.value = 'Network error — is the content server running? (yarn dev:server)';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.card {
  width: 100%;
  max-width: 380px;
  background: #fff7e8;
  border: 1px solid #e7dcc3;
  border-radius: 12px;
  padding: 28px 24px;
  box-shadow: 0 8px 24px rgba(27, 27, 27, 0.06);
}
h1 {
  margin: 0 0 8px;
  font-size: 1.5rem;
  color: #1b1b1b;
}
.hint {
  margin: 0 0 20px;
  font-size: 0.95rem;
  color: #5c4b2a;
  line-height: 1.5;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: #374151;
}
.field input {
  padding: 10px 12px;
  border: 1px solid #e7dcc3;
  border-radius: 8px;
  font-size: 1rem;
}
.btn {
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #0a4ea3;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  margin: 0 0 12px;
  color: #b91c1c;
  font-size: 0.9rem;
}
</style>
