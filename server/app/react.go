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
	"github.com/Lemo-yxk/lemo-robot"
	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/exception"
	"github.com/Lemo-yxk/lemo/utils"
)

func newReact() *react {
	return &react{}
}

type react struct {
	conn       *lemo.WebSocket
	robotStart bool
	mux        sync.Mutex
}

func (r *react) SetConnection(conn *lemo.WebSocket) {
	r.conn = conn
}

func (r *react) GetConnection() *lemo.WebSocket {
	return r.conn
}

func (r *react) Destroy() {
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

		// when client close, conn possible be nil
		exception.Try(func() {

			for e := range event {

				r.robotStart = true

				if r.conn == nil {
					continue
				}

				var bit = robotgo.CaptureScreen(int(e.X)-8, int(e.Y)-8, 16, 16)

				var bitBytes = robotgo.ToBitmapBytes(bit)
				robotgo.FreeBitmap(bit)

				var base64 = utils.Crypto.Base64Encode(bitBytes)

				console.Assert(r.conn.JsonFormat(lemo.JsonPackage{
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

		}).Catch(func(e exception.Error) {
			console.Error(e)
		})

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
