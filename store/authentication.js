export const actions = {
  async registerUser (state, data) {
    try {
      const response = await this.$axios.$post('users/register', data)
      return response
    } catch (e) {
      return e.response
    }
  },
  async loginUser (state, data) {
    try {
      const response = await this.$axios.$post('users/login', data)
      return response
    } catch (error) {
      return error.response
    }
  }
}
