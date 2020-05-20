/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-01 20:43
**/

package encrypt

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"
	"github.com/Lemo-yxk/lemo/utils"
)

type encrypt struct{}

var Encrypt *encrypt

func (e *encrypt) Md5(stream *lemo.Stream) exception.Error {

	var data = stream.Query.Get("data").Bytes()

	return stream.JsonFormat("SUCCESS", 200, utils.Crypto.Md5(data))
}

func (e *encrypt) Sha1(stream *lemo.Stream) exception.Error {

	var data = stream.Query.Get("data").Bytes()

	return stream.JsonFormat("SUCCESS", 200, utils.Crypto.Sha1(data))
}

func (e *encrypt) Sha256(stream *lemo.Stream) exception.Error {

	var data = stream.Query.Get("data").Bytes()

	return stream.JsonFormat("SUCCESS", 200, utils.Crypto.Sha256(data))
}

func (e *encrypt) Sha512(stream *lemo.Stream) exception.Error {

	var data = stream.Query.Get("data").Bytes()

	return stream.JsonFormat("SUCCESS", 200, utils.Crypto.Sha512(data))
}

func (e *encrypt) Base64Encode(stream *lemo.Stream) exception.Error {
	var data = stream.Query.Get("data").Bytes()
	return stream.JsonFormat("SUCCESS", 200, utils.Crypto.Base64Encode(data))
}

func (e *encrypt) Base64Decode(stream *lemo.Stream) exception.Error {
	var data = stream.Query.Get("data").String()
	var res, _ = utils.Crypto.Base64Decode(data)
	return stream.JsonFormat("SUCCESS", 200, string(res))
}
