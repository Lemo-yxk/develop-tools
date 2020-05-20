/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-01 20:43
**/

package time

import (
	"time"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"
)

type ti struct{}

var Time *ti

func (r *ti) Now(stream *lemo.Stream) exception.Error {
	return stream.JsonFormat("SUCCESS", 200, time.Now().Unix())
}
