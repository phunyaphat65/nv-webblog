<template>
    <div class="movie-container">
      <h1>Show Movie</h1>
      <transition-group name="fade">
        <div v-for="blog in filteredBlogs" :key="blog.id" class="blog-card">
          <center><div class="thumbnail-pic" v-if="blog.thumbnail && blog.thumbnail !== 'null'">
            <img :src="BASE_URL + blog.thumbnail" alt="thumbnail" class="thumbnail-image" />
          </div></center>
          <div class="blog-info">
            <h3>{{ blog.title }}</h3>
            <div v-html="blog.content.slice(0, 200) + '...'"></div>
            <p><strong>ความยาวภาพยนตร์ :</strong> {{ blog.pictures }}</p>
            <p><strong>ประเภทภาพยนตร์ :</strong> {{ blog.category }}</p>
            <p><strong>นักแสดงนำ :</strong> {{ blog.status }}</p>
            <p><strong>วันที่ออกฉาย :</strong> {{ formatDate(blog.createdAt) }}</p>
          </div>
        </div>
      </transition-group>
      <div class="button-group">
        <button class="action-button" v-on:click="navigateTo('/blog/edit/' + blog.id)">แก้ไข</button>
        <button class="action-button" v-on:click="navigateTo('/blogs')">กลับ</button>
      </div>
    </div>
  </template>
  
  <script>
  import BlogsService from '@/services/BlogsService';
  
  export default {
    data() {
      return {
        blog: null,
        filteredBlogs: [],
        BASE_URL: 'http://localhost:8081/assets/uploads/', // กำหนด URL ของรูปภาพ
      };
    },
    async created() {
      try {
        let blogId = this.$route.params.blogId;
        this.blog = (await BlogsService.show(blogId)).data;
        this.filteredBlogs = [this.blog]; // กรณีต้องการแสดงเพียง blog เดียว
      } catch (error) {
        console.log(error);
      }
    },
    methods: {
      navigateTo(route) {
        this.$router.push(route);
      },
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
    },
  };
  </script>
  
  <style scoped>
  .movie-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #141414a5; 
    color: white;
    min-height: 100vh; /* ความสูงเต็มหน้าจอ */
    margin-top: 10px;
  }
  
  h1 {
    color: #e50914; 
    margin-bottom: 20px; /* ระยะห่างด้านล่าง */
  }
  
  .blog-card {
    background-color: #333;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
    width: 800px;
    max-width: 600px;
  }
  
  .thumbnail-pic {
    margin-bottom: 10px;
  }
  
  .thumbnail-image {
    width: 100%;
    max-width: 150px;
    border-radius: 5px;
  }
  
  .blog-info {
    margin-top: 10px;
  }
  
  strong {
    color: #e50914; /* ทำให้ข้อความที่เป็นหัวเรื่องเด่นชัด */
  }
  
  .button-group {
    display: flex;
    justify-content: space-between; /* จัดปุ่มให้ห่างกัน */
    width: 100%;
    max-width: 600px;
  }
  
  .action-button {
    background-color: #e50914;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    margin: 5px;
  }
  
  .action-button:hover {
    background-color: #f40612;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  