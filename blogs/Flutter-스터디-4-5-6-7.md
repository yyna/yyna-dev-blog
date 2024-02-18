---
title: 플러터 스터디 (2)
description: 4장. 다트 3.0 신규 문법, 5장. 플러터 입문하기, 6장. 기본 위젯 알아보기, 7장. 앱을 만들려면 알아야하는 그 밖의 지식
date: 2024-02-21
category: tech
published: true
disqusIdentifier: flutter-study-2
---

> 이 글은 골든래빗 《코드팩토리의 플러터 프로그래밍》의 스터디 내용 입니다.

## 4장. 다트 3.0 신규 문법

### 레코드

#### 포지셔널 파라미터를 이용한 레코드

```dart
void main() {
  (String, int) minji = ('민지', 20);
  print(minji); // (민지, 20)
  print(minji.$1); // 민지
}
```

#### 네임드 파라미터를 이용한 레코드

포지셔널 파라미터와 다르게 입력 순서를 지킬 필요가 없다.

```dart
void main() {
  ({String name, int age}) minji = (
    name: '민지',
    age: 20,
  );
  print(minji); // (age: 20, name: 민지)
}
```

👩🏻‍💻 _왜 인덱스가 1부터 시작하지 않을까?_ 찾아보다가 더 요상한 것도 알게 되었다. 네임드와 포지셔널 파라미터를 섞어쓸 수 있으며, `$<position>` 접근 방식은 네임드 파라미터를 건너뛴다는 것이다. 안타깝게도 인덱스가 왜 1부터 시작인지는 찾을 수가 없었다.

```dart
var record = ('first', a: 2, b: true, 'last');

print(record.$1); // Prints 'first'
print(record.a); // Prints 2
print(record.b); // Prints true
print(record.$2); // Prints 'last'
```

### 구조 분해

반환된 타입을 그대로 복제해서 타입 내부에 각각의 값을 직접 추출해오는 문법

#### 리스트

```dart
void main() {
  final [minji, haerin] = ['민지', '해린'];
  print(minji); // 민지
  print(haerin); // 해린
}
```

#### 리스트 + 스프레드 연산자

```dart
void main() {
  final numbers = [1, 2, 3, 4, 5, 6, 7, 8];

  // 스프레드 연산자를 사용하면 중간의 필요없는 값들을 버릴 수 있다.
  final [x, y, ..., z] = numbers;
  print(x); // 1
  print(y); // 2
  print(z); // 8
}
```

#### 맵

```dart
void main() {
  final minjiMap = {'name': '민지', 'age': 19};
  final {'name': name, 'age': age} = minjiMap;

  print('name: $name'); // name: 민지
  print('age: $age'); // age: 19
}
```

#### 클래스

```dart
void main() {
  final minji = Idol(name: '민지', age: 19);
  final Idol(name: name, age: age) = minji; // 생성자 구조와 똑같이 구조 분해

  print(name); // 민지
  print(age); // 19
}

class Idol {
  final String name;
  final int age;

  Idol({
    required this.name,
    required this.age,
  });
}
```

### switch 문

#### 표현식 기능

다트 3.0 부터는 switch문을 함수처럼 사용하여 직접 값을 반환받을 수 있는 절 기능이 추가되었다.

```dart
void main() {
  String dayKor = '월요일';

  String dayEnglish = switch (dayKor) {
      '월요일' => 'Monday',
      '화요일' => 'Tuesday',
      '수요일' => 'Wednesday',
      '목요일' => 'Thursday',
      '금요일' => 'Friday',
      '토요일' => 'Saturday',
      '일요일' => 'Sunday',
      _ => 'Not Found'
  };

  print(dayEnglish); // Monday
}
```

#### 패턴 매칭

```dart
void switcher(dynamic anything) {
  switch (anything) {
    case 'aaa':
      print('match: aaa');
      break;
    case [1, 2]:
      print('match: [1, 2]');
      break;
    case [_, _, _]:
      print('match [_,_,_]');
      break;
    case [int a, int b]:
      print('match: [int $a, int $b]');
      break;
    case (String a, int b):
      print('match: (String: $a, int: $b)');
      break;
    default:
      print('no match');
  }
}

void main() {
  switcher('aaa'); // match: aaa
  switcher([1, 2]); // match: [1, 2]
  switcher([3, 4, 5]); // match [_,_,_]
  switcher([6, 7]); // match: [int 6, int 7]
  switcher(('민지', 19)); // match: (String: 민지, int: 19)
  switcher(8); // no match
}
```

#### 엄격한 검사<sup>exhaustiveness checking</sup>

코드가 입력받을 수 있는 모든 조건을 전부 확인하고 있는지 체크하는 기술

```dart
void main() {
  bool? val; // true, false, null이 될 수 있음

  // null 조건을 입력하지 않았기 때문에 에러 발생
  // null case를 추가하거나 default case를 추가해야 에러가 사라짐
  switch (val) {
    case true:
      print('true');
    case false:
      print('false');
  }
}
```

#### 보호 구문

switch문에 when 키워드로 보호 구문<sup>guard clause</sup>을 추가할 수 있도록 업데이트 되었다.

```
void main() {
  (int a, int b) val = (1, -1);

  switch(val) {
    case (1, _) when val.$2 > 0:
      print('1, _');
      break;
    default:
      print('default'); // default
  }
}
```

### 클래스 제한자

- 모든 클래스 제한자는 `class` 키워드 앞에 명시한다.
- 👩🏻‍💻 각 제한자들을 귀여운 비유와 함께 설명해둔 블로그: [Quick reminder about dart 3 class modifiers](https://dev.to/pablonax/quick-reminder-about-dart-3-class-modifiers-361p)

#### base 제한자

- 오직 상속만 가능하다. (구현 불가능)
- base 클래스의 자식 클래스는 base, final, sealed 제한자를 사용해야 한다.

#### final 제한자

- 외부에서 class가 더이상 상속(extend), 구현(implement)될 수 없도록 한다.
- base 제한자의 기능을 모두 포함한다.

#### interface 제한자

- 클래스를 외부 파일에서 상속받지 못하고 재정의만 할 수 있도록 제한하는 역할
- extend 불가능, implement 가능

#### sealed 제한자

- 외부에서 상속(extend), 구현(implement)가 불가능하다.
- 컴파일러가 모든 하위 유형을 인식할 수 있기 때문에 엄격한(exhaustive) 검사가 가능하다.

```
sealed class Vehicle {}

class Car extends Vehicle {}

class Truck implements Vehicle {}

class Bicycle extends Vehicle {}

String getVehicleSound(Vehicle vehicle) {
  // ERROR: The switch is missing the Bicycle subtype or a default case.
  return switch (vehicle) {
    Car() => 'vroom',
    Truck() => 'VROOOOMM',
  };
}
```

#### mixin 제한자

이름 그대로 mixin 클래스이다. 이전에 class 키워드로 생성된 mixin 들은 더이상 mixin으로 쓰일 수 없다.

## 5장. 플러터 입문하기

### 플러터 소개

#### 플러터 구조 살펴보기

- 임베더 계층: 하드웨어와 가장 가까운 로우 레벨, 각 플랫폼의 네이티브 언어로 작성되어 있다.
- 엔진 계층: 대부분 C++로 작성, 플러터 코어 API와 스키아 그래픽 엔진, 파일시스템, 네트워크 기능 등이 정의되어 있다.
- **프레임워크 계층**: 위젯, 애니메이션, 머티리얼 패키지, 쿠퍼티노 패키지 등이 있다.

플러터가 스키아 엔진과 직접 통신한다 👉 어떤 플랫폼이든 스키아 엔진을 지원한다면 플러터가 컴파일되고 실행되도록 구현할 수 있다

플러터는 위젯을 스키아 엔진에 직접 그려내고 필요한 제스처 및 이벤트 브릿지를 통하지 않고 실행 👉 리액트 네이티브에 비해 상당히 빠른 퍼포먼스

### Hello Flutter 앱 만들기

안드로이드 스튜디오에서 [New Flutter Project]를 통해 프로젝트를 생성하면 다음과 같은 파일들이 생성된다.

![새 프로젝트 구조](/images/Flutter-스터디-4-5-6-7/1.png)

`lib/main.dart` 파일을 수정하여 'Hello Code Factory'를 출력해보자.

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      home: Scaffold(
        body: Text(
          'Hello Code Factory',
        ),
      ),
    ),
  );
}
```

- `MaterialApp`: 머티리얼 디자인 기반의 위젯들을 사용하게 해주는 위젯
- `Scaffold`: 화면 전체를 차지하며 레이아웃을 도와주고 UI 관련 특수 기능을 제공한다. ex) 스낵바, 앱바, 탭바

시뮬레이터에서 위 코드를 실행해보자.

- iOS
  ![Hello Code Factory (iOS)](/images/Flutter-스터디-4-5-6-7/2.png)
- 안드로이드
  ![Hello Code Factory (Android)](/images/Flutter-스터디-4-5-6-7/3.png)

#### Center 위젯으로 중앙 정렬

```
import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      home: Scaffold(
        body: Center( // 👈 Center 위젯 추가
          child: Text(
            'Hello Code Factory',
          ),
        ),
      ),
    ),
  );
}
```

![Center 위젯](/images/Flutter-스터디-4-5-6-7/4.png)

#### 👩🏻‍💻 Hot Reload가 왜 안되지?

Text를 변경 후 저장하면, 아래와 같은 로그를 볼 수 있지만 시뮬레이터 속 내용은 변하지 않는다.

```
Performing hot reload...
Syncing files to device sdk gphone64 x86 64...
Reloaded 1 of 696 libraries in 774ms (compile: 29 ms, reload: 392 ms, reassemble: 305 ms).
D/EGL_emulation( 4457): app_time_stats: avg=6604.28ms min=6604.28ms max=6604.28ms count=1
```

Flutter 문서 [How to perform a hot reload](https://docs.flutter.dev/tools/hot-reload#how-to-perform-a-hot-reload)에서 다음과 같은 내용을 확인할 수 있다.

```
A code change has a visible effect only if the modified Dart code is run again after the change. Specifically, a hot reload causes all the existing widgets to rebuild. Only code involved in the rebuilding of the widgets is automatically re-executed. The main() and initState() functions, for example, are not run again.
```

핫 리로드는 위젯의 build()를 확인하여 변경 사항을 적용한다는 것이다.

StatelessWidget를 상속해서 build() 메소드를 재정의해보았다.

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text(
            'Hello Code Factory',
          ),
        ),
      ),
    );
  }
}
```

![StatelessWidget으로 Hot Reload 해보기](/images/Flutter-스터디-4-5-6-7/5.gif)

Hot Reload 성공! 😆

## 6장. 기본 위젯 알아보기

## 7장. 앱을 만들려면 알아야하는 그 밖의 지식
