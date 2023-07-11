<template>
  <div class="h-screen w-full bg-gray-200 flex items-center justify-center">
    <div class="flex flex-col w-1/2 bg-white rounded p-5 gap-y-5">
      <div class="flex flex-col items-center justify-center w-full">
        <h1 class="flex items-center text-xl">
          Pengiriman Dokumen
        </h1>
      </div>
      <form
        enctype="multipart/form-data"
        class="flex flex-col gap-3"
        @submit.prevent="submitForm"
      >
        <div class="">
          <label for="nama">Nama</label>
          <input
            id="nama"
            v-model="form.nama"
            type="text"
            placeholder="Nama"
            class="border p-2 rounded w-full"
          >
          <span
            v-if="errors.nama !== ''"
            class="error-message text-red-500 text-sm"
          >
            {{ errors.nama }}
          </span>
        </div>
        <div>
          <label for="nim">NIM</label>
          <input
            id="nim"
            v-model="form.nim"
            type="text"
            placeholder="NIM"
            class="border p-2 rounded w-full"
          >
          <span
            v-if="errors.nim !== ''"
            class="error-message text-red-500 text-sm"
          >
            {{ errors.nim }}
          </span>
        </div>
        <div>
          <label for="prodi">Prodi</label>
          <input
            id="prodi"
            v-model="form.prodi"
            type="text"
            placeholder="Prodi"
            class="border p-2 rounded w-full"
          >
          <span
            v-if="errors.prodi !== ''"
            class="error-message text-red-500 text-sm"
          >
            {{ errors.prodi }}
          </span>
        </div>
        <div>
          <label for="berkas">Lampiran Berkas</label>
          <div
            class="w-full flex flex-col border border border-dashed px-2 py-5 flex items-center justify-center gap-5"
          >
            <input
              id="berkas"
              ref="fileInput"
              accept=".pdf,.doc,.docx"
              type="file"
              class="hidden"
              @change="onFileChange"
            >
            <p v-if="fileName" class="text-center">
              {{ fileName }}
            </p>
            <label
              for="berkas"
              class="cursor-pointer px-5 py-1 bg-blue-400 text-white rounded"
            >Pilih File</label>
          </div>
        </div>
        <button
          :disabled="disabled"
          :class="{
            'w-full text-white bg-[#2AE98D] hover:bg-[#22f58f] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center':
              !disabled,
            'bg-gray-200 text-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full ':
              disabled
          }"
          type="submit"
        >
          Kirim
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      disabled: true,
      form: {
        nama: '',
        nim: '',
        prodi: '',
        file: ''
      },
      errors: {
        nama: '',
        nim: '',
        prodi: '',
        file: ''
      },
      fileName: ''
    }
  },
  watch: {
    form: {
      deep: true,
      handler () {
        if (this.validasiNama() && this.validasiNim()) {
          this.checkInput()
        } else {
          this.disabled = true
        }
      }
    },

    'form.nama': {
      handler () {
        this.errors.nama =
          this.form.nama === ''
            ? 'Nama harus diisi'
            : !this.validasiNama()
                ? 'Nama hanya boleh berisi huruf saja'
                : ''
      }
    },
    'form.nim': {
      handler () {
        this.errors.nim =
          this.form.nim === ''
            ? 'NIM wajib di isi'
            : !this.validasiNim()
                ? 'Nim tidak valid dan hanya boleh berisi angka saja'
                : ''
      }
    },
    'form.prodi': {
      handler () {
        this.errors.prodi = this.errors.prodi =
          this.form.prodi === '' ? 'Prodi wajib diisi' : ''
      }
    }
  },

  methods: {
    ...mapActions('upload', ['uploadForm']),
    checkInput () {
      this.disabled = !Object.keys(this.form).every(e => this.form[e] !== '')
    },

    onFileChange (event) {
      const file = event.target.files[0]
      if (file) {
        this.fileName = file.name
        this.form.file = file
        // Anda dapat melakukan tindakan lain dengan file di sini
      }
    },

    validasiNama () {
      return this.form.nama.length > 0
    },
    validasiNim () {
      const nim = /^[0-9]+$/
      return this.form.nim !== '' && nim.test(this.form.nim)
    },

    async submitForm () {
      const data = {
        nama: this.form.nama,
        nim: this.form.nim,
        prodi: this.form.prodi,
        file: this.form.file
      }
      const response = await this.uploadForm(data)
      console.log(response, 'res uplaod file')
      if (response.data.status === 200) {
        this.$toast.success(response.message)
        setTimeout(() => {
          window.location.reload() // Refresh halaman setelah penundaan 1000ms (1 detik)
        }, 1000)
      } else {
        this.$toast.error(response.message)
      }
    }
  }
}
</script>
