// dropdown.js 파일에서 script.js와의 충돌을 방지하기 위해 코드를 완전히 비활성화합니다.
// script.js에 모든 드롭다운 기능을 통합하여 처리합니다.
console.log("dropdown.js 로드됨 - 드롭다운 기능은 script.js에서 처리됩니다.");
// (이 파일에서는 아무런 동작도 하지 않음)

let isDropdownPause = false;

function setTopButtonsDisabled(disabled) {
  document.getElementById('startBtn').disabled = disabled;
  document.getElementById('pauseBtn').disabled = disabled;
  document.getElementById('stopBtn').disabled = disabled;
}

function toggleDropdown(event) {
  // 시작화면(!isGameRunning && !isGamePaused) 또는 게임 resume 상태(isGameRunning && isGamePaused)에서만 동작
  const isStartScreen = !isGameRunning && !isGamePaused;
  const isResumeState = isGameRunning && isGamePaused;
  
  if (!isStartScreen && !isResumeState) {
    console.log("드롭다운 허용되지 않는 상태: 게임 실행 중");
    return; // 게임 실행 중이면 드롭다운 불가
  }
  
  if (sentenceList.style.display === 'block') {
    sentenceList.style.display = 'none';
    
    // 영어 읽기 중단
    if (typeof stopDropdownMp3Playback === 'function') {
      stopDropdownMp3Playback();
    }
    
    // 드롭다운 버튼 원상 복구
    const dropdownBtn = document.getElementById('dropdownBtn');
    if (dropdownBtn) {
      dropdownBtn.innerHTML = '&#9662;';
      dropdownBtn.style.fontSize = '47px';
      dropdownBtn.style.lineHeight = '';
      dropdownBtn.style.minWidth = '';
      dropdownBtn.style.minHeight = '';
      dropdownBtn.style.padding = '';
    }
    
    // 상단 버튼 활성화
    setTopButtonsDisabled(false);
    
    // resume 상태 플래그 초기화
    isDropdownPause = false;
  } else {
    populateSentenceList();
    sentenceList.style.display = 'block';
    
    // 상단 버튼 항상 비활성화
    setTopButtonsDisabled(true);
    
    // 현재 문장으로 스크롤
    setTimeout(() => {
      const activeItem = sentenceList.querySelector(`.sentence-item:nth-child(${sentenceIndex + 1})`);
      if (activeItem) activeItem.scrollIntoView({ behavior: 'auto', block: 'center' });
    }, 100);
    
    // resume 상태에서 드롭다운을 열었을 경우 flag 설정
    if (isGameRunning && isGamePaused) {
      isDropdownPause = true;
    }
    
    // 드롭다운 버튼 모양 변경
    const dropdownBtn = document.getElementById('dropdownBtn');
    if (dropdownBtn) {
      dropdownBtn.style.position = 'relative';
      dropdownBtn.innerHTML = `
        <svg width="34" height="34" viewBox="0 0 34 34"
          style="display:block; position:relative; left:19px; top:19px;">
          <rect x="6" y="13" width="22" height="12" fill="white" />
        </svg>
      `;
      dropdownBtn.style.fontSize = '6px';
      dropdownBtn.style.lineHeight = '1';
      dropdownBtn.style.minWidth = '0';
      dropdownBtn.style.minHeight = '0';
      dropdownBtn.style.padding = '0';
    }
    
    // 영어 문장 읽기 시작
    if (typeof playAllSentenceMp3sFromStart === 'function') {
      setTimeout(() => {
        if (typeof dropdownMp3Index !== 'undefined' && typeof dropdownSentenceIndex !== 'undefined') {
          dropdownMp3Index = (dropdownSentenceIndex + 1) % 96;
          playAllSentenceMp3sFromStart();
        }
      }, 200);
    }
  }
}
