<template>
    <div class="movie-container">
      <header class="blog-header">
        <center><h2>Movie</h2></center>
        <form class="search-form">
          <input type="text" v-model="search" placeholder="Search" aria-label="Search Blogs" class="search-input" />
        </form>
        <div class="create-blog">
          <button class="btn btn-success btn-sm" @click="navigateTo('/blog/create')">เพิ่มหนัง</button>
          <strong> จํานวนข้อมูล: </strong> {{ filteredBlogs.length }}
        </div>
        <ul class="categories">
          <li v-for="(cate, index) in category" :key="index">
            <a @click.prevent="setCategory(cate)" href="#">{{ cate }}</a>
          </li>
          <li class="clear"><a @click.prevent="setCategory(' ')" href="#">Clear</a></li>
        </ul>
        <div class="clearfix"></div>
      </header>
  
      <transition-group name="fade">
        <div v-for="blog in filteredBlogs" :key="blog.id" class="blog-card">
          <div class="thumbnail-pic" v-if="blog.thumbnail && blog.thumbnail !== 'null'">
            <img :src="BASE_URL + blog.thumbnail" alt="thumbnail" />
          </div>
          <div class="blog-info">
            <h3>{{ blog.title }}</h3>
            <div v-html="blog.content.slice(0, 200) + '...'"></div>
            <p><strong>ความยาวภาพยนตร์ :</strong> {{ blog.pictures }}</p>
            <p><strong>ประเภทภาพยนตร์ :</strong> {{ blog.category }}</p>
            <p><strong>นักแสดงนำ :</strong> {{ blog.status }}</p>
            <p><strong>วันที่ออกฉาย :</strong> {{ formatDate(blog.createdAt) }}</p>
            <div class="button-group">
              <button class="action-button" @click="navigateTo('/blog/' + blog.id)">ข้อมูลภาพยนตร์</button>
              <button class="action-button" @click="navigateTo('/blog/edit/' + blog.id)">แก้ไขข้อมูลภาพยนตร์</button>
              <button class="delete-button" @click="deleteBlog(blog)">ลบภาพยนตร์</button>
            </div>
          </div>
          <hr />
        </div>
      </transition-group>
  
      
    </div>
  </template>
  
  <script>
  import BlogsService from '@/services/BlogsService';
  
  export default {
    data() {
      return {
        blogs: [],
        search: '',
        BASE_URL: 'http://localhost:8081/assets/uploads/',
        allBlogs: [],
        category: [],
      };
    },
    async created() {
      this.allBlogs = (await BlogsService.index()).data;
      this.blogs = this.allBlogs;
      this.populateCategories();
    },
    computed: {
      filteredBlogs() {
        if (this.search.trim() === '') {
          return this.allBlogs;
        }
        return this.allBlogs.filter(blog =>
          blog.title.toLowerCase().includes(this.search.toLowerCase()) ||
          blog.category.toLowerCase().includes(this.search.toLowerCase())
        );
      },
    },
    methods: {
      navigateTo(route) {
        this.$router.push(route);
      },
      async deleteBlog(blog) {
        let result = confirm('คุณต้องการลบข้อมูลใช่หรือไม่?');
        if (result) {
          try {
            await BlogsService.delete(blog);
            this.refreshData();
          } catch (err) {
            console.log(err);
          }
        }
      },
      async refreshData() {
        this.allBlogs = (await BlogsService.index()).data;
      },
      logout() {
        this.$store.dispatch('setToken', null);
        this.$router.push({ name: 'login' });
      },
      setCategory(keyword) {
        this.search = keyword === ' ' ? '' : keyword;
      },
      populateCategories() {
        this.allBlogs.forEach(blog => {
          if (!this.category.includes(blog.category)) {
            this.category.push(blog.category);
          }
        });
      },
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
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
    background-color: #141414;
    color: white;
    min-height: 100vh;
    margin-top: 10px;
  }
  
  h2 {
    color: #e50914;
  }
  
  /* ตกแต่งฟอร์มค้นหา */
  .search-form {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 100%;
    max-width: 400px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    background-color: #222;
    color: white;
    transition: all 0.2s ease; /* ลดเวลาตอบสนองของการเปลี่ยน */
  }
  
  .search-input:focus {
    outline: none;
    background-color: #333;
    box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
  }
  
  .action-button,
  .delete-button {
    background-color: #e50914;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px;
    transition: background-color 0.2s ease; /* ลดเวลาตอบสนองของปุ่ม */
  }
  
  .action-button:hover,
  .delete-button:hover {
    background-color: #f30a17;
  }
  
  .delete-button {
    background-color: #d9534f;
  }
  
  .blog-card {
    background-color: #333;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 15px;
    transition: transform 0.2s ease; /* เพิ่มเอฟเฟกต์เมื่อโฮเวอร์ */
    width: 800px;
  }
  
  .blog-card:hover {
    transform: scale(1.02); /* ขยายขณะโฮเวอร์ */
  }
  
  .thumbnail-pic img {
    width: 100%; /* ทำให้รูปภาพกว้างเต็มพื้นที่ */
    max-width: 300px; /* ขีดจำกัดความกว้างที่ต้องการ */
    height: auto; /* ปรับความสูงอัตโนมัติ */
    border-radius: 5px;
    object-fit: cover; /* ทำให้รูปภาพไม่บิดเบือน */
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
  }
  
  hr {
    border: 1px solid #444;
  }
  
  /* ตกแต่งหมวดหมู่ */
  .categories {
    margin-top: 10px;
    padding: 0;
    list-style: none;
  }
  
  .categories li {
    float: left;
    padding: 2px;
  }
  
  .categories li a {
    padding: 5px 10px;
    background: #e50914; /* เปลี่ยนสีปุ่มเป็นสี Netflix */
    color: white;
    border-radius: 5px;
    transition: background-color 0.2s ease;
    text-decoration: none; /* ลบขีดเส้นใต้ */
  }
  
  .categories li a:hover {
    background-color: #f30a17;
  }
  
  .categories li.clear a {
    background: #d9534f;
    color: white;
  }
  
  .create-blog {
    margin-top: 10px;
  }
  
  .clearfix::after {
    content: "";
    display: table;
    clear: both;
  }
  </style>
  