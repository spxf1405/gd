<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref, computed } from "vue";
import Test from "~/components/features/tournaments/test.vue";

definePageMeta({
  title: "Elite Gamer - Login",
  layout: false,
});

useHead({
  title: "Elite Gamer - Login",
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    },
  ],
});

// Form data
const formData = ref({
  username: "",
});

// Validation errors
const errors = ref({
  username: "",
});

// Touched fields
const touched = ref({
  username: false,
});

// Form submission state
const isSubmitting = ref(false);

// Forgot password dialog
const showForgotPasswordDialog = ref(false);
const phoneNumber = ref("");
const phoneError = ref("");
const isSubmittingPhone = ref(false);

// Validation functions
const validateUsername = () => {
  if (!touched.value.username) return;
  
  if (!formData.value.username.trim()) {
    errors.value.username = "Vui lòng nhập mã đăng nhập";
  } else if (formData.value.username.length < 9) {
    errors.value.username = "Mã đăng nhập phải có ít nhất 9 ký tự";
  } else if (!/^[A-Z]{2,}[0-9]{4}[0-9]{3}$/.test(formData.value.username)) {
    errors.value.username = "Định dạng không đúng (VD: PNS0596123)";
  } else {
    errors.value.username = "";
  }
};

const validatePhone = () => {
  if (!phoneNumber.value.trim()) {
    phoneError.value = "Vui lòng nhập số điện thoại";
    return false;
  } else if (!/^[0-9]{10}$/.test(phoneNumber.value)) {
    phoneError.value = "Số điện thoại phải có 10 chữ số";
    return false;
  } else {
    phoneError.value = "";
    return true;
  }
};

// Mark field as touched
const markTouched = (field: string) => {
  touched.value[field as keyof typeof touched.value] = true;
};

// Validate all fields
const validateAll = () => {
  touched.value.username = true;
  validateUsername();
};

// Check if form is valid
const isFormValid = computed(() => {
  return (
    formData.value.username.trim() &&
    !errors.value.username
  );
});

// Handle form submission
const handleSubmit = async () => {
  validateAll();
  
  if (!isFormValid.value) {
    return;
  }
  
  isSubmitting.value = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  isSubmitting.value = false;
  
  // Navigate to dashboard or show success
  console.log("Login successful:", formData.value);
};

// Forgot password functions
const openForgotPasswordDialog = () => {
  showForgotPasswordDialog.value = true;
  phoneNumber.value = "";
  phoneError.value = "";
};

const closeForgotPasswordDialog = () => {
  showForgotPasswordDialog.value = false;
  phoneNumber.value = "";
  phoneError.value = "";
};

const handleForgotPasswordSubmit = async () => {
  if (!validatePhone()) {
    return;
  }
  
  isSubmittingPhone.value = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  isSubmittingPhone.value = false;
  
  // Show success or handle result
  console.log("Phone submitted:", phoneNumber.value);
  closeForgotPasswordDialog();
};

// Format username to uppercase
const formatUsername = () => {
  formData.value.username = formData.value.username.toUpperCase();
};
</script>

<template>
  <ClientOnly>
    <body class="bg-dark-bg min-h-screen text-white flex items-center justify-center p-6">
      <!-- Background Decorations -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyber-purple/20 to-transparent rounded-full blur-3xl"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-blue/20 to-transparent rounded-full blur-3xl"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyber-green/10 to-transparent rounded-full blur-3xl"
        ></div>
      </div>

      <!-- Login Card -->
      <div
        class="relative w-xl max-w-xl bg-card-gradient border border-accent-blue/30 rounded-2xl shadow-2xl overflow-hidden"
      >
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-cyber-purple/20 via-accent-blue/20 to-cyber-green/20 border-b border-accent-blue/20 p-6"
        >
          <div class="flex items-center justify-center mb-4">
            <div
              class="w-16 h-16 bg-gradient-to-br from-accent-blue to-cyber-purple rounded-2xl flex items-center justify-center shadow-lg shadow-accent-blue/50"
            >
              <Icon icon="mdi:gamepad-variant" class="text-white text-3xl" />
            </div>
          </div>
          <h1
            class="text-3xl font-black text-center bg-gradient-to-r from-accent-blue to-cyber-green bg-clip-text text-transparent mb-2"
          >
            ĐĂNG NHẬP
          </h1>
          <p class="text-center text-gray-400 text-sm">
            Chào mừng trở lại, Elite Gamer!
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
          <!-- Username (Special Format) -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">
              Mã đăng nhập
              <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <Icon
                  icon="mdi:account-key"
                  class="text-sm transition-colors"
                  :class="formData.username && !errors.username ? 'text-accent-blue' : 'text-gray-500'"
                />
              </div>
              <input
                v-model="formData.username"
                @blur="markTouched('username'); validateUsername()"
                @input="formatUsername(); validateUsername()"
                type="text"
                placeholder="PNS0596123"
                class="w-full pl-12 pr-4 py-3 bg-darker-surface border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all uppercase tracking-wider font-mono"
                :class="
                  errors.username && touched.username
                    ? 'border-red-500 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20'
                    : 'border-accent-blue/20 focus:border-accent-blue/50 focus:shadow-lg focus:shadow-accent-blue/20'
                "
              />
            </div>
            <p
              v-if="errors.username && touched.username"
              class="mt-1.5 text-xs text-red-400 flex items-center"
            >
              <Icon icon="mdi:alert-circle" class="mr-1.5 text-sm flex-shrink-0" />
              {{ errors.username }}
            </p>
            <div v-else class="mt-1.5 text-xs text-gray-400 space-y-1">
              <p class="flex items-start">
                <Icon icon="mdi:information" class="mr-1.5 text-sm flex-shrink-0 mt-0.5" />
                <span>Định dạng: Chữ cái đầu tên + Tháng sinh + Năm sinh + 3 số cuối ID</span>
              </p>
              <p class="ml-5 text-gray-500">
                VD: Phùng Ngọc Sơn - 20/05/1996 - 123 → <span class="text-cyber-green font-mono">PNS0596123</span>
              </p>
            </div>
          </div>

          <!-- Forgot Password -->
          <div class="flex justify-end">
            <button
              type="button"
              @click="openForgotPasswordDialog"
              class="text-sm text-accent-blue hover:text-cyber-green transition-colors font-semibold"
            >
              Quên mật khẩu?
            </button>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            class="w-full bg-gradient-to-r from-cyber-green to-accent-blue hover:from-cyber-green/80 hover:to-accent-blue/80 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-bold text-black disabled:text-gray-400 transition-all duration-200 shadow-lg"
          >
            <Icon
              :icon="isSubmitting ? 'mdi:loading' : 'mdi:login'"
              class="inline-block mr-2 text-lg"
              :class="{ 'animate-spin': isSubmitting }"
            />
            {{ isSubmitting ? "Đang đăng nhập..." : "Đăng nhập" }}
          </button>

          <!-- Info Box -->
          <div
            class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-4"
          >
            <div class="flex items-start space-x-3">
              <Icon icon="mdi:shield-check" class="text-accent-blue mt-0.5 text-base flex-shrink-0" />
              <div class="text-xs text-gray-300">
                <span class="font-semibold text-white">Bảo mật đăng nhập:</span>
                Thông tin đăng nhập được mã hóa SSL 256-bit và bảo vệ bởi hệ thống 2FA.
              </div>
            </div>
          </div>
        </form>

        <!-- Footer -->
        <div
          class="bg-darker-surface/50 border-t border-accent-blue/20 p-4 text-center"
        >
          <p class="text-xs text-gray-500">
            Chưa có tài khoản?
            <a href="#" class="text-accent-blue hover:text-cyber-green transition-colors font-semibold">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>

      <!-- Forgot Password Dialog -->
      <div
        v-if="showForgotPasswordDialog"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        @click.self="closeForgotPasswordDialog"
      >
        <div class="bg-card-gradient border border-accent-blue/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <!-- Dialog Header -->
          <div class="bg-gradient-to-r from-cyber-purple/20 via-accent-blue/20 to-cyber-green/20 border-b border-accent-blue/20 p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-white">Quên mật khẩu</h2>
              <button
                @click="closeForgotPasswordDialog"
                class="text-gray-400 hover:text-white transition-colors"
              >
                <Icon icon="mdi:close" class="text-2xl" />
              </button>
            </div>
            <p class="text-sm text-gray-400 mt-2">
              Nhập số điện thoại để khôi phục mật khẩu
            </p>
          </div>

          <!-- Dialog Content -->
          <form @submit.prevent="handleForgotPasswordSubmit" class="p-6 space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Số điện thoại
                <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon
                    icon="mdi:phone"
                    class="text-sm transition-colors"
                    :class="phoneNumber && !phoneError ? 'text-accent-blue' : 'text-gray-500'"
                  />
                </div>
                <input
                  v-model="phoneNumber"
                  @input="validatePhone"
                  type="tel"
                  placeholder="0912345678"
                  maxlength="10"
                  class="w-full pl-12 pr-4 py-3 bg-darker-surface border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all"
                  :class="
                    phoneError
                      ? 'border-red-500 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20'
                      : 'border-accent-blue/20 focus:border-accent-blue/50 focus:shadow-lg focus:shadow-accent-blue/20'
                  "
                />
              </div>
              <p
                v-if="phoneError"
                class="mt-1.5 text-xs text-red-400 flex items-center"
              >
                <Icon icon="mdi:alert-circle" class="mr-1.5 text-sm flex-shrink-0" />
                {{ phoneError }}
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmittingPhone"
              class="w-full bg-gradient-to-r from-cyber-green to-accent-blue hover:from-cyber-green/80 hover:to-accent-blue/80 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-bold text-black disabled:text-gray-400 transition-all duration-200 shadow-lg"
            >
              <Icon
                :icon="isSubmittingPhone ? 'mdi:loading' : 'mdi:send'"
                class="inline-block mr-2 text-lg"
                :class="{ 'animate-spin': isSubmittingPhone }"
              />
              {{ isSubmittingPhone ? "Đang gửi..." : "Gửi yêu cầu" }}
            </button>
          </form>
        </div>
      </div>
    </body>
  </ClientOnly>
</template>

<style scoped>
body {
  background: linear-gradient(180deg, #061322 0%, #071022 30%, #0d1624 100%);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "IBM Plex Sans", sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0d1624;
}

::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #10b981;
}
</style>