<template>
  <div class="relative w-screen h-screen bg-[#060810] flex items-center justify-center overflow-hidden">

    <!-- Grid background -->
    <div class="cp-grid absolute inset-0 pointer-events-none" />

    <!-- Corner decorations -->
    <div class="absolute top-4 left-4 border-t border-l border-[#00f0ff] pointer-events-none" style="width:80px;height:80px;" />
    <div class="absolute top-4 right-4 border-t border-r border-[#ff2d78] pointer-events-none" style="width:80px;height:80px;" />
    <div class="absolute bottom-4 left-4 border-b border-l border-[#ff2d78] pointer-events-none" style="width:80px;height:80px;" />
    <div class="absolute bottom-4 right-4 border-b border-r border-[#00f0ff] pointer-events-none" style="width:80px;height:80px;" />

    <!-- ── Toast — Radix ToastProvider + ToastRoot ── -->
    <ToastProvider swipe-direction="up">
      <ToastRoot
        v-model:open="toastVisible"
        :duration="3000"
        class="fixed top-6 left-1/2 -translate-x-1/2 bg-[#060810] border z-[100] text-[12px] px-6 py-3 tracking-[2px] uppercase whitespace-nowrap toast-line
               data-[state=open]:animate-toast-in data-[state=closed]:animate-toast-out"
        :class="toastError ? 'border-[#ff2d78] text-[#ff2d78]' : 'border-[#00f0ff] text-[#00f0ff]'"
      >
        <ToastDescription>&gt; {{ toastMessage }}</ToastDescription>
      </ToastRoot>
      <ToastViewport class="fixed top-0 left-0 w-full pointer-events-none z-[100]" />
    </ToastProvider>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- LOGIN CARD                                              -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Transition name="card-swap">
      <div
        v-if="!showOnboarding"
        key="login"
        class="cp-card w-full max-w-[580px] mx-6 bg-[rgba(6,8,16,0.97)] border border-[#0a2030] relative z-[1]"
      >
        <div class="absolute -top-px left-5 right-5 h-px bg-[#00f0ff]" />
        <div class="absolute -bottom-px left-5 right-5 h-px bg-[#ff2d78]" />

        <!-- Header -->
        <div class="px-10 pt-9 pb-7 border-b border-[#0a2030] relative">
          <p class="text-[11px] text-[#00f0ff] tracking-[4px] uppercase mb-3 opacity-70">// SYSTEM ACCESS //</p>
          <h1 class="text-[30px] font-bold text-white mb-2 tracking-[2px] leading-tight">
            SIGN <span class="text-[#00f0ff]">IN</span>
          </h1>
          <p class="text-[12px] text-white/50 tracking-[1px]">NEURAL LINK AUTHENTICATION REQUIRED</p>
          <div class="absolute top-9 right-10 text-[10px] text-[#00f0ff] border border-[#00f0ff] px-2.5 py-1 tracking-[2px] opacity-60">
            SECURE
          </div>
        </div>

        <!-- Body -->
        <div class="px-10 pt-9 pb-8">
          <!-- Google button -->
          <button
            :disabled="isLoading"
            class="w-full flex items-center gap-4 px-6 py-5 bg-transparent border border-[#0e2840] text-white text-[14px] tracking-[1.5px] cursor-pointer text-left mb-4 relative overflow-hidden uppercase transition-all duration-200 group hover:bg-[rgba(0,240,255,0.05)] hover:border-[#00f0ff] hover:text-[#00f0ff] disabled:opacity-40 disabled:cursor-not-allowed"
            @click="handleGoogle"
          >
            <span class="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00f0ff] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <svg v-if="isLoading" class="w-6 h-6 flex-shrink-0 animate-spin text-[#00f0ff]" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
            <svg v-else class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span class="flex-1">{{ isLoading ? 'AUTHENTICATING...' : 'Continue with Google' }}</span>
            <span class="text-[10px] border border-[#0e4060] text-white px-2 py-0.5 tracking-[1px] transition-all duration-200 group-hover:border-[#00f0ff] group-hover:text-[#00f0ff]">ACTIVE</span>
          </button>

          <!-- Divider -->
          <div class="flex items-center gap-3 my-7">
            <div class="flex-1 h-px bg-[#0a1828]" />
            <span class="text-[10px] text-white/20 tracking-[3px]">// MORE OPTIONS //</span>
            <div class="flex-1 h-px bg-[#0a1828]" />
          </div>

          <!-- Terms -->
          <p class="text-[11px] text-white/50 tracking-[0.5px] leading-[1.8]">
            Bằng cách xác thực, bạn đồng ý với
            <a href="#" class="text-[#00f0ff] no-underline opacity-60 hover:opacity-100 transition-opacity">Terms of Service</a>
            và
            <a href="#" class="text-[#00f0ff] no-underline opacity-60 hover:opacity-100 transition-opacity">Privacy Policy</a>
            của chúng tôi.
          </p>
        </div>

        <!-- Footer -->
        <div class="border-t border-[#0a1828] px-10 py-4 flex justify-between items-center">
          <span class="text-[10px] text-white/20 tracking-[2px]">CORP. NETWORK v2.0.77</span>
          <div class="flex items-center gap-2 text-[10px] text-white/20">
            <span class="w-[6px] h-[6px] bg-[#00f0ff] rounded-full animate-pulse" />
            NODE ACTIVE
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- ONBOARDING OVERLAY                                      -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Transition name="card-swap">
      <div
        v-if="showOnboarding"
        key="onboarding"
        class="cp-card w-full max-w-[620px] mx-6 bg-[rgba(6,8,16,0.97)] border border-[#0a2030] relative z-[1] flex flex-col"
        style="max-height: 90vh;"
      >
        <div class="absolute -top-px left-5 right-5 h-px bg-[#00f0ff]" />
        <div class="absolute -bottom-px left-5 right-5 h-px bg-[#ff2d78]" />

        <!-- Header -->
        <div class="px-10 pt-8 pb-7 border-b border-[#0a2030] relative flex-shrink-0">
          <div class="absolute top-9 right-10 text-[10px] text-[#ff2d78] border border-[#ff2d78] px-2.5 py-1 tracking-[2px] opacity-70 font-bold">
            STEP 1/1
          </div>
          <div class="flex items-center gap-5 mb-4">
            <div class="relative flex-shrink-0">
              <div class="absolute inset-0 rounded-full bg-[#00f0ff] opacity-[0.08] blur-md scale-125" />
              <div class="relative w-[60px] h-[60px] rounded-full bg-[rgba(0,240,255,0.06)] border border-[#00f0ff]/30 flex items-center justify-center">
                <div class="absolute -top-[5px] -left-[5px] w-[10px] h-[10px] border-t border-l border-[#00f0ff]/60" />
                <div class="absolute -top-[5px] -right-[5px] w-[10px] h-[10px] border-t border-r border-[#00f0ff]/60" />
                <div class="absolute -bottom-[5px] -left-[5px] w-[10px] h-[10px] border-b border-l border-[#00f0ff]/60" />
                <div class="absolute -bottom-[5px] -right-[5px] w-[10px] h-[10px] border-b border-r border-[#00f0ff]/60" />
                <span class="font-orbitron text-[17px] font-bold text-[#00f0ff] select-none">{{ initials }}</span>
              </div>
              <span class="absolute bottom-0.5 right-0.5 w-[10px] h-[10px] rounded-full bg-[#00f0ff] border-2 border-[#060810] animate-pulse" />
            </div>
            <div>
              <p class="text-[11px] text-[#00f0ff]/60 tracking-[2px] uppercase mb-1">Xin chào,</p>
              <h1 class="font-orbitron text-[22px] font-bold text-white leading-none tracking-wide">
                {{ onboardingName || 'Operative' }}
              </h1>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-1.5 rounded-full bg-[#00f0ff]/60" />
            <p class="text-[12px] text-white/50 leading-relaxed">
              Gần xong rồi — hoàn tất hồ sơ để kích hoạt tài khoản của bạn.
            </p>
          </div>
        </div>

        <!-- Scrollable body -->
        <div class="overflow-y-auto flex-1 onboarding-scroll">

          <!-- Security notice -->
          <div class="mx-10 mt-7 border border-[#0a2030] bg-[rgba(0,240,255,0.02)] px-5 py-4 relative">
            <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00f0ff] opacity-50" />
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#ff2d78] opacity-50" />
            <div class="flex gap-3 items-start">
              <svg class="w-4 h-4 text-[#00f0ff] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <p class="text-[11px] text-white/50 leading-[1.9] tracking-[0.3px]">
                <span class="text-[#00f0ff] opacity-80">[ BẢO MẬT ]</span>
                Thông tin của bạn được mã hóa và bảo mật tuyệt đối. Hệ thống yêu cầu xác minh danh tính thực để
                <span class="text-white/80">ngăn chặn tài khoản smurf (bịp hạng)</span> — mỗi người chỉ được phép sở hữu
                <span class="text-[#00f0ff] opacity-80">một tài khoản duy nhất</span>. Khi nhận giải thưởng,
                CCCD/CMND phải khớp với thông tin đã đăng ký, nếu không kết quả sẽ bị hủy.
              </p>
            </div>
          </div>

          <!-- Form fields -->
          <div class="px-10 pt-7 pb-8 space-y-5">

            <!-- 01 Họ và tên — Radix Label -->
            <div>
              <Label for="fullName" class="cp-label">
                <span class="text-[#00f0ff] opacity-60 mr-2">01</span>
                <span class="text-white">HỌ VÀ TÊN</span>
                <span class="text-[#ff2d78] ml-1">*</span>
              </Label>
              <div class="cp-input-wrap" :class="{ 'is-error': errors.fullName }">
                <input
                  id="fullName"
                  v-model="form.fullName"
                  type="text"
                  class="cp-input"
                  placeholder="Nguyễn Văn A"
                  :aria-invalid="!!errors.fullName"
                  aria-describedby="err-fullName"
                  @blur="validateField('fullName')"
                />
              </div>
              <p v-if="errors.fullName" id="err-fullName" role="alert" class="cp-error">{{ errors.fullName }}</p>
            </div>

            <!-- 02 Ngày sinh — Radix Label -->
            <div>
              <Label for="dob" class="cp-label">
                <span class="text-[#00f0ff] opacity-60 mr-2">02</span>
                <span class="text-white">NGÀY THÁNG NĂM SINH</span>
                <span class="text-[#ff2d78] ml-1">*</span>
              </Label>
              <div class="cp-input-wrap" :class="{ 'is-error': errors.dob }">
                <input
                  id="dob"
                  v-model="form.dob"
                  type="date"
                  class="cp-input cp-date"
                  :max="maxDate"
                  :aria-invalid="!!errors.dob"
                  aria-describedby="err-dob"
                  @blur="validateField('dob')"
                />
                <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f0ff] opacity-40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <p v-if="errors.dob" id="err-dob" role="alert" class="cp-error">{{ errors.dob }}</p>
            </div>

            <!-- 03 4 số cuối CCCD — Radix Label -->
            <div>
              <Label for="idLast4" class="cp-label">
                <span class="text-[#00f0ff] opacity-60 mr-2">03</span>
                <span class="text-white">4 SỐ CUỐI CCCD / CMND</span>
                <span class="text-[#ff2d78] ml-1">*</span>
              </Label>
              <div class="cp-input-wrap" :class="{ 'is-error': errors.idLast4 }">
                <input
                  id="idLast4"
                  v-model="form.idLast4"
                  type="text"
                  inputmode="numeric"
                  maxlength="4"
                  class="cp-input tracking-[8px] text-[18px]"
                  placeholder="_ _ _ _"
                  :aria-invalid="!!errors.idLast4"
                  aria-describedby="err-idLast4 hint-idLast4"
                  @input="onIdInput"
                  @blur="validateField('idLast4')"
                />
                <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f0ff] opacity-40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                </svg>
              </div>
              <p v-if="errors.idLast4" id="err-idLast4" role="alert" class="cp-error">{{ errors.idLast4 }}</p>
              <p id="hint-idLast4" class="text-[10px] text-white/20 mt-1.5 tracking-[0.5px]">Chỉ nhập 4 chữ số cuối — dùng để đối chiếu khi nhận giải</p>
            </div>

            <!-- 04 Số điện thoại — Radix Select + Label -->
            <div>
              <Label for="phone" class="cp-label">
                <span class="text-[#00f0ff] opacity-60 mr-2">04</span>
                SỐ ĐIỆN THOẠI
                <span class="text-[#ff2d78] ml-1">*</span>
              </Label>

              <div class="flex gap-2">
                <!-- ── Radix SelectRoot: quản lý open/close, keyboard, focus trap tự động ── -->
                <SelectRoot v-model="selectedCountryCode" @update:model-value="onCountryChange">

                  <!-- Trigger — thay thế div + manual click handler -->
                  <SelectTrigger
                    class="flex-shrink-0 flex items-center gap-2 px-3 min-w-[106px] h-full border transition-all duration-200 cursor-pointer select-none
                           border-[#0e2840] bg-transparent text-white
                           hover:border-[#00f0ff] hover:bg-[rgba(0,240,255,0.02)]
                           focus:outline-none focus:border-[#00f0ff] focus:bg-[rgba(0,240,255,0.02)]
                           data-[state=open]:border-[#00f0ff] data-[state=open]:bg-[rgba(0,240,255,0.02)]"
                    :class="{ '!border-[#ff2d78]': errors.phone }"
                    aria-label="Chọn quốc gia"
                  >
                    <SelectValue>
                      <span class="flex items-center gap-2 py-[14px]">
                        <span class="text-[17px] leading-none">{{ currentCountry.flag }}</span>
                        <span class="text-[12px] text-[#00f0ff] font-mono tracking-wider">{{ currentCountry.dial }}</span>
                      </span>
                    </SelectValue>
                    <SelectIcon class="ml-auto flex-shrink-0">
                      <svg
                        class="w-3 h-3 text-white/30 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </SelectIcon>
                  </SelectTrigger>

                  <!-- Portal: tránh bị clip bởi overflow:hidden của card -->
                  <SelectPortal>
                    <SelectContent
                      position="popper"
                      :side-offset="2"
                      class="w-[200px] bg-[#060c14] border border-[#0e2840] z-[200] shadow-[0_8px_32px_rgba(0,0,0,0.7)]
                             data-[state=open]:animate-select-in data-[state=closed]:animate-select-out
                             will-change-[opacity,transform]"
                    >
                      <SelectViewport>
                        <SelectItem
                          v-for="c in countryOptions"
                          :key="c.code"
                          :value="c.code"
                          class="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 outline-none
                                 text-white/60
                                 hover:bg-[rgba(0,240,255,0.05)] hover:text-white
                                 focus:bg-[rgba(0,240,255,0.05)] focus:text-white
                                 data-[state=checked]:bg-[rgba(0,240,255,0.06)] data-[state=checked]:text-[#00f0ff]"
                        >
                          <span class="text-[18px] leading-none flex-shrink-0">{{ c.flag }}</span>
                          <div class="flex flex-col flex-1 min-w-0">
                            <span class="text-[11px] tracking-wider uppercase">{{ c.name }}</span>
                            <span class="text-[10px] text-white/30 font-mono">{{ c.dial }}</span>
                          </div>
                          <!-- Chỉ render khi item đang được chọn — không cần v-if thủ công -->
                          <SelectItemIndicator>
                            <svg class="w-3 h-3 text-[#00f0ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </SelectItemIndicator>
                        </SelectItem>
                      </SelectViewport>
                    </SelectContent>
                  </SelectPortal>
                </SelectRoot>

                <!-- Phone input -->
                <div class="cp-input-wrap flex-1" :class="{ 'is-error': errors.phone }">
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    inputmode="numeric"
                    class="cp-input"
                    :placeholder="currentCountry.code === 'VN' ? '912 345 678' : 'Số điện thoại...'"
                    :aria-invalid="!!errors.phone"
                    aria-describedby="err-phone hint-phone"
                    @input="onPhoneInput"
                    @blur="validateField('phone')"
                  />
                </div>
              </div>

              <p v-if="errors.phone" id="err-phone" role="alert" class="cp-error">{{ errors.phone }}</p>
              <p id="hint-phone" class="text-[10px] text-white/20 mt-1.5 tracking-[0.5px]">
                <span v-if="currentCountry.code === 'VN'">9 chữ số (không cần 0 đầu) hoặc 10 số có 0 đầu — VD: 912345678</span>
                <span v-else>Nhập số theo định dạng quốc tế, không gồm mã quốc gia</span>
              </p>
            </div>

            <!-- Submit -->
            <div class="pt-3">
              <button
                :disabled="isSubmitting"
                class="w-full flex items-center justify-center gap-3 px-6 py-5 border border-[#00f0ff] text-[#00f0ff] text-[14px] tracking-[3px] uppercase font-semibold transition-all duration-200 relative overflow-hidden group hover:bg-[rgba(0,240,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed"
                @click="handleSubmit"
              >
                <span class="absolute inset-0 btn-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN DANH TÍNH' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-[#0a1828] px-10 py-4 flex justify-between items-center flex-shrink-0">
          <span class="text-[10px] text-white/20 tracking-[2px]">IDENTITY PROTOCOL v1.0</span>
          <div class="flex items-center gap-2 text-[10px] text-white/20">
            <span class="w-[6px] h-[6px] bg-[#00f0ff] rounded-full animate-pulse" />
            SECURE CHANNEL
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { create } from '@bufbuild/protobuf'
import { initializeApp } from '@firebase/app'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from '@firebase/auth'
import { AuthWithGoogleRequestSchema } from '@gd/proto/auth/v1/auth_service_pb'

// ── Radix Vue primitives ──────────────────────────────────────
// Label: liên kết <label> với input đúng chuẩn a11y (htmlFor)
import { Label } from 'radix-vue'

// Select: dropdown accessible — tự handle keyboard nav, focus trap,
//         outside click, portal, ARIA roles (listbox/option)
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'radix-vue'

// Toast: notification accessible — tự handle live region ARIA,
//        swipe-to-dismiss, auto-dismiss timer, animation states
import {
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastViewport,
} from 'radix-vue'

// ── Firebase ──────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyBWixitHjAjG4pz8q3ENVUq5wGwnEoogoo',
  authDomain: 'gdvn-840be.firebaseapp.com',
  projectId: 'gdvn-840be',
  storageBucket: 'gdvn-840be.firebasestorage.app',
  messagingSenderId: '620563142499',
  appId: '1:620563142499:web:5935ee9d006c7055816556',
  measurementId: 'G-RBEX10LKLD',
}
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

const router = useRouter()
const route = useRoute()

// ── UI state ──────────────────────────────────────────────────
const isLoading    = ref(false)
const isSubmitting = ref(false)

// Toast — Radix ToastRoot dùng v-model:open thay vì setTimeout thủ công
const toastVisible = ref(false)
const toastMessage = ref('')
const toastError   = ref(false)

// ── Onboarding state ──────────────────────────────────────────
const showOnboarding = ref(false)
const onboardingName = ref('')

const form   = ref({ fullName: '', dob: '', idLast4: '', phone: '' })
const errors = ref({ fullName: '', dob: '', idLast4: '', phone: '' })

// ── Country selector — driven bởi Radix SelectRoot v-model ───
const countryOptions = [
  { code: 'VN',   name: 'Việt Nam', dial: '+84',  flag: '🇻🇳' },
  { code: 'INTL', name: 'Quốc tế',  dial: '+...', flag: '🌐'  },
] as const

type CountryCode = typeof countryOptions[number]['code']

// v-model của SelectRoot nhận/trả string (value của SelectItem)
const selectedCountryCode = ref<CountryCode>('VN')

// Derived object — dùng trong template và validation
const currentCountry = computed(
  () => countryOptions.find(c => c.code === selectedCountryCode.value) ?? countryOptions[0]
)

function onCountryChange(code: string) {
  selectedCountryCode.value = code as CountryCode
  // Reset phone khi đổi quốc gia
  form.value.phone   = ''
  errors.value.phone = ''
}

// ── Computed ──────────────────────────────────────────────────
const maxDate = computed(() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 13)
  return d.toISOString().split('T')[0]
})

const initials = computed(() =>
  (form.value.fullName || onboardingName.value || '?')
    .split(' ').filter(Boolean).slice(-2)
    .map((w: string) => w[0].toUpperCase()).join('')
)

// ── Toast helper — Radix tự dismiss sau :duration ms ─────────
function showToast(message: string, error = false) {
  toastMessage.value = message
  toastError.value   = error
  toastVisible.value = true
  // Không cần setTimeout để set false — Radix tự xử lý qua :duration
}

// ── Google Sign-In ────────────────────────────────────────────
async function handleGoogle() {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const result  = await signInWithPopup(auth, provider)
    const idToken = await result.user.getIdToken()

    console.log('idToken', idToken)

    const authReq  = create(AuthWithGoogleRequestSchema, { idToken })
    const authData = await AuthClient.authWithGoogle(authReq)
    console.log("authData", authData)
    if (idToken) {
      // onboardingName.value  = authData.displayName || result.user.displayName || ''
      // form.value.fullName   = onboardingName.value
      showOnboarding.value = true
    } else {
      // const redirect = route.query.redirect as string
      // router.push(redirect || '/dashboard')
    }
  } catch (err: any) {
    const messages: Record<string, string> = {
      'auth/popup-closed-by-user':  'POPUP CLOSED — TRY AGAIN',
      'auth/network-request-failed': 'NETWORK ERROR',
    }
    showToast(messages[err.code] ?? 'AUTH FAILED', true)
  } finally {
    isLoading.value = false
  }
}

// ── Input handlers ────────────────────────────────────────────
function onIdInput(e: Event) {
  form.value.idLast4 = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4)
}

function onPhoneInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  if (currentCountry.value.code === 'VN') {
    // 0xxx... → max 10 số | xxx... → max 9 số
    form.value.phone = raw.slice(0, raw.startsWith('0') ? 10 : 9)
  } else {
    form.value.phone = raw.slice(0, 15)
  }
}

// ── Validation ────────────────────────────────────────────────
function validateField(field: keyof typeof errors.value) {
  errors.value[field] = ''

  if (field === 'fullName') {
    if (!form.value.fullName.trim())          errors.value.fullName = '⚠ Vui lòng nhập họ và tên'
    else if (form.value.fullName.trim().length < 2) errors.value.fullName = '⚠ Họ tên quá ngắn'
  }

  if (field === 'dob') {
    if (!form.value.dob) {
      errors.value.dob = '⚠ Vui lòng chọn ngày sinh'
    } else {
      const age = (Date.now() - new Date(form.value.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      if (age < 13)  errors.value.dob = '⚠ Bạn phải ít nhất 13 tuổi'
      if (age > 100) errors.value.dob = '⚠ Ngày sinh không hợp lệ'
    }
  }

  if (field === 'idLast4') {
    if (!form.value.idLast4)                      errors.value.idLast4 = '⚠ Vui lòng nhập 4 số cuối CCCD'
    else if (!/^\d{4}$/.test(form.value.idLast4)) errors.value.idLast4 = '⚠ Phải là đúng 4 chữ số'
  }

  if (field === 'phone') {
    if (!form.value.phone) {
      errors.value.phone = '⚠ Vui lòng nhập số điện thoại'
    } else if (currentCountry.value.code === 'VN') {
      const vn9  = /^[3-9]\d{8}$/.test(form.value.phone)   // 9 số, không có 0 đầu
      const vn10 = /^0[3-9]\d{8}$/.test(form.value.phone)  // 10 số, có 0 đầu
      if (!vn9 && !vn10) errors.value.phone = '⚠ Số VN không hợp lệ — VD: 912345678 hoặc 0912345678'
    } else {
      if (form.value.phone.length < 5) errors.value.phone = '⚠ Số quốc tế quá ngắn'
    }
  }
}

function validateAll() {
  const fields = ['fullName', 'dob', 'idLast4', 'phone'] as const
  fields.forEach(validateField)
  return fields.every(f => !errors.value[f])
}

// ── Submit onboarding ─────────────────────────────────────────
async function handleSubmit() {
  if (isSubmitting.value) return
  if (!validateAll()) {
    showToast('VUI LÒNG KIỂM TRA LẠI THÔNG TIN', true)
    return
  }
  isSubmitting.value = true
  try {
    // const dialCode = currentCountry.value.code === 'VN' ? '+84' : currentCountry.value.dial
    // await ProfileClient.updateProfile({
    //   fullName: form.value.fullName,
    //   dob:      form.value.dob,
    //   idLast4:  form.value.idLast4,
    //   phone:    dialCode + form.value.phone.replace(/^0/, ''),
    // })
    showToast('IDENTITY CONFIRMED — WELCOME OPERATIVE')
    // setTimeout(() => {
    //   const redirect = route.query.redirect as string
    //   router.push(redirect || '/dashboard')
    // }, 1500)
  } catch (err: any) {
    showToast(err?.message ?? 'CẬP NHẬT THẤT BẠI', true)
  } finally {
    isSubmitting.value = false
  }
}

// ── Auth state listener ───────────────────────────────────────
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user && !showOnboarding.value) {
      // const redirect = route.query.redirect as string
      // router.push(redirect || '/dashboard')
    }
  })
  // Không cần addEventListener('click') nữa — Radix Select tự xử lý outside click
})
</script>

<style scoped>
/* ── Grid background ── */
.cp-grid {
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* ── Scrollbar ── */
.onboarding-scroll { scrollbar-width: thin; scrollbar-color: #0e2840 transparent; }
.onboarding-scroll::-webkit-scrollbar { width: 4px; }
.onboarding-scroll::-webkit-scrollbar-track { background: transparent; }
.onboarding-scroll::-webkit-scrollbar-thumb { background: #0e2840; }
.onboarding-scroll::-webkit-scrollbar-thumb:hover { background: #00f0ff33; }

/* ── Label (shared với Radix Label) ── */
.cp-label {
  display: block;
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 8px;
  cursor: default;
}

/* ── Input wrapper ── */
.cp-input-wrap {
  position: relative;
  border: 1px solid #0e2840;
  transition: border-color 0.2s;
}
.cp-input-wrap:focus-within { border-color: #00f0ff; background: rgba(0,240,255,0.02); }
.cp-input-wrap.is-error { border-color: #ff2d78; }

/* ── Input ── */
.cp-input {
  width: 100%;
  background: transparent;
  color: white;
  font-family: 'Share Tech Mono', monospace;
  font-size: 14px;
  letter-spacing: 1px;
  padding: 14px 16px;
  outline: none;
  border: none;
}
.cp-input::placeholder { color: rgba(255,255,255,0.2); }

/* ── Date picker ── */
.cp-date::-webkit-calendar-picker-indicator { opacity: 0; cursor: pointer; position: absolute; right: 0; width: 40px; height: 100%; }
.cp-date::-webkit-datetime-edit,
.cp-date::-webkit-datetime-edit-fields-wrapper { color: white; }

/* ── Error ── */
.cp-error { font-size: 10px; color: #ff2d78; letter-spacing: 1px; margin-top: 6px; }

/* ── Button shimmer ── */
.btn-shimmer { background: linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.06) 50%, transparent 100%); }

/* ── Toast accent line ── */
.toast-line::before { content: ''; position: absolute; top: -1px; left: 10px; right: 10px; height: 1px; background: currentColor; }

/* ── Card swap transition ── */
.card-swap-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.card-swap-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; position: absolute; }
.card-swap-enter-from   { opacity: 0; transform: translateY(16px); }
.card-swap-leave-to     { opacity: 0; transform: translateY(-16px); }

/* ── Radix Select content animation (kích hoạt qua data-[state] attr) ── */
@keyframes selectIn  { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes selectOut { from { opacity: 1; transform: translateY(0);    } to { opacity: 0; transform: translateY(-6px); } }
[data-state="open"].animate-select-in   { animation: selectIn  0.15s ease forwards; }
[data-state="closed"].animate-select-out { animation: selectOut 0.12s ease forwards; }

/* ── Radix Toast animation (kích hoạt qua data-[state] attr) ── */
@keyframes toastIn  { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
@keyframes toastOut { from { opacity: 1; transform: translateX(-50%) translateY(0);     } to { opacity: 0; transform: translateX(-50%) translateY(-10px); } }
[data-state="open"].animate-toast-in   { animation: toastIn  0.25s ease forwards; }
[data-state="closed"].animate-toast-out { animation: toastOut 0.2s  ease forwards; }
</style>