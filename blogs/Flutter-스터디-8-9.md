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

### 사전 지식

#### 위젯 생명주기

위젯이 화면에 그려지는 순간부터 삭제되는 순간까지의 주기

- StatelessWidget
  ![StatelessWidget의 생명주기](/images/Flutter-스터디-8-9/17.png)

  - `build()`는 필수로 오버라이드해야 하는 함수이다.
  - 한 번 생성된 인스턴스의 `build()` 함수는 재실행되지 않는다. 대신 인스턴스를 아예 새로 생성한 후 기존 인스턴스를 대체해서 변경 사항을 화면에 반영한다.

- StatefulWidget

  - 상태 변경이 없는 생명주기 (1): 위젯이 화면에 나타나며 생성되는 과정
    ![상태 변경이 없는 생명주기 (1): 생성](/images/Flutter-스터디-8-9/13.png)
    1. `StatefulWidget`의 생성자가 실행된다.
    2. `createState()`는 필수로 오버라이드해야 하는 함수이며 `StatefulWidget`과 연동되는 `State`를 생성한다.
    3. `initState()`는 `State`가 생성되는 순간에만 단 한번 실행된다.
    4. `didChangeDependencies()`는 `initState()` 직후에 실행된다. `initState()`와 다르게 `BuildContext`가 제공된다.
    5. `build()`가 실행 후 UI가 반영된다.
  - 상태 변경이 없는 생명주기 (2): 위젯이 위젯 트리에서 사라지는 과정
    ![상태 변경이 없는 생명주기 (2): 삭제](/images/Flutter-스터디-8-9/14.png)
    1. 위젯이 위젯 트리에서 사라지면 `deactivate()`가 실행된다. 이것이 위젯의 영구 삭제를 의미하는 것은 아니다.
    2. 위젯이 **영구적으로** 삭제될 때 `dispose()`가 실행된다. 위젯이 가진 리소스를 해제할 수 있다.
  - StatefulWidget 생성자의 매개변수가 변경됐을 때 생명주기
    ![StatefulWidget 생성자의 매개변수가 변경됐을 때 생명주기](/images/Flutter-스터디-8-9/15.png)
    - 예를 들어, 자식 위젯에게 전달되는 부모 위젯의 값을 변경했을 때 자식 위젯에서 발생하는 생명주기
    1. `didUpdateWidget()`가 실행된다.
    2. `build()`가 실행된다.
  - State 자체적으로 `build()`를 재실행할 때 생명주기
    ![State 자체적으로 build()를 재실행할 때 생명주기](/images/Flutter-스터디-8-9/16.png)
    - 클래스는 `setState()` 함수를 실행해서 `build()` 함수를 자체적으로 재실행한다.

#### Timer

Timer는 특정 시간이 지난 후에 일회성 또는 지속적으로 함수를 실행한다.

```dart
Timer.periodic(
  Duration(seconds: 3), // 주기
  (Timer timer) {}, // 주기가 지날 때마다 실행할 콜백 함수
);
```

### 사전 준비

1. 새 프로젝트 생성

2. 이미지 추가하기

   프로젝트 폴더에 `asset/img` 폴더를 생성하고 이미지를 추가한다.

   ![이미지 추가](/images/Flutter-스터디-8-9/6.png)

3. `pubspec.yaml` 설정

   ```yaml
   flutter:
     uses-material-design: true
     assets:
       - asset/img/ # 추가
   ```

4. 프로젝트 초기화하기

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

   import 'package:image_carousel/screen/home_screen.dart';
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

   ![프로젝트 초기화](/images/Flutter-스터디-8-9/7.png)

### 레이아웃 구상하기

PageView 하나로 구성되어 있다.

![레이아웃](/images/Flutter-스터디-8-9/12.png)

### 구현하기

#### 페이지뷰 구현하기

PageView 위젯은 여러 개의 위젯을 단독 페이지로 생성하고 가로 또는 세로 스와이프로 페이지를 넘길 수 있게 하는 위젯이다.

```dart
// lib/screen/home_screen.dart

import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // PageView 추가
      body: PageView(
          children: [1, 2, 3, 4, 5] // 샘플 리스트 생성
              .map(
                (number) => Image.asset(
                  'asset/img/image_$number.jpeg',
                  fit: BoxFit.cover, // 항상 전체 화면을 차지하도록
                ),
              )
              .toList()),
    );
  }
}
```

![페이지뷰 구현](/images/Flutter-스터디-8-9/8.gif)

#### 상태바 색상 변경하기

상태바: 앱 실행 중에 배터리, 시간, 와이파이 연결 상태 등을 보여주는 영역

```dart
// lib/screen/home_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 추가

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light); // 상태바 색상 변경

    return Scaffold(
      body: PageView(
          children: [1, 2, 3, 4, 5]
              .map(
                (number) => Image.asset(
                  'asset/img/image_$number.jpeg',
                  fit: BoxFit.cover,
                ),
              )
              .toList()),
    );
  }
}
```

![상태바 색상 변경](/images/Flutter-스터디-8-9/9.png)

#### 타이머 추가하기

StatelessWidget을 그대로 사용하면 Timer를 build()에 등록해야 한다. 그러면 build() 함수가 불릴 때마다 매번 새로운 Timer가 생성되어 메모리 누수가 생기게 된다. StatefulWidget의 initState()를 사용하면 State가 생성될 때 딱 한 번만 Timer를 생성할 수 있다.

```dart
// lib/screen/home_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async'; // async 패키지 불러오기

// StatefulWidget 정의
class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

// _HomeScreenState 정의
class _HomeScreenState extends State<HomeScreen> {
  // initState() 함수 등록
  @override
  void initState() {
    super.initState(); // 부모 initState() 실행

    Timer.periodic(
      // Timer.periodic() 등록
      Duration(seconds: 3),
      (timer) {
        print('실행!');
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // 생략
  }
}
```

initState()에 작성한 코드는 핫 리로드를 했을 때 반영이 안된다. 왜냐하면 initState()는 State가 생성될 때 딱 한 번만 실행이 되는데 이미 StatefulWidget으로 코드를 전환하는 과정에서 State를 생성해버렸기 때문이다. 따라서 재실행이 필요하다.

![타이머 추가](/images/Flutter-스터디-8-9/10.png)

PageController를 사용해서 PageView를 조작할 수 있다.

```dart
// lib/screen/home_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // PageController 생성
  final PageController pageController = PageController();

  @override
  void initState() {
    super.initState();

    Timer.periodic(
      Duration(seconds: 3),
      (timer) {
        // 현재 페이지 가져오기
        int? nextPage = pageController.page?.toInt();

        // 페이지 값이 없을 때 예외 처리
        if (nextPage == null) {
          return;
        }

        // 페이지 변경
        pageController.animateToPage(
          (nextPage + 1) % 5,
          duration: Duration(milliseconds: 500),
          curve: Curves.ease,
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyl(SystemUiOverlayStyle.light);

    return Scaffold(
      body: PageView(
          controller: pageController, // PageController 등록
          children: [1, 2, 3, 4, 5]
              .map(
                (number) => Image.asset(
                  'asset/img/image_$number.jpeg',
                  fit: BoxFit.cover,
                ),
              )
              .toList()),
    );
  }
}
```

![3초마다 자동으로 페이지 변경](/images/Flutter-스터디-8-9/11.gif)
