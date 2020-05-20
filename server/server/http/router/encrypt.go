/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-12-31 13:07
**/

package router

import (
	"github.com/Lemo-yxk/lemo"

	"server/server/http/controller/encrypt"
)

func EncryptRouter(server *lemo.HttpServerRouter) {
	server.Group("/Encrypt").Handler(func(handler *lemo.HttpServerRouteHandler) {
		handler.Get("/Encrypt/md5").Handler(encrypt.Encrypt.Md5)
		handler.Get("/Encrypt/sha1").Handler(encrypt.Encrypt.Sha1)
		handler.Get("/Encrypt/sha256").Handler(encrypt.Encrypt.Sha256)
		handler.Get("/Encrypt/sha512").Handler(encrypt.Encrypt.Sha512)
		handler.Get("/Encrypt/base64Encode").Handler(encrypt.Encrypt.Base64Encode)
		handler.Get("/Encrypt/base64Decode").Handler(encrypt.Encrypt.Base64Decode)
	})
}
