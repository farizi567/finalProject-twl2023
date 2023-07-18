<template>
  <div class="h-screen w-full bg-gray-200 flex items-center justify-center">
    <div class="flex flex-col w-1/2 bg-white rounded p-5 gap-y-5">
      <section class="flex flex-col items-center justify-center w-full">
        <h1 class="flex items-center text-xl">
          File yang Tersimpan
        </h1>
      </section>
      <NuxtLink to="/beranda" class="text-blue-700 underline">
        Upload File
      </NuxtLink>
      <section class="flex flex-col items-center justify-center w-full">
        <table class="border-collapse border border-slate-500 w-full">
          <thead>
            <tr>
              <th class="border border-slate-600 w-[80%] py-2">
                Nama File
              </th>
              <th class="border border-slate-600 w-[20%]">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="file in getDataFileFromGoogleDrive"
              :key="file.id"
              class=""
            >
              <td
                v-if="!editSession || editSession !== file.id"
                class="border border-slate-700"
              >
                {{ file.name }}
              </td>
              <td v-else class="border border-slate-700">
                <form class="w-full" @submit.prevent="submitFileName(file.id)">
                  <input
                    v-model="newName"
                    :placeholder="file.name"
                    type="text"
                    class="border border-slate-700"
                  >
                  <button
                    type="submit"
                    class="text-white bg-green-500 rounded-sm px-2"
                  >
                    Simpan
                  </button>
                </form>
              </td>
              <td
                class="py-2 border border-slate-700 flex justify-center items-center gap-2"
              >
                <button
                  class="text-white bg-red-500 rounded-sm px-2"
                  @click="handleDeleteFile(file.id)"
                >
                  Hapus
                </button>
                <button
                  class="text-white bg-blue-500 rounded-sm px-2"
                  @click="toggleEdit(file.id)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  middleware: 'auth',
  data () {
    return {
      editSession: false,

      newName: ''
    }
  },
  mounted () {
    this.ambilDataFile()
  },

  computed: {
    ...mapGetters('crud', ['getDataFileFromGoogleDrive'])
  },

  methods: {
    ...mapActions('crud', ['ambilDataFile', 'deleteFile', 'updateFileName']),

    async handleDeleteFile (id) {
      console.log(id)
      const response = await this.deleteFile(id)
      console.log(response)
      if (response.status === 200) {
        this.$toast.success(response.message)
        setTimeout(() => {
          window.location.reload() // Refresh halaman setelah penundaan 1000ms (1 detik)
        }, 1000)
      } else {
        this.$toast.error(response.message)
      }
    },

    async submitFileName (idFile) {
      const payload = {
        id: idFile,
        newName: this.newName
      }

      const response = await this.updateFileName(payload)
      if (response.status === 200) {
        console.log(response)
        this.$toast.success(response.message)
        setTimeout(() => {
          window.location.reload() // Refresh halaman setelah penundaan 1000ms (1 detik)
        }, 1000)
      } else {
        this.$toast.error(response.data.message)
      }
    },

    toggleEdit (fileId) {
      this.editSession = this.editSession !== fileId ? fileId : null
    }
  }
}
</script>
