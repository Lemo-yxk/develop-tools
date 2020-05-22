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

	"server/server/http/controller/codeRunner"
)

func CodeRouter(server *lemo.HttpServerRouter) {
	server.Group("/Code").Handler(func(handler *lemo.HttpServerRouteHandler) {
		handler.Post("/Code/run").Handler(codeRunner.Code.Run)
		handler.Post("/Code/stop").Handler(codeRunner.Code.Stop)
	})
}
