![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!notes/screenshot1.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!notes/screenshot2.jpg)

[![Build](https://github.com/filebrowser/filebrowser/actions/workflows/main.yaml/badge.svg)](https://github.com/filebrowser/filebrowser/actions/workflows/main.yaml)
[![Go Report Card](https://goreportcard.com/badge/github.com/filebrowser/filebrowser?style=flat-square)](https://goreportcard.com/report/github.com/filebrowser/filebrowser)
[![Documentation](https://img.shields.io/badge/godoc-reference-blue.svg?style=flat-square)](http://godoc.org/github.com/filebrowser/filebrowser)
[![Version](https://img.shields.io/github/release/filebrowser/filebrowser.svg?style=flat-square)](https://github.com/filebrowser/filebrowser/releases/latest)
[![Chat IRC](https://img.shields.io/badge/freenode-%23filebrowser-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23filebrowser)

PDJ Media Player is a mp3 and mp4 repeater with .srt subtitle file for language learning. It's modified based on Filebrowser. 

## Assets Download
windows version:
[filebrowser.zip](https://github.com/niubility000/PDJ-Media-Repeater/releases/download/v2.0/filebrowser-windows-64.zip)

linux amd64 version:
[filebrowser.zip](https://github.com/niubility000/PDJ-Media-Repeater/releases/download/v2.0/filebrowser-linux-amd64.zip)

linux arm64 version:
[filebrowser.zip](https://github.com/niubility000/PDJ-Media-Repeater/releases/download/v2.0/filebrowser-linux-arm64.zip)

[sample media.zip](https://github.com/niubility000/PDJ-Media-Repeater/files/14895563/sample.media.zip)
(Note: In settings, Language Used In translation Line should be zh-CN for this sample media.)

## Install
PDJ Media Repeater is a green standalone software. It's modified based on [Filebrowser](https://github.com/filebrowser/filebrowser). 
In windows, just double click the filebrowser.exe, then you can visit it at 127.0.0.1:8080, 192.168.x.x:8080 or public internet in your browser. The default account is admin:admin

Double click the .srt file in the webpage to launch PDJ Media Repeater. 

Note: To change the settings or add a favorite sentence, you need login the filebrowser with an account which has the permission to "Create files and directories"  It will add a "favorate.txt" file in current folder after you change the settings or add a favorate sentence. 
![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!notes/screenshot3.jpg)

To change the password, the root dir, the port..., please see "Filebrowser Settings with command lines". 

## Media Files Requirements

Media file should be .Mp3 or .Mp4.

.srt subtitle file should has the same name with the .mp3 or mp4 in the same folder. 

If the .srt file has language other than English, it should use utf8 encoding. (You can use windows NotePad to change it easily, just save as, choose "utf8".)

## Operating Instructions

Click top-right button: switch Playback Mode between "Single Sentence Repetition Mode" and "RegularMode".

Click in subtitle area (down arrow key on keyboard): replay current sentence.

DoubleClick (up arrow key on keyboard): pause.

Swipe left (right arrow key on keyboard): jump to next sentence.

Swipe right (left arrow key on keyboard): jump to last sentence.

Swipe Up: add this sentence to Favorate List.

Swipe down: close this player.

## Functions:

-Switch subtitle languages.

-Jump to a certain sentence by inputting the sentence number

-Switch between Sentence Repetition Mode and Regular Mode

-In Sentence Repetition Mode:

--Set the repetition times, intervals, playback speed for each time

--add or remove favorite sentences 

--play the favorite list

--Utter the translation lines in the subtitles with TTS in the beginning or in the end.

## Source Files Changed in this Project based on Filebrowser v2.28.0

Added:

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/src/views/files/Repeater.vue

Modified:

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/src/views/Files.vue

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/cmd/root.go

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/version/version.go

## Filebrowser Settings with command lines

In windows for example:

Put your filebrowser.exe into the folder d:\filebrowser

cd d:\filebrowser

.\filebrowser.exe -d filebrowser.db config init    //it will add a "filebrowser.db" file in d:\filebrowser\

.\filebrowser.exe -d filebrowser.db users add kkk 123456 --perm.admin   //add a new administrator account, kkk:123456

.\filebrowser.exe -d filebrowser.db config set --port 1234

.\filebrowser.exe -d filebrowser.db config set --root d:/     //set the root path to driver d in your computer.

run:

.\filebrowser.exe -d .\filebrowser.db --disable-preview-resize --cache-dir .\cache

stop:

ctrl+c

## Method of Compiling Filebrowser Source Codes in windows

1.1 install go:

Download the latest golang from https://golang.google.cn/dl/ (for example: go1.19.1.windows-amd64.msi)

Install it, set the path to c:\Go\, then next, next,...

in cmd windows:
go version   // to make sure you installed it correctly.

1.2 install nodejs:

Download it from https://nodejs.org

Install it, set the path to C:\nodejs\, then next, next,...

set the envirnment variables: 
![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!notes/screenshot4.jpg)

restart your cmd windows:

node -v

npm -v   // to make sure you installed them correctly.

1.3 Download the filebrowser source code:
![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!notes/screenshot5.jpg)

Unzip it, and put the filebrowser folder into c:\go\src\

2 compile:

cd c:\go\src\filebrowser\frontend

npm config set registry http://registry.npm.taobao.org  // run it if necessary.

npm install

npm run build

cd c:\go\src\filebrowser

go env -w GO111MODULE=on   // only run it at the first time.

go env -w GOPROXY=https://goproxy.cn,direct    // run it if necessary, only run it at the first time.

go env -w GOOS=windows   

go env -w GOARCH=amd64  

(for linux amd64, use: go env -w GOOS=linux, go env -w GOARCH=amd64)

(for linux arm64, use: go env -w GOOS=linux, go env -w GOARCH=arm64)

go get   

go build

Then, you will find filebrowser.exe in c:\go\src\filebrowser\

==============================================================