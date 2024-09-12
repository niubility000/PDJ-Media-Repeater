![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot1.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot1-1.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot2.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot51.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot52.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot6.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot7.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot8.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot301.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot302.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot303.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot304.jpg)

![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot305.jpg)

[![Build](https://github.com/filebrowser/filebrowser/actions/workflows/main.yaml/badge.svg)](https://github.com/filebrowser/filebrowser/actions/workflows/main.yaml)
[![Go Report Card](https://goreportcard.com/badge/github.com/filebrowser/filebrowser?style=flat-square)](https://goreportcard.com/report/github.com/filebrowser/filebrowser)
[![Documentation](https://img.shields.io/badge/godoc-reference-blue.svg?style=flat-square)](http://godoc.org/github.com/filebrowser/filebrowser)
[![Version](https://img.shields.io/github/release/filebrowser/filebrowser.svg?style=flat-square)](https://github.com/filebrowser/filebrowser/releases/latest)
[![Chat IRC](https://img.shields.io/badge/freenode-%23filebrowser-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23filebrowser)

PDJ Media Player is a mp3 and mp4 repeater with .srt subtitle file for English or any other language learning. It's modified based on [Filebrowser](https://github.com/filebrowser/filebrowser). 

## Assets Download

Updated: 09-12-2024

3.01: add a offline app mode (in settings)

[filebrowser-windows.zip](https://github.com/user-attachments/files/16985724/filebrowser-windows.zip)

[filebrowser-linux-amd64.zip](https://github.com/user-attachments/files/16985725/filebrowser-linux-amd64.zip)

[filebrowser-linux-arm64.zip](https://github.com/user-attachments/files/16985727/filebrowser-linux-arm64.zip)

Latest Source Code:

[filebrowser.zip](https://github.com/user-attachments/files/16985730/filebrowser.zip)

To compile the filebrowser for other platforms, see [Method of Compiling Filebrowser Source Codes in windows](https://github.com/niubility000/PDJ-Media-Repeater?tab=readme-ov-file#method-of-compiling-filebrowser-source-codes-in-windows)

Sample Media: [sample-media-1.zip](https://github.com/niubility000/PDJ-Media-Repeater/files/14899256/sample-media-1.zip)

(Note: In settings, Language Used In translation Line should be zh-CN for this sample media.)

## Quick Launch

PDJ Media Repeater is a green standalone software. 

In windows, just double click the filebrowser.exe, then you can visit it at your IP address:port in your browser. The default account is admin:admin (If you can't run filebrowser.exe in this way, use <a href="#lable">command line instead</a>.)

**WARNING: Please use standard browsers: Edge, Chrome, Safari or Firefox to ensure PDJ Media Repeater works correctly. Other browsers may not fully comply with HTML5 standard and may hijack media tags.**

Double click **the .srt file** with yellow icon in the webpage to launch PDJ Media Repeater. 

Note: To change the settings or add/remove a favorite sentence, you need login the filebrowser with an account which has the permission as below:  It will add a "PDJ-userX-favorite.txt" file in current user's root folder. 
![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot3.jpg)

And the following account permission settings in filebrowser will not allow the account user to change the settings and add/remove a favorite sentence in PDJ media repeater.
![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot12.jpg)


To change the password, the root dir, the port..., please see [Filebrowser Settings with command lines](https://github.com/niubility000/PDJ-Media-Repeater?tab=readme-ov-file#filebrowser-settings-with-command-lines). 

## Media Files Requirements

Media file should be .mp3 or .mp4 (case sensitive).

.srt subtitle file should has the same name with the .mp3 or mp4 file in the same folder. 

If the .srt file has language other than English, it should use utf8 encoding. (To change it, just open it with windows NotePad and choose "save as", select "utf8" encoding.)

## Operating Instructions

Click on the screen (DOWN arrow key on keyboard): replay current sentence

DoubleClick on the screen (UP arrow key on keyboard): stop playing

Swipe Left on the screen (RIGHT arrow key on keyboard): jump to next sentence

Swipe Right on the screen(LEFT arrow key on keyboard): jump to previous sentence

Swipe Up on the screen: add to favorites (Or remove a favorite when playing Favorite List)

Swipe Down on the screen: close this player

Click top-right button: switch Playback Mode between "Single Sentence Repetition Mode" and "Regular Mode".

## Functions:

-Switch subtitle languages.

-Jump to a certain sentence by inputting the sentence number

-Switch between Sentence Repetition Mode and Regular Mode

-In Sentence Repetition Mode:

--Set the repetition times, intervals, playback speed for each time

--add or remove favorite sentences 

--play the favorite list

--Utter the translation lines in the subtitles with TTS in the beginning or in the end.

## To Learn A Language Using PDJ Media Repeater

There are two very effective methods to learn a language: Shadowing and Reciting. For shadowing, you need listen to a sentence firstly, and then repeat it yourself immediately (maybe in mind). For reciting, you need read or listen to a sentence in your mother language firstly, and then translate to the new language immediately. 

The key to success is REPETITION. For the same sentence, you need to repeat shadowing and reciting it again and again (maybe 100 times in a month) to make it as familiar as your mother language. This is a boring and time-consuming job with no obvious effects in short time.

With PDJ Media Repeater, you can do shadowing and reciting easier. Just choose a video or audio with 20-50 sentences every week, and repeat shadowing and reciting them every morning and evening 2 or 3 times. You can lie in your bed, close your eyes, and click, or swipe left, up in your cell phone to learn the language. Thus, in one year, you may master thousands of sentences as fluent as your mother language. That will be a big improvement. 

## Source Files Changed in this Project based on Filebrowser v2.28.0

Added:

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/src/views/files/Repeater.vue

Modified:

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/src/views/Files.vue

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/cmd/root.go

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/version/version.go

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/src/i18n/en.json

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/src/i18n/zh-cn.json

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/public/img/logo.svg

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/src/css/login.css

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/src/utils/constants.js

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/http/auth.go

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/src/css/listing-icons.css

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/package.json

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/frontend/package-lock.json

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/http/headers.go

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/http/headers_dev.go

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/http/preview.go

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/http/raw.go

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/http/static.go

https://github.com/niubility000/PDJ-Media-Repeater/blob/main/filebrowser/http/tus_handlers.go


<span id="lable"> </span>
## Filebrowser Settings with command lines

In windows for example:

Put your filebrowser.exe into a folder like d:\filebrowser

In DOS window:

cd d:\filebrowser

.\filebrowser.exe -d filebrowser.db config init    //it will add a "filebrowser.db" file in d:\filebrowser\

.\filebrowser.exe -d filebrowser.db users add kkk 123456 --perm.admin   //add a new administrator account, kkk:123456

.\filebrowser.exe -d filebrowser.db config set --port 1234

.\filebrowser.exe -d filebrowser.db config set --root d:/     //set the root path to driver d in your computer.

run filebrowser:

.\filebrowser.exe -d .\filebrowser.db --disable-preview-resize --cache-dir .\cache

stop filebrowser:

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
![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot4.jpg)

restart your cmd windows:

node -v

npm -v   // to make sure you installed them correctly.

1.3 Download the Latest PDJ Media Repeater (a Modified Filebrowser) source code:
![Preview](https://github.com/niubility000/PDJ-Media-Repeater/blob/main/!!!attachments/screenshot5.jpg)

Unzip it, and put the filebrowser folder into c:\go\src\

2 compile:

cd c:\go\src\filebrowser\frontend

npm config set registry https://registry.npmjs.org/      // run it if necessary.

npm install

npm run build

cd c:\go\src\filebrowser

go env -w GO111MODULE=on   // only run it at the first time.

go env -w GOPROXY=https://goproxy.cn,direct      // run it if necessary, only run it at the first time.

go env -w GOOS=windows   

go env -w GOARCH=amd64  

(for linux amd64, use: go env -w GOOS=linux, go env -w GOARCH=amd64)

(for linux arm64, use: go env -w GOOS=linux, go env -w GOARCH=arm64)

go get   

go build

Then, you will find filebrowser.exe in c:\go\src\filebrowser\

==============================================================