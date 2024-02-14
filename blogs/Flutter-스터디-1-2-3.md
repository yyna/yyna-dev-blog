---
title: 플러터 스터디 (1)
description: 1장 다트 입문하기, 2장 다트 객체지향 프로그래밍, 3장 다트 비동기 프로그래밍
date: 2024-02-14
category: tech
published: true
disqusIdentifier: flutter-study-1
---

> 이 글은 골든래빗 《코드팩토리의 플러터 프로그래밍》의 스터디 내용 입니다.

## 1장. 다트 입문하기

다트는 프로그램 시작점인 엔트리 함수 기호로 main()을 사용한다. void는 반환값이 없다는 의미이다.

```dart
void main() {
  // 한 줄 주석은 이렇게

  /*
   * 여러 줄 주석은 이렇게
   */

  /// 문서 주석은 이렇게 슬래시 3개로 작성한다.

  // print 함수는 이렇게 생겼다
  print('Hello World'); // 세미콜론을 꼭 찍어줘야 한다.
}
```

👩🏻‍💻 `print()` 함수는 newline을 끝에 포함한다. newline이 없으려면 `stdout.write()`를 써야한다. 이 함수를 쓰려면 `dart.io`를 `import` 해야한다.

### 변수 선언

#### var

- `var 변수명 = 값;` 형식으로 선언한다.
- 변수에 값이 들어가면 자동으로 타입을 추론하기 때문에 타입을 선언하지 않아도 된다.
- **타입을 지킨다면 값을 수정할 수 있다.**
- 변수명 중복은 불가능하다.

#### dynamic

- dynamic 키워드를 사용하면 변수의 타입이 고정되지 않아 다른 타입을 저장할 수 있다.

#### final/const

- 변수의 값을 처음 선언 후 변경할 수 없다.
- final은 런타임, const는 빌드 타임 상수이다. 코드를 실행하지 않은 상태에서 값이 확정되면 const를, 실행될 때 확정되면 final을 사용하자.

#### 타입

- 모든 변수는 고유의 변수 타입을 갖고 있다.

  ```dart
  void main() {
    // String - 문자열
    String name = '코드팩토리';

    // int - 정수
    int isInt = 10;

    // double - 실수
    double isDouble = 2.5;

    // bool - 불리언 (true/false)
    bool isTrue = true;
  }
  ```

### 컬렉션

#### List

- 여러 값을 **순서대로** 나열한 변수에 저장한다.
- `리스트명[인덱스]` 형식으로 특정 원소에 접근한다.

```dart
void main() {
  // 리스트에 넣을 타입을 <> 사이에 명시할 수 있다.
  List<String> blackPinkList = ['리사', '지수', '제니', '로제'];

  // length로 길이를 확인할 수 있다.
  print(blackPinkList.length);

  // add() 함수는 리스트의 끝에 원소를 추가할 수 있다.
  blackPinkList.add('코드팩토리');

  // where() 함수는 List에 있는 값들을 순서대로 순회하면서 특정 조건에 맞는 값만 필터링한다.
  // 순회가 끝나면 유지된 값들을 기반으로 이터러블이 반환된다.
  final newList = blackPinkList.where(
    (name) => name == '리사' || name == '지수',
  );

  // toList() 함수는 Iterable을 List로 변환한다.
  print(newList.toList()); // [리사, 지수]

  // map() 함수는 List의 원소를 순서대로 순회하면서 값을 변경할 수 있다.
  final newBlackPink = blackPinkList.map(
    (name) => '블랙핑크 $name',
  );
  print(newBlackPink.toList()); // [블랙핑크 리사, 블랙핑크 지수, 블랙핑크 제니, 블랙핑크 로제]

  // reduce() 함수는 List의 원소를 순회하며 매개변수에 입력된 함수를 실행한다.
  // 순회할 때마다 값을 쌓아가는 특징이 있다.
  // List 멤버의 타입과 같은 타입을 반환한다.
  // 초기값을 넣을 수 없다.
  final allMembers = blackPinkList.reduce((value, element) => value + ', ' + element);
  print(allMembers); // 리사, 지수, 제니, 로제

  // fold() 함수는 reduce() 함수와 똑같이 실행되지만 반환되는 타입에 제한이 없다.
  final allMembers2 = blackPinkList.fold<int>(0, (value, element) => value + element.length);
  print(allMembers2); // 8
}
```

- 👩🏻‍💻 [[stackoverflow] Dart Fold vs Reduce](https://stackoverflow.com/questions/20491777/dart-fold-vs-reduce)
  - reduce()는 반환 타입이 List 멤버와 같아야하지만 fold() 함수는 반환 타입에 제한이 없다.
  - 빈 List에 대해 reduce는 `Bad state: No element` 에러가 나지만 fold는 초기값을 반환한다.
  - `list.reduce(f)`는 `list.skip(1).fold(list.first, f)`의 shortcut으로 볼 수 있다.

#### Map

- 키와 값을 저장한다.
- 키를 이용해서 원하는 값을 빠르게 찾는 데 중점을 둔다.
- `Map<키 타입, 값 타입> 맵이름` 형식으로 생성

```dart
void main() {
  Map<String, String> dictionary = {
    'Harry Potter': '해리 포터', // 키 : 값
    'Ron Weasley': '론 위즐리',
    'Hermione Granger': '헤르미온느 그레인저',
  };
  print(dictionary['Harry Potter']); // 해리 포터
  print(dictionary['Hermione Granger']); // 헤르미온느 그레인저

  // 키와 값 반환받기
  print(dictionary.keys); // (Harry Potter, Ron Weasley, Hermione Granger)
  print(dictionary.values); // (해리 포터, 론 위즐리, 헤르미온느 그레인저)
}
```

#### Set

- 중복 없는 값들의 집합
- `Set<타입> 세트이름` 형식으로 생성

```dart
void main() {
  Set<String> blackPink = {'로제', '지수', '리사', '제니', '제니'}; // 제니 중복

  print(blackPink); // {로제, 지수, 리사, 제니}

  // contains() 함수로 값이 있는지 확인할 수 있다.
  print(blackPink.contains('로제')); // true
}
```

#### enum

- 정확히 어떤 선택지가 존재하는지 정의해둘 수 있어 유용하다.
- 자동 완성이 지원되어 편리하다.

```dart
enum Status {
  approved,
  pending,
  rejected,
}

void main() {
  Status status = Status.approved;
  print(status); // Status.approved
}
```

### 연산자

#### 기본 수치 연산자

```dart
void main() {
  double number = 2;

  print(number + 2); // 4.0
  print(number - 2); // 0.0
  print(number * 2); // 4.0
  print(number / 2); // 1.0
  print(number % 3); // 2.0

  // 단항 연산도 가능
  number++;
  number--;
  number += 2;
  number -= 2;
  number *= 2;
  number /= 2;
}
```

#### null 관련 연산자

- 변수 타입이 null값을 가지는지 여부를 직접 지정해줘야 한다.
- type 뒤에 `?`를 추가해줘야 null 값이 저장될 수 있다.

```dart
void main() {
  // 타입 뒤에 ?를 명시해서 null값을 가질 수 있다.
  double? number1 = null;

  // 타입 뒤에 ?를 명시하지 않아 에러가 난다.
  // The value 'null' can't be assigned to a variable of type 'double'
  double number2 = null;

  // ??를 사용하면 기존 값이 null일 때만 새 값이 할당된다.
  number1 ??= 3;
  print(number1); // 3.0

  // null이 아니므로 3이 유지된다.
  number1 ??= 4;
  print(number1); // 3.0
}
```

#### 값 비교 연산자

```dart
void main() {
  int number1 = 1;
  int number2 = 2;

  print(number1 > number2); // false
  print(number1 < number2); // true
  print(number1 >= number2); // false
  print(number1 <= number2); // true
  print(number1 == number2); // false
  print(number1 != number2); // true
}
```

#### 타입 비교 연산자

`is` 키워드를 사용하여 변수의 타입을 비교할 수 있다.

```dart
void main() {
  int number1 = 1;

  print(number1 is int); // true
  print(number1 is String); // false
  print(number1 is! int); // false
  print(number1 is! String); // true
}
```

#### 논리 연산자

```dart
void main() {
  bool result = 12 > 10 && 1 > 0;
  print(result); // true

  bool result2 = 12 > 10 && 0 > 1;
  print(result2); // false

  bool result3 = 12 > 10 || 1 > 0;
  print(result3); // true

  bool result4 = 12 > 10 || 0 > 1;
  print(result4); // true

  bool result5 = 12 < 10 || 0 > 1;
  print(result5); // false
}
```

### 제어문

#### if문

```dart
void main() {
  int number = 2;

  if (number % 3 == 0) {
    print('3의 배수입니다.');
  } else if (number % 3 == 1) {
    print('나머지가 1입니다.');
  } else {
    // 위 조건 모두에 맞지 않기 때문에 다음 코드 실행
    print('맞는 조건이 없습니다.');
  }
}
```

#### switch 문

enum과 함께 사용하면 유용하다.

```dart
enum Status {
  approved,
  pending,
  rejected,
}

void main() {
  Status status = Status.approved;

  switch (status) {
    case Status.approved:
      // approved 값이기 때문에 다음 코드가 실행됩니다.
      print('승인 상태입니다.');
      break;
    case Status.pending:
      print('대기 상태입니다.');
      break;
    case Status.rejected:
      print('거절 상태입니다.');
      break;
    default:
      print('알 수 없는 상태입니다.');
  }
}
```

#### for문

```dart
void main() {
  for (int i = 0; i < 3; i++) {
    print(i);
  }

  List<int> numberList = [3, 6, 9];
  for (int number in numberList) {
    print(number);
  }
}
```

#### while문과 do...while문

```dart
void main() {
  int total = 11;

  // while문은 조건을 먼저 확인한 후 true가 반환되면 반복문을 실행하지만
  while (total < 10) {
    total += 1;
  }
  print(total); // 11

  // do while은 반복문을 실행한 후 조건을 확인한다.
  total = 11;
  do {
    total += 1;
  } while(total < 10);
  print(total); // 12
}
```

### 함수와 람다

#### 함수의 일반적인 특징

- 순서가 고정된 매개변수<sup>positional parameter</sup>(포지셔널 파라미터, 위치 매개변수)

  - 입력된 순서대로 매개변수에 값이 지정된다.

    ```dart
    int addTwoNumbers(int a, int b) {
      return a + b;
    }

    void main() {
      print(addTwoNumbers(1, 2)); // 3
    }
    ```

  - `[]` 기호로 기본값을 설정할 수 있다.

    ```dart
    // 두 번째 매개변수에 기본값 2를 적용
    int addTwoNumbers(int a, [int b = 2]) {
      return a + b;
    }

    void main() {
      print(addTwoNumbers(1)); // 3
    }
    ```

- 이름이 있는 매개변수<sup>named parameter</sup>(네임드 파라미터, 명명된 매개변수)

  - 순서와 관계없이 지정하고 싶은 매개변수의 이름을 이용해 값을 입력한다.
  - 중괄호`{}`와 `required` 키워드를 사용

    ```dart
    int addTwoNumbers({
      required int a,
      required int b,
    }) {
      return a + b;
    }

    void main() {
      print(addTwoNumbers(a: 1, b: 2)); // 3
    }
    ```

  - `required` 키워드를 생략하고 등호 다음에 기본값을 입력할 수 있다.

    ```dart
    int addTwoNumbers({
      required int a,
      int b = 2,
    }) {
      return a + b;
    }

    void main() {
      print(addTwoNumbers(a: 1)); // 3
    }
    ```

- 포지셔널 파라미터와 네임드 파라미터를 섞어 사용할 때는 포지셔널 파라미터가 네임드 파라미터보다 반드시 먼저 위치해야 한다.

  ```dart
  int addThreeNumbers(
    int a, {
    required int b,
    int c = 2,
  }) {
    return a + b + c;
  }

  void main() {
    print(addThreeNumbers(1, b: 3)); // 6
  }
  ```

#### 익명 함수와 람다 함수

- 이름이 없고 일회성으로 사용된다.
- 익명 함수
  ```dart
  (매개 변수) {
    함수 바디
  }
  ```
- 람다 함수

  ```dart
  (매개변수) => 단 하나의 스테이트먼트
  ```

  - 이름을 정하고 미리 선언할 필요가 없어서 글로벌 스코프<sup>global scope</sup>로 다룰 필요가 없다.
  - 콜백 함수나 리스트의 `map()`, `reduce()`, `fold()` 함수 등에서 일회성이 높은 로직을 작성할 때 주로 사용한다.

#### typedef와 함수

```dart
typedef Operation = void Function(int x, int y);

void add(int x, int y) {
  print('결괏값: ${x + y}');
}

void subtract(int x, int y) {
  print('결괏값: ${x - y}');
}

void main() {
  // typedef는 일반적인 변수의 type처럼 사용 가능
  Operation oper = add;
  oper(1, 2); // 결괏값: 3

  // subtract() 함수도 Operation에 해당되는 시그니처이므로 oper 변수에 저장 가능
  oper = subtract;
  oper(1, 2); // 결괏값: -1
}
```

다트에서 함수는 일급 객체<sup>first-class citizen</sup>이므로 함수를 값처럼 사용할 수 있다. 따라서 다음과 같이 매개변수로 넣어 사용할 수 있다.

```dart
void calculate(int x, int y, Operation oper) {
  oper(x, y);
}

void main() {
  calculate(1, 2, add); // 결괏값: 3
}
```

### try...catch

```dart
void main() {
  try {
    final String name = '코드팩토리';
    throw Exception('이름이 잘못됐습니다!'); // 고의로 에러 발생
    print(name); // 실행되지 않음
  } catch(e) {
    print(e);
  }
}
```

---

## 2장. 다트 객체지향 프로그래밍

### 객체지향 프로그래밍의 필요성

- 변수와 메서드를 특정 클래스에 종속되기 코딩할 수 있다.
- 클래스는 일종의 설계도로서 데이터가 보유할 속성과 기능을 정의하는 자료구조이다.

### 클래스

```dart
class Idol {
  // 생성자에서 입력받을 변수는 일반적으로 final로 선언하는데 실수로 변경하는 것을 막기 위함이다.
  final String name;

  // 생성자는 클래스와 같은 이름이어야 한다.
  Idol(String name) : this.name = name;

  // 클래스에 종속되는 함수를 메서드라고 부른다.
  void sayName() {
    // 클래스 내부의 속성을 지칭하고 싶을 때는 this 키워드를 사용한다.
    print('저는 ${this.name}입니다.');
    // 스코프 안에 같은 속성 이름이 하나만 존재한다면 this를 생략할 수 있다.
    // print('저는 ${name}입니다.');
  }
}

void main() {
  Idol blackPink = Idol('블랙핑크');
  blackPink.sayName(); // 저는 블랙핑크입니다.

  Idol BTS = Idol('BTS');
  BTS.sayName(); // 저는 BTS입니다.
}
```

생성자의 매개변수를 변수에 저장하는 과정을 생략하는 방법도 있다.

```
class Idol {
  ...

  // this를 사용할 경우
  // 해당되는 변수에 자동으로 매개변수가 저장된다.
  Idol(this.name);

  ...
}
```

#### 네임드 생성자

일반적으로 클래스를 생성하는 여러 방법을 명시하고 싶을 때 사용한다.

```dart
class Idol {
  final String name;
  final int membersCount;

  // 생성자
  Idol(String name, int membersCount)
      : this.name = name,
        this.membersCount = membersCount;

  // 네임드 생성자
  // {클래스명.네임드 생성자명} 형식
  Idol.fromMap(Map<String, dynamic> map)
      : this.name = map['name'],
        this.membersCount = map['membersCount'];

  void sayName() {
    print('저는 ${this.name}입니다. ${this.name} 멤버는 ${this.membersCount}명입니다.');
  }
}

void main() {
  Idol blackPink = Idol('블랙핑크', 4);
  blackPink.sayName(); // 저는 블랙핑크입니다. 블랙핑크 멤버는 4명입니다.

  Idol bts = Idol.fromMap({
    'name': 'BTS',
    'membersCount': 7,
  });
  bts.sayName(); // 저는 BTS입니다. BTS 멤버는 7명입니다.
}
```

#### 프라이빗 변수

일반적으로 프라이빗 변수는 클래스 내부에서만 사용하는 변수를 칭하지만 다트 언어에서는 **같은 파일에서만 접근 가능한 변수**입니다.

```dart
class Idol {
  // '_'로 변수명을 시작하면 프라이빗 변수이다.
  String _name;

  Idol(this._name);
}
```

#### 게터 / 세터

- 최근에는 객체지향 프로그래밍을 할 때 변수의 값에 불변성(인스턴스화 후 변경할 수 없는)을 특성으로 사용하기 때문에 세터는 거의 사용하지 않는다.
- 프라이빗으로 선언된 변수에 게터를 사용하면 외부에서도 접근할 수 있다.
- 변수처럼 `()`없이 사용한다. ex) `blackPink.name`

### 상속

- 어떤 클래스의 기능을 다른 클래스가 사용할 수 있게 하는 기법
- `extends` 키워드를 사용한다.

```dart
class Idol {
  final String name;
  final int membersCount;

  Idol(this.name, this.membersCount);

  void sayName() {
    print('저는 ${this.name}입니다.');
  }

  void sayMembersCount() {
    print('${this.name} 멤버는 ${this.membersCount}명입니다.');
  }
}

class BoyGroup extends Idol {
  BoyGroup(
    String name,
    int membersCount,
  ) : super( // super는 상속한 부모 클래스를 지칭한다. 자식클래스 생성자에서 부모 생성자를 실행해줘야 한다.
          name,
          membersCount,
        );

  // 상속받지 않은 메서드는 변수를 새로 추가할 수 있다.
  void sayMale() {
    print('저는 남자 아이돌입니다.');
  }
}

void main() {
  BoyGroup bts = BoyGroup('BTS', 7);

  bts.sayName(); // 저는 BTS입니다.
  bts.sayMembersCount(); // BTS 멤버는 7명입니다.
  bts.sayMale(); // 저는 남자 아이돌입니다.
}
```

### 오버라이드

```dart
class GirlGroup extends Idol {
  GirlGroup(
  super.name,
  super.membersCount,);

  @override // 생략해도 메서드가 덮어써진다. 하지만 직접 명시하는 게 협업 및 유지보수에 유리하다.
  void sayName() {
    print('저는 여자 아이돌 ${this.name}입니다.');
  }
}

void main() {
  GirlGroup blackPink = GirlGroup('블랙핑크', 4);

  blackPink.sayName(); // 저는 여자 아이돌 블랙핑크입니다.
  blackPink.sayMembersCount(); // 블랙핑크 멤버는 4명입니다.
}
```

### 인터페이스

- 공통으로 필요한 기능을 정의만 해두는 역할
- 인터페이스를 지정하는 키워드가 따로 없다.
- 상속은 단 하나의 클래스만 할 수 있지만 인터페이스는 적용 개수가 제한이 없다.
- `implements` 키워드로 원하는 클래스를 인터페이스로 사용할 수 있다.

```dart
class GirlGroup implements Idol {
  final String name;
  final int membersCount;

  GirlGroup(
    this.name,
    this.membersCount,
  );

  void sayName() {
    print('저는 여자 아이돌 ${this.name}입니다.');
  }

  void sayMembersCount() {
    print('${this.name} 멤버는 ${this.membersCount}명입니다.');
  }
}

void main() {
  GirlGroup blackPink = GirlGroup('블랙핑크', 4);

  // 사용법은 클래스와 같다.
  blackPink.sayName(); // 저는 여자 아이돌 블랙핑크입니다.
  blackPink.sayMembersCount(); // 블랙핑크 멤버는 4명입니다.
}
```

### 믹스인

- 특정 클래스에 원하는 기능들만 골라 넣는 기능이다.
- 한 개의 클래스에 여러 개의 믹스인을 적용할 수 있다.
- `with` 키워드를 사용한다.

```dart
mixin IdolSingMixin on Idol {
  void sing() {
    print('${this.name}이 노래를 부릅니다.');
  }
}

class BoyGroup extends Idol with IdolSingMixin {
  BoyGroup(
    super.name,
    super.membersCount,
  );

  void sayMale() {
    print('저는 남자 아이돌입니다.');
  }
}

void main() {
  BoyGroup bts = BoyGroup('BTS', 7);
  bts.sing(); // BTS이 노래를 부릅니다.
}
```

### 추상

- 상속이나 인터페이스로 사용하는 데 필요한 속성만 정의하고 인스턴스화할 수 없도록 하는 기능
- 메서드 정의를 자식 클래스에 위임
- 추상 메서드를 선언할 수 있으며 함수의 반환 타입, 이름, 매개변수만 정의

```dart
abstract class Idol {
  final String name;
  final int membersCount;

  Idol(this.name, this.membersCount);

  // 추상 메서드 선언
  void sayName();
  void sayMembersCount();
}

class GirlGroup implements Idol {
  final String name;
  final int membersCount;

  GirlGroup(
    this.name,
    this.membersCount,
  );

  void sayName() {
    print('저는 여자 아이돌 ${this.name}입니다.');
  }

  void sayMembersCount() {
    print('${this.name} 멤버는 ${this.membersCount}명입니다.');
  }
}

void main() {
  GirlGroup blackPink = GirlGroup('블랙핑크', 4);

  blackPink.sayName(); // 저는 여자 아이돌 블랙핑크입니다.
  blackPink.sayMembersCount(); // 블랙핑크 멤버는 4명입니다.
}
```

### 제네릭

- 클래스나 함수의 정의를 인스턴스화 하거나 실행할 때로 미룬다.
- 특정 변수의 타입을 하나의 타입으로 제한하고 싶지 않을 때 자주 사용한다.

```dart
// 인스턴스화할 때 입력받을 타입을 T로 지정
class Cache<T> {
  // data의 탕비을 추후 입력될 T 타입으로 지정
  final T data;

  Cache({
    required this.data,
  });
}

void main() {
  // T의 타입을 List<int>로 입력
  final cache = Cache<List<int>>(
    data: [1, 2, 3],
  );

  // 제네릭에 입력된 값을 통해 data 변수의 타입 자동 유추
  print(cache.data.reduce((value, element) => value + element)); // 6
}
```

#### 흔히 사용되는 제네릭 문자들

| 문자 | 설명                                  | 예시        |
| ---- | ------------------------------------- | ----------- |
| T    | 변수 타입을 표현할 때                 | `T value;`  |
| E    | 리스트 내부 요소들의 타입을 표현할 때 | `List<E>`   |
| K    | 키를 표현할 때                        | `Map<K, V>` |
| V    | 값을 표현할 때                        | `Map<K, V>` |

### 스태틱

static 키워드를 사용하면 변수와 메서드 등 모든 속성은 '인스턴스'가 아닌 클래스 자체에 귀속된다.

```dart
class Counter {
  static int i = 0;

  // static 변수는 클래스에 직접 귀속되기 때문에 생성자에서 값을 지정하지 못함
  Counter() {
    i++;
    print(i);
  }
}

void main() {
  Counter count1 = Counter(); // 1
  Counter count2 = Counter(); // 2
  Counter count3 = Counter(); // 3
}
```

### 캐스케이드 연산자

- 인스턴스의 속성이나 멤버 함수를 연속해서 사용하는 기능
- `..` 기호를 사용

```dart
class Idol {
  final String name;
  final int membersCount;

  Idol(this.name, this.membersCount);

  void sayName() {
    print('저는 ${this.name}입니다.');
  }

  void sayMembersCount() {
    print('${this.name} 멤버는 ${this.membersCount}명입니다.');
  }
}

void main() {
  Idol blackPink = Idol('블랙핑크', 4)
    ..sayName() // 저는 블랙핑크입니다.
    ..sayMembersCount(); // 블랙핑크 멤버는 4명입니다.
}
```

---

## 3장. 다트 비동기 프로그래밍

### 동기 vs. 비동기 프로그래밍

비동기 프로그래밍은 요청한 결과를 기다리지 않으며 응답 순서 또한 요청한 순서와 다를 수 있다.

### Future

- 미래에 받아올 값을 뜻한다.
- 제네릭으로 어떤 미래의 값을 받아올지 정할 수 있다.

```dart
Future<String> name; // 미래에 받을 String 값
Future<int> number; // 미래에 받을 int 값
Future<bool> isOpened; // 미래에 받을 boolean 값
```

```dart
void main() {
  addNumbers(1, 1);
}

void addNumbers(int number1, int number2) {
  print('$number1 + $number2 계산 시작!');

// 특정 기간 동안 아무것도 하지 않고 기다리는 함수
// 첫번째 매개변수 - 대기할 기간, 두번째 매개변수 - 대기 후 실행할 콜백 함수
  Future.delayed(Duration(seconds: 3), () {
    print('$number1 + $number2 = ${number1 + number2}');
  });

  print('$number1 + $number2 코드 실행 끝');
}
// 1 + 1 계산 시작!
// 1 + 1 코드 실행 끝
// 1 + 1 = 2
```

### async와 await

```dart
void main() {
  addNumbers(1, 1);
}

Future<void> addNumbers(int number1, int number2) async {
  print('$number1 + $number2 계산 시작!');

  // await는 대기하고 싶은 비동기 함수 앞에 입력
  await Future.delayed(Duration(seconds: 3), () {
    print('$number1 + $number2 = ${number1 + number2}');
  });

  print('$number1 + $number2 코드 실행 끝');
}
```

```
1 + 1 계산 시작!
1 + 1 = 2
1 + 1 코드 실행 끝
```

```dart
void main() {
  addNumbers(1, 1);
  addNumbers(2, 2); // addNumbers() 함수가 비동기로 실행되었기 때문에 1 + 1이 끝나기 전에 실행
}
```

```
1 + 1 계산 시작!
2 + 2 계산 시작!
1 + 1 = 2
1 + 1 코드 실행 끝
2 + 2 = 4
2 + 2 코드 실행 끝
```

```dart
// addNumbers()가 순차적으로 실행되길 원한다면 아래와 같이 async, await 키워드를 추가
void main() async{
  await addNumbers(1, 1);
  await addNumbers(1, 2);
}
```

```
1 + 1 계산 시작!
1 + 1 = 2
1 + 1 코드 실행 끝
2 + 2 계산 시작!
2 + 2 = 4
2 + 2 코드 실행 끝
```

#### 결괏값 반환받기

```dart
void main() async{
  final result = await addNumbers(1, 1);
  print('결괏값 $result');
  final result2 = await addNumbers(2, 2);
  print('결괏값 $result2');
}

Future<int> addNumbers(int number1, int number2) async {
  print('$number1 + $number2 계산 시작!');

  await Future.delayed(Duration(seconds: 3), () {
    print('$number1 + $number2 = ${number1 + number2}');
  });

  print('$number1 + $number2 코드 실행 끝');

  return number1 + number2;
}
```

```
1 + 1 계산 시작!
1 + 1 = 2
1 + 1 코드 실행 끝
결괏값 2
2 + 2 계산 시작!
2 + 2 = 4
2 + 2 코드 실행 끝
결괏값 4
```

### Stream

- Future는 반환값을 딱 한 번 받아내는 비동기 프로그래밍에 사용
- 지속적으로 값을 반환받을 때는 Stream을 사용
- 한 번 리슨<sup>listen</sup>하면 주입되는 모든 값을 지속적으로 받아온다.

#### 스트림 기본 사용법

```dart
import 'dart:async';

void main() {
  final controller = StreamController();
  final stream = controller.stream;

  // Stream에 listen() 함수를 실행하면 값이 주입될 때마다 콜백 함수를 실행한다.
  final streamListener1 = stream.listen((val) {
    print(val);
  });

  // Stream에 값을 주입하기
  controller.sink.add(1);
  controller.sink.add(2);
  controller.sink.add(3);
  controller.sink.add(4);
}
```

```
1
2
3
4
```

#### 브로드캐스트 스트림

스트림을 여러 번 listen()하도록 변환할 수 있다.

```dart
import 'dart:async';

void main() {
  final controller = StreamController();
  // 여러 번 리슨할 수 있는 Broadcast Stream 객체 생성
  final stream = controller.stream.asBroadcastStream();

// 첫 번째 listen() 함수
  final streamListener1 = stream.listen((val) {
    print('listening 1');
    print(val);
  });

  // 두 번째 listen() 함수
  final streamListener2 = stream.listen((val) {
    print('listening 2');
    print(val);
  });

  // add()를 실행할 때마다 listen()하는 모든 콜백 함수에 값이 주입된다.
  controller.sink.add(1);
  controller.sink.add(2);
  controller.sink.add(3);
}
```

```
listening 1
1
listening 2
1
listening 1
2
listening 2
2
listening 1
3
listening 2
3
```

#### 함수로 스트림 반환하기

- `Future`를 반환하는 함수는 `async`로 함수를 선언하고 `return` 키워드로 값을 반환
- 스트림을 반환하는 함수는 `async*`로 함수를 선언하고 `yield` 키워드로 값을 반환

```dart
import 'dart:async';

Stream<String> calculate(int number) async* {
  for (int i = 0; i<5; i++) {
    yield 'i = $i';
    await Future.delayed(Duration(seconds: 1));
  }
}

void playStream() {
  calculate(1).listen((val) {
    print(val);
  });
}

void main() {
  playStream();
}
```

```
i = 0
i = 1
i = 2
i = 3
i = 4
```
