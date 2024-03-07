---
title: 플러터 스터디 (4)
description: 10장. 만난 지 며칠 U&I, 11장. 디지털 주사위
date: 2024-03-06
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
