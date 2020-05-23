/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-05-20 21:13
**/

package app

import (
	"errors"
	"io"
	"os"
	"os/exec"
	"path"
	"sync"
	"syscall"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/exception"
	"github.com/Lemo-yxk/lemo/utils"
)

func newRunner() *runner {
	read, write, err := os.Pipe()
	exception.Assert(err)
	return &runner{read: read, write: write, languageExt: map[string]language{
		"go":         {file: "develop_tools.go", cmd: "go run "},
		"typescript": {file: "develop_tools.ts", cmd: "node "},
		"javascript": {file: "develop_tools.js", cmd: "node "},
		"python":     {file: "develop_tools.py", cmd: "python "},
		"java":       {file: "develop_tools.java", cmd: "java "},
		"rust":       {file: "develop_tools.rs", cmd: "rustc "},
		"csharp":     {file: "develop_tools.cs", cmd: "scs "},
		"php":        {file: "develop_tools.php", cmd: "php "},
	}}
}

type language struct {
	file string
	cmd  string
}

type runner struct {
	cmd         *exec.Cmd
	mux         sync.Mutex
	read        io.Reader
	write       io.Writer
	languageExt map[string]language
}

func (c *runner) Run(language string, codeString string) {

	c.mux.Lock()
	defer c.mux.Unlock()

	if c.cmd != nil {
		return
	}

	var tempDir = "./"

	lang, ok := c.languageExt[language]
	if ok {
		_ = utils.File.ReadFromString(codeString).WriteToPath(path.Join(tempDir, lang.file))
		c.cmd = utils.Cmd.New(lang.cmd + path.Join(tempDir, lang.file)).Cmd()
		c.cmd.Env = os.Environ()
	} else {
		c.cmd = utils.Cmd.New(codeString).Cmd()
		c.cmd.Env = os.Environ()
	}

	c.cmd.Stderr = c.write
	// c.cmd.Stdin = c.read
	c.cmd.Stdout = c.write

	_ = c.cmd.Start()

	console.Log("runner pid is", c.cmd.Process.Pid)

	go func() {
		_ = c.cmd.Wait()
		c.mux.Lock()
		c.cmd = nil
		if ok {
			_ = os.Remove(path.Join(tempDir, lang.file))
		}
		c.mux.Unlock()
	}()

	go func() {

		for bytes := range c.readPipe() {

			var react = React().GetConnection()
			if react == nil {
				continue
			}

			console.Assert(
				react.JsonFormat(lemo.JsonPackage{
					Event:   "/Server/System/runner",
					Message: string(bytes),
				}),
			)
		}
	}()
}

func (c *runner) readPipe() chan []byte {

	var ch = make(chan []byte)

	var buf = make([]byte, 1024)

	go func() {

		for {
			n, err := c.read.Read(buf)
			if err != nil {
				break
			}

			ch <- buf[:n]
		}

		close(ch)

	}()

	return ch

}

func (c *runner) Kill() error {
	c.mux.Lock()
	defer c.mux.Unlock()
	if c.cmd == nil {
		return errors.New("no cmd")
	}
	console.Log("kill", c.cmd.Process.Pid)
	return utils.Signal.KillGroup(c.cmd.Process.Pid, syscall.SIGKILL)
}
