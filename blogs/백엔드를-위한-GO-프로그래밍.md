---
title: 백엔드를 위한 GO 프로그래밍
description: 천재 프로그래머 텐메이가 알려주는 Go 테크닉을 읽고 작성한 리뷰입니다.
date: 2024-10-04
category: book-review
published: true
---

![book-cover](/images/백엔드를-위한-GO-프로그래밍/book-cover.png)

고루틴이 무엇인지 궁금해서 Go언어를 한번 공부해보고 싶었는데 서점에 들렀다 귀여운 표지, 얇은 두께, 그리고 "천재 프로그래머" 라는 키워드가 끌려서 구매했다.

5살부터 관련 기술을 가지고 놀았던 텐메이 박시(Tanmay Bakshi)와 13살에 Java의 병렬처리 같은 고급 기능을 스스로 공부하기에 이르렀던 바히어 카말(Baheer Kamal)이 함께 쓴 책이라고 한다. 과연 천재 프로그래머가 알려주는 Go 언어는 어떨지 기대가 되었다.

우선, 책의 구성은 다음과 같다.

- 제1장 소개

  왜 Go를 사용해야 하는지, Go의 설계 목표는 무엇인지 등을 설명한다.

- 제2장 빠르게 시작하기

  Go를 설치하는 방법, 빌드 방법, 기본 개념을 소개한다.

- 제3장 Go 모듈

  Go 모듈의 개념과 사용 방법을 설명한다.

- 제4장 빌트인 패키지 사용하기

  표준 라이브러리를 사용하는 방법을 설명한다.

- 제5장 동시성

  고루틴과 채널을 사용하여 동시성 프로그래밍을 하는 방법을 설명한다.

- 제6장 상호 호환성

  Go 언어에서 다른 언어로 프로그램을 작성하는 방법을 설명한다.

이 책은 Go 언어에 대한 흥미를 불러일으키는데 적합한 수준이다. 그만큼 얇고 재미있게 작성되었다. 하루에 1~2시간 정도 시간을 써서 1주일 정도 읽으면 충분히 읽을 수 있는 양이다. 현업에서 쓸만한 예제보다는 다익스트라 길찾기 알고리즘, 콘웨이의 라이프 게임 등을 예제로 제시하여 재밌게 몇가지 기능을 이해할 수 있었다.

인상적이었던 부분은 다음과 같다.

- swift나 java 같은 언어에서는 "public", "private"와 같은 접근 제어를 위한 키워드를 함수나 변수에 추가하여, 컴파일러가 어떤 것이 어디까지 접근할 수 있는지 설정할 수 있도록 한다. 그러나 Go에서는 접근 제어를 위한 별도의 정보를 추가하지 않고 첫 글자의 대소문자로 public과 private 여부를 결정한다. 대문자는 public, 소문자는 private을 의미한다.

- 로컬 변수는 := 를 사용해서 선언한다. 이것은 악명이 높은데 가독성 저하, 명확성 부족 등의 문제가 있기 때문이다.

- 배열을 만드는 형태가 굉장히 생소하다. 문자열 배열 생성은 `[]string` 이렇게, 초기화는 `names := []string{"Tanmay Bakshi", "Baheer Kamal"}` 이렇게 중괄호를 사용한다.

- 시간이 오래 걸릴 수 있는 재할당 작업을 방지하기 위하여 배열은 `make` 함수를 사용해서 만드는 것이 좋다. 예를 들어 `make([]string, 10)` 이렇게 만들면 10개의 문자열을 담을 수 있는 배열을 만들 수 있다. 메모리 버퍼를 미리 확보해두기 때문에 재할당 작업을 방지할 수 있다.

- 보통 다른 언어에서는 배열의 원소에 접근하려면 index 변수를 만들거나, enumerated 같은 메서드 호출이 필요하다. Go는 이미 존재하고 있는 offset 카운터에 프로그래머가 접근하는 방식을 채택했다.

  ```go
  func main() {
    names := []string{"Tanmay Bakshi", "Baheer Kamal"}
    for i, name := range names {
      fmt.Println(i, name)
    }
  }
  ```

- 함수의 시그니처가 특이하다. 먼저 인자의 이름이 배치되고, 그 다음 공백이 들어가며, 마지막으로 타입이 위치한다.

  ```go
  func valueOfPi(multiplier uint) float32 {
    return 3.14159 * float32(multiplier)
  }
  ```

- defer라는 기능이 있다. 리소스 정리, 에러 처리에 유용하다. 아래 코드는 먼저 "Hello"를 출력하고, 그 다음 "Bye"를 출력한다.

  ```go
  func main() {
    defer fmt.Println("Bye")
    fmt.Println("Hello")
  }
  ```

좋았던 점

- 서문에서 소개했듯 저자들이 '거대한 바이너리 파일들을 자세히 살펴보고 개선하려는 공동의 목표'를 가지고 있었다는 것이 책에 잘 드러났다. 고민의 결과물이 책으로 남았다는 것이 멋지기도 했다. 새로운 개념들을 소개할 때 흥미롭게 사례를 소개하며 독자의 이목을 끌어주는 것이 좋았다.

- 프로세스, 스레드를 고민하는 것이 중요하다는 것을 알려주어서 좋았다. 상세한 설명 덕분에 간만에 접한 개념임에도 불구하고 이해하기가 쉬웠다. Go를 통해 CPU의 여러 코어를 잘 활용하는 고급 개발자가 되고싶다는 생각이 들었다.

아쉬웠던 점

- 각 장이 끝날때마다 연습 문제가 있는데 답을 안알려준다. 재미있는 문제가 많지만 내가 옳은 방향으로 접근하고 있는 것인지 알 수가 없다. 책에 나오지 않는 내용에 대한 문제도 있어서 난감하다. 열린 결말이라니...
