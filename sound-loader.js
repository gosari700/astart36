/**
 * 사운드 파일 캐시 방지를 위한 유틸리티 모듈
 * 
 * 이 파일은 브라우저 캐시를 우회하여 항상 새로운 사운드 파일을 로드하도록 합니다.
 * 
 * 강화된 캐시 방지 기능 (v2.0):
 * 1. 파일 마지막 수정 시간 자동 감지하여 버전 관리
 * 2. 로컬 스토리지 캐시 버전 체크하여 새로운 파일 감지
 * 3. AJAX 요청으로 파일 헤더 확인하여 캐시 무효화
 */

// 새 오디오 파일 로드 함수 (강화된 캐시 방지)
function loadFreshAudio(filePath) {
  // 타임스탬프 + 랜덤 문자열로 캐시 방지 강화
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const cacheBuster = `?nocache=${timestamp}-${randomStr}`;
  
  // 로컬 스토리지에 파일 버전 정보 업데이트
  try {
    localStorage.setItem(`audio_version_${filePath}`, timestamp.toString());
  } catch(e) {
    console.warn('로컬 스토리지 접근 실패:', e);
  }
  
  // 오디오 파일 생성 전 헤드 요청으로 파일 존재 확인
  checkFileExists(filePath).then(exists => {
    if (!exists) {
      console.warn(`오디오 파일을 찾을 수 없음: ${filePath}`);
    } else {
      console.log(`오디오 파일 확인됨: ${filePath}`);
    }
  });
  
  return new Audio(`${filePath}${cacheBuster}`);
}

// 파일 존재 확인 (HEAD 요청 사용)
function checkFileExists(url) {
  return fetch(url, { 
    method: 'HEAD',
    cache: 'no-store',
    headers: { 'Pragma': 'no-cache' }
  })
  .then(response => {
    return response.ok;
  })
  .catch(() => {
    return false;
  });
}


let maxBgmIndex = 6;     // 기본값으로 6 설정, 나중에 동적으로 확인

// 배경음악 파일의 최대 번호를 확인하는 함수
function checkMaxBackgroundMusicIndex() {
  console.log('배경음악 파일 최대 개수 확인 중...');
  let maxFound = 1;
  
  // 최대 20개의 배경음악 파일까지 확인 (충분히 큰 수)
  const checkPromises = [];
  for (let i = 1; i <= 20; i++) {
    const filePath = `sounds/background${i}.mp3`;
    checkPromises.push(
      checkFileExists(filePath).then(exists => {
        if (exists) {
          maxFound = Math.max(maxFound, i);
          console.log(`배경음악 파일 확인됨: ${filePath}`);
        }
        return exists;
      })
    );
  }
  
  // 모든 확인이 완료된 후 최대값 설정
  Promise.all(checkPromises).then(() => {
    maxBgmIndex = maxFound;
    console.log(`배경음악 파일 최대 개수 확인 완료: ${maxBgmIndex}개`);
    localStorage.setItem('max_bgm_index', maxBgmIndex.toString());
  });
}

// 배경음악 새로 로드 (강화된 방식)
function loadFreshBackgroundMusic() {
  return new Promise((resolve, reject) => {
    // 기존 배경음악 정지 및 제거
    if (window.bgmAudio) {
      window.bgmAudio.pause();
      window.bgmAudio = null;
    }
    
    // 파일 경로와 버전 정보
    // background1.mp3부터 순서대로 재생
    const bgmBasePath = `sounds/background${currentBgmIndex}.mp3`;
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const cacheBuster = `?v=${timestamp}-${randomStr}`;
    
    // 로컬 스토리지에 마지막 로드 시간 저장
    try {
      localStorage.setItem('last_bgm_load_time', timestamp.toString());
    } catch(e) {
      console.warn('로컬 스토리지 접근 실패:', e);
    }
    
    // 파일 존재 확인 후 로드
    checkFileExists(bgmBasePath)
      .then(exists => {
        if (!exists) {
          console.warn(`배경음악 파일을 찾을 수 없음: ${bgmBasePath}`);
          reject(new Error('배경음악 파일을 찾을 수 없음'));
          return;
        }
        
        console.log(`배경음악 파일 확인됨, 로드 시작: ${bgmBasePath}`);
        const bgmPath = `${bgmBasePath}${cacheBuster}`;
        const newBgm = new Audio(bgmPath);
        
        // 오디오 로드 이벤트 처리
        newBgm.addEventListener('canplaythrough', () => {
          console.log(`배경음악 로드 완료: ${bgmPath}`);
          
          // 볼륨 설정 - PC에서는 30% 더 크게, 모바일은 원래 볼륨
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          newBgm.volume = isMobile ? 0.021 : 0.164;
          
          // loop 대신 onended 이벤트 사용하여 다음 배경음악 재생
          newBgm.loop = false;
          
          // 현재 곡이 끝나면 다음 배경음악으로 넘어가는 이벤트 리스너
          newBgm.addEventListener('ended', () => {
            console.log(`배경음악 ${currentBgmIndex} 종료, 다음 음악으로 넘어갑니다.`);
            
            // 다음 번호의 배경음악으로 변경
            currentBgmIndex++;
            
            // 만약 최대 번호의 배경음악까지 재생했다면 다시 background1.mp3로 돌아감
            if (currentBgmIndex > maxBgmIndex) {
              currentBgmIndex = 1;
              console.log(`모든 배경음악(1~${maxBgmIndex})을 재생 완료, 다시 처음으로 돌아갑니다.`);
            }
            
            // 다음 배경음악 로드 및 재생
            reloadBackgroundMusic();
          });
          
          resolve(newBgm);
        }, { once: true });
        
        // 오류 처리
        newBgm.addEventListener('error', (e) => {
          console.error(`배경음악 로드 실패: ${e.message}`);
          reject(e);
        }, { once: true });
        
        // 로드 시작
        newBgm.load();
        
        // 일정 시간 내에 로드되지 않으면 그냥 반환
        setTimeout(() => {
          if (newBgm.readyState < 3) { // HAVE_FUTURE_DATA 이하면 아직 충분히 로드되지 않은 상태
            console.log('배경음악 로드 제한시간 초과, 현재 상태로 진행');
            resolve(newBgm);
          }
        }, 3000); // 3초 제한시간
      })
      .catch(err => {
        console.error('배경음악 로드 중 오류:', err);
        
        // 오류 발생시 기본 오디오 객체라도 반환
        const fallbackBgm = new Audio(bgmBasePath + cacheBuster);
        fallbackBgm.loop = true;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        fallbackBgm.volume = isMobile ? 0.021 : 0.164;
        resolve(fallbackBgm);
      });
  });
}

// 특정 문장 오디오 새로 로드
function loadFreshSentenceAudio(index) {
  const cacheBuster = `?nocache=${Date.now()}`;
  const audioPath = `sounds/96_audio/${index + 1}.mp3${cacheBuster}`;
  const audio = new Audio(audioPath);
  
  // 볼륨 설정
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  audio.volume = isMobile ? 0.8 : 0.8;
  
  console.log(`새 문장 오디오 로드됨: ${audioPath}`);
  return audio;
}

// 효과음 새로 로드
function reloadSoundEffects() {
  if (window.sounds) {
    // 효과음 다시 로드
    if (window.sounds.shoot) {
      const shootPath = 'sounds/shoot.mp3';
      window.sounds.shoot = loadFreshAudio(shootPath);
      console.log(`새 효과음 로드됨: ${shootPath}`);
    }
    
    if (window.sounds.explosion) {
      const explosionPath = 'sounds/explosion.mp3';
      window.sounds.explosion = loadFreshAudio(explosionPath);
      console.log(`새 효과음 로드됨: ${explosionPath}`);
    }
  }
}

// 페이지 로드 시 모든 사운드 새로 로드
window.addEventListener('DOMContentLoaded', function() {
  console.log('사운드 로더 초기화 - 모든 사운드를 새로 로드합니다.');
  
  // 로컬 스토리지 초기화 - 항상 새 파일 로드하도록
  try {
    localStorage.removeItem('last_bgm_load_time');
    localStorage.removeItem('audio_cache_version');
  } catch(e) {
    console.warn('로컬 스토리지 접근 실패:', e);
  }
  
  // 먼저 최대 배경음악 파일 번호 확인
  checkMaxBackgroundMusicIndex();
  
  // 배경음악 로드
  setTimeout(function() {
    if (typeof window.bgmAudio !== 'undefined') {
      loadFreshBackgroundMusic()
        .then(newBgm => {
          window.bgmAudio = newBgm;
          console.log('새 배경음악 설정 완료');
          
          // 게임이 이미 실행 중이면 음악 재생
          if (window.isGameRunning && !window.isMuted) {
            const playPromise = window.bgmAudio.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => { 
                console.error('새 배경음악 재생 오류:', error); 
              });
            }
          }
        })
        .catch(err => {
          console.error('배경음악 로드 실패:', err);
        });
    }
    
    // 효과음 로드
    if (window.sounds) {
      reloadSoundEffects();
    }
  }, 1500); // 최대 배경음악 파일 번호 확인을 위한 시간 약간 더 확보
  
  // 브라우저 캐시 확인 및 리로드 필요 여부 검사
  setTimeout(checkAudioFileChanges, 1800);
});  // 오디오 파일 변경 여부 확인
function checkAudioFileChanges() {
  // 기본 오디오 파일들의 경로
  const audioFiles = [
    'sounds/shoot.mp3',
    'sounds/explosion.mp3'
  ];
  
  // 배경음악 파일들 동적으로 추가
  for (let i = 1; i <= maxBgmIndex; i++) {
    audioFiles.push(`sounds/background${i}.mp3`);
  }
  
  // 각 파일별로 HEAD 요청으로 Last-Modified 헤더 확인
  audioFiles.forEach(filePath => {
    fetch(filePath, { 
      method: 'HEAD',
      cache: 'no-store',
      headers: { 'Pragma': 'no-cache' }
    })
    .then(response => {
      if (!response.ok) return;
      
      // 마지막 수정 시간 확인
      const lastModified = response.headers.get('Last-Modified');
      if (lastModified) {
        const fileKey = `file_modified_${filePath.replace(/\//g, '_')}`;
        const lastStoredValue = localStorage.getItem(fileKey);
        
        // 변경된 파일이면 캐시 버전 업데이트
        if (lastStoredValue !== lastModified) {
          console.log(`파일 변경 감지: ${filePath}`);
          localStorage.setItem(fileKey, lastModified);
          localStorage.setItem('audio_cache_version', Date.now().toString());
          
          // 해당하는 오디오 파일 리로드
          if (filePath.includes('background')) {
            reloadBackgroundMusic();
          } else if (window.sounds && filePath.includes('shoot')) {
            window.sounds.shoot = loadFreshAudio(filePath);
          } else if (window.sounds && filePath.includes('explosion')) {
            window.sounds.explosion = loadFreshAudio(filePath);
          }
        }
      }
    })
    .catch(err => {
      console.warn(`파일 상태 확인 실패: ${filePath}`, err);
    });
  });
}

// 배경음악 다시 로드 및 재생
function reloadBackgroundMusic() {
  if (typeof window.bgmAudio !== 'undefined') {
    // 현재 재생 중인지 확인
    const wasPlaying = window.bgmAudio && !window.bgmAudio.paused;
    const currentVolume = window.bgmAudio ? window.bgmAudio.volume : undefined;
    const isMuted = window.isMuted;
    
    loadFreshBackgroundMusic()
      .then(newBgm => {
        // 볼륨 유지
        if (currentVolume !== undefined) {
          newBgm.volume = currentVolume;
        }
        
        // 기존 오디오 정지
        if (window.bgmAudio) {
          window.bgmAudio.pause();
        }
        
        // 새 오디오로 교체
        window.bgmAudio = newBgm;
        console.log('배경음악 다시 로드됨');
        
        // 이전에 재생 중이었다면 다시 재생
        if (wasPlaying && !isMuted) {
          const playPromise = window.bgmAudio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => { 
              console.error('새 배경음악 재생 오류:', error);
              
              // 오류 발생 시 다시 시도
              setTimeout(() => {
                window.bgmAudio.play().catch(e => console.error('재시도 실패:', e));
              }, 1000);
            });
          }
        }
      })
      .catch(err => {
        console.error('배경음악 리로드 실패:', err);
      });
  }
}

// 문서 가시성 변화 감지하여 사운드 다시 로드
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    console.log('페이지 가시성 변경됨 - 사운드 파일 변경 확인');
    
    // 파일 변경 확인
    checkAudioFileChanges();
    
    // 게임이 실행 중인 경우만 오디오 다시 로드
    if (window.isGameRunning) {
      setTimeout(function() {
        reloadBackgroundMusic();
      }, 1000);
    }
  }
});

// 수동으로 배경음악 리로드 요청 처리 함수 노출
window.reloadBackgroundMusic = reloadBackgroundMusic;

// 배경음악 버튼 대신 볼륨 버튼을 사용하도록 리다이렉트
function toggleBackgroundMusicButton() {
  // 볼륨 버튼 클릭과 동일한 효과
  const volumeBtn = document.getElementById('volumeBtn');
  if (volumeBtn && volumeBtn.onclick) {
    volumeBtn.onclick();
  }
}

// 전역 함수로 등록
window.toggleBackgroundMusicButton = toggleBackgroundMusicButton;

// 60초마다 파일 변경 확인
setInterval(checkAudioFileChanges, 60000);
