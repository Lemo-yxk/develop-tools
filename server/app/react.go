/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-05-03 22:15
**/

package app

import (
	"sync"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/exception"
	"github.com/Lemo-yxk/lemo/utils"
	"github.com/go-vgo/robotgo"
)

func newReact() *react {
	return &react{}
}

type react struct {
	conn       *lemo.WebSocket
	robotStart bool
	mux        sync.Mutex
	rMux       sync.Mutex
}

func (r *react) SetConnection(conn *lemo.WebSocket) {
	r.rMux.Lock()
	defer r.rMux.Unlock()
	r.conn = conn
}

func (r *react) GetConnection() *lemo.WebSocket {
	r.rMux.Lock()
	defer r.rMux.Unlock()
	return r.conn
}

func (r *react) Destroy() {
	r.rMux.Lock()
	defer r.rMux.Unlock()
	r.conn = nil
}

func (r *react) StartHook() {
	r.mux.Lock()
	defer r.mux.Unlock()

	if r.robotStart {
		return
	}

	var event = robotgo.Start()

	go func() {

		for e := range event {

			r.robotStart = true

			var react = r.GetConnection()
			if react == nil {
				continue
			}

			var bit = robotgo.CaptureScreen(int(e.X)-8, int(e.Y)-8, 16, 16)

			var bitBytes = robotgo.ToBitmapBytes(bit)
			robotgo.FreeBitmap(bit)

			var base64 = utils.Crypto.Base64Encode(bitBytes)

			console.Assert(react.JsonFormat(lemo.JsonPackage{
				Event: "/Server/System/hook",
				Message: lemo.M{
					"id":      e.Kind,
					"x":       e.X,
					"y":       e.Y,
					"keyCode": e.Keycode,
					"color":   robotgo.GetPixelColor(int(e.X), int(e.Y)),
					"image":   base64,
				},
			}))
		}

		r.robotStart = false
	}()
}

func (r *react) StopHook() {
	r.mux.Lock()
	defer r.mux.Unlock()

	if !r.robotStart {
		return
	}

	r.robotStart = false

	exception.Try(func() {
		robotgo.End()
	}).Catch(func(e exception.Error) {
		console.Error(e)
	})
}
