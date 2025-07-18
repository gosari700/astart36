// 하단 이미지 관련 함수
let currentBottomMediaIndex = 0; // 현재 표시 중인 미디어 인덱스 (0부터 시작)
let bottomMediaTimer = null; // 자동 전환용 타이머
let isBottomMediaPlaying = true; // 하단 미디어 재생 상태
let bottomMediaFiles = []; // 정렬된 미디어 파일 목록을 저장할 배열
let isBottomAudioEnded = false; // 하단 미디어의 오디오가 이미 종료되었는지 여부를 추적

// 전역 변수: 첫 폭발 발생 여부를 추적
let firstExplosionOccurred = false;

// 초기화: DOM이 로드되면 하단 미디어 파일 목록만 초기화하고 미디어는 표시하지 않음
document.addEventListener('DOMContentLoaded', function() {
  console.log("하단 미디어 스크립트 초기화");
  
  // 하단 미디어 파일 목록 초기화
  initBottomMediaFiles().then(() => {
    console.log("하단 미디어 파일 목록 초기화 완료:", bottomMediaFiles);
    
    // 하단 이미지/동영상 숨김 상태로 초기화
    hideBottomImage();
    
    // 정지 버튼 클릭 시 하단 미디어 정지
    document.getElementById('stopBtn').addEventListener('click', function() {
      stopBottomMediaShow();
      firstExplosionOccurred = false; // 정지 시 첫 폭발 상태 초기화
    });
    
    // 일시 정지 버튼 클릭 시 하단 미디어 일시 정지/재개
    document.getElementById('pauseBtn').addEventListener('click', function() {
      toggleBottomMediaPause();
    });
    
    // 더 이상 더블클릭 이벤트는 사용하지 않음 (폭발 이벤트로 대체)
  });
});

// 폭발 발생 시 호출되는 함수 (script.js에서 호출해야 함)
function onGameExplosion() {
  // 첫 폭발 시에만 하단 미디어 표시 시작
  if (!firstExplosionOccurred) {
    console.log("첫 폭발 감지 - 하단 미디어 표시 시작");
    firstExplosionOccurred = true;
    
    // 현재 게임 상태 확인
    const pauseBtn = document.getElementById('pauseBtn');
    const isGamePaused = pauseBtn && pauseBtn.textContent === 'RESUME';
    
    // 게임 상태에 따라 미디어 재생 여부 결정
    isBottomMediaPlaying = !isGamePaused;
    
    // 미디어 표시 시작
    startBottomMediaShow();
  }
}

// 하단 미디어 파일 목록 초기화 (번호 순으로 정렬)
async function initBottomMediaFiles() {
  console.log("하단 미디어 파일 목록 가져오기 시작");
  bottomMediaFiles = [];
  
  // 파일 번호 1부터 시작해서 연속된 번호의 이미지/비디오 파일 확인
  let fileNumber = 1;
  let continueChecking = true;
  
  while (continueChecking) {
    // 이미지 파일(.jpg) 확인
    let imageExists = await checkFileExists(`images/bottom/${fileNumber}.jpg`);
    if (imageExists) {
      bottomMediaFiles.push({
        number: fileNumber,
        type: 'image',
        path: `images/bottom/${fileNumber}.jpg`
      });
      fileNumber++;
      continue;
    }
    
    // 비디오 파일(.mp4) 확인
    let videoExists = await checkFileExists(`images/bottom/${fileNumber}.mp4`);
    if (videoExists) {
      bottomMediaFiles.push({
        number: fileNumber,
        type: 'video',
        path: `images/bottom/${fileNumber}.mp4`
      });
      fileNumber++;
      continue;
    }
    
    // 더 이상 연속된 번호의 파일이 없으면 종료
    continueChecking = false;
  }
  
  // 번호 순으로 정렬
  bottomMediaFiles.sort((a, b) => a.number - b.number);
  
  console.log(`하단 미디어 파일 ${bottomMediaFiles.length}개 발견:`, bottomMediaFiles.map(file => file.path));
  return bottomMediaFiles;
}

// 미디어 목록 새로고침 (파일 추가/제거 확인)
async function refreshMediaFiles() {
  const oldCount = bottomMediaFiles.length;
  await initBottomMediaFiles();
  
  if (bottomMediaFiles.length !== oldCount) {
    console.log(`미디어 파일 목록 변경 감지: ${oldCount} -> ${bottomMediaFiles.length}`);
  }
  
  // 현재 인덱스가 범위를 벗어나면 처음으로 돌아감
  if (currentBottomMediaIndex >= bottomMediaFiles.length) {
    currentBottomMediaIndex = 0;
  }
}

// 하단 미디어 자동 표시 시작
function startBottomMediaShow() {
  console.log("하단 미디어 표시 시작 함수 호출");
  
  // 미디어 파일 목록 갱신
  refreshMediaFiles().then(() => {
    // 재생 중이 아닐 때만 시작
    isBottomMediaPlaying = true;
    
    // 이미 실행 중인 타이머가 있다면 제거
    if (bottomMediaTimer) {
      clearInterval(bottomMediaTimer);
      bottomMediaTimer = null;
    }
    
    // 하단 미디어 컨테이너 즉시 표시 준비
    const bottomImageContainer = document.getElementById('bottomImageContainer');
    if (bottomImageContainer) {
      bottomImageContainer.style.display = 'block';
      
      // 이전 애니메이션 완료 타이머 취소
      if (window.bottomHideTimer) {
        clearTimeout(window.bottomHideTimer);
      }
    }
    
    // 미디어 파일이 있는지 확인
    if (bottomMediaFiles.length > 0) {
      // 즉시 현재 미디어 표시 시작
      showCurrentBottomMedia();
      
      // 이미지의 경우 10초마다, 비디오의 경우 비디오 종료 후 자동으로 다음으로 넘어감
      // 이미지일 경우를 위한 타이머 설정
      startImageTimer();
    } else {
      console.log("표시할 하단 미디어 파일이 없습니다.");
    }
  });
}

// 현재 보여지는 미디어가 이미지인 경우 타이머 시작
function startImageTimer() {
  // 기존 타이머 정리
  if (bottomMediaTimer) {
    clearTimeout(bottomMediaTimer);
    bottomMediaTimer = null;
  }
  
  // 현재 미디어가 이미지인 경우에만 타이머 설정
  if (bottomMediaFiles[currentBottomMediaIndex] && 
      bottomMediaFiles[currentBottomMediaIndex].type === 'image') {
    bottomMediaTimer = setTimeout(() => {
      if (isBottomMediaPlaying) {
        moveToNextMedia();
      }
    }, 10000); // 이미지는 10초 동안 표시
  }
}

// 추가된 함수: 현재 미디어를 4초 동안 서서히 숨기는 함수
function hideCurrentBottomMedia(callback) {
  const bottomImageContainer = document.getElementById('bottomImageContainer');
  const bottomImage = document.getElementById('bottomImage');
  const bottomVideo = document.getElementById('bottomVideo');

  if (bottomImageContainer) {
    // 4초 동안 아래로 내려가는 애니메이션 실행
    bottomImageContainer.style.bottom = '-150vh';

    // 이미지/비디오가 서서히 사라지도록 처리
    if (bottomImage) {
      bottomImage.classList.remove('show');
    }
    if (bottomVideo) {
      bottomVideo.style.opacity = '0';
    }

    // 4초(애니메이션 시간) 후 콜백 실행
    setTimeout(() => {
      if (callback) {
        callback();
      }
    }, 4000);
  } else {
    // 컨테이너가 없으면 즉시 콜백
    if (callback) {
      callback();
    }
  }
}

// --- JS 기반 애니메이션으로 변경 ---

// Easing 함수 (ease-out 효과)
function easeOutCubic(t) {
  return (--t) * t * t + 1;
}

// 현재 실행 중인 애니메이션을 추적하는 전역 객체
const animationState = {
  slideDownAnimation: null,
  slideUpAnimation: null,
  isPaused: false,
  startTime: 0,        // 애니메이션 시작 시간
  pauseTime: 0,        // 애니메이션 일시정지 시간
  elapsedBeforePause: 0, // 일시정지 전 경과 시간
  currentProgress: 0,  // 현재 진행 상태 (0~1)
  containerElement: null, // 현재 애니메이션 중인 컨테이너 요소
  mediaElement: null,  // 현재 애니메이션 중인 미디어 요소
  direction: null,     // 'up' 또는 'down'
  callback: null,      // 애니메이션 완료 시 실행할 콜백
  startPos: 0,         // 애니메이션 시작 위치
  endPos: 0,           // 애니메이션 종료 위치
  currentPos: 0,       // 현재 위치 (일시정지 시)
  lastFrameTime: 0     // 마지막 프레임 시간
};

// 애니메이션을 처리하는 범용 함수 (일시정지/재개 기능 추가)
function animate(options) {
  const animationId = {}; // 애니메이션 ID 객체
  const startPosition = options.startPos || 0; // 시작 위치
  const endPosition = options.endPos || 0;     // 종료 위치
  const isResuming = options.isResuming || false; // 재개 여부
  
  // 새로운 애니메이션인 경우에만 상태 초기화
  if (!isResuming) {
    // 시작 시간 기록
    animationState.startTime = performance.now();
    animationState.elapsedBeforePause = 0;
    animationState.isPaused = false;
    animationState.currentProgress = 0;
  } else {
    // 재개하는 경우 시작 시간만 업데이트
    animationState.startTime = performance.now();
    animationState.isPaused = false;
  }
  
  // 항상 저장해야 하는 값들
  animationState.containerElement = options.container || null;
  animationState.mediaElement = options.media || null;
  animationState.direction = options.direction || 'up';
  animationState.callback = options.callback || null;
  animationState.startPos = startPosition;
  animationState.endPos = endPosition;
  
  // 애니메이션 함수 실행
  function animateFrame(time) {
    // 일시정지 상태면 현재 프레임에서 멈춤
    if (animationState.isPaused) {
      // 다음 프레임으로 진행하지 않고 현재 상태 유지
      return;
    }
    
    // 마지막 프레임 시간 저장 (부드러운 애니메이션을 위해)
    animationState.lastFrameTime = time;
    
    // 일시정지 후 재개된 경우, 경과 시간에 일시정지 전 경과 시간을 더함
    let elapsed = time - animationState.startTime + animationState.elapsedBeforePause;
    
    // 재개하는 경우 이미 진행된 위치에서 시작하기 위해 타임 프랙션 조정
    let timeFraction = elapsed / options.duration;
    
    // 재개 시 타임 프랙션에 이전 진행도 반영
    if (isResuming && options.resumeProgress !== undefined && options.resumeProgress > 0) {
      timeFraction = options.resumeProgress + ((1 - options.resumeProgress) * timeFraction);
    }
    
    if (timeFraction > 1) timeFraction = 1;
    
    // 애니메이션 진행 상태 저장
    animationState.currentProgress = timeFraction;
    
    // easing 함수를 사용하여 부드러운 애니메이션 효과 적용
    const progress = options.easing(timeFraction);
    
    // 애니메이션 그리기 함수 실행
    options.draw(progress);
    
    if (timeFraction < 1) {
      // 현재 방향에 따라 적절한 애니메이션 ID 저장
      if (options.direction === 'down') {
        animationState.slideDownAnimation = requestAnimationFrame(animateFrame);
      } else {
        animationState.slideUpAnimation = requestAnimationFrame(animateFrame);
      }
    } else {
      // 애니메이션 완료
      if (options.direction === 'down') {
        animationState.slideDownAnimation = null;
      } else {
        animationState.slideUpAnimation = null;
      }
      
      // 콜백 함수 실행 (완료 시)
      if (options.callback) {
        // 약간의 지연을 두어 최종 상태가 반영되도록 함
        setTimeout(() => {
          options.callback();
        }, 50);
      }
    }
  }
  
  // 첫 프레임 시작
  if (options.direction === 'down') {
    animationState.slideDownAnimation = requestAnimationFrame(animateFrame);
  } else {
    animationState.slideUpAnimation = requestAnimationFrame(animateFrame);
  }
  
  return animationId;
}

// 애니메이션 일시정지 함수
function pauseAnimation() {
  // 일시정지 상태가 아닐 때만 일시정지 처리
  if (!animationState.isPaused) {
    animationState.isPaused = true;
    animationState.pauseTime = performance.now();
    animationState.elapsedBeforePause += animationState.pauseTime - animationState.startTime;
    
    // 현재 요소 위치 저장 (중요: 정확한 위치를 기반으로 재개하기 위함)
    if (animationState.containerElement) {
      const currentBottom = parseInt(animationState.containerElement.style.bottom) || 0;
      animationState.currentPos = currentBottom;
      
      console.log(`애니메이션 일시정지 - 진행도: ${Math.round(animationState.currentProgress * 100)}%, 현재 위치: ${currentBottom}px`);
    } else {
      console.log("애니메이션 일시정지 - 현재 진행도:", Math.round(animationState.currentProgress * 100) + "%");
    }
    
    // 현재 실행 중인 애니메이션 취소
    if (animationState.slideDownAnimation) {
      cancelAnimationFrame(animationState.slideDownAnimation);
    }
    if (animationState.slideUpAnimation) {
      cancelAnimationFrame(animationState.slideUpAnimation);
    }
  }
}

// 애니메이션 재개 함수
function resumeAnimation() {
  // 일시정지 상태일 때만 재개 처리
  if (animationState.isPaused) {
    // 현재 요소 위치 저장
    const container = animationState.containerElement;
    const media = animationState.mediaElement;
    
    if (!container || !media) {
      console.error("재개할 애니메이션 요소가 없음");
      return;
    }
    
    // 비디오인 경우 오디오 상태를 확인
    if (media.tagName === 'VIDEO') {
      // 현재 재생 시간 위치 확인
      const currentTime = media.currentTime || 0;
      const duration = media.duration || 0;
      
      if (duration > 0 && currentTime >= duration - 0.5) {
        // 비디오가 거의 끝에 있는 경우, 오디오가 종료된 것으로 간주
        console.log("애니메이션 재개: 비디오가 거의 끝에 도달함 - 오디오 종료로 간주");
        isBottomAudioEnded = true;
        media.muted = true;
      } else if (isBottomAudioEnded) {
        console.log("애니메이션 재개: 오디오가 이미 종료됨 - 음소거 유지");
        media.muted = true;
      } else {
        console.log("애니메이션 재개: 오디오 정상 재생 가능 - 음소거 해제");
        media.muted = false;
      }
    }
    
    // 현재 컨테이너 위치를 직접 확인
    const currentBottom = parseInt(container.style.bottom) || 0;
    
    // 미디어 요소의 현재 투명도 확인
    const currentOpacity = parseFloat(media.style.opacity) || 0;
    
    // 위치와 목표 사이의 거리 계산
    const startPos = animationState.startPos || 0;
    const endPos = animationState.endPos || 0;
    const totalDistance = Math.abs(endPos - startPos);
    const remainingDistance = Math.abs(endPos - currentBottom);
    
    // 남은 거리 비율로 진행도 계산
    let calculatedProgress = 0;
    if (totalDistance > 0) {
      calculatedProgress = 1 - (remainingDistance / totalDistance);
    }
    
    console.log(`애니메이션 재개 - 진행도: ${Math.round(calculatedProgress * 100)}%, 현재 위치: ${currentBottom}px`);
    
    // 일시정지 상태 해제
    animationState.isPaused = false;
    animationState.startTime = performance.now();
    animationState.elapsedBeforePause = 0; // 재설정하여 새로 시작
    animationState.currentProgress = calculatedProgress;
    animationState.currentPos = currentBottom;
    
    // 애니메이션 상태 업데이트 (화면에 보이는 현재 상태를 기준으로)
    if (container.style.display === 'none' || Math.abs(currentBottom) >= 500) {
      // 요소가 이미 화면 밖에 있으면 애니메이션 완료 처리
      console.log("요소가 이미 화면 밖에 있음 - 애니메이션 완료로 처리");
      if (animationState.callback) {
        animationState.callback();
      }
      return;
    }
    
    // 방향에 따라 적절한 애니메이션 재시작
    if (animationState.direction === 'down') {
      // 내려가는 애니메이션 재개 - 현재 위치에서 계속
      slideDown(container, media, animationState.callback, true);
    } else {
      // 올라가는 애니메이션 재개 - 현재 위치에서 계속
      slideUp(container, media, animationState.callback, true);
    }
  }
}

// 올라오는 애니메이션
function slideUp(element, media, callback, isResuming = false) {
  const container = element;
  const targetMedia = media;
  
  // 비디오인 경우 오디오 상태 확인
  if (targetMedia && targetMedia.tagName === 'VIDEO') {
    // 새 애니메이션이 시작되는 경우 오디오 관련 설정 초기화
    if (!isResuming) {
      isBottomAudioEnded = false;
      targetMedia.muted = false;
      console.log("슬라이드 업: 새 비디오 시작 - 오디오 상태 초기화");
    }
    // 재개되는 애니메이션인 경우 현재 상태 확인
    else {
      const currentTime = targetMedia.currentTime || 0;
      const duration = targetMedia.duration || 0;
      
      if (duration > 0 && currentTime >= duration - 0.5) {
        isBottomAudioEnded = true;
        targetMedia.muted = true;
        console.log("슬라이드 업 재개: 비디오가 거의 끝에 도달함 - 오디오 종료로 간주");
      }
    }
  }
  
  // 재개가 아닌 새 애니메이션인 경우에만 초기화
  if (!isResuming) {
    // 확실하게 화면 밖 아래에서 시작하도록 컨테이너 위치 강제 설정
    container.style.bottom = '-150vh';
    container.style.transition = 'none'; // 즉시 적용되도록
    container.style.display = 'block';
    
    // 강제로 리플로우 발생시켜 즉시 적용되도록 함
    void container.offsetWidth;
    
    // 미디어 요소도 보이도록 설정 (opacity는 0으로)
    if (targetMedia) {
      targetMedia.style.opacity = '0';
      targetMedia.style.display = 'block';
    }
  }
  
  // 지연 시간 설정 (재개 시에는 지연 없음)
  const delay = isResuming ? 0 : 50;
  
  // 좀 더 긴 지연시간으로 DOM이 확실히 업데이트되도록 함
  setTimeout(() => {
    // 위치 및 상태 변수 설정
    let startPos, endPos, currentPos;
    
    // 미디어 높이 계산
    let mediaHeight = 0;
    if (targetMedia && targetMedia.offsetHeight) {
      mediaHeight = targetMedia.offsetHeight;
    } else {
      mediaHeight = window.innerHeight / 2; // 더 아래에서 시작하도록 화면 높이의 절반 정도로 설정
    }
    
    // 기본 애니메이션 시간 (ms)
    const defaultDuration = 4000; // 기본 4초
    let duration = defaultDuration;
    
    // 재개가 아닌 새 애니메이션인 경우
    if (!isResuming) {
      // 다시 한번 컨테이너 위치 확인
      if (parseInt(container.style.bottom || '-150') > -100) {
        container.style.bottom = '-150vh'; // 확실히 아래에 있도록 강제 설정
      }
      
      startPos = -mediaHeight - 100; // 화면 아래에서 시작 (여유롭게 100px 추가)
      endPos = -80; // 화면 하단에서 80px 위까지만 올라옴
      currentPos = startPos; // 새 애니메이션은 시작 위치에서 시작
      
      console.log(`슬라이드 업 애니메이션 시작: ${startPos}px → ${endPos}px, 현재 위치: ${container.style.bottom}`);
    } else {
      // 재개 시에는 저장된 시작/종료 위치 사용하고, 현재 위치 직접 확인
      startPos = animationState.startPos || (-mediaHeight - 100);
      endPos = animationState.endPos || -80;
      
      // 현재 위치를 직접 가져오기 (더 정확한 방법)
      currentPos = parseInt(container.style.bottom) || startPos;
      
      // 전체 거리와 남은 거리 계산
      const totalDistance = Math.abs(endPos - startPos);
      const remainingDistance = Math.abs(endPos - currentPos);
      
      // 남은 거리 비율에 따라 애니메이션 시간 조정 (더 부드러운 이동을 위해)
      if (totalDistance > 0) {
        const remainingRatio = remainingDistance / totalDistance;
        duration = Math.max(defaultDuration * remainingRatio, 1000); // 최소 1초
      }
      
      console.log(`슬라이드 업 애니메이션 재개: 진행률 ${Math.round((1 - (remainingDistance / totalDistance)) * 100)}%, 현재 위치: ${currentPos}px, 남은 시간: ${duration}ms`);
    }
    
    animate({
      container: container,    // 컨테이너 요소 추가
      media: targetMedia,      // 미디어 요소 추가
      direction: 'up',         // 방향 표시
      duration: duration,      // 올라오는 속도 (동적으로 조정)
      easing: easeOutCubic,
      startPos: startPos,      // 시작 위치
      endPos: endPos,          // 종료 위치
      isResuming: isResuming,  // 재개 여부
      resumeProgress: 0,       // 항상 새로운 진행도로 시작 (현재 위치에서)
      draw(progress) {
        if (isResuming) {
          // 재개 시 현재 위치에서 목표 위치까지 부드럽게 이동
          container.style.bottom = `${currentPos + ((endPos - currentPos) * progress)}px`;
        } else {
          // 새 애니메이션은 처음부터 끝까지 전체 거리 이동
          container.style.bottom = `${startPos + ((endPos - startPos) * progress)}px`;
        }
        
        // 투명도는 현재 위치에 기반하여 조정 (슬라이드 업에서는 0에서 1로)
        const opacityProgress = isResuming ? 
          (Math.abs(currentPos - startPos) + progress * Math.abs(endPos - currentPos)) / Math.abs(endPos - startPos) :
          progress;
        
        targetMedia.style.opacity = `${Math.min(1, opacityProgress)}`;
      },
      callback: callback
    });
  }, delay);
}

// 내려가는 애니메이션
function slideDown(element, media, callback, isResuming = false) {
  const container = element;
  const targetMedia = media;
  let mediaHeight = 0;
  
  if (targetMedia && targetMedia.offsetHeight) {
    mediaHeight = targetMedia.offsetHeight;
  } else {
    mediaHeight = window.innerHeight / 3;
  }
  
  // 위치 설정
  let startPos, endPos, currentPos;
  
  // 기본 애니메이션 시간 (ms)
  const defaultDuration = 4000; // 기본 4초
  let duration = defaultDuration;
  
  // 재개가 아닌 경우 표준 시작/종료 위치 사용
  if (!isResuming) {
    startPos = -80; // 올라온 자리에서 바로 내려감
    endPos = -mediaHeight; // 화면 아래로 완전히 사라짐
    currentPos = startPos; // 현재 위치는 시작 위치와 동일
    
    console.log(`슬라이드 다운 애니메이션 시작: ${startPos}px → ${endPos}px`);
  } else {
    // 재개할 때는 진행도에 따른 현재 위치 계산
    startPos = animationState.startPos || -80;
    endPos = animationState.endPos || -mediaHeight;
    
    // 현재 위치를 직접 가져오기 (더 정확한 방법)
    currentPos = parseInt(container.style.bottom) || startPos;
    
    // 전체 거리와 남은 거리 계산
    const totalDistance = Math.abs(endPos - startPos);
    const remainingDistance = Math.abs(endPos - currentPos);
    
    // 남은 거리 비율에 따라 애니메이션 시간 조정 (더 부드러운 이동을 위해)
    if (totalDistance > 0) {
      const remainingRatio = remainingDistance / totalDistance;
      duration = Math.max(defaultDuration * remainingRatio, 1000); // 최소 1초
    }
    
    console.log(`슬라이드 다운 애니메이션 재개: 진행률 ${Math.round((1 - (remainingDistance / totalDistance)) * 100)}%, 현재 위치: ${currentPos}px, 남은 시간: ${duration}ms`);
  }
  
  // 애니메이션 실행
  animate({
    container: container,       // 컨테이너 요소
    media: targetMedia,         // 미디어 요소
    direction: 'down',          // 방향 표시
    duration: duration,         // 내려가는 속도 (조정됨)
    easing: easeOutCubic,
    startPos: startPos,         // 시작 위치
    endPos: endPos,             // 종료 위치
    isResuming: isResuming,     // 재개 여부
    resumeProgress: 0,          // 항상 새로운 진행도로 시작 (현재 위치에서)
    draw(progress) {
      if (isResuming) {
        // 재개 시 현재 위치에서 목표 위치까지 부드럽게 이동
        container.style.bottom = `${currentPos + ((endPos - currentPos) * progress)}px`;
      } else {
        // 새 애니메이션은 처음부터 끝까지 전체 거리 이동
        container.style.bottom = `${startPos + ((endPos - startPos) * progress)}px`;
      }
      
      // 투명도는 현재 위치에 기반하여 조정
      const opacityProgress = isResuming ? 
        (Math.abs(currentPos - startPos) + progress * Math.abs(endPos - currentPos)) / Math.abs(endPos - startPos) :
        progress;
      
      targetMedia.style.opacity = Math.max(0, 1 - opacityProgress);
    },
    callback: callback
  });
}

// 내려가는 애니메이션이 완료됐는지 추적하기 위한 변수
let isSlideDownComplete = true;
let mediaIndexAfterSlideDown = 0;

// 다음 미디어로 이동
function moveToNextMedia() {
  // 현재 게임 상태 확인
  const pauseBtn = document.getElementById('pauseBtn');
  const isGamePaused = pauseBtn && pauseBtn.textContent === 'RESUME';
  
  // 게임이 일시정지 상태면 미디어 변경을 하지 않음
  if (isGamePaused) {
    console.log("게임 일시정지 상태 - 다음 미디어로 이동하지 않음");
    return;
  }
  
  // 타이머 정리
  if (bottomMediaTimer) {
    clearTimeout(bottomMediaTimer);
    bottomMediaTimer = null;
  }

  const bottomImageContainer = document.getElementById('bottomImageContainer');
  const currentMediaElement = document.getElementById('bottomVideo') || document.getElementById('bottomImage');
  
  // 애니메이션 시작 전에 다음 인덱스를 미리 계산
  mediaIndexAfterSlideDown = currentBottomMediaIndex + 1;
  
  // 마지막 미디어 이후에는 다시 처음으로 돌아감
  if (mediaIndexAfterSlideDown >= bottomMediaFiles.length) {
    mediaIndexAfterSlideDown = 0;
  }
  
  console.log(`다음 미디어 준비 (슬라이드 다운 후): ${mediaIndexAfterSlideDown}`);
  
  // 슬라이드 다운 진행 중 플래그 설정
  isSlideDownComplete = false;
  
  // 게임이 일시정지 상태인지 다시 한번 확인하고 현재 미디어 애니메이션 시작
  if (!isGamePaused && isBottomMediaPlaying) {
    // 현재 미디어를 4초간 숨긴 후 다음 미디어를 표시
    slideDown(bottomImageContainer, currentMediaElement, () => {
      // 슬라이드 다운 애니메이션 완료
      isSlideDownComplete = true;
      
      // 인덱스 실제 업데이트
      currentBottomMediaIndex = mediaIndexAfterSlideDown;
      
      console.log(`슬라이드 다운 완료, 다음 미디어로 이동: ${currentBottomMediaIndex} (${bottomMediaFiles.length}개 중)`);
      
      // 애니메이션 완료 후에도 게임 상태 다시 확인
      const pauseBtn = document.getElementById('pauseBtn');
      const isGamePausedAfterAnimation = pauseBtn && pauseBtn.textContent === 'RESUME';
      
      if (isBottomMediaPlaying && !isGamePausedAfterAnimation) {
        // 현재 컨테이너 위치 확인
        const containerBottom = parseInt(bottomImageContainer.style.bottom || '-150');
        
        // 컨테이너가 숨겨져 있거나 화면 밖에 있으면 아래에서 올라오게 함
        if (bottomImageContainer.style.display === 'none' || Math.abs(containerBottom) >= 100) {
          console.log("컨테이너가 화면 밖에 있음 - 다시 아래에서 올라오게 함");
          bottomImageContainer.style.display = 'block';
          bottomImageContainer.style.bottom = '-150vh'; // 화면 밖(아래)에서 시작
        }
        
        showCurrentBottomMedia(); // 내려가는 애니메이션이 끝난 후 바로 다음 미디어를 올림
      }
    });
  }
}

// 하단 미디어 정지
function stopBottomMediaShow() {
  console.log("하단 미디어 정지");
  isBottomMediaPlaying = false;
  
  // 타이머 제거
  if (bottomMediaTimer) {
    clearTimeout(bottomMediaTimer);
    bottomMediaTimer = null;
  }
  
  // 미디어 숨김
  hideBottomImage();
  
  // 인덱스 초기화
  currentBottomMediaIndex = 0;
  
  // 첫 폭발 상태 초기화
  firstExplosionOccurred = false;
}

// 게임 일시정지 시 미디어 재생 동작 (게임과 반대로 동작)
function onGamePaused() {
  // 게임 일시정지 시에만 미디어 제어
  if (firstExplosionOccurred) {
    console.log("게임 일시정지(RESUME 상태) - 애니메이션 상태 확인");
    
    // 일시정지 전 애니메이션 상태를 확인
    const isAnimationInProgress = animationState.slideDownAnimation !== null || animationState.slideUpAnimation !== null;
    
    // 현재 상태에 따라 다르게 처리
    if (isAnimationInProgress) {
      console.log("애니메이션 진행 중 - 게임 일시정지에 따라 애니메이션도 일시정지");
      
      // 진행 중인 애니메이션 일시정지
      pauseAnimation();
      
      // 비디오 요소가 있다면 일시정지
      const bottomVideo = document.getElementById('bottomVideo');
      if (bottomVideo && bottomVideo.style.display !== 'none') {
        // 비디오 일시정지 전에 오디오 상태 확인
        if (bottomVideo.duration > 0 && !bottomVideo.paused) {
          // 오디오가 끝에 도달했는지 확인
          const audioTrackEnded = bottomVideo.currentTime >= bottomVideo.duration - 0.5; // 0.5초 여유
          if (audioTrackEnded && !isBottomAudioEnded) {
            isBottomAudioEnded = true;
            console.log('하단 비디오 오디오 트랙 종료 감지 (일시정지 시)');
          }
        }
        
        bottomVideo.pause();
      }
      
      // 현재 미디어 재생 중지 상태로 설정
      isBottomMediaPlaying = false;
      
      return;
    }
    
    // 슬라이드 다운 중이 아니라면 일반적인 처리 계속
    console.log("게임 일시정지(RESUME 상태) - 미디어 아래에서 올라오게 재생");
    isBottomMediaPlaying = true;
    
    const bottomImageContainer = document.getElementById('bottomImageContainer');
    
    // 슬라이드 다운 중 상태 확인 - 슬라이드 다운이 진행 중이었다면 다음 인덱스를 이미 준비해둔 상태
    if (!isSlideDownComplete) {
      console.log("슬라이드 다운 진행 중 - 일시정지 해제 후 다음 미디어로 넘어갈 준비");
      // 이제 슬라이드 다운이 완료된 것으로 간주하고, 다음 인덱스를 사용
      currentBottomMediaIndex = mediaIndexAfterSlideDown;
      isSlideDownComplete = true;
    }
      
    // 항상 컨테이너를 화면 아래에 위치시키고 표시 상태로 설정 - 첫 폭발처럼 아래에서 올라오게
    if (bottomImageContainer) {
      bottomImageContainer.style.display = 'block';
      bottomImageContainer.style.bottom = '-150vh'; // 화면 밖(아래)에서 시작
    }
    
    // 미디어 요소 초기화 - 이전에 표시되던 내용 모두 제거
    resetMediaElements();
    
    // 현재 미디어를 아래에서 올라오게 함 (항상 새로 애니메이션 시작)
    showCurrentBottomMedia();
  }
}

// 게임 재개 시 미디어 제어 (게임과 반대로 동작)
function onGameResumed() {
  // 게임 재개 시(RESUME 버튼 클릭 시) 처리
  if (firstExplosionOccurred) {
    console.log("게임 재개(RESUME->PAUSE) - 애니메이션 상태 확인");
    
    // 애니메이션이 일시정지 상태인지 확인
    if (animationState.isPaused) {
      console.log("애니메이션 일시정지 상태 - 재개");
      
      // 일시정지된 애니메이션 재개
      resumeAnimation();
      
      // 비디오 요소가 있다면 재생 (단, 오디오가 이미 끝난 상태가 아닌 경우에만)
      const bottomVideo = document.getElementById('bottomVideo');
      if (bottomVideo && bottomVideo.style.display !== 'none') {
        // 비디오의 현재 상태 확인
        const currentTime = bottomVideo.currentTime || 0;
        const duration = bottomVideo.duration || 0;
        
        if (duration > 0 && currentTime >= duration - 0.5) {
          // 비디오가 거의 끝에 있는 경우
          console.log('비디오가 거의 끝에 도달함 - 오디오 종료로 간주');
          isBottomAudioEnded = true;
          bottomVideo.muted = true;
          bottomVideo.play().catch(e => console.log('미디어 재생 오류:', e));
        } else if (!isBottomAudioEnded) {
          // 오디오가 아직 종료되지 않은 경우
          console.log('하단 비디오 재생 시도 - 오디오 정상 재생');
          bottomVideo.muted = false; // 명시적으로 음소거 해제
          bottomVideo.play().catch(e => console.log('미디어 재생 오류:', e));
        } else {
          // 오디오가 이미 종료된 경우
          console.log('하단 비디오 재생 - 오디오는 음소거 상태로 재생');
          bottomVideo.muted = true;
          bottomVideo.play().catch(e => console.log('미디어 재생 오류:', e));
        }
      }
      
      // 미디어 재생 상태로 설정
      isBottomMediaPlaying = true;
      
      return;
    }
    
    // 일시정지된 애니메이션이 없으면 일반적인 처리 계속
    console.log("게임 재개(RESUME->PAUSE) - 미디어는 아래에서 올라오게 설정");
    
    // 게임 재개 시 미디어 재생 상태로 설정
    isBottomMediaPlaying = true;
    
    // 미디어 컨테이너 참조
    const bottomImageContainer = document.getElementById('bottomImageContainer');
    
    // 슬라이드 다운 중인지 여부에 관계없이 다음 미디어로 이동
    if (!isSlideDownComplete) {
      console.log("슬라이드 다운 완료 안됨 - 다음 미디어 인덱스로 설정");
      
      // 다음 미디어 인덱스로 미리 설정
      currentBottomMediaIndex = mediaIndexAfterSlideDown;
      
      // 슬라이드 다운 완료 상태를 true로 설정
      isSlideDownComplete = true;
    }
    
    // 컨테이너는 항상 화면 밖 아래에서 시작하도록 설정
    if (bottomImageContainer) {
      bottomImageContainer.style.display = 'block';
      bottomImageContainer.style.bottom = '-150vh'; // 화면 밖(아래)에 위치 - 중요!
    }
    
    // 모든 미디어 요소 초기화 (이전 미디어 제거)
    resetMediaElements();
    
    // 타이머 중지 (필요 시 새로 시작할 것이므로)
    if (bottomMediaTimer) {
      clearTimeout(bottomMediaTimer);
      bottomMediaTimer = null;
    }
    
    // 새로운 미디어를 아래에서 올라오게 표시
    showCurrentBottomMedia();
  }
}

// 모든 미디어 요소 초기화 (비디오/이미지 모두)
function resetMediaElements() {
  const bottomVideo = document.getElementById('bottomVideo');
  const bottomImage = document.getElementById('bottomImage');
  
  if (bottomVideo) {
    bottomVideo.pause();
    bottomVideo.style.opacity = '0';
    bottomVideo.style.display = 'none';
  }
  
  if (bottomImage) {
    bottomImage.classList.remove('show');
    bottomImage.style.opacity = '0';
    bottomImage.style.display = 'none';
  }
}

// 하단 미디어 일시 정지/재개 토글 - 게임 상태와 반대로 작동
function toggleBottomMediaPause() {
  // 중요: 게임이 일시정지 상태(RESUME 버튼이 표시됨)이면 미디어는 정지해야 함
  // 게임이 실행 중 상태(PAUSE 버튼이 표시됨)이면 미디어는 재생해야 함
  const pauseBtn = document.getElementById('pauseBtn');
  const isGamePaused = pauseBtn && pauseBtn.textContent === 'RESUME';
  
  // 게임 상태와 반대로 미디어 상태 설정 (게임이 일시정지면 미디어도 일시정지)
  isBottomMediaPlaying = !isGamePaused;
  console.log("하단 미디어 상태 변경:", isBottomMediaPlaying ? "재생" : "일시정지", "게임 상태:", isGamePaused ? "일시정지" : "실행 중");
  
  // 현재 비디오가 표시 중이면 재생/일시 정지 토글
  const bottomVideo = document.getElementById('bottomVideo');
  if (bottomVideo && bottomVideo.style.display !== 'none') {
    if (isBottomMediaPlaying) {
      // 비디오의 현재 상태 확인
      const currentTime = bottomVideo.currentTime || 0;
      const duration = bottomVideo.duration || 0;
      
      if (duration > 0 && currentTime >= duration - 0.5) {
        // 비디오가 거의 끝에 있는 경우
        console.log('토글: 비디오가 거의 끝에 도달함 - 오디오 종료로 간주');
        isBottomAudioEnded = true;
        bottomVideo.muted = true;
        bottomVideo.play().catch(e => console.log('하단 비디오 재생 오류:', e));
      } else if (!isBottomAudioEnded) {
        // 오디오가 아직 종료되지 않은 경우
        console.log('토글: 하단 비디오 재생 - 오디오 정상 재생');
        bottomVideo.muted = false; // 명시적으로 음소거 해제
        bottomVideo.play().catch(e => console.log('하단 비디오 재생 오류:', e));
      } else {
        // 오디오가 이미 종료된 경우
        console.log('토글: 하단 비디오 재생 - 오디오는 음소거 상태로 재생');
        bottomVideo.muted = true;
        bottomVideo.play().catch(e => console.log('하단 비디오 재생 오류:', e));
      }
    } else {
      // 일시정지 전에 오디오 상태를 확인하여 설정
      const currentTime = bottomVideo.currentTime || 0;
      const duration = bottomVideo.duration || 0;
      
      if (duration > 0 && currentTime >= duration - 0.5) {
        isBottomAudioEnded = true;
        console.log('토글: 일시정지 전 비디오가 거의 끝에 도달함 - 오디오 종료로 간주');
      }
      
      bottomVideo.pause();
    }
  }
  
  // 현재 진행 중인 애니메이션이 있는지 확인
  const isAnimationInProgress = animationState.slideDownAnimation !== null || 
                               animationState.slideUpAnimation !== null;
  
  // 애니메이션 상태 토글
  if (isAnimationInProgress) {
    if (isBottomMediaPlaying) {
      // 미디어가 재생 상태로 변경됐다면 애니메이션 재개
      if (animationState.isPaused) {
        console.log("토글: 애니메이션 재개");
        resumeAnimation();
      }
    } else {
      // 미디어가 일시정지 상태로 변경됐다면 애니메이션 일시정지
      console.log("토글: 애니메이션 일시정지");
      pauseAnimation();
    }
  }
  
  // 재생 상태가 되면 타이머 다시 시작 (이미지일 경우)
  if (isBottomMediaPlaying) {
    startImageTimer();
  } else {
    // 일시정지면 타이머 중지
    if (bottomMediaTimer) {
      clearTimeout(bottomMediaTimer);
      bottomMediaTimer = null;
    }
  }
}

// 현재 인덱스의 미디어 표시
function showCurrentBottomMedia() {
  if (!isBottomMediaPlaying || bottomMediaFiles.length === 0) return;
  
  // 미디어 파일 정보 가져오기
  const mediaFile = bottomMediaFiles[currentBottomMediaIndex];
  if (!mediaFile) {
    console.error("현재 인덱스에 해당하는 미디어 파일이 없습니다:", currentBottomMediaIndex);
    return;
  }
  
  console.log(`미디어 표시 (${currentBottomMediaIndex + 1}/${bottomMediaFiles.length}): ${mediaFile.type} - ${mediaFile.path}`);
  
  // 미디어 컨테이너를 미리 화면 아래로 배치 (절대 중요: 항상 아래에서 시작하도록)
  const bottomImageContainer = document.getElementById('bottomImageContainer');
  if (bottomImageContainer) {
    bottomImageContainer.style.bottom = '-150vh';
    bottomImageContainer.style.display = 'block';
  }
  
  // 모든 이전 미디어 요소를 초기화 (새 시작을 위해)
  resetMediaElements();
  
  // 타입에 따라 다른 함수 호출
  if (mediaFile.type === 'image') {
    showBottomImageContent(mediaFile.number);
    // 이미지는 자동 타이머 설정
    startImageTimer();
  } else if (mediaFile.type === 'video') {
    showBottomVideoContent(mediaFile.number);
    // 비디오는 onended 이벤트에서 다음으로 넘어가므로 여기서는 타이머 설정 안 함
  }
}

// 하단 미디어 숨김
function hideBottomImage() {
  const bottomImageContainer = document.getElementById('bottomImageContainer');
  const bottomImage = document.getElementById('bottomImage');
  const bottomVideo = document.getElementById('bottomVideo');
  
  if (bottomImageContainer) {
    // 이미지 애니메이션 클래스 제거
    if (bottomImage) {
      bottomImage.classList.remove('show');
    }
    
    // 비디오 애니메이션 효과 제거
    if (bottomVideo) {
      bottomVideo.style.opacity = '0';
      bottomVideo.pause();
    }
    
    // 컨테이너를 아래로 슬라이드하여 숨김
    bottomImageContainer.style.bottom = '-150vh';
    
    // 애니메이션 완료 후 컨테이너 숨기기
    if (window.bottomHideTimer) {
      clearTimeout(window.bottomHideTimer);
    }
    window.bottomHideTimer = setTimeout(() => {
      bottomImageContainer.style.display = 'none';
    }, 4000); // 4초 후 완전히 숨김
  }
}

// 이 함수는 이제 사용하지 않음 (showCurrentBottomMedia로 대체)
function showBottomMedia(index) {
  console.log("경고: 이전 버전의 showBottomMedia 함수가 호출됨. 대신 showCurrentBottomMedia를 사용하세요.");
  
  // 파일 목록 새로고침 후 현재 미디어 표시
  refreshMediaFiles().then(() => {
    // 특정 번호의 파일을 찾아 인덱스 설정
    const fileIndex = bottomMediaFiles.findIndex(file => file.number === index);
    
    if (fileIndex !== -1) {
      currentBottomMediaIndex = fileIndex;
    } else {
      console.log(`미디어 번호 ${index}를 찾을 수 없어 처음부터 시작합니다.`);
      currentBottomMediaIndex = 0;
    }
    
    showCurrentBottomMedia();
  });
}

// 파일 존재 여부 확인 (Head 요청으로 확인)
function checkFileExists(url) {
  return fetch(url, { method: 'HEAD' })
    .then(response => response.ok)
    .catch(() => false);
}

// 하단 이미지 콘텐츠 표시
function showBottomImageContent(index) {
  const bottomImageContainer = document.getElementById('bottomImageContainer');
  const bottomImage = document.getElementById('bottomImage');
  
  if (!bottomImage || !bottomImageContainer) return;
  
  console.log(`하단 이미지 ${index}.jpg 표시 준비`);
  
  // 다른 미디어 숨김
  if (document.getElementById('bottomVideo')) {
    document.getElementById('bottomVideo').style.display = 'none';
  }
  
  // 항상 화면 밖 아래에서 시작하도록 설정 (중요)
  bottomImageContainer.style.bottom = '-150vh'; 
  bottomImageContainer.style.transition = 'none';
  bottomImageContainer.style.display = 'block';
  
  // 강제로 리플로우 발생시켜 위치 설정이 즉시 적용되도록 함
  void bottomImageContainer.offsetWidth;
  
  // 이미지 설정
  bottomImage.style.display = 'block';
  bottomImage.src = `images/bottom/${index}.jpg`;
  bottomImage.style.opacity = '0'; // 시작 투명도 초기화
  
  bottomImage.onload = function() {
    console.log(`하단 이미지 ${index}.jpg 로드 완료 - 애니메이션 시작, 현재 위치: ${bottomImageContainer.style.bottom}`);
    
    // 컨테이너 위치 다시 한번 확인
    if (parseInt(bottomImageContainer.style.bottom || '-150') > -100) {
      // 아직도 위에 있다면 강제로 아래로 이동
      bottomImageContainer.style.bottom = '-150vh';
      void bottomImageContainer.offsetWidth; // 강제 리플로우
    }
    
    // DOM이 업데이트될 시간을 주기 위해 약간 지연
    setTimeout(() => {
      // 아래에서 올라오는 애니메이션 시작 (반드시 아래에서 시작)
      slideUp(bottomImageContainer, bottomImage);
    }, 50);
  };
  
  bottomImage.onerror = function() {
    console.log(`하단 이미지 ${index}.jpg를 찾을 수 없습니다.`);
    bottomImageContainer.style.display = 'none';
  };
}

// 하단 동영상 콘텐츠 표시
function showBottomVideoContent(index) {
  const bottomImageContainer = document.getElementById('bottomImageContainer');
  let bottomVideo = document.getElementById('bottomVideo');
  
  console.log(`하단 비디오 ${index}.mp4 표시 준비`);
  
  // 비디오 요소 생성 (기존 코드와 유사)
  if (!bottomVideo) {
    bottomVideo = document.createElement('video');
    bottomVideo.id = 'bottomVideo';
    bottomVideo.className = 'no-border-at-all video-touchable';
    bottomVideo.controls = true; 
    bottomVideo.autoplay = false;
    bottomVideo.muted = false;  // 반드시 음소거 해제 상태로 시작
    bottomVideo.playsInline = true;
    bottomImageContainer.appendChild(bottomVideo);
  } else {
    // 기존 비디오 요소가 있는 경우, 명시적으로 음소거 해제
    bottomVideo.muted = false;
  }
  
  // 다른 미디어 숨김
  if (document.getElementById('bottomImage')) {
    document.getElementById('bottomImage').style.display = 'none';
  }
  
  // 항상 화면 밖 아래에서 시작하도록 설정 (중요)
  bottomImageContainer.style.bottom = '-150vh';
  bottomImageContainer.style.transition = 'none';
  bottomImageContainer.style.display = 'block';
  
  // 강제로 리플로우 발생시켜 위치 설정이 즉시 적용되도록 함
  void bottomImageContainer.offsetWidth;
  
  bottomVideo.style.display = 'block';
  bottomVideo.style.opacity = '0'; // 시작 투명도 초기화
  // 새 비디오를 로드하기 전에 음소거 상태와 오디오 종료 플래그를 명확하게 재설정
  bottomVideo.muted = false; // 명시적으로 음소거 해제
  isBottomAudioEnded = false; // 오디오 종료 플래그 초기화
  bottomVideo.src = `images/bottom/${index}.mp4`;
  
  bottomVideo.onloadeddata = function() {
    console.log(`하단 비디오 ${index}.mp4 로드 완료 - 애니메이션 시작, 현재 위치: ${bottomImageContainer.style.bottom}`);
    
    // 컨테이너 위치 다시 한번 확인
    if (parseInt(bottomImageContainer.style.bottom || '-150') > -100) {
      // 아직도 위에 있다면 강제로 아래로 이동
      bottomImageContainer.style.bottom = '-150vh';
      void bottomImageContainer.offsetWidth; // 강제 리플로우
    }
    
    // DOM이 업데이트될 시간을 주기 위해 약간 지연
    setTimeout(() => {
      // 아래에서 올라오는 애니메이션 시작 (반드시 아래에서 시작)
      slideUp(bottomImageContainer, bottomVideo, () => {
        if (isBottomMediaPlaying) {
          bottomVideo.play().catch(e => console.error("Video play failed", e));
        }
      });
    }, 50);
  };

  bottomVideo.onerror = function() {
    console.log(`하단 동영상 ${index}.mp4를 찾을 수 없습니다.`);
    bottomImageContainer.style.display = 'none';
  };
  
  // 비디오가 이미 다음 미디어로 넘어갔는지 확인하기 위한 플래그
  let hasMovedToNextMedia = false;
  
  bottomVideo.onended = function() {
    // 비디오가 끝날 때 오디오도 끝났음을 표시
    isBottomAudioEnded = true;
    console.log('하단 비디오 오디오 재생 완료');
    
    // 이미 다음 미디어로 넘어갔는지 확인하고, 넘어가지 않았을 때만 실행
    if (isBottomMediaPlaying && !hasMovedToNextMedia) {
      hasMovedToNextMedia = true;
      console.log(`비디오 ${index}.mp4 종료 - 다음 미디어로 넘어감`);
      moveToNextMedia();
    }
  };
  
  // 오디오만 종료되었을 때 플래그 설정
  bottomVideo.addEventListener('timeupdate', function() {
    // 오디오 트랙이 있고 재생 중이면서 현재 시간이 오디오 끝에 도달했는지 확인
    if (bottomVideo.duration > 0 && !bottomVideo.paused) {
      const audioTrackEnded = bottomVideo.currentTime >= bottomVideo.duration - 0.5; // 0.5초 여유
      if (audioTrackEnded && !isBottomAudioEnded) {
        isBottomAudioEnded = true;
        console.log('하단 비디오 오디오 트랙 종료 감지');
        
        // 오디오 트랙 종료 시 다음 미디어로 넘어가지 않음
        // onended 이벤트에서만 처리하도록 수정
      }
    }
  });
}

// 모든 하단 미디어 요소 초기화
function resetBottomMediaElements() {
  const bottomImage = document.getElementById('bottomImage');
  const bottomVideo = document.getElementById('bottomVideo');
  const bottomImageContainer = document.getElementById('bottomImageContainer');
  
  // 첫 폭발 상태 초기화
  firstExplosionOccurred = false;
  
  // 현재 인덱스 초기화
  currentBottomMediaIndex = 0;
  
  if (bottomImage) {
    bottomImage.classList.remove('show');
    bottomImage.src = '';
  }
  
  if (bottomVideo) {
    bottomVideo.style.opacity = '0';
    bottomVideo.pause();
    bottomVideo.src = '';
  }
  
  // 타이머 정리
  if (bottomMediaTimer) {
    clearTimeout(bottomMediaTimer);
    bottomMediaTimer = null;
  }
  
  // 컨테이너 위치 초기화 (화면 밖으로)
  if (bottomImageContainer) {
    // 이전 타이머 정리
    if (window.bottomHideTimer) {
      clearTimeout(window.bottomHideTimer);
    }
    
    // 컨테이너 초기화하고 표시 상태로 준비
    bottomImageContainer.style.bottom = '-150vh'; // 화면 밖 위치로 초기화
    bottomImageContainer.style.display = 'none'; // 완전 숨김 상태로 변경
  }
  
  // 재생 상태 확인 - 게임 상태와 반대로 설정
  const pauseBtn = document.getElementById('pauseBtn');
  const isGamePaused = pauseBtn && pauseBtn.textContent === 'RESUME';
  isBottomMediaPlaying = !isGamePaused;
}
