<template>
  <div>
    <section class="bg-slate-900">
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      >
        <h1 class="flex items-center mb-6 text-2xl font-semibold text-gray-300">
          Registrations
        </h1>
        <div
          class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0"
        >
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
              class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
            >
              Create and account
            </h1>
            <form class="space-y-4 md:space-y-6" @submit.prevent="submitRegis">
              <div>
                <label
                  for="username"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >Your username</label>
                <input
                  id="username"
                  v-model="form.username"
                  type="username"
                  name="username"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Input your username"
                  required
                >
                <span
                  v-if="errors.username !== ''"
                  class="error-message text-red-500 text-sm"
                >
                  {{ errors.username }}
                </span>
              </div>
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >Your email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  name="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Input your email"
                  required
                >
                <span
                  v-if="errors.email !== ''"
                  class="error-message text-red-500 text-sm"
                >
                  {{ errors.email }}
                </span>
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >Password</label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  name="password"
                  placeholder="Input your password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                >
                <span
                  v-if="errors.password !== ''"
                  class="error-message text-red-500 text-sm"
                >
                  {{ errors.password }}
                </span>
              </div>
              <div>
                <label
                  for="confirm-password"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >Confirm password</label>
                <input
                  id="confirm-password"
                  v-model="form.confirmPassword"
                  type="password"
                  name="confirm-password"
                  placeholder="Retype your password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                >
                <span
                  v-if="errors.confirmPassword !== ''"
                  class="error-message text-red-500 text-sm"
                >
                  {{ errors.confirmPassword }}
                </span>
              </div>
              <button
                type="submit"
                :disabled="disabled"
                :class="{
                  'w-full text-white bg-[#2AE98D] hover:bg-[#22f58f] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center':
                    !disabled,
                  'bg-gray-200 text-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full ':
                    disabled
                }"
              >
                Create an account
              </button>
              <p class="text-sm font-light text-gray-500">
                Already have an account?
                <NuxtLink
                  to="/login"
                  class="font-medium text-primary-600 hover:underline"
                >
                  Login here
                </NuxtLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'RegisterPage',

  data () {
    return {
      disabled: true,
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      errors: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },

  watch: {
    form: {
      deep: true,
      handler () {
        if (
          this.validateEmail() &&
          this.validatePassword() &&
          this.validateRetypePassword()
        ) {
          this.checkInput()
        } else {
          this.btnDisabled = true
        }
      }
    },

    'form.username': {
      handler () {
        this.errors.username =
          this.form.username === ''
            ? 'Nama harus diisi'
            : !this.validateUsername()
                ? 'Nama hanya boleh berisi huruf saja'
                : ''
      }
    },
    'form.email': {
      handler () {
        this.errors.email =
          this.form.email === ''
            ? 'Email harus diisi'
            : !this.validateEmail()
                ? 'Email tidak valid'
                : ''
      }
    },
    'form.password': {
      handler () {
        this.errors.password =
          this.form.password === ''
            ? 'Password harus diisi'
            : !this.validatePassword()
                ? 'Kata sandi minimal harus 6 karakter, 1 huruf besar dan 1 angka'
                : ''
        this.errors.confirmPassword = !this.validateRetypePassword()
          ? 'Kata sandi tidak cocok'
          : ''
      }
    },
    'form.confirmPassword': {
      handler () {
        this.errors.confirmPassword = !this.validateRetypePassword()
          ? 'Kata sandi tidak cocok'
          : ''
      }
    }
  },

  methods: {
    ...mapActions('authentication', ['registerUser']),
    checkInput () {
      this.disabled = !Object.keys(this.form).every(e => this.form[e] !== '')
    },

    validateUsername () {
      return this.form.username.length > 0
    },
    validateEmail () {
      const emailRegex = /\S+@\S+\.\S+/
      return emailRegex.test(this.form.email)
    },
    validatePassword () {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/
      return passwordRegex.test(this.form.password)
    },

    validateRetypePassword () {
      return this.form.confirmPassword === this.form.password
    },

    async submitRegis () {
      const data = {
        username: this.form.username,
        email: this.form.email,
        password: this.form.password
      }
      const response = await this.registerUser(data)
      console.log(response)
      if (response.status === 201) {
        this.$toast.success(response.message)
        this.$router.push('/login')
      } else {
        this.$toast.error(response.data.message)
      }
    }
  }
}
</script>
