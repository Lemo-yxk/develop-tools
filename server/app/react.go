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
	hook "github.com/robotn/gohook"
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

			if e.Kind == 5 {
				r.mouseMove(e)
				continue
			} else {
				r.keyUp(e)
				continue
			}

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

func (r *react) mouseMove(e hook.Event) {
	var react = r.GetConnection()
	if react == nil {
		return
	}
	console.Assert(react.JsonFormat(lemo.JsonPackage{
		Event: "/Server/System/hook",
		Message: lemo.M{
			"id":      e.Kind,
			"x":       e.X,
			"y":       e.Y,
			"keycode": e.Keycode,
		},
	}))
}
func (r *react) keyUp(e hook.Event) {
	var react = r.GetConnection()
	if react == nil {
		return
	}
	var hx, hy = robotgo.GetScreenSize()

	var x = int(e.X)
	var y = int(e.Y)
	var ex = x - 4
	var ey = y - 4
	var width = 8
	var height = 8

	if x < 4 {
		return
	}

	if hx-x < 4 {
		return
	}

	if y < 4 {
		return
	}

	if hy-y < 4 {
		return
	}

	var bit = robotgo.CaptureScreen(ex, ey, width, height)

	var bitBytes = robotgo.ToBitmapBytes(bit)
	robotgo.FreeBitmap(bit)

	var base64 = utils.Crypto.Base64Encode(bitBytes)

	console.Assert(react.JsonFormat(lemo.JsonPackage{
		Event: "/Server/System/hook",
		Message: lemo.M{
			"id":      e.Kind,
			"x":       e.X,
			"y":       e.Y,
			"keycode": e.Keycode,
			"color":   robotgo.GetPixelColor(int(e.X), int(e.Y)),
			"image":   base64,
		},
	}))
}
