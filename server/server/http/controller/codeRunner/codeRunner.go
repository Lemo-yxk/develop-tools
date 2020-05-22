/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-01 20:43
**/

package codeRunner

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/exception"

	"server/app"
)

type code struct{}

var Code *code

func (e *code) Run(stream *lemo.Stream) exception.Error {

	var codeString = stream.Form.Get("code").String()
	var language = stream.Form.Get("language").String()

	app.Runner().Run(language, codeString)

	return stream.JsonFormat("SUCCESS", 200, "OK")
}

func (e *code) Stop(stream *lemo.Stream) exception.Error {
	console.Assert(app.Runner().Kill())
	return stream.JsonFormat("SUCCESS", 200, "OK")
}
