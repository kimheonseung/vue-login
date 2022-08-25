import axios from 'axios'
import aes256Helper from './aes256Helper'

const url = 'http://localhost:8888/token/generate';

const methods = {
    generateToken: async (username, password) => {
        return axios
            .post(url, {
                username: username,
                password: aes256Helper.encrypt(password)
            })
            .then((rs) => {
                if(rs.data.status === 200) {
                    return {
                        result: true,
                        token: rs.data.dataArray[0].token,
                    }
                } else {
                    return {
                        result: false,
                    }
                }
            })
            .catch(e => {
                console.error(e);
                return {
                    result: false,
                }
            });
    }
};

export default {
    install(Vue) {
        Vue.config.globalProperties.$generateToken = methods.generateToken;
    }
};