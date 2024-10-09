<template>
  <div>
    <div class="nv-navbar">
      <ul class="nav">
        <li><router-link :to="{ name: 'blogs' }">Blogs</router-link></li>
        <li><router-link :to="{ name: 'users' }">Users</router-link></li>
        <li><router-link :to="{ name: 'comments' }">Comments</router-link></li>
        <!-- if isLogin is true, show logout menu. otherwise, show login menu-->
        <li><router-link :to="{ name: 'login' }">Login</router-link></li>  
      </ul>
    </div>
  </div>
</template>
<script>

export default {

  methods:{
    isLogin(){
      return this.$store.getters.isUserLoggedIn;
    },
    logout(){
      this.$store.dispatch('logout');
      this.$router.push({name: 'login'});
    }
  }
};
</script>
<style scoped>
/* ปรับแถบนำทางให้เป็นธีม Netflix */
.nv-navbar {
  background-color: #141414; /* สีดำของ Netflix */
  width: 100%;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.nv-navbar .nav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center; /* จัดให้ลิงก์อยู่ตรงกลาง */
}

.nv-navbar .nav li {
  margin-right: 20px;
}

.nv-navbar .nav li:last-child {
  margin-right: 0; /* ไม่มีระยะห่างทางด้านขวาสำหรับลิงก์สุดท้าย */
}

.nv-navbar .nav li a {
  padding: 10px 15px;
  text-decoration: none;
  color: #e50914; /* สีแดงของ Netflix */
  font-weight: bold;
  font-size: 1.1rem;
  transition: color 0.3s, background-color 0.3s;
}

.nv-navbar .nav li a:hover {
  color: #fff;
  background-color: #e50914;
  border-radius: 5px;
}

.nv-navbar .nav li a.router-link-active {
  background-color: #e50914;
  color: #fff;
  border-radius: 5px;
}

.clearfix {
  clear: both;
}
</style>
