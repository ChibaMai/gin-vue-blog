package v1

import (
	"gin-blog/model/req"
	"gin-blog/utils"
	"gin-blog/utils/r"

	"github.com/gin-gonic/gin"
)

type UserAuth struct{}

// 根据 Token 获取用户信息
func (*User) GetInfo(c *gin.Context) {
	r.Success(c, userService.GetInfo(utils.GetFromContext[int](c, "user_info_id")))
}

// 用户注册
func (*UserAuth) Register(c *gin.Context) {
	r.Code(c, userService.Register(utils.BindValidJson[req.Register](c)))
}

// 登录
func (*UserAuth) Login(c *gin.Context) {
	loginReq := utils.BindValidJson[req.Login](c)
	loginVo, code := userService.Login(c, loginReq.Username, loginReq.Password)
	r.Data(c, code, loginVo)
}

// 退出登录
func (*UserAuth) Logout(c *gin.Context) {
	userService.Logout(c)
	r.SuccessNil(c)
}

// 发送邮件验证码
func (*UserAuth) SendCode(c *gin.Context) {
	r.Code(c, userService.SendCode(c.Query("email")))
}

// TODO: refresh token
