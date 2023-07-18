export const state = () => ({
  files: []
})

export const mutations = {
  setDataFile (state, data) {
    state.files = data
  }
}

export const actions = {
  async uploadForm (ctx, data) {
    try {
      const headers = { 'Content-Type': 'multipart/form-data' }
      const formData = new FormData()
      formData.append('nama', data.nama)
      formData.append('nim', data.nim)
      formData.append('prodi', data.prodi)
      formData.append('file', data.file)

      const response = await this.$axios.$post('users/upload', formData, {
        headers
      })
      return response
    } catch (e) {
      return e.response
    }
  },

  async ambilDataFile ({ commit }) {
    try {
      const response = await this.$axios.$get('users/getFiles')
      const file = response

      commit('setDataFile', file)
    } catch (error) {
      console.error(error)
    }
  },

  async deleteFile (state, id) {
    try {
      const response = await this.$axios.$delete(`users/files/${id}`)
      return response
    } catch (error) {
      return error.response
    }
  },

  async updateFileName ({ commit }, payload) {
    try {
      const response = await this.$axios.$put(`users/files/${payload.id}`, {
        newName: payload.newName
      })
      return response
    } catch (err) {
      return err.response
    }
  }
}

export const getters = {
  getDataFileFromGoogleDrive: (state) => {
    return state.files.files
  },

  getDataFileFromMongoDb: (state) => {
    return state.files.data
  }
}
