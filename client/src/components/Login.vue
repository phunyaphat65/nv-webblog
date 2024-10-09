<template>
  <div class="login-container">
    <h1>Login</h1>
    <form v-on:submit.prevent="onLogin" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" v-model="password" required />
      </div>
      <button type="submit" class="login-button">Login</button>
      <div class="error" v-if="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import AuthenService from "../services/AuthenService";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async onLogin() {
      try {
        const response = await AuthenService.login({
          email: this.email,
          password: this.password,
        });

        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);

        this.$router.push({
          name: "users",
        });
      } catch (error) {
        console.log(error);
        this.error = error.response.data.error;
        this.email = "";
        this.password = "";
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
