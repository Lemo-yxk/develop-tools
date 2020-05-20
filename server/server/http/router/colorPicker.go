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

	"server/server/http/controller/colorPicker"
)

func ColorPickerRouter(server *lemo.HttpServerRouter) {
	server.Group("/ColorPicker").Handler(func(handler *lemo.HttpServerRouteHandler) {
		handler.Get("/ColorPicker/StartHook").Handler(colorPicker.ColorPicker.StartHook)
		handler.Get("/ColorPicker/StopHook").Handler(colorPicker.ColorPicker.StopHook)
	})
}
