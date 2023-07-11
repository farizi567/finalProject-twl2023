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
  }
}
