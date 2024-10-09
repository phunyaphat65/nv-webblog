<template>
  <div class="login-container">
    <h1>แก้ไขข้อมูลผู้ใช้</h1>
    <form v-on:submit.prevent="editUser" class="login-form">
      <div class="form-group">
        <label for="name">ชื่อ:</label>
        <input type="text" id="name" v-model="user.name" required />
      </div>
      <div class="form-group">
        <label for="lastname">นามสกุล:</label>
        <input type="text" id="lastname" v-model="user.lastname" required />
      </div>
      <div class="form-group">
        <label for="email">อีเมล:</label>
        <input type="email" id="email" v-model="user.email" required />
      </div>
      <div class="form-group">
        <label for="password">รหัสผ่าน:</label>
        <input type="password" id="password" v-model="user.password" />
      </div>
      <div class="form-group">
        <button type="submit" class="login-button">แก้ไขข้อมูลผู้ใช้</button>
      </div>
      <div class="form-group">
        <button class="login-button" v-on:click="navigateTo('/users')">ย้อนกลับ</button>
      </div>
    </form>
  </div>
</template>

<script>
import UsersService from '../../services/UsersService';

export default {
  data() {
    return {
      user: {
        name: '',
        lastname: '',
        email: '',
        password: '',
        status: 'active',
      },
    };
  },
  async created() {
    try {
      const userId = this.$route.params.userId;
      this.user = (await UsersService.show(userId)).data;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async editUser() {
      try {
        await UsersService.put(this.user);
        this.$router.push('/users');
      } catch (err) {
        console.log(err);
      }
    },
  },
};
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
