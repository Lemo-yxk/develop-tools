/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-01 20:43
**/

package colorPicker

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"

	"server/app"
)

type colorPicker struct{}

var ColorPicker *colorPicker

func (e *colorPicker) StartHook(stream *lemo.Stream) exception.Error {
	app.React().StartHook()
	return stream.JsonFormat("SUCCESS", 200, "OK")
}

func (e *colorPicker) StopHook(stream *lemo.Stream) exception.Error {
	app.React().StopHook()
	return stream.JsonFormat("SUCCESS", 200, "OK")
}
