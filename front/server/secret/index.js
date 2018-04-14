const md5 = require("js-md5")
//请自行设置盐值和密码
const createSecret = {
	salt: 12345,
	jwtSecret: "12345"
}

module.exports = createSecret