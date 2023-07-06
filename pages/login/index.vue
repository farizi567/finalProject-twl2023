<template>
  <div class="bg-slate-900 h-screen flex items-center justify-center">
    <div
      class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8"
    >
      <form class="space-y-6" @submit.prevent="submitLoginForm">
        <h5 class="text-xl font-medium text-gray-900">
          Login Form Validation
        </h5>
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
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Input your email"
            required
          >
          <span v-if="errors.email" class="text-sm text-red-500">
            {{ errors.email }}</span>
        </div>
        <div>
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900"
          >Your password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            name="password"
            placeholder="Input your password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
          <span v-if="errors.password" class="text-sm text-red-500">
            {{ errors.password }}</span>
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
          Login to your account
        </button>
        <div class="text-sm font-medium text-gray-500">
          Not registered?
          <NuxtLink to="/regis" class="text-blue-700 hover:underline">
            Create account
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'LoginPage',

  data () {
    return {
      disabled: true,
      form: {
        email: '',
        password: ''
      },
      errors: {
        email: '',
        password: ''
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler () {
        if (this.validateEmail() && this.validatePassword()) {
          this.checkInput()
        } else {
          this.disabled = true
        }
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
      }
    }
  },
  methods: {
    ...mapActions('authentication', ['loginUser']),
    checkInput () {
      this.disabled = !Object.keys(this.form).every(e => this.form[e] !== '')
    },
    validateEmail () {
      const emailRegex = /\S+@\S+\.\S+/
      return emailRegex.test(this.form.email)
    },
    validatePassword () {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/
      return passwordRegex.test(this.form.password)
    },
    async submitLoginForm () {
      const data = {
        email: this.form.email,
        password: this.form.password
      }
      const response = await this.loginUser(data)
      if (response.status === 200) {
        console.log(response)
        this.$toast.success(response.message)
        this.$router.push('/beranda')
      } else {
        this.$toast.error(response.data.message)
      }
    }
  }
}
</script>
