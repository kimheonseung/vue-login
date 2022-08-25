<template>
  <div class="content width-100">
    <div class="div-login-logo">
      <img src="./assets/logo.png" />
    </div>
    <div class="div-login-gap"></div>
    <div class="div-login-form">
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group
          id="input-group-id"
          label-for="input-id"
          description="Enter your ID."
        >
          <b-form-input
            id="input-id"
            type="text"
            :placeholder="isLoggedIn ? 'press logout button' : 'ID'"
            v-model="form.username"
            :disabled="isLoggedIn ? true : false"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-password"
          label-for="input-password"
          description="Enter your password."
        >
          <b-form-input
            id="input-password"
            type="password"
            :placeholder="isLoggedIn ? 'press logout button' : 'Password'"
            v-model="form.password"
            :disabled="isLoggedIn ? true : false"
            required
          ></b-form-input>
        </b-form-group>

        <b-button v-if="isLoggedIn == false" id="btn-login" type="submit">Login</b-button>
        <b-button v-else @click="onLogout" id="btn-login" type="submit">Logout</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      isLoggedIn: false
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.$generateToken(this.form.username, this.form.password)
        .then((rs) => {
          this.clearInput();
          if(rs.result) {
            this.isLoggedIn = true;
            localStorage.setItem('token', JSON.stringify(rs.token));
            alert('인증 성공');
          } else {
            alert('인증 실패');
          }
        }
      );
    },
    onLogout(e) {
      e.preventDefault();
      localStorage.removeItem('token');
      this.isLoggedIn = false;
    },
    clearInput() {
      this.form.username = '';
      this.form.password = '';
    },
  },
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: black;
  width: 100vw;
  height: 100vh;
}
.width-100 {
  width: 100vw;
}
.content {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.div-login-logo {
  width: 50vw;
  height: 20vh;
}

.div-login-gap {
  width: 50vw;
  height: 3vh;
}

.div-login-form {
  width: 50vw;
  height: 30vh;
  min-width: 250px;
  max-width: 300px;
}

#btn-login {
  width: 100%;
}

</style>
