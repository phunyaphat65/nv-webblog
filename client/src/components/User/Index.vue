<template>
  <div class="user-container">
    <h1>User</h1>
    <div class="button-group">
      <button class="action-button" v-on:click="navigateTo('/user/create')">สร้างผู้ใช้</button>
      <button class="action-button" v-on:click="logout">ออกจากระบบ</button>
    </div>
    
    <div v-if="users.length">
      <div class="user-count"><b>จำนวนผู้ใช้งาน:</b> {{ users.length }}</div>
      <div v-for="user in users" v-bind:key="user.id" class="user-card">
        <div><b>รหัสผู้ใช้:</b> {{ user.id }}</div>
        <div><b>ชื่อผู้ใช้:</b> {{ user.name }} {{ user.lastname }}</div>
        <div><b>อีเมล:</b> {{ user.email }}</div>
        <div><b>สถานะ:</b> {{ user.status }}</div>
        <div><b>ประเภท:</b> {{ user.type }}</div><br><br>
        <div class="user-actions">
          <button class="action-button" v-on:click="navigateTo('/user/' + user.id)">ดูข้อมูล</button>
          <button class="action-button" v-on:click="navigateTo('/user/edit/' + user.id)">แก้ไขข้อมูล</button>
          <button class="action-button delete-button" v-on:click="deleteUser(user)">ลบข้อมูล</button>
        </div>
        <hr />
      </div>
    </div>
    <div v-else>
      <p>ไม่มีผู้ใช้ในระบบ</p>
    </div>
  </div>
</template>

<script>
import UsersService from "@/services/UsersService";

export default {
  data() {
    return {
      users: [],
    };
  },
  async created() {
    await this.refreshData();
  },
  methods: {
    logout() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
      this.$router.push({ name: "login" });
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteUser(user) {
      let result = confirm("คุณต้องการลบข้อมูลใช่หรือไม่?");
      if (result) {
        try {
          await UsersService.delete(user);
          this.refreshData();
        } catch (err) {
          console.log(err);
        }
      }
    },
    async refreshData() {
      try {
        this.users = (await UsersService.index()).data;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.user-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* จัดกลางแนวตั้ง */
  justify-content: center; /* จัดกลางแนวนอน */
  padding: 20px; /* เพิ่มระยะห่างด้านใน */
  background-color: #141414; /* สีพื้นหลังคล้าย Netflix */
  color: white; /* สีตัวอักษร */
  min-height: 100vh; /* ความสูงเต็มหน้าจอ */
  margin-top: 10px; /* เพิ่มระยะห่างด้านบน */
}

h1 {
  color: #e50914; /* สีแดงของ Netflix */
  margin-bottom: 20px; /* ระยะห่างด้านล่าง */
}

.button-group {
  display: flex;
  justify-content: space-between; /* จัดปุ่มให้ห่างกัน */
  width: 300px; /* ความกว้างเต็ม */
  max-width: 400px; /* ความกว้างสูงสุด */
  margin-bottom: 20px; /* ระยะห่างด้านล่าง */
}

.action-button {
  background-color: #e50914; /* สีแดงของ Netflix */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  margin: 0 10px; /* เพิ่มระยะห่างระหว่างปุ่ม */
}

.action-button:hover {
  background-color: #f40612; /* สีแดงเข้มขึ้นเมื่อโฟกัส */
}

.user-count {
  margin-bottom: 10px; /* ระยะห่างด้านล่าง */
}

.user-card {
  background-color: #333; /* สีพื้นหลังของข้อมูลผู้ใช้ */
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px; /* ระยะห่างระหว่างผู้ใช้ */
  width: 100%; /* ความกว้างเต็ม */
  max-width: 400px; /* ความกว้างสูงสุด */
}

.user-actions {
  display: flex;
  justify-content: space-between; /* จัดปุ่มให้ห่างกัน */
}

.delete-button {
  background-color: #d9534f; /* สีแดงสำหรับปุ่มลบ */
}

.delete-button:hover {
  background-color: #c9302c; /* สีแดงเข้มขึ้นเมื่อโฟกัส */
}

.error {
  color: red; /* สีข้อความผิดพลาด */
  margin-top: 4px; /* ระยะห่างด้านบน */
}
</style>

