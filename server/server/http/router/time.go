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

	"server/server/http/controller/time"
)

func TimeRouter(server *lemo.HttpServerRouter) {
	server.Group("/Time").Handler(func(handler *lemo.HttpServerRouteHandler) {
		handler.Get("/Time/now").Handler(time.Time.Now)
	})
}
