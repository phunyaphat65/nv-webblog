<template>
  <div>
    <div class="login-container">
      <div class="form-group">
    <h1>Show User</h1><br>
    <p>ID: {{ user.id }} </p>
    <p>Name: {{ user.id }} </p>
    <p>Lastname: {{ user.lastname }} </p>
    <p>Email: {{ user.email }}</p>
    <p>Password: {{ user.password }}</p>
    <p>Status: {{ user.status }}</p>
    <p>Type: {{ user.type }}</p>
    <p>Created At: {{ user.createdAt }}</p>
  </div>
</div>
  </div>
</template>

<script>
import UsersService from "@/services/UsersService";

export default { 
  data(){
    return {
      user: {}
    }
  },
  async created() {
    try{
      var userId = this.$route.params.userId;
      this.user = (await UsersService.show(userId)).data;
    }catch(err){
      console.log(err);
    }
    
    // console.log(this.user);
  },
  

}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* จัดกลางแนวตั้ง */
  justify-content: center; /* จัดกลางแนวนอน */
  height: 100vh; /* ความสูงเต็มหน้าจอ */
  background-color: #141414; /* สีพื้นหลังคล้าย Netflix */
  color: white; /* สีตัวอักษร */
  margin-top: 10px; /* เพิ่มระยะห่างด้านบน */
}

h1 {
  color: #e50914; /* สีแดงของ Netflix */
  margin-bottom: 20px; /* ระยะห่างด้านล่าง */
}

.login-form {
  background-color: #333; /* สีพื้นหลังของฟอร์ม */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* เงา */
}

.form-group {
  margin-bottom: 15px; /* ระยะห่างระหว่างกลุ่มฟอร์ม */
}

label {
  display: block; /* แสดง label เป็นบล็อก */
  margin-bottom: 5px; /* ระยะห่างด้านล่าง */
}

input {
  width: 300px; /* กำหนดความกว้างของ input */
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #444; /* สีพื้นหลังของ input */
  color: white; /* สีตัวอักษร */
  font-size: 1rem; /* ขนาดฟอนต์ */
}

input:focus {
  outline: none; /* ไม่แสดงเส้นขอบเมื่อโฟกัส */
  background-color: #555; /* สีพื้นหลังเมื่อโฟกัส */
}

.login-button {
  background-color: #e50914; /* สีแดงของ Netflix */
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  width: 100%; /* ทำให้ปุ่มกว้างเต็ม */
}

.login-button:hover {
  background-color: #f40612; /* สีแดงเข้มขึ้นเมื่อโฟกัส */
}

.error {
  color: red; /* สีข้อความผิดพลาด */
  margin-top: 4px; /* ระยะห่างด้านบน */
}
</style>