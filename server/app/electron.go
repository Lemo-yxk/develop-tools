/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-05-03 21:43
**/

package app

import (
	"path/filepath"
	"sync"
	"time"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/utils"
)

func newElectron() *electron {
	return &electron{}
}

type electron struct {
	dir  string
	conn *lemo.WebSocket
	eMux sync.Mutex
}

func (e *electron) SetDir(dir string) {
	e.dir = dir
}

func (e *electron) GetDir() string {
	return e.dir
}

func (e *electron) SetConnection(conn *lemo.WebSocket) {
	e.eMux.Lock()
	defer e.eMux.Unlock()
	e.conn = conn
}

func (e *electron) GetConnection() *lemo.WebSocket {
	e.eMux.Lock()
	defer e.eMux.Unlock()
	return e.conn
}

func (e *electron) Destroy() {
	e.eMux.Lock()
	defer e.eMux.Unlock()
	e.conn = nil
	e.dir = ""
}

func (e *electron) Update() {

	e.eMux.Lock()
	defer e.eMux.Unlock()

	var res = utils.HttpClient.Get("http://127.0.0.1:8080/dist.zi1p").Timeout(6 * time.Second).Query(nil).Send()
	if res.LastError() != nil {
		console.Error(res.LastError())
		return
	}

	if res.Code() != 200 {
		console.Error(res.Code())
		return
	}

	console.Assert(utils.Zip.UnzipFromBytes(res.Bytes()).To(filepath.Join(e.dir, "dist")))

}
