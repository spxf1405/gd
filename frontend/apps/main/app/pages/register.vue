<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  title: "Elite Gamer - Registration",
  layout: false,
});

useHead({
  title: "Elite Gamer - Registration",
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    },
  ],
});

// Form data
const formData = ref({
  fullName: "",
  birthMonth: "",
  birthYear: "",
  phoneNumber: "",
  lastThreeId: "",
});

// Validation errors
const errors = ref({
  fullName: "",
  birthMonth: "",
  birthYear: "",
  phoneNumber: "",
  lastThreeId: "",
});

// Touched fields
const touched = ref({
  fullName: false,
  birthMonth: false,
  birthYear: false,
  phoneNumber: false,
  lastThreeId: false,
});

// Form submission state
const isSubmitting = ref(false);
const isSuccess = ref(false);

// Generate months and years
const months = [
  { value: "01", label: "Tháng 1" },
  { value: "02", label: "Tháng 2" },
  { value: "03", label: "Tháng 3" },
  { value: "04", label: "Tháng 4" },
  { value: "05", label: "Tháng 5" },
  { value: "06", label: "Tháng 6" },
  { value: "07", label: "Tháng 7" },
  { value: "08", label: "Tháng 8" },
  { value: "09", label: "Tháng 9" },
  { value: "10", label: "Tháng 10" },
  { value: "11", label: "Tháng 11" },
  { value: "12", label: "Tháng 12" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => {
  const year = currentYear - i;
  return { value: year.toString(), label: year.toString() };
});

// Validation functions
const validateFullName = () => {
  if (!touched.value.fullName) return;

  if (!formData.value.fullName.trim()) {
    errors.value.fullName = "Vui lòng nhập họ và tên";
  } else if (formData.value.fullName.trim().length < 3) {
    errors.value.fullName = "Họ và tên phải có ít nhất 3 ký tự";
  } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.value.fullName)) {
    errors.value.fullName = "Họ và tên chỉ được chứa chữ cái";
  } else {
    errors.value.fullName = "";
  }
};

const validateBirthMonth = () => {
  if (!touched.value.birthMonth) return;

  if (!formData.value.birthMonth) {
    errors.value.birthMonth = "Vui lòng chọn tháng sinh";
  } else {
    errors.value.birthMonth = "";
  }
};

const validateBirthYear = () => {
  if (!touched.value.birthYear) return;

  if (!formData.value.birthYear) {
    errors.value.birthYear = "Vui lòng chọn năm sinh";
  } else {
    errors.value.birthYear = "";
  }
};

const validatePhoneNumber = () => {
  if (!touched.value.phoneNumber) return;

  if (!formData.value.phoneNumber.trim()) {
    errors.value.phoneNumber = "Vui lòng nhập số điện thoại";
  } else if (
    !/^(0|\+84)[0-9]{9,10}$/.test(formData.value.phoneNumber.replace(/\s/g, ""))
  ) {
    errors.value.phoneNumber = "Số điện thoại không hợp lệ";
  } else {
    errors.value.phoneNumber = "";
  }
};

const validateLastThreeId = () => {
  if (!touched.value.lastThreeId) return;

  if (!formData.value.lastThreeId.trim()) {
    errors.value.lastThreeId = "Vui lòng nhập 3 số cuối ID";
  } else if (!/^\d{3}$/.test(formData.value.lastThreeId)) {
    errors.value.lastThreeId = "Phải là 3 chữ số";
  } else {
    errors.value.lastThreeId = "";
  }
};

// Mark field as touched
const markTouched = (field: string) => {
  touched.value[field as keyof typeof touched.value] = true;
};

// Validate all fields
const validateAll = () => {
  touched.value.fullName = true;
  touched.value.birthMonth = true;
  touched.value.birthYear = true;
  touched.value.phoneNumber = true;
  touched.value.lastThreeId = true;

  validateFullName();
  validateBirthMonth();
  validateBirthYear();
  validatePhoneNumber();
  validateLastThreeId();
};

// Check if form is valid
const isFormValid = computed(() => {
  return (
    formData.value.fullName.trim() &&
    formData.value.birthMonth &&
    formData.value.birthYear &&
    formData.value.phoneNumber.trim() &&
    formData.value.lastThreeId.trim() &&
    !errors.value.fullName &&
    !errors.value.birthMonth &&
    !errors.value.birthYear &&
    !errors.value.phoneNumber &&
    !errors.value.lastThreeId
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
  await new Promise((resolve) => setTimeout(resolve, 1500));

  isSubmitting.value = false;
  isSuccess.value = true;

  // Reset form after 3 seconds
  setTimeout(() => {
    formData.value = {
      fullName: "",
      birthMonth: "",
      birthYear: "",
      phoneNumber: "",
      lastThreeId: "",
    };
    touched.value = {
      fullName: false,
      birthMonth: false,
      birthYear: false,
      phoneNumber: false,
      lastThreeId: false,
    };
    isSuccess.value = false;
  }, 3000);
};

// Handle select changes
const handleMonthChange = (value: string) => {
  formData.value.birthMonth = value;
  markTouched("birthMonth");
  validateBirthMonth();
};

const handleYearChange = (value: string) => {
  formData.value.birthYear = value;
  markTouched("birthYear");
  validateBirthYear();
};
</script>

<template>
  <ClientOnly>
    <body
      class="bg-dark-bg min-h-screen text-white flex items-center justify-center p-4"
    >
      <!-- Background Decorations -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyber-purple/20 to-transparent rounded-full blur-3xl"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-blue/20 to-transparent rounded-full blur-3xl"
        ></div>
      </div>

      <!-- Registration Card -->
      <div
        class="relative w-lg max-w-lg bg-card-gradient border border-accent-blue/30 rounded-xl shadow-2xl overflow-hidden"
      >
        <!-- Header - Compact -->
        <div
          class="bg-gradient-to-r from-cyber-purple/20 via-accent-blue/20 to-cyber-green/20 border-b border-accent-blue/20 p-4"
        >
          <div class="flex items-center justify-center mb-2">
            <div
              class="w-12 h-12 bg-gradient-to-br from-accent-blue to-cyber-purple rounded-xl flex items-center justify-center shadow-lg shadow-accent-blue/50"
            >
              <i class="fas fa-gamepad text-white text-xl"></i>
            </div>
          </div>
          <h1
            class="text-xl font-bold text-center bg-gradient-to-r from-accent-blue to-cyber-green bg-clip-text text-transparent mb-1"
          >
            ĐĂNG KÝ NHANH
          </h1>
          <p class="text-center text-gray-400 text-xs">Chỉ 4 bước đơn giản</p>
        </div>

        <!-- Success Message -->
        <div
          v-if="isSuccess"
          class="absolute inset-0 bg-dark-surface/95 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div class="text-center px-6">
            <div
              class="w-16 h-16 bg-gradient-to-br from-cyber-green to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-cyber-green/50 animate-bounce"
            >
              <i class="fas fa-check text-white text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">
              Đăng ký thành công!
            </h3>
            <p class="text-gray-400 text-xs">
              Chào mừng bạn đến với Elite Gamer
            </p>
          </div>
        </div>

        <!-- Form - Compact -->
        <form @submit.prevent="handleSubmit" class="p-4 space-y-3">
          <!-- Full Name -->
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1.5">
              Họ và tên <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-user text-xs"
                  :class="
                    formData.fullName && !errors.fullName
                      ? 'text-accent-blue'
                      : 'text-gray-500'
                  "
                ></i>
              </div>
              <input
                v-model="formData.fullName"
                @blur="
                  markTouched('fullName');
                  validateFullName();
                "
                @input="validateFullName"
                type="text"
                placeholder="Nguyễn Văn A"
                class="w-full pl-9 pr-3 py-2.5 text-sm bg-darker-surface border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all"
                :class="
                  errors.fullName && touched.fullName
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-accent-blue/20 focus:border-accent-blue/50'
                "
              />
            </div>
            <p
              v-if="errors.fullName && touched.fullName"
              class="mt-1 text-xs text-red-400"
            >
              {{ errors.fullName }}
            </p>
          </div>
          <!-- Phone Number -->
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1.5">
              Số điện thoại <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-phone text-xs"
                  :class="
                    formData.phoneNumber && !errors.phoneNumber
                      ? 'text-accent-blue'
                      : 'text-gray-500'
                  "
                ></i>
              </div>
              <input
                v-model="formData.phoneNumber"
                @blur="
                  markTouched('phoneNumber');
                  validatePhoneNumber();
                "
                @input="validatePhoneNumber"
                type="tel"
                placeholder="0912345678"
                class="w-full pl-9 pr-3 py-2.5 text-sm bg-darker-surface border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all"
                :class="
                  errors.phoneNumber && touched.phoneNumber
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-accent-blue/20 focus:border-accent-blue/50'
                "
              />
            </div>
            <p
              v-if="errors.phoneNumber && touched.phoneNumber"
              class="mt-1 text-xs text-red-400"
            >
              {{ errors.phoneNumber }}
            </p>
          </div>

          <!-- Birth Month and Year -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Birth Month -->
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">
                Tháng sinh <span class="text-red-400">*</span>
              </label>
              <SelectRoot
                v-model="formData.birthMonth"
                @update:model-value="handleMonthChange"
              >
                <SelectTrigger
                  class="w-full px-3 py-2.5 text-sm bg-darker-surface border rounded-lg text-white focus:outline-none transition-all flex items-center justify-between"
                  :class="
                    errors.birthMonth && touched.birthMonth
                      ? 'border-red-500'
                      : 'border-accent-blue/20 focus:border-accent-blue/50'
                  "
                >
                  <div class="flex items-center gap-2">
                    <i
                      class="fas fa-calendar text-xs"
                      :class="
                        formData.birthMonth
                          ? 'text-accent-blue'
                          : 'text-gray-500'
                      "
                    ></i>
                    <SelectValue placeholder="Chọn tháng" class="text-sm" />
                  </div>
                </SelectTrigger>
                <SelectContent
                  class="bg-darker-surface border border-accent-blue/30 rounded-lg shadow-2xl overflow-y-auto max-h-60"
                  position="popper"
                  :side-offset="5"
                >
                  <SelectGroup>
                    <SelectItem
                      v-for="month in months"
                      :key="month.value"
                      :value="month.value"
                      class="px-3 py-2 text-sm text-white hover:bg-accent-blue/20 cursor-pointer transition-colors outline-none"
                    >
                      <SelectItemText>{{ month.label }}</SelectItemText>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
              <p
                v-if="errors.birthMonth && touched.birthMonth"
                class="mt-1 text-xs text-red-400"
              >
                {{ errors.birthMonth }}
              </p>
            </div>

            <!-- Birth Year -->
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">
                Năm sinh <span class="text-red-400">*</span>
              </label>
              <SelectRoot
                v-model="formData.birthYear"
                @update:model-value="handleYearChange"
              >
                <SelectTrigger
                  class="w-full px-3 py-2.5 text-sm bg-darker-surface border rounded-lg text-white focus:outline-none transition-all flex items-center justify-between"
                  :class="
                    errors.birthYear && touched.birthYear
                      ? 'border-red-500'
                      : 'border-accent-blue/20 focus:border-accent-blue/50'
                  "
                >
                  <div class="flex items-center gap-2">
                    <i
                      class="fas fa-calendar text-xs"
                      :class="
                        formData.birthYear
                          ? 'text-accent-blue'
                          : 'text-gray-500'
                      "
                    ></i>
                    <SelectValue placeholder="Chọn năm" class="text-sm" />
                  </div>
                </SelectTrigger>
                <SelectContent
                  class="bg-darker-surface border border-accent-blue/30 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto thin-scroll"
                  position="popper"
                  :side-offset="5"
                >
                  <SelectGroup>
                    <SelectItem
                      v-for="year in years"
                      :key="year.value"
                      :value="year.value"
                      class="px-3 py-2 text-sm text-white hover:bg-accent-blue/20 cursor-pointer transition-colors outline-none"
                    >
                      <SelectItemText>{{ year.label }}</SelectItemText>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
              <p
                v-if="errors.birthYear && touched.birthYear"
                class="mt-1 text-xs text-red-400"
              >
                {{ errors.birthYear }}
              </p>
            </div>
          </div>

          <!-- Phone and ID in one row -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Last 3 ID Digits -->
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-1.5">
                3 số cuối căn cước <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i
                    class="fas fa-hashtag text-xs"
                    :class="
                      formData.lastThreeId && !errors.lastThreeId
                        ? 'text-accent-blue'
                        : 'text-gray-500'
                    "
                  ></i>
                </div>
                <input
                  v-model="formData.lastThreeId"
                  @blur="
                    markTouched('lastThreeId');
                    validateLastThreeId();
                  "
                  @input="validateLastThreeId"
                  type="text"
                  maxlength="3"
                  placeholder="123"
                  class="w-full pl-9 pr-3 py-2.5 text-sm bg-darker-surface border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all text-center font-mono"
                  :class="
                    errors.lastThreeId && touched.lastThreeId
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-accent-blue/20 focus:border-accent-blue/50'
                  "
                />
              </div>
              <p
                v-if="errors.lastThreeId && touched.lastThreeId"
                class="mt-1 text-xs text-red-400"
              >
                {{ errors.lastThreeId }}
              </p>
            </div>
          </div>

          <!-- Info notice - compact -->
          <p class="text-xs text-gray-500 text-center pt-1">
            <i class="fas fa-info-circle mr-1"></i>
            Thông tin dùng để xác minh khi nhận giải
          </p>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            class="w-full bg-gradient-to-r from-cyber-green to-accent-blue hover:from-cyber-green/80 hover:to-accent-blue/80 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg font-bold text-sm text-black disabled:text-gray-400 transition-all duration-200 shadow-lg mt-2"
          >
            <i
              class="mr-2"
              :class="
                isSubmitting ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'
              "
            ></i>
            {{ isSubmitting ? "Đang xử lý..." : "Đăng ký ngay" }}
          </button>
        </form>

        <!-- Footer -->
        <div
          class="bg-darker-surface/50 border-t border-accent-blue/20 p-3 text-center"
        >
          <p class="text-xs text-gray-500">
            Đã có tài khoản?
            <a
              href="#"
              class="text-accent-blue hover:text-cyber-green transition-colors font-semibold"
            >
              Đăng nhập
            </a>
          </p>
        </div>
      </div>

      <!-- FontAwesome for icons -->
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
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

/* Radix Vue Select custom styles */
[data-radix-popper-content-wrapper] {
  z-index: 100 !important;
}
</style>
