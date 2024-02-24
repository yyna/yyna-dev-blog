---
title: 플러터 스터디 (3)
description: 8장. 블로그 웹 앱, 9장. 전자액자
date: 2024-02-28
category: tech
published: true
disqusIdentifier: flutter-study-3
---

> 이 글은 골든래빗 《코드팩토리의 플러터 프로그래밍》의 스터디 내용 입니다.

## 8장. 블로그 웹 앱

### 사전 지식

#### 콜백 함수

콜백함수는 일정 작업이 완료되면 실행되는 함수이다.

- ex) 웹뷰의 로딩이 완료되면 실행할 콜백 함수

  ```dart
  WebViewController controller = WebViewController()
    ..setNativeDelegate(NavigationDelegate(
        // 로딩 완료 후 실행되는 함수
        onPageFinished: (String url) { // 로딩된 페이지의 URL
          print(url);
        }
    ))
  ```

#### 웹뷰 위젯

웹뷰는 프레임워크에 내장된 브라우저를 앱의 네이티브 컴포넌트에 임베딩하는 기능이다.

웹뷰를 구현할 때 사용할 웹뷰 위젯은 controller 파라미터에 WebViewController 객체를 입력해줘야 한다. 웹뷰 컨트롤러는 웹뷰 위젯을 제어하는데 필요한 기능을 제공해준다.

`WebViewController controller = WebViewController();`

### 사전 준비

1. 새 프로젝트 생성
2. `pubspec.yaml` 설정

   `webview_flutter` 플러그인을 추가하고 [pub get] 실행

   ```yaml
   dependencies:
     flutter:
     sdk: flutter

     cupertino_icons: ^1.0.2
     webview_flutter: 4.4.1 # 추가하기
   ```

3. 권한 및 네이티브 설정 - 인터넷 사용 권한 추가, http 프로토콜 이용할 수 있게 수정

   a. 안드로이드 설정

   ```xml
   <!-- android/app/src/main/AndroidManifest.xml -->

   <manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" /> <!-- 추가 -->
      <application
        android:label="blog_web_app"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true"> <!-- 추가 -->
    <!-- ... -->
   </manifest>
   ```

   ```gradle
   // android/app/build.gradle

   android {
    ...
    compileSdkVersion 33 // 수정
    ...
    defaultConfig {
      ...
      minSdkVersion 20 // 수정
      ...
    }
   }
   ```

   b. iOS 설정

   `Info.plist` 파일은 iOS 앱의 런타임을 설정하는 파일이다.

   ```xml
   <!-- ios/Runner/Info.plist -->
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
      <!-- 아래 7줄 추가 -->
      <key>NSAppTransportSecurity</key>
      <dict>
          <key>NSAllowsLocalNetworking</key>
          <true/>
          <key>NSAllowsArbitraryLoadsInWebContent</key>
          <true/>
      </dict>
   </dict>
   </plist>
   ```

4. 프로젝트 초기화

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

   import 'package:blog_web_app/screen/home_screen.dart';
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

   ![프로젝트 초기화](/images/Flutter-스터디-8-9/1.png)

### 레이아웃 구상하기

![프로젝트 초기화](/images/Flutter-스터디-8-9/4.png)

- 앱바: 제목과 홈 버튼 렌더링
- 웹뷰: 지정한 URL의 내용(웹페이지)을 보여준다.

### 구현하기

#### 앱바 구현하기

```dart
// lib/screen/home_screen.dart

import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // 앱바 위젯 추가
      appBar: AppBar(
        backgroundColor: Colors.orange, // 배경색 지정
        title: Text('Code Factory'), // 앱 타이틀 설정
        centerTitle: true, // 가운데 정렬
      ),
      body: Text('Home Screen'),
    );
  }
}
```

![앱바 구현](/images/Flutter-스터디-8-9/2.png)

#### 웹뷰 구현하기

```dart
// lib/screen/home_screen.dart

import 'package:flutter/material.dart';

// 웹뷰 플러그인 불러오기
import 'package:webview_flutter/webview_flutter.dart';

class HomeScreen extends StatelessWidget {
  // WebViewController 선언
  WebViewController webViewController = WebViewController()
    ..loadRequest(Uri.parse('https://blog.codefactory.ai'))
    ..setJavaScriptMode(
        JavaScriptMode.unrestricted); // javascript가 제한없이 실행될 수 있도록

  HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.orange,
        title: Text('Code Factory'),
        centerTitle: true,
      ),
      // 웹뷰 위젯 추가
      body: WebViewWidget(
        controller: webViewController,
      ),
    );
  }
}
```

![웹뷰 구현](/images/Flutter-스터디-8-9/3.png)

#### `main.dart` 파일 수정

```dart
// lib/main.dart

import 'package:blog_web_app/screen/home_screen.dart';
import 'package:flutter/material.dart';

void main() {
  // 플러터 프레임워크가 앱을 실행할 준비가 될 때까지 기다림
  WidgetsFlutterBinding.ensureInitialized();

  runApp(
    MaterialApp(
      home: HomeScreen(),
    ),
  );
}
```

일반적으로 개발자가 직접 이 함수를 실행할 필요는 없지만 `StatelessWidget`에서 `WebViewController`를 프로퍼티로 직접 인스턴스화하려면 `ensureInitialized()` 함수를 직접 실행해줘야 한다.

#### 홈 버튼 구현하기

```dart
// lib/screen/home_screen.dart

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class HomeScreen extends StatelessWidget {
  WebViewController webViewController = WebViewController()
    ..loadRequest(Uri.parse('https://blog.codefactory.ai'))
    ..setJavaScriptMode(JavaScriptMode.unrestricted);

  HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.orange,
        title: Text('Code Factory'),
        centerTitle: true,
        // AppBar에 액션 버튼을 추가할 수 있는 매개변수
        actions: [
          IconButton(
            // 아이콘을 눌렀을 때 실행할 콜백 함수
            onPressed: () {
              // 웹뷰 위젯에서 사이트 전환하기
              webViewController
                  .loadRequest(Uri.parse('https://blog.codefactory.ai'));
            },
            // 홈 버튼 아이콘 설정
            icon: Icon(
              Icons.home,
            ),
          )
        ],
      ),
      body: WebViewWidget(
        controller: webViewController,
      ),
    );
  }
}
```

![웹뷰 구현](/images/Flutter-스터디-8-9/5.gif)

## 9장. 전자액자
