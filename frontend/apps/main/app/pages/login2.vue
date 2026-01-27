<template>
  <div
    class="min-h-screen flex items-center justify-center p-8 relative font-sans text-white overflow-x-hidden antialiased bg-hero-gradient"
  >
    <!-- Grid Pattern Background -->
    <div
      class="absolute inset-0 opacity-50 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[length:50px_50px]"
    ></div>

    <!-- Floating Particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="absolute rounded-full animate-pulse"
        :style="{
          left: particle.x + '%',
          top: particle.y + '%',
          width: particle.size + 'px',
          height: particle.size + 'px',
          background: particle.color,
          animationDelay: particle.delay + 's',
          animationDuration: particle.duration + 's',
        }"
      ></div>
    </div>

    <!-- Login Card -->
    <div class="relative w-full max-w-md z-10">
      <!-- Glow Border Effect -->
      <div
        class="absolute -inset-0.5 rounded-3xl opacity-60 blur-xl animate-pulse bg-gradient-to-r from-cyber-green via-accent-blue to-cyber-purple"
      ></div>

      <div
        class="relative bg-card-gradient rounded-3xl p-12 shadow-2xl backdrop-blur-3xl border border-accent-blue/30"
      >
        <!-- Header -->
        <div class="text-center mb-10">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-blue to-cyber-purple rounded-2xl mb-6 relative overflow-hidden shadow-lg shadow-accent-blue/30"
          >
            <div
              class="absolute inset-0 -translate-x-full animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent duration-[3s]"
            ></div>
            <i class="fas fa-gamepad text-3xl text-white relative z-10"></i>
          </div>

          <h1
            class="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-accent-blue bg-clip-text text-transparent tracking-tight"
          >
            {{ isLogin ? "WELCOME BACK" : "JOIN THE GRID" }}
          </h1>

          <p class="text-accent-blue text-base opacity-80">
            {{
              isLogin
                ? "Access your neural interface"
                : "Initialize your connection"
            }}
          </p>
        </div>

        <!-- Success/Error Messages -->
        <div
          v-if="successMessage"
          class="mb-6 p-4 rounded-xl text-center text-sm border border-cyber-green bg-gradient-to-r from-cyber-green/10 to-accent-blue/10 text-cyber-green"
        >
          <i class="fas fa-check-circle mr-2"></i>{{ successMessage }}
        </div>

        <div
          v-if="errorMessage"
          class="mb-6 p-4 rounded-xl text-center text-sm border border-red-500 bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-400"
        >
          <i class="fas fa-exclamation-triangle mr-2"></i>{{ errorMessage }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Username (Register Only) -->
          <transition name="fade">
            <div v-if="!isLogin" class="relative">
              <div class="relative group">
                <i
                  class="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-accent-blue text-xl z-10"
                ></i>
                <input
                  v-model="formData.username"
                  type="text"
                  placeholder="Username"
                  class="w-full pl-12 pr-4 py-5 bg-darker-blue/70 rounded-2xl text-white text-base transition-all duration-300 outline-none backdrop-blur-sm font-sans border border-accent-blue/30 group-hover:border-accent-blue/60 focus:border-cyber-green focus:shadow-lg focus:shadow-cyber-green/20 focus:-translate-y-0.5 placeholder:text-white/50"
                  :class="{ 'border-red-500': errors.username }"
                  required
                />
              </div>
              <div
                v-if="errors.username"
                class="text-red-400 text-sm mt-2 pl-4"
              >
                {{ errors.username }}
              </div>
            </div>
          </transition>

          <!-- Email -->
          <div class="relative">
            <div class="relative group">
              <i
                class="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-accent-blue text-xl z-10"
              ></i>
              <input
                v-model="formData.email"
                type="email"
                placeholder="Email"
                class="w-full pl-12 pr-4 py-5 bg-darker-blue/70 rounded-2xl text-white text-base transition-all duration-300 outline-none backdrop-blur-sm font-sans border border-accent-blue/30 group-hover:border-accent-blue/60 focus:border-cyber-green focus:shadow-lg focus:shadow-cyber-green/20 focus:-translate-y-0.5 placeholder:text-white/50"
                :class="{ 'border-red-500': errors.email }"
                required
              />
            </div>
            <div v-if="errors.email" class="text-red-400 text-sm mt-2 pl-4">
              {{ errors.email }}
            </div>
          </div>

          <!-- Password -->
          <div class="relative">
            <div class="relative group">
              <i
                class="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-accent-blue text-xl z-10"
              ></i>
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                class="w-full pl-12 pr-16 py-5 bg-darker-blue/70 rounded-2xl text-white text-base transition-all duration-300 outline-none backdrop-blur-sm font-sans border border-accent-blue/30 group-hover:border-accent-blue/60 focus:border-cyber-green focus:shadow-lg focus:shadow-cyber-green/20 focus:-translate-y-0.5 placeholder:text-white/50"
                :class="{ 'border-red-500': errors.password }"
                required
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-accent-blue text-xl transition-all duration-300 hover:text-cyber-green hover:scale-110 z-10"
                @click="showPassword = !showPassword"
              >
                <i
                  :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                ></i>
              </button>
            </div>
            <div v-if="errors.password" class="text-red-400 text-sm mt-2 pl-4">
              {{ errors.password }}
            </div>
          </div>

          <!-- Form Options (Login Only) -->
          <div
            v-if="isLogin"
            class="flex justify-between items-center text-sm mb-8"
          >
            <div
              class="flex items-center cursor-pointer"
              @click="rememberMe = !rememberMe"
            >
              <div
                class="w-5 h-5 border-2 border-accent-blue rounded mr-2 relative transition-all duration-300 flex items-center justify-center"
                :class="rememberMe ? 'border-cyber-green bg-cyber-green' : ''"
              >
                <i
                  v-if="rememberMe"
                  class="fas fa-check text-white text-xs"
                ></i>
              </div>
              <span class="text-accent-blue">Remember me</span>
            </div>
            <a
              href="#"
              class="text-cyber-green hover:opacity-80 transition-opacity duration-300"
              >Forgot password?</a
            >
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-5 px-8 bg-gradient-to-r from-cyber-green via-accent-blue to-cyber-purple bg-[length:200%_200%] rounded-2xl text-white text-lg font-semibold transition-all duration-300 relative overflow-hidden mb-8 shadow-lg shadow-cyber-green/20 font-sans disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none hover:shadow-xl hover:shadow-cyber-green/40 hover:-translate-y-0.5 hover:animate-gradient-shift"
          >
            <span
              v-if="isLoading"
              class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"
            ></span>
            {{
              isLoading
                ? "Connecting..."
                : isLogin
                  ? "ACCESS SYSTEM"
                  : "INITIALIZE ACCOUNT"
            }}
          </button>

          <!-- Form Toggle -->
          <div class="text-center text-accent-blue text-base">
            {{ isLogin ? "Don't have access?" : "Already connected?" }}
            <button
              type="button"
              class="text-cyber-green font-semibold ml-2 transition-all duration-300 hover:opacity-80 hover:scale-105 font-sans"
              @click="toggleForm"
            >
              {{ isLogin ? "Create Account" : "Login" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { create } from "@bufbuild/protobuf";
import { GenerateMatchesRequestSchema } from "@gd/proto/match/v1/match_service_pb";
import { ref, onMounted } from "vue";
import { matchClient } from "~/utils/service-client";

// Page metadata for Nuxt
definePageMeta({
  title: "Elite Gamer - Login",
  layout: false,
});

// Use Nuxt's built-in head management
useHead({
  title: "Elite Gamer - Login",
  link: [
    {
      rel: "stylesheet",
      href: "https://db.onlinewebfonts.com/c/359daf377c374b65e821b9f218fc91ef?family=Google+Sans+Flex",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
    },
  ],
});

// Reactive data
const isLogin = ref(true);
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const particles = ref([]);
const successMessage = ref("");
const errorMessage = ref("");
const errors = ref({});

const formData = ref({
  email: "",
  password: "",
  username: "",
});

// Generate floating particles
const generateParticles = () => {
  const colors = [
    "var(--color-cyber-green)",
    "var(--color-accent-blue)",
    "var(--color-cyber-purple)",
  ];
  const newParticles = [];

  for (let i = 0; i < 20; i++) {
    newParticles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3,
      duration: Math.random() * 4 + 3,
    });
  }

  particles.value = newParticles;
};

// Clear messages after timeout
const clearMessages = () => {
  setTimeout(() => {
    successMessage.value = "";
    errorMessage.value = "";
  }, 5000);
};

// Form validation
const validateForm = () => {
  errors.value = {};

  if (!formData.value.email) {
    errors.value.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    errors.value.email = "Email is invalid";
  }

  if (!formData.value.password) {
    errors.value.password = "Password is required";
  } else if (formData.value.password.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
  }

  if (!isLogin.value && !formData.value.username) {
    errors.value.username = "Username is required";
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    errorMessage.value = "Please fix the errors above";
    clearMessages();
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // In a real app, you would call your API here
    // Example: await $fetch('/api/auth/login', { method: 'POST', body: formData.value })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate random success/failure for demo
    if (Math.random() > 0.3) {
      successMessage.value = `${isLogin.value ? "Login" : "Registration"} successful! Welcome to Elite Gamer.`;
      console.log("Form submitted:", formData.value);

      // In a real app, you might redirect here:
      // await navigateTo('/dashboard')
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    errorMessage.value = isLogin.value
      ? "Invalid email or password. Please try again."
      : "Registration failed. Username or email may already exist.";
  } finally {
    isLoading.value = false;
    clearMessages();
  }
};

const toggleForm = () => {
  isLogin.value = !isLogin.value;
  formData.value = { email: "", password: "", username: "" };
  rememberMe.value = false;
  errors.value = {};
  successMessage.value = "";
  errorMessage.value = "";
};

const testAPI = async () => {
  const data = await playerClient.getPlayer();
  console.log("data", data.players);
};

const testGenerateAPI = async () => {
  const generateMatchesReq = create(GenerateMatchesRequestSchema, {
    tournamentId: 1,
    playerIds: ["1"],
  });
  const data = await matchClient.generateMatches(generateMatchesReq);
  console.log("data", data.matches);
};

onMounted(() => {
  generateParticles();
  testGenerateAPI();
  // testAPI()
});
</script>

<style>
/* Custom animations */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient-shift {
  animation: gradient-shift 1s ease-in-out;
}

/* Fade transitions for Vue */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Font families */
.font-orbitron {
  font-family: "Orbitron", sans-serif;
}

.font-sans {
  font-family:
    "Google Sans Flex",
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial;
}
</style>
