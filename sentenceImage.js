// 중요: 문장 위치 설정 (절대 수정하지 마세요)
const SENTENCE_CONTAINER_TOP_POSITION = '43px';

// 미디어 트랜지션 시간 설정 (밀리초)
const MEDIA_TRANSITION_IN_TIME = 3000;  // 나타나는 시간: 3초
const MEDIA_TRANSITION_OUT_TIME = 3000; // 사라지는 시간: 3초

// 현재 표시되고 있는 미디어의 번호 추적
window.currentMediaNumber = null;
// 미디어 처리 중 상태 추적
window.isMediaProcessing = false;

// 문장 이미지 관련 함수
function showSentenceImage(sentenceIndex) {
  const realSentenceNumber = sentenceIndex + 1; // 1부터 시작하는 실제 문장 번호
  console.log(`문장 폭발 감지: ${realSentenceNumber}번 문장`);
  
  // 첫번째 폭발인지 확인 (window.firstExplosionHappened 플래그 사용)
  if (typeof window.firstExplosionHappened === 'undefined') {
    window.firstExplosionHappened = false;
  }
  
  // 이전 숨기기 타이머 취소
  if (window.hideSentenceImageTimer) {
    clearTimeout(window.hideSentenceImageTimer);
    window.hideSentenceImageTimer = null;
  }

  // 홀수/짝수 문장 처리
  let mediaNumber;
  
  if (sentenceIndex % 2 === 0) { // 홀수 문장 (0부터 시작하는 인덱스에서는 짝수가 실제로는 홀수)
    mediaNumber = realSentenceNumber;
    console.log(`홀수 문장 폭발 - 미디어 변경: ${mediaNumber}번 미디어`);
  } else {
    // 짝수 문장인 경우 이전 홀수 문장의 미디어를 표시
    mediaNumber = realSentenceNumber - 1;
    console.log(`짝수 문장 폭발 - 해당 미디어 ${mediaNumber}번 표시`);
  }
  
  // 미디어 처리 중 플래그 설정
  window.isMediaProcessing = true;
  
  if (!window.firstExplosionHappened) {
    // 첫번째 폭발의 경우 바로 미디어 표시
    window.firstExplosionHappened = true;
    console.log(`첫번째 폭발: ${mediaNumber}번 미디어 직접 표시`);
    
    showNewSentenceMedia(mediaNumber);
    window.currentMediaNumber = mediaNumber;
    
    // 미디어 처리 완료
    setTimeout(() => {
      window.isMediaProcessing = false;
      console.log(`${mediaNumber}번 미디어 표시 완료 (최초 표시)`);
    }, MEDIA_TRANSITION_IN_TIME + 100);
  } else {
    // 이후 문장에서는 이전 미디어 페이드아웃 후 새 미디어 표시
    
    // 이전 미디어와 같은 번호면 그대로 유지
    if (window.currentMediaNumber === mediaNumber) {
      console.log(`동일한 미디어(${mediaNumber}번) 유지`);
      window.isMediaProcessing = false;
      return;
    }
    
    console.log(`문장 폭발(${realSentenceNumber}번): 이전 미디어 페이드아웃 후 새 미디어(${mediaNumber}번) 표시`);
    
    // 이전 미디어 페이드아웃 (3초 동안)
    fadeOutCurrentMedia(() => {
      console.log(`이전 미디어(${window.currentMediaNumber}번) 페이드아웃 완료`);
      
      // 페이드아웃 완료 후 콘텐츠 초기화
      resetMediaElements();
      
      // 새 미디어 표시 (페이드인 3초)
      console.log(`새 미디어(${mediaNumber}번) 페이드인 시작`);
      showNewSentenceMedia(mediaNumber);
      
      // 미디어 번호 업데이트
      window.currentMediaNumber = mediaNumber;
      
      // 미디어 처리 완료 - 페이드인 완료 후
      setTimeout(() => {
        window.isMediaProcessing = false;
        console.log(`${mediaNumber}번 미디어 표시 완료`);
      }, MEDIA_TRANSITION_IN_TIME + 100);
    });
  }
}

// 현재 표시 중인 미디어를 페이드아웃하는 함수
function fadeOutCurrentMedia(callback) {
  const sentenceImageContainer = document.getElementById('sentenceImageContainer');
  const sentenceImage = document.getElementById('sentenceImage');
  const sentenceVideo = document.getElementById('sentenceVideo');
  
  console.log(`미디어 페이드아웃 시작 - 소요 시간: ${MEDIA_TRANSITION_OUT_TIME/1000}초`);
  
  // 페이드아웃 효과 적용
  if (sentenceImage && sentenceImage.style.display !== 'none') {
    sentenceImage.style.transition = `opacity ${MEDIA_TRANSITION_OUT_TIME/1000}s ease-out`;
    sentenceImage.style.opacity = '0';
    console.log('이미지 페이드아웃 시작');
  }
  
  if (sentenceVideo && sentenceVideo.style.display !== 'none') {
    sentenceVideo.style.transition = `opacity ${MEDIA_TRANSITION_OUT_TIME/1000}s ease-out, transform ${MEDIA_TRANSITION_OUT_TIME/1000}s ease-out`;
    sentenceVideo.style.opacity = '0';
    sentenceVideo.style.transform = 'scale(0.8)';
    
    // 비디오 재생 중지
    sentenceVideo.pause();
    console.log('비디오 페이드아웃 시작 및 재생 중지');
  }
  
  // 페이드아웃이 완료된 후 콜백 실행 (정확히 3초 후)
  setTimeout(() => {
    console.log('미디어 페이드아웃 완료');
    if (typeof callback === 'function') {
      callback();
    }
  }, MEDIA_TRANSITION_OUT_TIME);
}

function showNewSentenceMedia(realSentenceNumber) {
  // 미디어 표시 직전에 숨김 예약 타이머가 있으면 반드시 취소
  if (window.hideSentenceImageTimer) {
    clearTimeout(window.hideSentenceImageTimer);
    window.hideSentenceImageTimer = null;
  }
  const sentenceImageContainer = document.getElementById('sentenceImageContainer');
  const sentenceImage = document.getElementById('sentenceImage');
  
  if (!sentenceImageContainer) return;
  
  console.log(`상단 미디어 표시 시도: ${realSentenceNumber}`);
  
  // 이미지와 동영상 요소를 모두 초기화
  resetMediaElements();

  // top 폴더 내 MP4 파일 확인 (요구사항: top 폴더 내 미디어만 사용)
  checkFileExists(`images/top/${realSentenceNumber}.mp4`)
    .then(existsInTop => {
      if (existsInTop) {
        // top 폴더에 MP4 파일이 존재하면 비디오 요소 사용
        console.log(`top 폴더에서 동영상 찾음: ${realSentenceNumber}.mp4`);
        showVideoContent(realSentenceNumber, 'top');
      } else {
        // top 폴더에서 이미지 파일(jpg) 확인
        checkFileExists(`images/top/${realSentenceNumber}.jpg`)
          .then(imageExistsInTop => {
            if (imageExistsInTop) {
              // top 폴더에 JPG 파일이 존재하면 이미지 요소 사용
              console.log(`top 폴더에서 이미지 찾음: ${realSentenceNumber}.jpg`);
              showImageContent(realSentenceNumber, 'top');
            } else {
              // top 폴더에 미디어 파일이 없는 경우
              console.log(`top 폴더에서 미디어 파일을 찾을 수 없습니다: ${realSentenceNumber}`);
              sentenceImageContainer.style.display = 'none';
            }
          });
      }
    });
}

// 파일 존재 여부 확인 (Head 요청으로 확인)
function checkFileExists(url) {
  return fetch(url, { method: 'HEAD' })
    .then(response => response.ok)
    .catch(() => false);
}

// 이미지 콘텐츠 표시
function showImageContent(realSentenceNumber, folder = '') {
  const sentenceImageContainer = document.getElementById('sentenceImageContainer');
  const sentenceImage = document.getElementById('sentenceImage');
  
  if (!sentenceImage || !sentenceImageContainer) return;
  
  // 비디오 숨기고 이미지 표시
  if (document.getElementById('sentenceVideo')) {
    document.getElementById('sentenceVideo').style.display = 'none';
  }
  sentenceImage.style.display = 'block';
  
  // 기존 스타일 초기화 및 애니메이션 준비
  sentenceImage.classList.remove('show');
  sentenceImage.style.opacity = '0';
  sentenceImage.style.transition = `opacity ${MEDIA_TRANSITION_IN_TIME/1000}s ease-in`;
  
  // 이미지 경로 설정 (폴더 경로 포함)
  let imagePath = '';
  if (folder) {
    imagePath = `images/${folder}/${realSentenceNumber}.jpg`;
  } else {
    imagePath = `images/${realSentenceNumber}.jpg`;
  }
  
  console.log(`상단 이미지 로딩 중: ${imagePath}`);
  sentenceImage.src = imagePath;
  
  // 이미지 로드 이벤트
  sentenceImage.onload = function() {
    console.log(`상단 이미지 로드 완료: ${imagePath}`);
    // 추가적인 스타일 적용으로 테두리 제거
    sentenceImage.style.border = 'none';
    sentenceImage.style.outline = 'none';
    sentenceImageContainer.style.display = 'block';
    
    // 이미지 페이드인 시작 (DOM 변경을 인식할 시간 제공)
    setTimeout(() => {
      // 정확히 3초에 걸쳐 페이드인
      console.log(`${realSentenceNumber}번 이미지 페이드인 시작 - 소요 시간: ${MEDIA_TRANSITION_IN_TIME/1000}초`);
      sentenceImage.style.opacity = '1';
      
      // 애니메이션 완료 후 클래스 추가 (CSS 효과 적용을 위해)
      setTimeout(() => {
        sentenceImage.classList.add('show');
        console.log(`${realSentenceNumber}번 이미지 페이드인 완료`);
      }, MEDIA_TRANSITION_IN_TIME);
      
      // 미디어는 다음 홀수 문장 폭발 시까지 계속 표시됨
    }, 50);
  };
  
  sentenceImage.onerror = function() {
    // 이미지가 없으면 컨테이너를 숨김
    console.log(`상단 이미지 로드 실패: ${imagePath}`);
    sentenceImageContainer.style.display = 'none';
  };
}

// 동영상 콘텐츠 표시
function showVideoContent(realSentenceNumber, folder = '') {
  const sentenceImageContainer = document.getElementById('sentenceImageContainer');
  let sentenceVideo = document.getElementById('sentenceVideo');
  
  console.log(`상단 동영상 표시 함수 호출: ${realSentenceNumber}, 폴더: ${folder}`);
  
  // 비디오 요소가 없으면 생성
  if (!sentenceVideo) {
    console.log('상단 동영상 요소 생성');
    sentenceVideo = document.createElement('video');
    sentenceVideo.id = 'sentenceVideo';
    sentenceVideo.className = 'no-border-at-all video-touchable custom-video-controls';
    sentenceVideo.controls = true; // 컨트롤러 표시
    sentenceVideo.autoplay = false; // 자동 재생 비활성화
    sentenceVideo.muted = false; // 소리 활성화
    sentenceVideo.playsInline = true; // 인라인 재생 (전체화면 방지)
    sentenceVideo.setAttribute('playsinline', 'true'); // 표준 속성
    sentenceVideo.setAttribute('webkit-playsinline', 'true'); // iOS Safari 호환성
    sentenceVideo.setAttribute('x-webkit-airplay', 'allow'); // AirPlay 허용
    sentenceVideo.setAttribute('data-tap-disabled', 'false'); // 탭 활성화
    
    // 점 3개 메뉴 강제 제거를 위한 추가 속성
    sentenceVideo.controlsList = "nodownload noremoteplayback nofullscreen noplaybackrate";
    sentenceVideo.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen noplaybackrate');
    sentenceVideo.style.setProperty('--media-controls-opacity', '0', 'important');
    
    sentenceVideo.disablePictureInPicture = true; // PiP 모드 비활성화
    sentenceVideo.preload = "auto"; // 데이터 미리 로드
    
    // 터치 이벤트 최적화 (모바일)
    sentenceVideo.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
    sentenceVideo.style.webkitTouchCallout = 'none';
    sentenceVideo.style.maxWidth = '100.24vw';
    sentenceVideo.style.maxHeight = '50.13vh';
    sentenceVideo.style.objectFit = 'cover';
    sentenceVideo.style.objectPosition = 'center -45px'; // 상단 45px 크롭하여 메뉴 아이콘이 가려지지 않도록 함
    
    // 컨트롤 설정 - 플레이 버튼을 시계 자리에 표시
    sentenceVideo.setAttribute('disableRemotePlayback', ''); // 원격 재생 버튼 비활성화
    
    // 비디오가 로드된 후 컨트롤 위치 조정을 위한 이벤트
    sentenceVideo.addEventListener('loadedmetadata', function() {
      // 비디오 컨트롤이 로드된 후 약간의 지연을 두고 스타일 적용
      setTimeout(() => {
        // 플레이 버튼 위치 조정 시도
        try {
          const mediaControlsPlayButton = sentenceVideo.querySelector('::-webkit-media-controls-play-button');
          if (mediaControlsPlayButton) {
            mediaControlsPlayButton.style.transform = 'translateY(3px)';
          }
        } catch (e) {
          console.log('플레이 버튼 위치 조정 실패:', e);
        }
      }, 300);
    });
    // controlslist 속성 설정 (다운로드 버튼 제거, 플레이 버튼 유지)
    sentenceVideo.setAttribute('controlslist', 'nodownload'); // 다운로드 버튼 제거
    // 중앙 플레이 버튼은 필요하므로 제거하지 않음
    sentenceVideo.style.border = '0 none transparent';
    sentenceVideo.style.outline = '0 none transparent';
    sentenceVideo.style.borderRadius = '0';
    sentenceVideo.style.boxShadow = 'none';
    sentenceVideo.style.backgroundColor = 'transparent';
    sentenceVideo.style.transform = 'scale(0)';
    sentenceVideo.style.opacity = '0';
    sentenceVideo.style.transition = `opacity ${MEDIA_TRANSITION_IN_TIME/1000}s ease-in, transform ${MEDIA_TRANSITION_IN_TIME/1000}s ease-in`;
    sentenceImageContainer.appendChild(sentenceVideo);
  }
  
  // 이미지 숨기고 비디오 표시
  if (document.getElementById('sentenceImage')) {
    document.getElementById('sentenceImage').style.display = 'none';
  }
  sentenceVideo.style.display = 'block';
  
  // 비디오 소스 설정 (폴더 경로 포함)
  let videoPath = '';
  if (folder) {
    videoPath = `images/${folder}/${realSentenceNumber}.mp4`;
  } else {
    videoPath = `images/${realSentenceNumber}.mp4`;
  }
  
  // 컨테이너 표시 확실히 하기
  sentenceImageContainer.style.display = 'block';
  
  console.log(`상단 동영상 로딩 중: ${videoPath}`);
  sentenceVideo.src = videoPath;
  sentenceVideo.autoplay = false; // 자동 재생 비활성화
  sentenceVideo.muted = false; // 음소거 해제 (자동재생 방지)
  
  // 모든 이벤트 리스너 제거 및 다시 설정
  sentenceVideo.removeEventListener('click', window.videoClickHandler);
  sentenceVideo.removeEventListener('touchstart', window.videoTouchHandler);
  
  // 전역 스코프에 핸들러 저장하여 나중에 제거 가능하게 함
  window.videoClickHandler = function(event) {
    // 이벤트 버블링 및 기본 동작 중지
    event.stopPropagation();
    event.preventDefault();
    
    console.log('비디오 클릭 이벤트 발생');
    toggleVideoPlayback(sentenceVideo);
  };
  
  window.videoTouchHandler = function(event) {
    // 모바일에서 터치 이벤트 최적화
    event.stopPropagation();
    event.preventDefault();
    
    console.log('비디오 터치 이벤트 발생');
    toggleVideoPlayback(sentenceVideo);
    
    // 300ms 이내에 다시 터치되지 않도록 이벤트 비활성화 후 재활성화
    sentenceVideo.removeEventListener('touchstart', window.videoTouchHandler);
    setTimeout(() => {
      sentenceVideo.addEventListener('touchstart', window.videoTouchHandler);
    }, 300);
  };
  
  // 재생/일시정지 토글 함수
  function toggleVideoPlayback(video) {
    if (video.paused) {
      // 여러 방법으로 재생 시도
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('비디오 재생 성공');
        }).catch(error => {
          console.log('재생 시도 실패:', error);
          
          // 첫 번째 재시도
          setTimeout(() => {
            console.log('재생 재시도 1');
            video.muted = true; // 음소거 상태에서 시도
            video.play().then(() => {
              console.log('음소거 재생 성공');
              video.muted = false; // 음소거 해제
            }).catch(e => {
              console.log('음소거 재생 실패:', e);
              
              // 두 번째 재시도
              setTimeout(() => {
                console.log('재생 재시도 2');
                video.play().catch(e2 => console.log('최종 재시도 실패:', e2));
              }, 200);
            });
          }, 100);
        });
      }
    } else {
      video.pause();
      console.log('비디오 일시정지');
    }
  }
  
  // 다양한 방식의 이벤트 리스너 등록
  sentenceVideo.addEventListener('click', window.videoClickHandler, {passive: false});
  sentenceVideo.addEventListener('touchstart', window.videoTouchHandler, {passive: false});
  
  // 컨트롤러 요소 전용 이벤트 처리 (중첩 이벤트 처리 확실히)
  setTimeout(() => {
    try {
      const mediaControls = sentenceVideo.querySelector('::-webkit-media-controls-play-button');
      if (mediaControls) {
        mediaControls.addEventListener('click', function(e) {
          console.log('미디어 컨트롤 클릭');
          e.stopPropagation();
        }, {passive: false});
      }
    } catch (e) {
      console.log('미디어 컨트롤 접근 실패:', e);
    }
  }, 500);
  
  // 플레이어 상태 변화 감지
  sentenceVideo.addEventListener('play', function() {
    console.log('비디오 재생 시작됨');
  });
  
  sentenceVideo.addEventListener('pause', function() {
    console.log('비디오 일시정지됨');
  });
  
  // 비디오 로드 이벤트
  sentenceVideo.onloadeddata = function() {
    console.log(`상단 비디오 로드 완료: ${videoPath}`);
    // 컨테이너 표시
    sentenceImageContainer.style.display = 'block';
    
    // 약간의 지연 후 페이드인 애니메이션 시작 (자동 재생 없음)
    setTimeout(() => {
      console.log(`${realSentenceNumber}번 비디오 페이드인 시작 - 소요 시간: ${MEDIA_TRANSITION_IN_TIME/1000}초`);
      
      // 정확히 3초에 걸쳐 페이드인 애니메이션 수행
      sentenceVideo.style.transform = 'scale(1)';
      sentenceVideo.style.opacity = '1';
      
      // 자동 재생하지 않음 - 사용자가 직접 플레이 버튼을 클릭해야 함
      
      // 페이드인 완료 이벤트 (로깅용)
      setTimeout(() => {
        console.log(`${realSentenceNumber}번 비디오 페이드인 완료`);
      }, MEDIA_TRANSITION_IN_TIME);
    }, 50);
  };
  
  sentenceVideo.onerror = function() {
    console.log(`동영상 ${realSentenceNumber}.mp4를 찾을 수 없습니다.`);
    sentenceImageContainer.style.display = 'none';
  };
}

// 모든 미디어 요소 초기화
function resetMediaElements() {
  const sentenceImage = document.getElementById('sentenceImage');
  const sentenceVideo = document.getElementById('sentenceVideo');
  
  if (sentenceImage) {
    sentenceImage.classList.remove('show');
    sentenceImage.src = '';
  }
  
  if (sentenceVideo) {
    sentenceVideo.style.transform = 'scale(0)';
    sentenceVideo.style.opacity = '0';
    sentenceVideo.pause();
    sentenceVideo.src = '';
  }
}

function hideSentenceImage(hideContainer = true) {
  const sentenceImageContainer = document.getElementById('sentenceImageContainer');
  const sentenceImage = document.getElementById('sentenceImage');
  const sentenceVideo = document.getElementById('sentenceVideo');
  
  if (sentenceImageContainer) {
    // 페이드아웃 트랜지션 설정
    if (sentenceImage) {
      sentenceImage.classList.remove('show');
      sentenceImage.style.transition = `opacity ${MEDIA_TRANSITION_OUT_TIME/1000}s ease-out`;
      sentenceImage.style.opacity = '0';
    }
    
    // 비디오 페이드아웃 효과 적용 (3초)
    if (sentenceVideo) {
      sentenceVideo.style.transition = `opacity ${MEDIA_TRANSITION_OUT_TIME/1000}s ease-out, transform ${MEDIA_TRANSITION_OUT_TIME/1000}s ease-out`;
      sentenceVideo.style.transform = 'scale(0)';
      sentenceVideo.style.opacity = '0';
      sentenceVideo.pause();
    }
    
    // 애니메이션 완료 후 컨테이너 숨기기
    if (window.hideSentenceImageTimer) {
      clearTimeout(window.hideSentenceImageTimer);
      window.hideSentenceImageTimer = null;
    }
    
    // 페이드아웃 시간(3초) 후 컨테이너 처리
    window.hideSentenceImageTimer = setTimeout(() => {
      if (hideContainer) {
        // 컨테이너를 숨기는 경우
        sentenceImageContainer.style.display = 'none';
      } else {
        // 컨테이너는 유지하고 내용만 초기화
        resetMediaElements();
      }
      window.hideSentenceImageTimer = null;
      
      // 현재 미디어 번호 초기화 (다음 미디어 표시 준비)
      if (hideContainer) {
        window.currentMediaNumber = null;
      }
      
      console.log('미디어 페이드아웃 완료');
    }, MEDIA_TRANSITION_OUT_TIME);
  }
}

// 문장 위치 조정 함수
function adjustSentencePosition() {
  const sentenceImageContainer = document.getElementById('sentenceImageContainer');
  if (sentenceImageContainer) {
    // 최상위 우선순위로 위치 설정
    sentenceImageContainer.style.setProperty('top', SENTENCE_CONTAINER_TOP_POSITION, 'important');
    console.log(`문장 컨테이너 위치 강제 설정: ${SENTENCE_CONTAINER_TOP_POSITION}`);
  }
}

// 이미지/동영상 초기화
document.addEventListener('DOMContentLoaded', function() {
  hideSentenceImage();
  
  // 즉시 위치 설정
  adjustSentencePosition();
  
  // 0.5초마다 위치 재설정 (5초 동안)
  let count = 0;
  const intervalId = setInterval(() => {
    adjustSentencePosition();
    count++;
    if (count >= 10) clearInterval(intervalId);
  }, 500);
});
