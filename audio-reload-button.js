// 배경 음악 수동 리로드 버튼 클릭 이벤트 처리
document.addEventListener('DOMContentLoaded', function() {
  // 볼륨 버튼 오른쪽에 새 버튼 추가
  const topControls = document.getElementById('topControls');
  const reloadBtn = document.createElement('button');
  reloadBtn.id = 'reloadMusicBtn';
  reloadBtn.className = 'reload-btn';
  reloadBtn.textContent = '🔄';
  reloadBtn.title = '배경음악 새로 로드';
  reloadBtn.style.position = 'absolute';
  reloadBtn.style.right = '10px';
  reloadBtn.style.top = '43px';
  reloadBtn.style.fontSize = '24px';
  reloadBtn.style.padding = '5px 10px';
  reloadBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  reloadBtn.style.border = '1px solid #555';
  reloadBtn.style.borderRadius = '5px';
  reloadBtn.style.color = '#fff';
  reloadBtn.style.cursor = 'pointer';
  reloadBtn.style.zIndex = '9999';
  document.body.appendChild(reloadBtn);

  // 클릭 이벤트 처리
  reloadBtn.addEventListener('click', function() {
    console.log('배경음악 수동 리로드 요청');
    
    // 로컬 스토리지 초기화
    try {
      localStorage.removeItem('last_bgm_load_time');
      localStorage.removeItem('audio_cache_version');
      
      const audioFiles = [
        'sounds/background1.mp3',
        'sounds/background2.mp3',
        'sounds/background3.mp3',
        'sounds/shoot.mp3',
        'sounds/explosion.mp3'
      ];
      
      audioFiles.forEach(filePath => {
        const fileKey = `file_modified_${filePath.replace(/\//g, '_')}`;
        localStorage.removeItem(fileKey);
      });
    } catch(e) {
      console.warn('로컬 스토리지 접근 실패:', e);
    }
    
    // 애니메이션 효과
    reloadBtn.classList.add('rotating');
    setTimeout(() => {
      reloadBtn.classList.remove('rotating');
    }, 1000);
    
    // 배경음악 리로드
    if (window.reloadBackgroundMusic) {
      window.reloadBackgroundMusic();
      
      // 알림 메시지 표시
      const notification = document.createElement('div');
      notification.textContent = '배경음악을 새로 로드했습니다';
      notification.style.position = 'fixed';
      notification.style.top = '80px';
      notification.style.right = '10px';
      notification.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
      notification.style.color = 'white';
      notification.style.padding = '10px';
      notification.style.borderRadius = '5px';
      notification.style.zIndex = '9999';
      notification.style.fontSize = '14px';
      document.body.appendChild(notification);
      
      // 3초 후 알림 제거
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } else {
      console.error('reloadBackgroundMusic 함수를 찾을 수 없음');
    }
  });
});

// 회전 애니메이션 스타일 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .rotating {
    animation: rotate 1s linear;
  }
`;
document.head.appendChild(style);
