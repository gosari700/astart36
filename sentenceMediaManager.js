/**
 * 문장 미디어 관리자 모듈
 * 
 * 이 모듈은 홀수/짝수 문장을 구분하여 미디어 표시/숨김을 관리합니다.
 * 
 * 주요 기능:
 * 1. 홀수 문장(1,3,5...) 폭발 시에만 미디어가 페이드인으로 나타남 (2초 트랜지션)
 * 2. 다음 홀수 문장 폭발 시에만 이전 미디어가 페이드아웃(2초)으로 사라지고 새 미디어가 표시됨
 * 3. 짝수 문장(2,4,6...) 폭발 시에는 미디어가 변경되지 않고 유지됨
 * 4. 오직 images/top/ 폴더 내 미디어만 사용함
 * 
 * script.js와의 연동:
 * - window.showSentenceImage 함수를 통해 script.js에서 호출됨
 */

// 미디어 트랜지션 시간 설정 (밀리초)
const MEDIA_TRANSITION_IN_TIME = 2000;  // 나타나는 시간: 2초
const MEDIA_TRANSITION_OUT_TIME = 2000; // 사라지는 시간: 2초

// 모듈 네임스페이스 생성
const SentenceMediaManager = {
  // 상태 관리 변수
  currentMediaNumber: null,
  isMediaProcessing: false,
  firstExplosionHappened: false,
  hideSentenceImageTimer: null,
  
  // 홀수 문장 ID 배열 (1, 3, 5, 7, ...)
  oddSentenceIds: [],
  
  // 짝수 문장 ID 배열 (2, 4, 6, 8, ...)
  evenSentenceIds: [],
  
  /**
   * 모듈 초기화
   */
  init: function() {
    console.log('SentenceMediaManager 모듈 초기화');
    
    // 1부터 96까지 홀수/짝수 ID 배열 생성
    for (let i = 1; i <= 96; i++) {
      if (i % 2 === 1) {
        this.oddSentenceIds.push(i);
      } else {
        this.evenSentenceIds.push(i);
      }
    }
    
    console.log(`홀수 문장 ID (${this.oddSentenceIds.length}개):`, this.oddSentenceIds);
    console.log(`짝수 문장 ID (${this.evenSentenceIds.length}개):`, this.evenSentenceIds);
  },
  
  /**
   * 문장 폭발 시 호출되는 함수
   * @param {number} sentenceIndex - 0부터 시작하는 문장 인덱스
   */
  handleSentenceExplosion: function(sentenceIndex) {
    const realSentenceNumber = sentenceIndex + 1; // 1부터 시작하는 실제 문장 번호
    console.log(`문장 폭발 감지: ${realSentenceNumber}번 문장`);
    
    // 홀수/짝수 문장 확인
    const isOddSentence = realSentenceNumber % 2 === 1;
    
    if (isOddSentence) {
      // 홀수 문장인 경우
      console.log(`홀수 문장 폭발(${realSentenceNumber}번) - 미디어 변경 처리`);
      // 홀수 문장에 대응하는 짝수 문장도 함께 표시 (홀수+1 = 짝수)
      const correspondingEvenSentence = realSentenceNumber + 1;
      if (correspondingEvenSentence <= 96) {  // 96번이 마지막 문장인 경우 체크
        console.log(`홀수 문장 폭발에 대응하는 짝수 문장(${correspondingEvenSentence}번)도 함께 표시`);
      }
      this.handleSentenceMediaChange(realSentenceNumber);
    } else {
      // 짝수 문장인 경우 - 짝수 문장에 해당하는 미디어도 표시
      const correspondingOddSentence = realSentenceNumber - 1;
      console.log(`짝수 문장 폭발(${realSentenceNumber}번) - 해당 미디어 ${correspondingOddSentence}번 표시`);
      this.handleSentenceMediaChange(correspondingOddSentence);
    }
  },
  
  /**
   * 문장 폭발 시 미디어 변경 처리 
   * @param {number} sentenceNumber - 실제 문장 번호 (1부터 시작)
   */
  handleSentenceMediaChange: function(sentenceNumber) {
    // 모든 타이머 취소 (중요: 미디어가 나오자마자 사라지는 문제 방지)
    if (this.hideSentenceImageTimer) {
      console.log(`이전 타이머 취소 (hideSentenceImageTimer)`);
      clearTimeout(this.hideSentenceImageTimer);
      this.hideSentenceImageTimer = null;
    }
    
    // 미디어 처리 중일 경우 대기 (중복 처리 방지)
    if (this.isMediaProcessing) {
      console.log(`미디어 처리 중... 잠시 후 다시 시도`);
      setTimeout(() => {
        console.log(`재시도: ${sentenceNumber}번 문장 미디어 표시`);
        this.handleSentenceMediaChange(sentenceNumber);
      }, 500);
      return;
    }
    
    // 미디어 처리 상태 설정
    this.isMediaProcessing = true;
    console.log(`미디어 처리 시작 (isMediaProcessing = true)`);
    
    if (!this.firstExplosionHappened) {
      // 첫 번째 홀수 문장 폭발 (1번)
      this.firstExplosionHappened = true;
      console.log(`첫번째 홀수 문장 폭발(${sentenceNumber}번): 미디어 표시`);
      
      // 새 미디어 표시
      this.showNewSentenceMedia(sentenceNumber);
      this.currentMediaNumber = sentenceNumber;
      
      // 미디어 처리 완료
      setTimeout(() => {
        this.isMediaProcessing = false;
        console.log(`${sentenceNumber}번 미디어 표시 완료 (최초 표시) - isMediaProcessing = false`);
      }, MEDIA_TRANSITION_IN_TIME + 100);
    } else {
      // 이후 홀수 문장 폭발 (3번, 5번, 7번, ...)
      console.log(`홀수 문장 폭발(${sentenceNumber}번): 이전 미디어 페이드아웃 후 새 미디어 표시`);
      
      // 이전 미디어가 있으면 페이드아웃
      if (this.currentMediaNumber !== null) {
        // 이전 미디어와 새 미디어가 동일한 경우 처리
        if (this.currentMediaNumber === sentenceNumber) {
          console.log(`같은 미디어(${sentenceNumber}번)가 이미 표시 중 - 미디어 유지`);
          this.isMediaProcessing = false;
          return;
        }
        
        console.log(`이전 미디어(${this.currentMediaNumber}번) 페이드아웃 시작`);
        
        // 이전 미디어 페이드아웃
        this.fadeOutCurrentMedia(() => {
          console.log(`이전 미디어(${this.currentMediaNumber}번) 페이드아웃 완료`);
          
          // 페이드아웃 완료 후 콘텐츠 초기화
          this.resetMediaElements();
          
          // 새 미디어 표시
          console.log(`새 미디어(${sentenceNumber}번) 페이드인 시작`);
          this.showNewSentenceMedia(sentenceNumber);
          
          // 미디어 번호 업데이트
          this.currentMediaNumber = sentenceNumber;
          
          // 미디어 처리 완료
          setTimeout(() => {
            this.isMediaProcessing = false;
            console.log(`${sentenceNumber}번 미디어 표시 완료 - isMediaProcessing = false`);
          }, MEDIA_TRANSITION_IN_TIME + 100);
        });
      } else {
        // 이전 미디어가 없으면 바로 새 미디어 표시
        console.log(`새 미디어(${sentenceNumber}번) 직접 표시 (이전 미디어 없음)`);
        this.showNewSentenceMedia(sentenceNumber);
        this.currentMediaNumber = sentenceNumber;
        
        // 미디어 처리 완료
        setTimeout(() => {
          this.isMediaProcessing = false;
          console.log(`${sentenceNumber}번 미디어 표시 완료 (직접 표시) - isMediaProcessing = false`);
        }, MEDIA_TRANSITION_IN_TIME + 100);
      }
    }
  },
  
  /**
   * 새 미디어 표시 (top 폴더 내 파일만 사용)
   * @param {number} sentenceNumber - 문장 번호
   */
  showNewSentenceMedia: function(sentenceNumber) {
    // 타이머 취소
    if (this.hideSentenceImageTimer) {
      clearTimeout(this.hideSentenceImageTimer);
      this.hideSentenceImageTimer = null;
    }
    
    const sentenceImageContainer = document.getElementById('sentenceImageContainer');
    if (!sentenceImageContainer) return;
    
    console.log(`상단 미디어 표시 시도: ${sentenceNumber}번`);
    
    // 미디어 요소 초기화
    this.resetMediaElements();
    
    // top 폴더 내 파일만 사용
    this.checkFileExists(`images/top/${sentenceNumber}.mp4`)
      .then(videoExists => {
        if (videoExists) {
          // 동영상 파일이 있는 경우
          console.log(`top 폴더에서 동영상 찾음: ${sentenceNumber}.mp4`);
          this.showVideoContent(sentenceNumber, 'top');
        } else {
          // 이미지 파일 확인
          this.checkFileExists(`images/top/${sentenceNumber}.jpg`)
            .then(imageExists => {
              if (imageExists) {
                // 이미지 파일이 있는 경우
                console.log(`top 폴더에서 이미지 찾음: ${sentenceNumber}.jpg`);
                this.showImageContent(sentenceNumber, 'top');
              } else {
                // 미디어 파일이 없는 경우
                console.log(`top 폴더에서 미디어 파일을 찾을 수 없음: ${sentenceNumber}`);
                sentenceImageContainer.style.display = 'none';
              }
            });
        }
      });
  },
  
  /**
   * 파일 존재 여부 확인
   * @param {string} url - 파일 URL
   * @returns {Promise<boolean>} 파일 존재 여부
   */
  checkFileExists: function(url) {
    return fetch(url, { method: 'HEAD' })
      .then(response => response.ok)
      .catch(() => false);
  },
  
  /**
   * 이미지 콘텐츠 표시
   * @param {number} sentenceNumber - 문장 번호
   * @param {string} folder - 폴더명 (예: 'top')
   */
  showImageContent: function(sentenceNumber, folder = '') {
    const sentenceImageContainer = document.getElementById('sentenceImageContainer');
    const sentenceImage = document.getElementById('sentenceImage');
    
    if (!sentenceImage || !sentenceImageContainer) return;
    
    // 비디오 숨기고 이미지 표시
    const sentenceVideo = document.getElementById('sentenceVideo');
    if (sentenceVideo) {
      sentenceVideo.style.display = 'none';
    }
    
    // 이미지 초기 설정 - 비디오와 동일한 페이드 인 효과 적용을 위해 transform 속성 추가
    sentenceImage.style.display = 'block';
    sentenceImage.classList.remove('show');
    sentenceImage.style.opacity = '0';
    sentenceImage.style.transform = 'scale(0.8)'; // 비디오와 동일하게 시작 크기를 작게 설정
    sentenceImage.style.transition = `opacity ${MEDIA_TRANSITION_IN_TIME/1000}s ease-in, transform ${MEDIA_TRANSITION_IN_TIME/1000}s ease-in`;
    
    // 이미지 경로 설정
    const imagePath = `images/${folder}/${sentenceNumber}.jpg`;
    console.log(`상단 이미지 로딩 중: ${imagePath}`);
    sentenceImage.src = imagePath;
    
    // 이미지 로드 이벤트
    sentenceImage.onload = () => {
      console.log(`상단 이미지 로드 완료: ${imagePath}`);
      
      // 이미지 컨테이너 스타일 설정
      sentenceImage.style.border = 'none';
      sentenceImage.style.outline = 'none';
      sentenceImageContainer.style.display = 'block';
      
      // 페이드인 시작 (2초)
      setTimeout(() => {
        console.log(`${sentenceNumber}번 이미지 페이드인 시작 - 소요 시간: ${MEDIA_TRANSITION_IN_TIME/1000}초`);
        sentenceImage.style.opacity = '1';
        sentenceImage.style.transform = 'scale(1)'; // 비디오와 동일하게 최종 크기로 확대
        
        // 페이드인 완료
        setTimeout(() => {
          sentenceImage.classList.add('show');
          console.log(`${sentenceNumber}번 이미지 페이드인 완료`);
        }, MEDIA_TRANSITION_IN_TIME);
      }, 50);
    };
    
    // 이미지 로드 실패 이벤트
    sentenceImage.onerror = () => {
      console.log(`상단 이미지 로드 실패: ${imagePath}`);
      sentenceImageContainer.style.display = 'none';
    };
  },
  
  /**
   * 비디오 콘텐츠 표시
   * @param {number} sentenceNumber - 문장 번호
   * @param {string} folder - 폴더명 (예: 'top')
   */
  showVideoContent: function(sentenceNumber, folder = '') {
    const sentenceImageContainer = document.getElementById('sentenceImageContainer');
    let sentenceVideo = document.getElementById('sentenceVideo');
    
    console.log(`상단 동영상 표시 함수 호출: ${sentenceNumber}번, 폴더: ${folder}`);
    
    // 비디오 요소 생성 또는 가져오기
    if (!sentenceVideo) {
      console.log('상단 동영상 요소 생성');
      sentenceVideo = document.createElement('video');
      sentenceVideo.id = 'sentenceVideo';
      sentenceVideo.className = 'no-border-at-all video-touchable custom-video-controls';
      sentenceVideo.controls = true;
      sentenceVideo.autoplay = false;
      sentenceVideo.muted = false;
      sentenceVideo.playsInline = true;
      sentenceVideo.setAttribute('playsinline', 'true');
      sentenceVideo.setAttribute('webkit-playsinline', 'true');
      sentenceVideo.setAttribute('x-webkit-airplay', 'allow');
      sentenceVideo.setAttribute('data-tap-disabled', 'false');
      
      // 점 3개 메뉴 강제 제거를 위한 추가 속성
      sentenceVideo.controlsList = "nodownload noremoteplayback nofullscreen noplaybackrate";
      sentenceVideo.setAttribute('controlsList', 'nodownload noremoteplayback nofullscreen noplaybackrate');
      sentenceVideo.style.setProperty('--media-controls-opacity', '0', 'important');
      
      sentenceVideo.disablePictureInPicture = true;
      sentenceVideo.preload = "auto";
      
      // 비디오 스타일 설정
      sentenceVideo.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
      sentenceVideo.style.webkitTouchCallout = 'none';
      sentenceVideo.style.maxWidth = '100.24vw';
      sentenceVideo.style.maxHeight = '50.13vh';
      sentenceVideo.style.objectFit = 'cover';
      sentenceVideo.style.objectPosition = 'center -45px';
      sentenceVideo.setAttribute('disableRemotePlayback', '');
      
      // 비디오 로드 이벤트
      sentenceVideo.addEventListener('loadedmetadata', function() {
        setTimeout(() => {
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
    const sentenceImage = document.getElementById('sentenceImage');
    if (sentenceImage) {
      sentenceImage.style.display = 'none';
    }
    sentenceVideo.style.display = 'block';
    
    // 비디오 소스 설정
    const videoPath = `images/${folder}/${sentenceNumber}.mp4`;
    sentenceImageContainer.style.display = 'block';
    
    console.log(`상단 동영상 로딩 중: ${videoPath}`);
    sentenceVideo.src = videoPath;
    sentenceVideo.autoplay = false;
    sentenceVideo.muted = false;
    
    // 비디오 클릭/터치 이벤트 핸들러
    this.setupVideoEventHandlers(sentenceVideo);
    
    // 비디오 로드 이벤트
    sentenceVideo.onloadeddata = () => {
      console.log(`상단 비디오 로드 완료: ${videoPath}`);
      sentenceImageContainer.style.display = 'block';
      
      // 페이드인 시작 (3초)
      setTimeout(() => {
        console.log(`${sentenceNumber}번 비디오 페이드인 시작 - 소요 시간: ${MEDIA_TRANSITION_IN_TIME/1000}초`);
        sentenceVideo.style.transform = 'scale(1)';
        sentenceVideo.style.opacity = '1';
        
        // 페이드인 완료
        setTimeout(() => {
          console.log(`${sentenceNumber}번 비디오 페이드인 완료`);
        }, MEDIA_TRANSITION_IN_TIME);
      }, 50);
    };
    
    // 비디오 로드 실패 이벤트
    sentenceVideo.onerror = () => {
      console.log(`상단 동영상 로드 실패: ${videoPath}`);
      sentenceImageContainer.style.display = 'none';
    };
  },
  
  /**
   * 비디오 이벤트 핸들러 설정
   * @param {HTMLVideoElement} video - 비디오 요소
   */
  setupVideoEventHandlers: function(video) {
    // 이전 이벤트 리스너 제거
    video.removeEventListener('click', window.videoClickHandler);
    video.removeEventListener('touchstart', window.videoTouchHandler);
    
    // 새 이벤트 핸들러 정의
    window.videoClickHandler = function(event) {
      event.stopPropagation();
      event.preventDefault();
      
      console.log('비디오 클릭 이벤트 발생');
      SentenceMediaManager.toggleVideoPlayback(video);
    };
    
    window.videoTouchHandler = function(event) {
      event.stopPropagation();
      event.preventDefault();
      
      console.log('비디오 터치 이벤트 발생');
      SentenceMediaManager.toggleVideoPlayback(video);
      
      // 중복 터치 방지
      video.removeEventListener('touchstart', window.videoTouchHandler);
      setTimeout(() => {
        video.addEventListener('touchstart', window.videoTouchHandler, {passive: false});
      }, 300);
    };
    
    // 이벤트 리스너 등록
    video.addEventListener('click', window.videoClickHandler, {passive: false});
    video.addEventListener('touchstart', window.videoTouchHandler, {passive: false});
    
    // 컨트롤러 요소 이벤트
    setTimeout(() => {
      try {
        const mediaControls = video.querySelector('::-webkit-media-controls-play-button');
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
    
    // 상태 변화 감지
    video.addEventListener('play', function() {
      console.log('비디오 재생 시작됨');
    });
    
    video.addEventListener('pause', function() {
      console.log('비디오 일시정지됨');
    });
  },
  
  /**
   * 비디오 재생/일시정지 토글
   * @param {HTMLVideoElement} video - 비디오 요소
   */
  toggleVideoPlayback: function(video) {
    if (video.paused) {
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('비디오 재생 성공');
        }).catch(error => {
          console.log('재생 시도 실패:', error);
          
          // 첫 번째 재시도
          setTimeout(() => {
            console.log('재생 재시도 1');
            video.muted = true;
            video.play().then(() => {
              console.log('음소거 재생 성공');
              video.muted = false;
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
  },
  
  /**
   * 현재 표시된 미디어 페이드아웃
   * @param {Function} callback - 페이드아웃 완료 후 콜백
   */
  fadeOutCurrentMedia: function(callback) {
    const sentenceImageContainer = document.getElementById('sentenceImageContainer');
    const sentenceImage = document.getElementById('sentenceImage');
    const sentenceVideo = document.getElementById('sentenceVideo');
    
    console.log(`미디어 페이드아웃 시작 - 소요 시간: ${MEDIA_TRANSITION_OUT_TIME/1000}초`);
    
    // 이미지 페이드아웃 - 비디오와 동일하게 transform 속성 추가
    if (sentenceImage && sentenceImage.style.display !== 'none') {
      sentenceImage.style.transition = `opacity ${MEDIA_TRANSITION_OUT_TIME/1000}s ease-out, transform ${MEDIA_TRANSITION_OUT_TIME/1000}s ease-out`;
      sentenceImage.style.opacity = '0';
      sentenceImage.style.transform = 'scale(0.8)'; // 비디오와 동일하게 작아지는 효과 추가
      console.log('이미지 페이드아웃 시작');
    }
    
    // 비디오 페이드아웃
    if (sentenceVideo && sentenceVideo.style.display !== 'none') {
      sentenceVideo.style.transition = `opacity ${MEDIA_TRANSITION_OUT_TIME/1000}s ease-out, transform ${MEDIA_TRANSITION_OUT_TIME/1000}s ease-out`;
      sentenceVideo.style.opacity = '0';
      sentenceVideo.style.transform = 'scale(0.8)';
      
      sentenceVideo.pause();
      console.log('비디오 페이드아웃 시작 및 재생 중지');
    }
    
    // 페이드아웃 완료 후 콜백 실행 (정확히 2초 후)
    this.hideSentenceImageTimer = setTimeout(() => {
      console.log('미디어 페이드아웃 완료');
      if (typeof callback === 'function') {
        callback();
      }
    }, MEDIA_TRANSITION_OUT_TIME);
  },
  
  /**
   * 미디어 요소 초기화
   */
  resetMediaElements: function() {
    const sentenceImage = document.getElementById('sentenceImage');
    const sentenceVideo = document.getElementById('sentenceVideo');
    
    // 이미지 초기화 - 비디오와 동일하게 transform 속성 설정
    if (sentenceImage) {
      sentenceImage.classList.remove('show');
      sentenceImage.style.transform = 'scale(0)';
      sentenceImage.style.opacity = '0';
      sentenceImage.src = '';
    }
    
    // 비디오 초기화
    if (sentenceVideo) {
      sentenceVideo.style.transform = 'scale(0)';
      sentenceVideo.style.opacity = '0';
      sentenceVideo.pause();
      sentenceVideo.src = '';
    }
  },
  
  /**
   * 모든 미디어 숨기기
   */
  hideAllMedia: function() {
    this.resetMediaElements();
    
    const sentenceImageContainer = document.getElementById('sentenceImageContainer');
    if (sentenceImageContainer) {
      sentenceImageContainer.style.display = 'none';
    }
    
    this.currentMediaNumber = null;
    this.isMediaProcessing = false;
  }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  console.log('SentenceMediaManager 모듈 로드 완료');
  SentenceMediaManager.init();
  console.log('SentenceMediaManager.init() 호출 완료');
});

// 전역 함수로 노출 (script.js에서 호출할 수 있도록)
window.showSentenceImage = function(sentenceIndex) {
  console.log(`showSentenceImage 호출됨 - 인덱스: ${sentenceIndex}, 실제 문장 번호: ${sentenceIndex + 1}`);
  SentenceMediaManager.handleSentenceExplosion(sentenceIndex);
  
  // 디버깅 정보 출력 (홀수/짝수 문장 구분)
  const realSentenceNumber = sentenceIndex + 1;
  const isOddSentence = realSentenceNumber % 2 === 1;
  console.log(`문장 종류: ${isOddSentence ? '홀수' : '짝수'} 문장 (${realSentenceNumber}번)`);
  console.log(`현재 미디어 번호: ${SentenceMediaManager.currentMediaNumber}`);
};
