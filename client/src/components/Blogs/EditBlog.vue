<template> 
  <div class="edit-blog-container">
    <h1>Edit Movie</h1>
    <form v-on:submit.prevent="editBlog">
      <div class="form-group">
        <label for="title">ชื่อเรื่อง:</label>
        <input type="text" v-model="blog.title" id="title" class="form-input" />
      </div>

      <transition name="fade">
        <div class="thumbnail-pic" v-if="blog.thumbnail !== 'null'">
          <img :src="BASE_URL + blog.thumbnail" alt="thumbnail" />
        </div>
      </transition>

      <div class="upload-section">
        <form enctype="multipart/form-data" novalidate>
          <div class="dropbox">
            <input
              type="file"
              multiple
              :name="uploadFieldName"
              :disabled="isSaving"
              @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
              accept="image/*"
              class="input-file"
            />
            <p v-if="isInitial">Drag your file(s) here or click to browse</p>
            <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
            <p v-if="isSuccess">Upload Successful.</p>
          </div>
        </form>

        <transition-group tag="ul" class="pictures">
          <li v-for="picture in pictures" :key="picture.id">
            <img :src="BASE_URL + picture.name" alt="picture image" />
            <br />
            <button v-on:click.prevent="useThumbnail(picture.name)">ใช่รูปนี้</button>
            <button v-on:click.prevent="delFile(picture)">ลบ</button>
          </li>
        </transition-group>
      </div>

      <div class="form-group content-section">
        <label for="content">เรื่องย่อ:</label>
        <vue-ckeditor
          v-model.lazy="blog.content"
          :config="config"
          @blur="onBlur"
          @focus="onFocus"
        />
      </div>

      <div class="form-group">
        <label for="pictures">ความยาวภาพยนตร์ :</label>
        <input type="text" v-model="blog.pictures" id="pictures" class="form-input" />
      </div>

      <div class="form-group">
        <label for="category">ประเภทภาพยนตร์:</label>
        <input type="text" v-model="blog.category" id="category" class="form-input" />
      </div>

      <div class="form-group">
        <label for="status">นักแสดงนำ :</label>
        <input type="text" v-model="blog.status" id="status" class="form-input" />
      </div>

      <div class="form-group">
  <label for="createdAt">วันที่ออกฉาย :</label>
  <input type="date" v-model="blog.createdAt" id="createdAt" class="form-input" />
</div>

      <div class="button-group">
        <button type="submit">อัพเดทข้อมูล</button>
        <button v-on:click="navigateTo('/blogs')">กลับ</button>
      </div>
    </form>
  </div>
</template>

<script>
import BlogsService from "@/services/BlogsService";
import VueCkeditor from "vue-ckeditor2";
import UploadService from "../../services/UploadService";

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
  components: { VueCkeditor },
  data() {
    return {
      BASE_URL: "http://localhost:8081/assets/uploads/",
      blog: { title: "", thumbnail: "null", pictures: "null", content: "", category: "", status: "" },
      config: { toolbar: [["Bold", "Italic", "Underline"]], height: 300 },
      currentStatus: STATUS_INITIAL,
      uploadFieldName: "userPhoto",
      uploadedFileNames: [],
      pictures: [],
      pictureIndex: 0,
      fileCount: 0,
    };
  },
  methods: {
    async editBlog() {
      try {
        await BlogsService.put(this.blog);
        this.$router.push({ name: "blogs" });
      } catch (err) { console.log(err); }
    },
    async delFile(material) {
      let result = confirm("Want to delete?");
      if (result) {
        let dataJSON = { filename: material.name };
        await UploadService.delete(dataJSON);
        this.pictures = this.pictures.filter(picture => picture.id !== material.id);
      }
    },
    filesChange(fieldName, fileList) {
      const formData = new FormData();
      if (!fileList.length) return;
      Array.from(fileList).forEach(file => {
        formData.append(fieldName, file, file.name);
        this.uploadedFileNames.push(file.name);
      });
      this.save(formData);
    },
    async save(formData) {
      try {
        this.currentStatus = STATUS_SAVING;
        await UploadService.upload(formData);
        this.currentStatus = STATUS_SUCCESS;
        this.uploadedFileNames.forEach(uploadFilename => {
          if (!this.pictures.some(picture => picture.name === uploadFilename)) {
            this.pictureIndex++;
            this.pictures.push({ id: this.pictureIndex, name: uploadFilename });
          }
        });
        this.clearUploadResult();
      } catch (error) {
        this.currentStatus = STATUS_FAILED;
        console.log(error);
      }
    },
    clearUploadResult() {
      setTimeout(() => this.currentStatus = STATUS_INITIAL, 5000);
    },
    useThumbnail(filename) {
      this.blog.thumbnail = filename;
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    onBlur(editor) { console.log(editor); },
    onFocus(editor) { console.log(editor); },
  },
  async created() {
    try {
      const blogId = this.$route.params.blogId;
      this.blog = (await BlogsService.show(blogId)).data;
      this.pictures = JSON.parse(this.blog.pictures || "[]");
      this.pictureIndex = this.pictures.length;
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style scoped>
.edit-blog-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #141414;
  color: white;
  min-height: 100vh;
  margin-top: 10px;
}

h1 {
  color: #e50914;
  margin-bottom: 20px;
}

.form-group {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

label {
  color: #e50914;
  font-size: 1.2rem;
  margin-bottom: 8px;
  display: block;
}

.form-input {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
  border-radius: 5px;
  border: 1px solid #444;
  background-color: #222;
  color: white;
  margin-top: 5px;
}

.form-input:focus {
  outline: none;
  border-color: #e50914;
}

.upload-section {
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
}

.dropbox {
  border: 2px dashed #444;
  padding: 15px;
  text-align: center;
  border-radius: 5px;
  background-color: #222;
  margin-bottom: 20px;
}

.pictures img {
  max-width: 100px;
  border-radius: 5px;
  margin: 5px;
}

.button-group {
  display: flex;
  gap: 15px;
}

button {
  background-color: #e50914;
  color: white;
  padding: 12px 20px;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #f40612;
}
</style>
