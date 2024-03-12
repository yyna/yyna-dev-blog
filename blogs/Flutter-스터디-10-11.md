---
title: 플러터 스터디 (4)
description: 10장. 만난 지 며칠 U&I, 11장. 디지털 주사위
date: 2024-03-13
category: tech
published: true
disqusIdentifier: flutter-study-4
---

> 이 글은 골든래빗 《코드팩토리의 플러터 프로그래밍》의 스터디 내용 입니다.

## 10장. 만난 지 며칠 U&I

### 사전 지식

#### `setState()` 함수

- `State`를 상속하는 모든 클래스는 `setState()` 함수를 사용할 수 있다.
- 매개변수는 콜백 함수 하나를 입력받는다. (실행 순서: 콜백 함수 -> `build()` 함수)

```dart
setState(() {
  number++;
})
```

#### `showCupertinoDialog()` 함수

- iOS 스타일 다이얼로그를 실행하는 함수

```dart
import 'package:flutter/cupertino.dart'; // Cupertino 패키지 임포트

showCupertinoDialog(
  context: context,
  barrierDismissible: true, // 배리어 탭해서 다이얼로그 닫을 수 있게 하기
  builder: (BuildContext context) {
    return Text('Dialog'); // 다이얼로그에 들어갈 위젯 반환
  },
);
```

### 사전 준비

1. 새 프로젝트 생성

2. 이미지와 폰트 추가하기

   ![이미지와 폰트 추가](/images/Flutter-스터디-10-11/1.png)

3. `pubspec.yaml` 설정하기

   ```yaml
   flutter:
     uses-material-design: true

     assets:
       - asset/img/ # 이미지를 프로젝트에 포함시키기

     fonts:
       - family: parisienne
         fonts:
           - asset: asset/font/Parisienne-Regular.ttf
       - family: sunflower
         fonts:
           - asset: asset/font/Sunflower-Light.ttf
           - asset: asset/font/Sunflower-Medium.ttf
             weight: 500
           - asset: asset/font/Sunflower-Light.ttf
             weight: 700
   ```

   [pub get] 실행!

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

   import 'package:u_and_i/screen/home_screen.dart';
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

![프로젝트 초기화](/images/Flutter-스터디-10-11/2.png)

### 레이아웃 구상하기

![레이아웃 구상](/images/Flutter-스터디-10-11/9.jpg)

`_DDay` 위젯과 `_CoupleImage` 위젯 두가지를 위아래로 나누어서 구현하고 하트 아이콘을 클릭하면 `CupertinoDialog`가 실행되도록 구현한다.

### 구현하기

#### 홈 스크린 UI 구현하기

```dart
// lib/main.dart

import 'package:u_and_i/screen/home_screen.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      theme: ThemeData(
        fontFamily: 'sunflower',
        textTheme: TextTheme(
          headline1: TextStyle(
            color: Colors.white,
            fontSize: 80.0,
            fontWeight: FontWeight.w700,
            fontFamily: 'parisienne',
          ),
          headline2: TextStyle(
            color: Colors.white,
            fontSize: 50.0,
            fontWeight: FontWeight.w700,
          ),
          bodyText1: TextStyle(
            color: Colors.white,
            fontSize: 30.0,
          ),
          bodyText2: TextStyle(
            color: Colors.white,
            fontSize: 20.0,
          ),
        ),
      ),
      home: HomeScreen(),
    ),
  );
}
```

추가한 `theme`은 핫 리로드에 반영되지 않으므로 재시작이 필요하다.

```dart
// lib/screen/home_screen.dart

import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.pink[100], // 분홍 배경
      body: SafeArea(
        top: true,
        bottom: false,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _DDay(),
            _CoupleImage(),
          ],
        ),
      ),
    );
  }
}

class _DDay extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Column(
      children: [
        const SizedBox(height: 16.0),
        Text(
          'U&I',
          style: textTheme.headline1,
        ),
        const SizedBox(height: 16.0),
        Text(
          '우리 처음 만난 날',
          style: textTheme.bodyText1,
        ),
        Text(
          '2012.05.30',
          style: textTheme.bodyText2,
        ),
        const SizedBox(height: 16.0),
        IconButton(
          iconSize: 60.0,
          onPressed: () {},
          icon: Icon(
            Icons.favorite,
            color: Colors.red,
          ),
        ),
        const SizedBox(height: 16.0),
        Text(
          'D+365',
          style: textTheme.headline2,
        ),
      ],
    );
  }
}

class _CoupleImage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 이미지 중앙 정렬
    return Center(
      child: Image.asset(
        'asset/img/middle_image.png',
        height: MediaQuery.of(context).size.height / 2, // 화면 높이의 반
      ),
    );
  }
}
```

![홈 스크린 UI 구현](/images/Flutter-스터디-10-11/3.png)

상단의 글자들이 화면의 반 이상을 차지하면 아래쪽 이미지는 남은 공간보다 더 많은 높이를 차지한다. 이런 상황을 오버플로<sup>overflow</sup>라고 한다. 이때 Expanded 위젯을 사용하여 남는 공간 만큼만 이미지가 차지하도록 변경해줄 수 있다.

```dart
// lib/screen/home_screen.dart
// 생략

class _CoupleImage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Center(
        child: Image.asset(
          'asset/img/middle_image.png',
          height: MediaQuery.of(context).size.height / 2,
        ),
      ),
    );
  }
}
```

![Expanded 위젯으로 오버플로 해결](/images/Flutter-스터디-10-11/4.png)

#### 상태 관리 연습해보기

```dart
// lib/screen/home_screen.dart

import 'package:flutter/material.dart';

// StatefulWidget으로 변경
class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

// _HomeScreenState 추가
class _HomeScreenState extends State<HomeScreen> {
  DateTime firstDay = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.pink[100],
      body: SafeArea(
        top: true,
        bottom: false,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _DDay(
              onHeartPressed: onHeartPressed,
              firstDay: firstDay,
            ),
            _CoupleImage(),
          ],
        ),
      ),
    );
  }

  void onHeartPressed() {
    // 하트 눌렀을 때 실행할 함수
    print('클릭');
  }
}

class _DDay extends StatelessWidget {
  final GestureTapCallback onHeartPressed;
  final DateTime firstDay; // 사귀기 시작한 날

  _DDay({
    required this.onHeartPressed, // 상위에서 함수 입력받기
    required this.firstDay, // 날짜 변수로 입력받기
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final now = DateTime.now(); // 현재 날짜시간

    return Column(
      children: [
        const SizedBox(height: 16.0),
        Text(
          'U&I',
          style: textTheme.headline1,
        ),
        const SizedBox(height: 16.0),
        Text(
          '우리 처음 만난 날',
          style: textTheme.bodyText1,
        ),
        Text(
          '${firstDay.year}.${firstDay.month}.${firstDay.day}', // DateTime을 년.월.일 형태로 변경
          style: textTheme.bodyText2,
        ),
        const SizedBox(height: 16.0),
        IconButton(
          iconSize: 60.0,
          onPressed: onHeartPressed, // 아이콘 눌렀을 때 실행할 함수
          icon: Icon(
            Icons.favorite,
            color: Colors.red,
          ),
        ),
        const SizedBox(height: 16.0),
        Text(
          'D+${DateTime(now.year, now.month, now.day).difference(firstDay).inDays + 1}', // DDay 계산하기
          style: textTheme.headline2,
        ),
      ],
    );
  }
}

// 생략
```

![상태 관리](/images/Flutter-스터디-10-11/5.png)

오늘 날짜가 처음 만난 날로 정의되고 계산된 D-Day가 렌더링된다. 하트를 누르면 콘솔에 '클릭'이라는 글자가 출력된다.

![상태 관리](/images/Flutter-스터디-10-11/6.png)

이번에는 `setState()` 함수를 사용해보자. 테스트를 위해 하트 아이콘을 누르면 firstDay가 하루씩 늘어나는 기능을 추가한다.

```dart
void onHeartPressed() {
  // 상태 변경시 setState() 함수 실행
  setState(() {
    // firstDay 변수에서 하루 빼기
    firstDay = firstDay.subtract(Duration(days: 1));
  });
}
```

![상태 관리 테스트](/images/Flutter-스터디-10-11/7.jpg)

하트를 클릭할 때마다 날짜가 하루씩 앞당겨지며 D-Day가 늘어나는 모습이다.

#### CupertinoDatePicker로 날짜 선택 구현하기

```dart
void onHeartPressed() {
  // 쿠퍼티노 다이얼로그 실행
  showCupertinoDialog(
    context: context,
    builder: (BuildContext context) {
      // 날짜 선택하는 다이얼로그
      return Align(
        alignment: Alignment.bottomCenter, // 아래 중간으로 정렬
        child: Container(
          color: Colors.white, // 흰색 배경
          height: 300, // 높이
          child: CupertinoDatePicker(
            mode: CupertinoDatePickerMode.date, // 날짜만 선택하기
            // 날짜가 변경되면 실행되는 함수
            onDateTimeChanged: (DateTime date) {
              setState(() {
                firstDay = date;
              });
            },
          ),
        ),
      );
    },
    barrierDismissible: true, // 외부 탭할 경우 다이얼로그 닫기
  );
}
```

### 테스트하기

![테스트](/images/Flutter-스터디-10-11/8.gif)

## 11장. 디지털 주사위

### 사전 지식

#### 가속도계

특정 물체가 특정 방향으로 이동하는 가속도가 어느 정도인지를 숫자로 측정하는 기기이다. 핸드폰을 기준으로 x축은 좌우, y축은 위아래, z축은 앞뒤 움직임을 나타낸다.

#### 자이로스코프

직선 움직임만 측정할 수 있는 가속도계와는 달리 x, y, z축의 **회전**을 측정할 수 있다. x축은 좌우, y측은 위아래, z축은 앞뒤 회전을 나타낸다.

#### Sensor_Plus 패키지

`sensors_plus` 패키지를 `pubspec.yaml`에 등록하여 가속도계와 자이로스코프를 사용해볼 수 있다.

```dart
import 'package:sensors_plus/sensors_plus.dart';
// 생략

// 중력을 반영한 가속도계 값
accelerometerEvents.listen((AccelerometerEvent event) {
  print(event.x); // x축 수치
  print(event.y); // y축 수치
  print(event.z); // z축 수치
});

// 중력을 반영하지 않은 순수 사용자의 힘에 의한 가속도계 값
userAccelerometerEvents.listen((UserAccelerometerEvent event) {
  print(event.x); // x축 수치
  print(event.y); // y축 수치
  print(event.z); // z축 수치
});

gyroscopeEvents.listen((GyroscopeEvent event) {
  print(event.x); // x축 수치
  print(event.y); // y축 수치
  print(event.z); // z축 수치
});
```

### 사전 준비

1. 새 프로젝트 생성

2. 상수 추가하기

   ```dart
   // lib/const/colors.dart
   import 'package:flutter/material.dart';

   const backgroundColor = Color(0xFF0E0E0E); // 배경색
   const primaryColor = Colors.white; // 주색상
   final secondaryColor = Colors.grey[600]; // 보조 색상
   ```

   600이라는 키값을 입력하면 런타임에 색상이 계산되기 때문에 const 사용 불가능하다.

3. 이미지 추가하기

   ![이미지 추가](/images/Flutter-스터디-10-11/10.png)

4. `pubspec.yaml` 설정

   ```yaml
   dependencies:
     flutter:
       sdk: flutter

     cupertino_icons: ^1.0.2
     shake: 2.2.0 # 흔들림을 감지하는 플러그인

   flutter:
     uses-material-design: true

     assets:
       - asset/img/
   ```

   [pub get]을 실행하여 변경사항을 반영한다.

5. 프로젝트 초기화

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

   import 'package:random_dice/screen/home_screen.dart';
   import 'package:flutter/material.dart';
   import 'package:random_dice/const/colors.dart';

   void main() {
     runApp(
       MaterialApp(
         theme: ThemeData(
           scaffoldBackgroundColor: backgroundColor,
           sliderTheme: SliderThemeData(
             // Slider 위젯 관련 테마
             thumbColor: primaryColor, // 노브 색상
             activeTrackColor: primaryColor, // 노브가 이동한 트랙 색상
             // 노브가 아직 이동하지 않은 트랙 색상
             inactiveTrackColor: primaryColor.withOpacity(0.3),
           ),
           // BottomNavigationBar 위젯 관련 테마
           bottomNavigationBarTheme: BottomNavigationBarThemeData(
             selectedItemColor: primaryColor, // 선택 상태 색
             unselectedItemColor: secondaryColor, // 비선택 상태 색
             backgroundColor: backgroundColor, // 배경색
           ),
         ),
         home: HomeScreen(),
       ),
     );
   }
   ```

   위 앱을 실행하면 이런 화면이 뜬다. (배경색이 어두워서 Home Screen이라는 글자가 잘 안보이는 상태)

   ![프로젝트 초기화](/images/Flutter-스터디-10-11/11.png)

### 레이아웃 구상하기

첫 번째 화면인 HomeScreen 위젯과 두 번째 화면인 SettingsScreen을 TabBarView를 이용해서 RootScreen 위젯에 위치시킨다.

#### 기본 스크린 위젯

![기본 스크린 위젯](/images/Flutter-스터디-10-11/16.png)

이번 프로젝트에서 사용할 모든 위젯을 담고 있는 최상위 위젯이다. BottomNavigationBar에서 각 탭을 누르거나 TabBarView에서 좌우로 스크롤하여 화면을 전환한다.

#### 홈 스크린 위젯

![홈 스크린 위젯](/images/Flutter-스터디-10-11/17.png)

#### 설정 스크린 위젯

![설정 스크린 위젯](/images/Flutter-스터디-10-11/18.png)

### 구현하기

#### RootScreen 위젯 구현하기

```dart
// lib/screen/root_screen.dart

import 'package:flutter/material.dart';

class RootScreen extends StatefulWidget {
  const RootScreen({Key? key}) : super(key: key);

  @override
  State<RootScreen> createState() => _RootScreenState();
}

// TickerProviderStateMixin 사용하기
class _RootScreenState extends State<RootScreen> with TickerProviderStateMixin {
  TabController? controller; // 사용할 TabController 선언

  @override
  void initState() {
    super.initState();

    // 위젯이 생성될 때 단 한 번만 초기화되어야하니 initState()에서 초기화
    controller = TabController(length: 2, vsync: this);
    // 위젯이 생성될 때 단 한 번만 리스너가 등록되면 되니 initState()에서 실행
    controller!.addListener(tabListener);
  }

  // 리스너로 사용할 함수
  tabListener() {
    setState(() {}); // controller의 속성이 변경될 때마다 build()를 재실행하도록 한다.
  }

  @override
  dispose() {
    // 리스너에 등록한 함수 등록 취소
    // addListener를 사용해서 listener를 등록하면 위젯이 삭제될 때 항상 등록된 listener도 같이 삭제해줘야 한다.
    controller!.removeListener(tabListener);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // 탭 화면을 보여줄 위젯
      body: TabBarView(
        controller: controller, // 컨트롤러 등록하기, TabBarView는 TabController가 필수이다
        children: renderChildren(),
      ),

      // 아래 탭 내비게이션을 구현하는 매개변수
      bottomNavigationBar: renderBottomNavigation(),
    );
  }

  List<Widget> renderChildren() {
    return [
      Container(
        child: Center(
          child: Text(
            'Tab 1',
            style: TextStyle(
              color: Colors.white,
            ),
          ),
        ),
      ),
      Container(
        child: Center(
          child: Text(
            'Tab 2',
            style: TextStyle(
              color: Colors.white,
            ),
          ),
        ),
      ),
    ];
  }

  BottomNavigationBar renderBottomNavigation() {
    // 탭 내비게이션을 구현하는 위젯
    return BottomNavigationBar(
      currentIndex: controller!.index, // 현재 화면에 렌더링되는 탭의 인덱스
      onTap: (int index) {
        setState(() {
          controller!.animateTo(index);
        });
      },
      items: [
        BottomNavigationBarItem(
          icon: Icon(
            Icons.edgesensor_high_outlined,
          ),
          label: '주사위',
        ),
        BottomNavigationBarItem(
          icon: Icon(
            Icons.settings,
          ),
          label: '설정',
        )
      ],
    );
  }
}
```

```dart
// lib/main.dart

import 'package:flutter/material.dart';
import 'package:random_dice/const/colors.dart';
import 'package:random_dice/screen/root_screen.dart'; // home_screen에서 root_screen으로 변경

void main() {
  runApp(
    MaterialApp(
      theme: ThemeData(
        scaffoldBackgroundColor: backgroundColor,
        sliderTheme: SliderThemeData(
          thumbColor: primaryColor,
          activeTrackColor: primaryColor,
          inactiveTrackColor: primaryColor.withOpacity(0.3),
        ),
        bottomNavigationBarTheme: BottomNavigationBarThemeData(
          selectedItemColor: primaryColor,
          unselectedItemColor: secondaryColor,
          backgroundColor: backgroundColor,
        ),
      ),
      home: RootScreen(), // HomeScreen()에서 RootScreen()으로 변경
    ),
  );
}
```

![RootScreen 위젯 구현하기](/images/Flutter-스터디-10-11/12.gif)

#### HomeScreen 위젯 구현하기

```dart
// lib/screen/home_screen.dart

import 'package:random_dice/const/colors.dart';
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  final int number;

  const HomeScreen({
    required this.number,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // 주사위 이미지,
        Center(
          child: Image.asset('asset/img/$number.png'),
        ),
        SizedBox(height: 32.0),
        Text(
          '행운의 숫자',
          style: TextStyle(
            color: secondaryColor,
            fontSize: 20.0,
            fontWeight: FontWeight.w700,
          ),
        ),
        SizedBox(height: 12.0),
        Text(
          number.toString(), // 주사위 값에 해당되는 숫자
          style: TextStyle(
            color: primaryColor,
            fontSize: 60.0,
            fontWeight: FontWeight.w200,
          ),
        ),
      ],
    );
  }
}
```

```dart
// lib/screen/root_screen.dart

import 'package:random_dice/screen/home_screen.dart'; // 추가

// 생략

  List<Widget> renderChildren() {
    return [
      HomeScreen(number: 1), // HomeScreen을 불러와서 입력하기
      Container(
        child: Center(
          child: Text(
            'Tab 2',
            style: TextStyle(
              color: Colors.white,
            ),
          ),
        ),
      ),
    ];
  }
```

![HomeScreen 위젯 구현하기](/images/Flutter-스터디-10-11/14.png)

#### SettingsScreen 위젯 구현하기

```dart
// lib/screen/settings_screen.dart

import 'package:random_dice/const/colors.dart';
import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  final double threshold; // Slider의 현잿값

// Slider가 변경될 때마다 실행되는 함수
  final ValueChanged<double> onThresholdChange;

  const SettingsScreen({
    Key? key,

    // threshold와 onThresholdChange는 SettingsScreen에서 입력
    required this.threshold,
    required this.onThresholdChange,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 20.0),
          child: Row(
            children: [
              Text(
                '민감도',
                style: TextStyle(
                  color: secondaryColor,
                  fontSize: 20.0,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
        Slider(
          min: 0.1, // 최솟값
          max: 10.0, // 최댓값
          divisions: 101, // 최솟값과 최댓값 사이 구간 개수
          value: threshold, // 슬라이더 선택값
          onChanged: onThresholdChange, // 값 변경 시 실행되는 함수
          label: threshold.toStringAsFixed(1), // 표싯값
        ),
      ],
    );
  }
}
```

```dart
// lib/screen/root_screen.dart

import 'package:random_dice/screen/settings_screen.dart'; // 추가

// 생략

  List<Widget> renderChildren() {
    return [
      HomeScreen(number: 1),
      SettingsScreen(
        threshold: threshold,
        onThresholdChange: onThresholdChange,
      )
    ];
  }

  void onThresholdChange(double val) {
    setState(() {
      threshold = val;
    });
  }
```

![SettingsScreen 위젯 구현하기](/images/Flutter-스터디-10-11/13.gif)

#### shake 플러그인 적용하기

```dart
// lib/screen/root_screen.dart

// 추가
import 'dart:math';
import 'package:shake/shake.dart';

class _RootScreenState extends State<RootScreen> with TickerProviderStateMixin {
  TabController? controller;
  double threshold = 2.7;
  int number = 1; // 주사위 숫자
  ShakeDetector? shakeDetector;

  @override
  void initState() {
    super.initState();

    controller = TabController(length: 2, vsync: this);
    controller!.addListener(tabListener);

    shakeDetector = ShakeDetector.autoStart(
      // 흔들기 감지 즉시 시작
      shakeSlopTimeMS: 100, // 감지 주기
      shakeThresholdGravity: threshold, // 감지 민감도
      onPhoneShake: onPhoneShake, // 감지 후 실행할 함수
    );
  }

  // 감지 후 실행할 함수
  void onPhoneShake() {
    final rand = new Random();

    setState(() {
      number = rand.nextInt(5) + 1;
    });
  }

  tabListener() {
    setState(() {});
  }

  @override
  dispose() {
    controller!.removeListener(tabListener);
    shakeDetector!.stopListening(); // 흔들기 감지 중지
    super.dispose();
  }

  // 생략
}
```

![shake 플러그인 적용하기](/images/Flutter-스터디-10-11/15.png)
