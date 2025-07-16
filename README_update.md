# 영어 문장 교체 안내서

## 문제 상황
- 기존 96개 영어 문장을 새로운 96개 문장으로 교체해야 합니다.
- 새 오디오 파일은 이미 `sounds/96_audio/` 폴더에 준비되어 있습니다.

## 해결 방법
두 개의 파일을 준비했습니다:

1. `sentences_update.js`: 새로운 96개 영어 문장 배열입니다.
2. `translations_update.js`: 새로운 96개 한국어 번역 배열입니다.

## 교체 방법

### 1. 영어 문장 교체하기
1. `script.js` 파일을 엽니다.
2. 파일에서 `// --- START: 새로운 96개 영어 문장 ---` 부분을 찾습니다.
3. 아래와 같이 시작하는 `const sentences = [` 배열을 찾아서:
   ```javascript
   const sentences = [
     "What will we build with these big boxes?", // 1.txt
     "We will make a spaceship for our trip.", // 2.txt
     ... (중략) ...
   ```
4. `sentences_update.js` 파일에서 새로운 문장 배열 전체를 복사합니다.
5. `script.js`의 기존 배열을 지우고 새로운 배열로 교체합니다.

### 2. 한국어 번역 교체하기
1. `script.js` 파일에서 `// --- START: 새로운 96개 한국어 번역 ---` 부분을 찾습니다.
2. 아래와 같이 시작하는 `const translations = [` 배열을 찾습니다:
   ```javascript
   const translations = [
     "이 큰 상자들로 무엇을 만들 건가요?", // 1.txt 번역 예시
     "우리는 여행을 위한 우주선을 만들 거예요.", // 2.txt 번역 예시
     ... (중략) ...
   ```
3. `translations_update.js` 파일에서 새로운 번역 배열 전체를 복사합니다.
4. `script.js`의 기존 번역 배열을 지우고 새로운 배열로 교체합니다.

### 3. 변경사항 저장하기
1. `script.js` 파일을 저장합니다.
2. 웹 페이지를 새로고침하여 변경사항이 적용되었는지 확인합니다.

## 참고사항
- 배열의 구조와 형식을 그대로 유지해야 합니다.
- 각 문장 뒤의 주석 (예: `// 1.txt`)도 유지하는 것이 좋습니다.
- 기존 기능은 모두 그대로 유지됩니다 (색상, 애니메이션, 오디오 등).
