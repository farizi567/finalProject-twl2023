export const mutations = {
  setTokenUser (state, token) {
    localStorage.setItem('token', token)
  }
}

export const actions = {
  async registerUser (state, data) {
    try {
      const response = await this.$axios.$post('users/register', data)
      return response
    } catch (e) {
      return e.response
    }
  },
  async loginUser ({ commit }, data) {
    try {
      const response = await this.$auth.loginWith('local', data)
      commit('setTokenUser', response.data.token)
      return response
    } catch (error) {
      return error.response
    }
  }
}
