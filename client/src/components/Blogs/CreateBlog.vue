<template>
  <div class="edit-blog-container">
    <h1>Create Blog</h1>
    <form v-on:submit.prevent="createBlog">
      <div class="form-group">
        <label for="title">ชื่อเรื่อง:</label>
        <input type="text" v-model="blog.title" id="title" class="form-input" />
      </div>

      <transition name="fade">
        <div class="thumbnail-pic" v-if="blog.thumbnail != 'null'">
          <img :src="BASE_URL + blog.thumbnail" alt="thumbnail" />
        </div>
      </transition>

      <div class="upload-section">
        <div class="dropbox">
          <input
            type="file"
            multiple
            :name="uploadFieldName"
            :disabled="isSaving"
            @change="
              filesChange($event.target.name, $event.target.files);
              fileCount = $event.target.files.length;
            "
            accept="image/*"
            class="input-file"
          />
          <p v-if="isInitial">Drag your file(s) here to begin<br />or click to browse</p>
          <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
          <p v-if="isSuccess">Upload Successful.</p>
        </div>

        <div>
          <transition-group tag="ul" class="pictures">
            <li v-for="picture in pictures" v-bind:key="picture.id">
              <img :src="BASE_URL + picture.name" alt="picture image" />
              <div class="button-group">
                <button v-on:click.prevent="useThumbnail(picture.name)">ใช่รูปนี้</button>
                <button v-on:click.prevent="delFile(picture)">ลบรูป</button>
              </div>
            </li>
          </transition-group>
        </div>
      </div>

      <div class="form-group">
        <label for="content">เรื่องย่อ:</label>
        <vue-ckeditor
          v-model.lazy="blog.content"
          :config="config"
          @blur="onBlur($event)"
          @focus="onFocus($event)"
        />
      </div>

      <div class="form-group">
        <label for="pictures">ความยาวภาพยนตร์:</label>
        <input type="text" v-model="blog.pictures" id="pictures" class="form-input" />
      </div>

      <div class="form-group">
        <label for="category">ประเภทภาพยนตร์:</label>
        <input type="text" v-model="blog.category" id="category" class="form-input" />
      </div>

      <div class="form-group">
        <label for="status">นักแสดงนำ:</label>
        <input type="text" v-model="blog.status" id="status" class="form-input" />
      </div>

      <div class="form-group">
        <label for="createdAt">วันที่ออกฉาย :</label>
        <input type="date" v-model="blog.createdAt" id="createdAt" class="form-input" />
      </div>

      <p>
        <button type="submit">Create Blog</button>
      </p>
    </form>
  </div>
</template>

<script>
// ... (script remains unchanged)
</script>

<style scoped>
/* (existing styles remain unchanged) */
.form-group {
  margin-bottom: 1em; /* Adjust margin as needed */
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>

<script>
import BlogsService from "@/services/BlogsService";
import VueCkeditor from "vue-ckeditor2";
import UploadService from "../../services/UploadService";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  data() {
  return {
    BASE_URL: "http://localhost:8081/assets/uploads/",
    error: null,
    uploadError: null,
    currentStatus: null,
    uploadFieldName: "userPhoto",
    uploadedFileNames: [],
    pictures: [],
    pictureIndex: 0,
    blog: {
      title: "",
      thumbnail: "null",
      pictures: "null", // ความยาวภาพยนตร์
      content: "",
      category: "", // ประเภทภาพยนตร์
      status: "saved", // นักแสดงนำ
      createdAt: "", // วันที่ออกฉาย
    },
    config: {
      toolbar: [
        ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript"],
      ],
      height: 300,
    },
  };
},

  methods: {
    async delFile(material) {
      let result = confirm("Want to delete?");
      if (result) {
        let dataJSON = {
          filename: material.name,
        };

        await UploadService.delete(dataJSON);
        for (var i = 0; i < this.pictures.length; i++) {
          if (this.pictures[i].id === material.id) {
            this.pictures.splice(i, 1);
            this.materialIndex--;
            break;
          }
        }
      }
    },
    async createBlog() {
      this.blog.pictures = JSON.stringify(this.pictures);
      console.log("JSON.stringify: ", this.blog);
      try {
        await BlogsService.post(this.blog);
        this.$router.push({
          name: "blogs",
        });
      } catch (err) {
        console.log(err);
      }
    },
    onBlur(editor) {
      console.log(editor);
    },
    onFocus(editor) {
      console.log(editor);
    },
    navigateTo(route) {
      console.log(route);
      this.$router.push(route);
    },
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      // this.uploadedFiles = []
      this.uploadError = null;
      this.uploadedFileNames = [];
    },
    async save(formData) {
      // upload data to the server
      try {
        this.currentStatus = STATUS_SAVING;
        await UploadService.upload(formData);
        this.currentStatus = STATUS_SUCCESS;

        // update image uploaded display
        let pictureJSON = [];
        this.uploadedFileNames.forEach((uploadFilename) => {
          let found = false;
          for (let i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].name == uploadFilename) {
              found = true;
              break;
            }
          }
          if (!found) {
            this.pictureIndex++;
            let pictureJSON = {
              id: this.pictureIndex,
              name: uploadFilename,
            };
            this.pictures.push(pictureJSON);
          }
        });
        this.clearUploadResult();
      } catch (error) {
        console.log(error);
        this.currentStatus = STATUS_FAILED;
      }
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();
      if (!fileList.length) return;
      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append(fieldName, fileList[x], fileList[x].name);
        this.uploadedFileNames.push(fileList[x].name);
      });
      // save it
      this.save(formData);
    },
    clearUploadResult: function () {
      setTimeout(() => this.reset(), 5000);
    },
    useThumbnail(filename) {
      console.log(filename);
      this.blog.thumbnail = filename;
    },
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    },
  },
  components: {
    VueCkeditor,
  },
  created() {
    this.currentStatus = STATUS_INITIAL;
    this.config.toolbar = [
      {
        name: "document",
        items: [
          "Source",
          "-",
          "Save",
          "NewPage",
          "Preview",
          "Print",
          "-",
          "Templates",
        ],
      },
      {
        name: "clipboard",
        items: [
          "Cut",
          "Copy",
          "Paste",
          "PasteText",
          "PasteFromWord",
          "-",
          "Undo",
          "Redo",
        ],
      },
      {
        name: "editing",
        items: ["Find", "Replace", "-", "SelectAll", "-", "Scayt"],
      },
      {
        name: "forms",
        items: [
          "Form",
          "Checkbox",
          "Radio",
          "TextField",
          "Textarea",
          "Select",
          "Button",
          "ImageButton",
          "HiddenField",
        ],
      },
      "/",
      {
        name: "basicstyles",
        items: [
          "Bold",
          "Italic",
          "Underline",
          "Strike",
          "Subscript",
          "Superscript",
          "-",
          "CopyFormatting",
          "RemoveFormat",
        ],
      },
      {
        name: "paragraph",
        items: [
          "NumberedList",
          "BulletedList",
          "-",
          "Outdent",
          "Indent",
          "-",
          "Blockquote",
          "CreateDiv",
          "-",
          "JustifyLeft",
          "JustifyCenter",
          "JustifyRight",
          "JustifyBlock",
          "-",
          "BidiLtr",
          "BidiRtl",
          "Language",
        ],
      },
      { name: "links", items: ["Link", "Unlink", "Anchor"] },
      {
        name: "insert",
        items: [
          "Image",
          "Flash",
          "Table",
          "HorizontalRule",
          "Smiley",
          "SpecialChar",
          "PageBreak",
          "Iframe",
          "InsertPre",
        ],
      },
      "/",
      { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
      { name: "colors", items: ["TextColor", "BGColor"] },
      { name: "tools", items: ["Maximize", "ShowBlocks"] },
      { name: "about", items: ["About"] },
    ];
  },
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