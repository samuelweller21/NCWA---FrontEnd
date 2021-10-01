import axios from 'axios'

//Backend Toggle

var SERVER = "http://localhost:5000"
//const SERVER = "http://myfirstapp-env.eba-rygdbhqj.us-east-1.elasticbeanstalk.com"

//Password Hashing
var passwordHash = require('password-hash');

class NCService {

    //Search

    searchGame(id) {
        this.setUpAuthentication();
        return axios.get(this.getDomain() + `/search/${id}`)
    }

    //Two Player

    getDomain() {
        return SERVER
    }

    getTPGame(id) {
        this.setUpAuthentication()
        return axios.get(this.getDomain() + `/tpgames/${id}`)
    }

    createTPGame() {
        this.setUpAuthentication()
        return axios.get(this.getDomain() + `/tpgames/new`)
    }

    doTPMove(id, move) {
        this.setUpAuthentication()
        return axios.post(this.getDomain() + `/tpgames/${id}/move`, move)
    }

    //Authentication

    setUpAxiosInterceptors(token) {

        axios.interceptors.request.use(
            (config) => {
                config.headers.authorization = token
                return config
            }
        )
    }

    createBasicAuthToken(username, password) {
        return 'Basic ' + window.btoa(username + ":" + password)
    }

    login(username, password) {
        axios.post(this.getDomain() + "/authenticate", {username, password}).then((res) => {
            sessionStorage.setItem('authenticatedUser', username);
            this.setUpAxiosInterceptors(this.createJWTtoken(res.data.token))
        })
    }

    createJWTtoken(token) {
        return 'Bearer ' + token
    }

    // setUpAuthentication() {
        
    //     //For now hard code log in details
    //     sessionStorage.setItem("authenticatedUser", "sam.weller")
    //     this.setUpAxiosInterceptors(this.createBasicAuthToken("sam.weller", "sweller"))
    // }

    //Account system

    sendCreateAccountRequest(username, rawPassword) {
        this.setUpAuthentication()
        let password = passwordHash.generate(rawPassword)
        return axios({
            method: 'post',
            url: this.getDomain() + "/createaccount",
            data: {
              username: username,
              password: password
            }
          });
    }

    // suggestUsername(currentUsername) {
    //     this.setUpAuthentication()
    //     console.log(currentUsername)
    //     return axios.get(this.getDomain() + `/suggestusername/${currentUsername}`);
    // }

    suggestUsername(currentUsername) {
        this.setUpAuthentication()
        return axios({
            method: 'post',
            url: this.getDomain() + "/suggestusername",
            data: {
              username: currentUsername,
            }
          });
    }

}

export default new NCService()
