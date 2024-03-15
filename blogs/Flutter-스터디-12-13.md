---
title: 플러터 스터디 (5)
description: 12장. 동영상 플레이어, 13장. 영상 통화
date: 2024-03-14
category: tech
published: true
disqusIdentifier: flutter-study-5
---

> 이 글은 골든래빗 《코드팩토리의 플러터 프로그래밍》의 스터디 내용 입니다.

## 12장. 동영상 플레이어

### 사전 지식

#### 시간 변환 및 String 패딩

```dart
Duration duration = Duration(seconds: 192);

print(duration); // 0:03:12.000000
print(duration.toString().split('.')[0]); // 0:03:12
print(duration.toString().split('.')[0].split(':').sublist(1, 3).join(':')); // 03:12
print('${duration.inMinutes.toString().padLeft(2, '0')}:${(duration.inSeconds % 60).toString().padLeft(2, '0')}'); // 03:12

print('23'.padLeft(3, '0')); // 023
print('233'.padLeft(3, '0')); // 233
```

### 사전 준비

1. 새 프로젝트 생성

2. 가상 단말에 동영상 추가하기

   ![가상 단말에 동영상 추가하기](/images/Flutter-스터디-12-13/1.png)

3. 이미지 추가하기

   ![이미지 추가하기](/images/Flutter-스터디-12-13/2.png)

4. `pubspec.yaml` 설정하기

   ```yaml
   dependencies:
     flutter:
       sdk: flutter

     cupertino_icons: ^1.0.2
     image_picker: 1.0.4 # 추가
     video_player: 2.8.1 # 추가

   flutter:
     uses-material-design: true

     assets:
       - asset/img/ # 추가
   ```

   [pub get] 실행!

5. 네이티브 설정하기

   이번 프로젝트는 <u>갤러리 관련 권한</u>이 필요하다. 갤러리에서 사용자가 선택한 동영상을 불러오려면 안드로이드와 iOS 모두에서 갤러리 권한을 추가해야 한다.

   a. iOS 권한 추가하기

   ```xml
   <!-- ios/Runner/Info.plist -->

   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
     <!-- 생략. 아래 2줄 추가 -->
     <key>NSPhotoLibraryUsageDescription</key>
     <string>갤러리 권한을 허가해주세요.</string>
   </dict>
   </plist>
   ```

   b. 안드로이드 권한 추가하기

   ```xml
   <!-- app/src/main/AndroidManifest.xml -->

   <manifest xmlns:android="http://schemas.android.com/apk/res/android">
       <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
       <!-- 생략 -->
   </manifest>
   ```

6. 프로젝트 초기화하기

   ```dart
   // lib/screen/home_screen.dart

   import 'package:flutter/material.dart';

   class HomeScreen extends StatelessWidget {
     const HomeScreen({Key? key}) : super(key: key);

     @override
     Widget build(BuildContext context) {
       return Scaffold(
         body: Text('Home Screen'),
       );
     }
   }
   ```

   ```dart
   // lib/main.dart

   import 'package:vid_player/screen/home_screen.dart';
   import 'package:flutter/material.dart';

   void main() {
     runApp(
       MaterialApp(
         home: HomeScreen(),
       ),
     );
   }
   ```

   위 앱을 실행하면 이런 화면이 뜬다.

   ![프로젝트 초기화](/images/Flutter-스터디-12-13/3.png)

### 레이아웃 구상하기

실질적으로 화면 하나로 구성되어 있지만 조건에 따라 알맞은 위젯을 보여주기로 하자. `renderEmpty()` 함수와 `renderVideo()` 함수 각각 동영상이 선택되기 전과 후를 담당하는 위젯을 반환하도록 한다.

#### 첫 화면 : `renderEmpty()` 함수

![renderEmpty() 함수](/images/Flutter-스터디-12-13/4.png)

#### 플레이 화면 : `renderVideo()` 함수

![renderVideo() 함수](/images/Flutter-스터디-12-13/5.png)

### 구현하기

```dart
// lib/component/custom_icon_button.dart

import 'package:flutter/material.dart';

class CustomIconButton extends StatelessWidget {
  final GestureTapCallback onPressed; // 아이콘을 눌렀을 때 실행할 함수
  final IconData iconData; // 아이콘

  const CustomIconButton({
    required this.onPressed,
    required this.iconData,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 아이콘을 버튼으로 만들어주는 위젯
    return IconButton(
      onPressed: onPressed, // 아이콘을 눌렀을 때 실행할 함수
      iconSize: 30.0, // 아이콘 크기
      color: Colors.white, // 아이콘 색상
      icon: Icon(
        // 아이콘
        iconData,
      ),
    );
  }
}
```

```dart
// lib/component/custom_video_player.dart

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:video_player/video_player.dart';
import 'dart:io'; // 파일 관련 작업 패키지
import 'package:vid_player/component/custom_icon_button.dart';

// 동영상 위젯 생성
class CustomVideoPlayer extends StatefulWidget {
  // 선택한 동영상을 저장할 변수
  // XFile은 ImagePicker로 영상 또는 이미지를 선택했을 때 반환하는 타입
  final XFile video;

  // 새로운 동영상을 선택하면 실행되는 함수
  final GestureTapCallback onNewVideoPressed;

  const CustomVideoPlayer({
    required this.video, // 상위에서 선택한 동영상 주입해주기
    required this.onNewVideoPressed,
    Key? key,
  }) : super(key: key);

  @override
  State<CustomVideoPlayer> createState() => _CustomVideoPlayerState();
}

class _CustomVideoPlayerState extends State<CustomVideoPlayer> {
  VideoPlayerController? videoController; // 동영상을 조작하는 컨트롤러
  bool showControls = false; // 동영상 조작하는 아이콘을 보일지 여부

  @override
  void initState() {
    super.initState();

    initializeController(); // 컨트롤러 초기화
  }

  // 선택한 동영상으로 컨트롤러 초기화
  initializeController() async {
    final videoController = VideoPlayerController.file(
      File(widget.video.path),
    );

    await videoController.initialize(); // 동영상을 재생할 수 있는 상태로 준비

    // 컨트롤러의 속성이 변경될 때마다 실행할 함수 등록
    videoController.addListener(videoControllerListener);

    setState(() {
      this.videoController = videoController;
    });
  }

  // 동영상의 재생 상태가 변경될 때마다 setState()를 실행해서 build를 재실행
  void videoControllerListener() {
    setState(() {});
  }

  @override
  void dispose() {
    // listener 삭제
    videoController?.removeListener(videoControllerListener);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // 동영상 컨트롤러가 준비 중일 때 로딩 표시
    if (videoController == null) {
      return Center(
        child: CircularProgressIndicator(),
      );
    }

    // 화면 전체의 탭을 인식하기 위해 사용
    return GestureDetector(
      onTap: () {
        setState(() {
          showControls = !showControls;
        });
      },
      child: AspectRatio(
        aspectRatio: videoController!.value.aspectRatio,
        // children 위젯을 위로 쌓을 수 있는 위젯
        child: Stack(
          children: [
            VideoPlayer(
              videoController!,
            ),
            if (showControls)
              // 아이콘 버튼을 보일 때 화면을 어둡게 변경
              Container(
                color: Colors.black.withOpacity(0.5),
              ),
            // child 위젯의 위치를 정할 수 있는 위젯
            Positioned(
              bottom: 0,
              right: 0,
              left: 0,
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 8.0),
                child: Row(
                  children: [
                    renderTimeTextFromDuration(
                      // 동영상 현재 위치
                      videoController!.value.position,
                    ),
                    Expanded(
                      child:
                          // // 동영상 재생 상태를 보여주는 슬라이더
                          Slider(
                        // 슬라이더가 이동할 때마다 실행할 함수
                        onChanged: (double val) {
                          videoController!.seekTo(
                            Duration(seconds: val.toInt()),
                          );
                        },
                        value: videoController!.value.position.inSeconds.toDouble(), // 동영상 재생 위치를 초 단위로 표현
                        min: 0,
                        max: videoController!.value.duration.inSeconds.toDouble(),
                      ),
                    ),
                    renderTimeTextFromDuration(
                      videoController!.value.duration, // 동영상 총 길이
                    ),
                  ],
                ),
              ),
            ),
            if (showControls)
              // 오른쪽 위에 새 동영상 아이콘 위치
              Align(
                alignment: Alignment.topRight,
                child: CustomIconButton(
                  onPressed: widget
                      .onNewVideoPressed, // 카메라 아이콘을 선택하면 새로운 동영상 선택 함수 실행
                  iconData: Icons.photo_camera_back,
                ),
              ),
            if (showControls)
              // 동영상 재생 관련 아이콘 중앙에 위치
              Align(
                alignment: Alignment.center,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // 되감기 버튼
                    CustomIconButton(
                      onPressed: onReversePressed,
                      iconData: Icons.rotate_left,
                    ),
                    // 재생 버튼
                    CustomIconButton(
                      onPressed: onPlayPressed,
                      iconData: videoController!.value.isPlaying
                          ? Icons.pause
                          : Icons.play_arrow,
                    ),
                    // 되감기 버튼
                    CustomIconButton(
                      onPressed: onForwardPressed,
                      iconData: Icons.rotate_right,
                    ),
                  ],
                ),
              )
          ],
        ),
      ),
    );
  }

  // Duration 값을 보기 편한 형태로 변환하기
  Widget renderTimeTextFromDuration(Duration duration) {
    return Text(
      '${duration.inMinutes.toString().padLeft(2, '0')}:${(duration.inSeconds % 60).toString().padLeft(2, '0')}',
      style: TextStyle(
        color: Colors.white,
      ),
    );
  }

  // 되감기 버튼 눌렀을 때 실행할 함수
  void onReversePressed() {
    final currentPosition = videoController!.value.position; // 현재 실행 중인 위치

    Duration position = Duration(); // 0초로 실행 위치 초기화

    // 현재 실행 위치가 3초보다 길 때만 3초 빼기
    if (currentPosition.inSeconds > 3) {
      position = currentPosition - Duration(seconds: 3);
    }

    videoController!.seekTo(position);
  }

  // 앞으로 감기 버튼 눌렀을 때 실행할 함수
  void onForwardPressed() {
    final maxPosition = videoController!.value.duration; // 동영상 길이
    final currentPosition = videoController!.value.position;

    Duration position = maxPosition; // 동영상 길이로 실행 위치 초기화

    // 동영상 길이에서 3초를 뺀 값보다 현재 위치가 짧을 때만 3초 더하기
    if ((maxPosition - Duration(seconds: 3)).inSeconds >
        currentPosition.inSeconds) {
      position = currentPosition + Duration(seconds: 3);
    }

    videoController!.seekTo(position);
  }

  // 재생 버튼을 눌렀을 때 실행할 함수
  void onPlayPressed() {
    if (videoController!.value.isPlaying) {
      videoController!.pause();
    } else {
      videoController!.play();
    }
  }

  @override
  // covariant 키워드는 CustomVideoPlayer 클래스의 상속된 값도 허가해준다.
  void didUpdateWidget(covariant CustomVideoPlayer oldWidget) {
    super.didUpdateWidget(oldWidget);

    // 새로 선택한 동영상이 같은 동영상인지 확인
    if (oldWidget.video.path != widget.video.path) {
      initializeController();
    }
  }
}
```

👩🏻‍💻 initializeController 함수는 왜 반환 타입이 없을까? [Dart 공식 문서: Functions](https://dart.dev/language/functions)에 보면 아래와 같은 내용을 확인할 수 있다. 생략해도 작동은 한다는 것!

> Although Effective Dart recommends type annotations for public APIs, the function still works if you omit the types:

```dart
// lib/screen/home_screen.dart

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

// CustomVideoPlayer 위젯 파일 임포트
import 'package:vid_player/component/custom_video_player.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  XFile? video; // 동영상 저장할 변수, image_picker 플러그인을 사용하면 XFile 형태로 동영상을 받아볼 수 있다.

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,

      // 동영상이 선택됐을 때와 선택 안 됐을 때 보여줄 위젯
      body: video == null ? renderEmpty() : renderVideo(),
    );
  }

  // 동영상 선택 전 보여줄 위젯
  Widget renderEmpty() {
    return Container(
      width: MediaQuery.of(context).size.width, // 너비 최대로 늘려주기
      decoration: getBoxDecoration(), // 함수로부터 값 가져오기
      child: Column(
        //  위젯들 가운데 정렬
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _Logo(
            onTap: onNewVideoPressed, // 로고 탭하면 실행하는 함수
          ), // 로고 이미지
          SizedBox(height: 30.0),
          _AppName(), // 앱 이름
        ],
      ),
    );
  }

  // 이미지 선택하는 기능을 구현한 함수
  void onNewVideoPressed() async {
    final video = await ImagePicker().pickVideo(
      source: ImageSource.gallery,
    );

    if (video != null) {
      setState(() {
        this.video = video;
      });
    }
  }

  BoxDecoration getBoxDecoration() {
    return BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          Color(0xFF2A3A7C),
          Color(0xFF000118),
        ],
      ),
    );
  }

  // 동영상 선택 후 보여줄 위젯
  Widget renderVideo() {
    return Center(
      child: CustomVideoPlayer(
        video: video!, // 선택된 동영상 입력해주기
        onNewVideoPressed: onNewVideoPressed,
      ), // 동영상 재생기 위젯
    );
  }
}

// 로고를 보여줄 위젯
class _Logo extends StatelessWidget {
  final GestureTapCallback onTap; // 탭했을 때 실행할 함수

  const _Logo({
    required this.onTap,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap, // 상위 위젯으로부터 탭 콜백받기
      child: Image.asset(
        'asset/img/logo.png',
      ),
    );
  }
}

// 앱 제목을 보여줄 위젯
class _AppName extends StatelessWidget {
  const _AppName({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final textStyle = TextStyle(
      color: Colors.white,
      fontSize: 30.0,
      fontWeight: FontWeight.w300,
    );

    return Row(
      mainAxisAlignment: MainAxisAlignment.center, // 글자 가운데 정렬
      children: [
        Text(
          'VIDEO',
          style: textStyle,
        ),
        Text(
          'PLAYER',
          style: textStyle.copyWith(
            // textStyle에서 두께만 700으로 변경
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
    );
  }
}
```

### 테스트하기

![테스트하기](/images/Flutter-스터디-12-13/6.gif)

## 13장. 영상 통화

### 사전 지식

#### 카메라 플러그인

```yaml
# pubspec.yaml

dependencies:
  flutter:
    sdk: flutter

  cupertino_icons: ^1.0.2
  camera: 0.10.5+5 # 추가
```

```dart
// lib/main.dart

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';

late List<CameraDescription> _cameras;

Future<void> main() async {
  // Flutter 앱이 실행될 준비가 됐는지 확인
  // material.dart에서 제공
  // main() 함수의 첫 실행값이 runApp()이면 불필요
  WidgetsFlutterBinding.ensureInitialized();

  // 핸드폰에 있는 카메라들 가져오기
  _cameras = await availableCameras();
  runApp(const CameraApp());
}

class CameraApp extends StatefulWidget {
  const CameraApp({Key? key}) : super(key: key);

  @override
  State<CameraApp> createState() => _CameraAppState();
}

class _CameraAppState extends State<CameraApp> {
  // 카메라를 제어할 수 있는 컨트롤러 선언
  late CameraController controller;

  @override
  void initState() {
    super.initState();

    initializeCamera();
  }

  initializeCamera() async {
    try {
      // 가장 첫 번째로 카메라 설정하기
      controller = CameraController(_cameras[0], ResolutionPreset.max);

      // 카메라 초기화
      await controller.initialize();

      setState(() {});
    } catch (e) {
      // 에러났을 떄 출력
      if (e is CameraException) {
        switch (e.code) {
          case 'CameraAccessDenied':
            print('User denied camera access.');
            break;
          default:
            print('Handle other errors.');
            break;
        }
      }
    }
  }

  @override
  void dispose() {
    // 컨트롤러 삭제
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // 카메라 초기화 상태 확인
    if (!controller.value.isInitialized) {
      return Container();
    }
    return MaterialApp(
      // 카메라 보여주기
      home: CameraPreview(controller),
    );
  }
}
```

위 앱을 실행하면 이렇게 카메라 접근 권한을 요청하는 화면이 뜬다. (camera_plugin은 앱 이름)

![카메라 접근 권한 요청](/images/Flutter-스터디-12-13/7.png)

'while using the app'을 선택하여 권한을 부여하면 이렇게 카메라 화면이 뜬다. 안드로이드 에뮬레이터로 앱을 실행했는데 실제로 카메라를 켠 것처럼 화면이 조금 움직이는 모습이다. 신기신기 🤩

![카메라 플러그인 테스트](/images/Flutter-스터디-12-13/8.gif)

#### WebRTC

WebRTC를 사용하려면 두 클라이언트 말고도 중계용 서버<sup>Signaling Server</sup>가 필요하다. 아고라 서비스를 사용해보자.

![WebRTC 중계 서버](/images/Flutter-스터디-12-13/9.png)
