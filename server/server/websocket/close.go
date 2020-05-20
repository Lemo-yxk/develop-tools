/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-01 15:01
**/

package websocket

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"

	"server/app"
)

func Close(conn *lemo.WebSocket) {

	var electron = app.Electron().GetConnection()
	if electron != nil && electron.FD == conn.FD {
		app.Electron().Destroy()
		console.Log("electron", electron.FD, "close")
	}

	var react = app.React().GetConnection()
	if react != nil && react.FD == conn.FD {
		app.React().Destroy()
		console.Log("react", react.FD, "close")
	}

}
