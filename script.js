const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const coffeeSteamVideo = document.getElementById('coffeeSteamVideo'); // 김 효과 비디오 요소

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- START: New variable and function for top offset calculation ---
let topOffset = 0;

function calculateTopOffset() {
  const topControlsElement = document.getElementById('topControls');
  if (topControlsElement) {
    topOffset = topControlsElement.offsetHeight;
  } else {
    topOffset = 0; // Default if element not found
  }
}
// Initial calculation attempt. More reliable calculation in startGame and resize.
calculateTopOffset();
// --- END: New variable and function for top offset calculation ---


window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  calculateTopOffset(); // Recalculate offset on resize
});

// --- START: 폭발 횟수 추적 변수 ---
let explosionCount = 0; // 폭발 횟수 추적

// --- START: ?덈줈??96媛??곸뼱 臾몄옣 ---
const sentences = [
  "Where will we find \nthose yummy berries?", // 1.txt
  "We will swing on \nthat long vine!", // 2.txt
  "Why will you choose \nthat wobbly vine?", // 3.txt
  "It will be a super \nspeedy ride!", // 4.txt
  "Who will go first \non the vine?", // 5.txt
  "I will! I am the \nbravest penguin!", // 6.txt
  "What will happen if \nthe vine breaks?", // 7.txt
  "We will just bounce like \nrubber balls!", // 8.txt
  "How will we get back \nif successful?", // 9.txt
  "We will build a super \nberry raft!", // 10.txt
  "When will we eat \nthose juicy berries?", // 11.txt
  "We will eat them \nvery soon, yum!", // 12.txt
  "Why won't our leaf glider fly \nhigh?", // 13.txt
  "It won't fly with \nyour heavy stones!", // 14.txt
  "What won't make it \ncrash then, smarty?", // 15.txt
  "My fluffy tail \nwon't make it crash!", // 16.txt
  "Who won't help me fix \nthis thing?", // 17.txt
  "I won't help \nif you are grumpy!", // 18.txt
  "Where won't we land \nif it breaks?", // 19.txt
  "We won't land \nin the prickly bushes!", // 20.txt
  "How won't we get \nall muddy then?", // 21.txt
  "We won't, if \nwe steer very well!", // 22.txt
  "When won't we reach \nthe flower field?", // 23.txt
  "We won't, \nif this glider never flies!", // 24.txt
  "Where would we sail \nthis little boat?", // 25.txt
  "We would sail to \nCandy Island, yum!", // 26.txt
  "What would we find \non Candy Island?", // 27.txt
  "We would find rivers of \nchocolate there!", // 28.txt
  "Why would there be \nchocolate rivers flowing?", // 29.txt
  "Magic would make \nthe sweet rivers flow!", // 30.txt
  "Who would be king \non Candy Island?", // 31.txt
  "I would be the king, \nso kind!", // 32.txt
  "How would you rule \nyour sweet yummy kingdom?", // 33.txt
  "I would share candies \nwith everyone daily!", // 34.txt
  "When would we have \nour candy feast?", // 35.txt
  "We would feast as soon \nas we land!", // 36.txt
  "Why wouldn't the bug share \nits light?", // 37.txt
  "It wouldn't share; \nit was too shy!", // 38.txt
  "What wouldn't make the bug \nhide more?", // 39.txt
  "Big shouts wouldn't help \nit feel safe!", // 40.txt
  "Who wouldn't love its pretty, \nwarm glow?", // 41.txt
  "I wouldn't want to miss \nits sparkle!", // 42.txt
  "Where wouldn't it like \nto glimmer brightly?", // 43.txt
  "It wouldn't glimmer near \nthe grumpy toad!", // 44.txt
  "How wouldn't we try \nto be friends?", // 45.txt
  "We wouldn't poke it; \nwe would hum!", // 46.txt
  "When wouldn't it be shy \nwith us?", // 47.txt
  "It wouldn't be shy \nwith gentle friends!", // 48.txt
  "Where could we test \nthis giant parachute?", // 49.txt
  "We can jump from \nthis tall cliff!", // 50.txt
  "Why can you be so brave \nnow?", // 51.txt
  "I can be brave \nwith you, Toto!", // 52.txt
  "Who can hold the parachute \nreally tight?", // 53.txt
  "We can both hold it \nsuper tight!", // 54.txt
  "What can we see \nfrom way up there?", // 55.txt
  "We can see the whole \nwide jungle!", // 56.txt
  "How can we land \nsoft like feathers?", // 57.txt
  "We can steer towards \nthat big flowerbed!", // 58.txt
  "When can we shout \nour big \"Hurray!\"", // 59.txt
  "We can shout when \nwe land safely!", // 60.txt
  "Why can't you climb \ndown this tree?", // 61.txt
  "I can't look down; \nit's too high!", // 62.txt
  "What can't we use \nto get down?", // 63.txt
  "We can't use those flimsy, \nweak vines!", // 64.txt
  "Who can't reach that big \nstrong branch?", // 65.txt
  "I can't quite reach it, \nPingping!", // 66.txt
  "Where can't we find \na softer landing?", // 67.txt
  "We can't land \non those pointy rocks!", // 68.txt
  "How can't we signal \nfor some help?", // 69.txt
  "We can't shout loud; \nvoices are small!", // 70.txt
  "When can't this tricky situation just end?", // 71.txt - ??臾몄옣留?以꾨컮轅??놁씠 ??以꾨줈
  "It can't end \nif we don't try!", // 72.txt
  "What could make \nthese giant footprints here?", // 73.txt
  "A fluffy snow monster \ncould make them!", // 74.txt
  "Why could it be hiding \nfrom us?", // 75.txt
  "It could be shy, \nlike that Sparklebug!", // 76.txt
  "Where could we search \nfor this creature?", // 77.txt
  "We could search \ninside that icy cave!", // 78.txt
  "Who could lead the way \ninto darkness?", // 79.txt
  "I could! \nI am a brave penguin!", // 80.txt
  "How could we become \nfriends with it?", // 81.txt
  "We could offer it \nyummy fish snacks!", // 82.txt
  "When could we see \nits happy face?", // 83.txt
  "We could, \nif we are gentle and kind!", // 84.txt
  "Why couldn't you cross \nthe wobbly bridge?", // 85.txt
  "I couldn't balance; \nit wobbled too much!", // 86.txt
  "What couldn't help us get \nacross safely?", // 87.txt
  "That silly long stick \ncouldn't help us!", // 88.txt
  "Who couldn't stop giggling \nat my slip?", // 89.txt
  "I couldn't help it; \nyou looked funny!", // 90.txt
  "Where couldn't we find \na better crossing?", // 91.txt
  "We couldn't find one \nnear the waterfall!", // 92.txt
  "How couldn't we just leap \nover it?", // 93.txt
  "We couldn't leap; \nit is too wide!", // 94.txt
  "When couldn't we try \na new plan?", // 95.txt
  "We couldn't fail \nwith my new idea!" // 96.txt
];
// --- END: ?덈줈??96媛??곸뼱 臾몄옣 ---


// --- START: 새로운 96개 한국어 번역 (영어 문장과 정확히 일치) ---
const translations = [
  "우리는 어디서 그 맛있는 베리들을 찾을까요?", // 1.txt
  "우리는 그 긴 덩굴을 타고 흔들 거예요!", // 2.txt
  "왜 너는 그 흔들거리는 덩굴을 선택할 거니?", // 3.txt
  "그것은 아주 빠른 속도의 타기가 될 거예요!", // 4.txt
  "덩굴에서 누가 먼저 갈 거예요?", // 5.txt
  "제가 할게요! 저는 가장 용감한 펭귄이에요!", // 6.txt
  "만약 덩굴이 부러지면 어떻게 될까요?", // 7.txt
  "우리는 그냥 고무공처럼 튕길 거예요!", // 8.txt
  "성공하면 어떻게 돌아올까요?", // 9.txt
  "우리는 슈퍼 베리 뗏목을 만들 거예요!", // 10.txt
  "언제 우리는 그 즙이 많은 베리들을 먹을까요?", // 11.txt
  "우리는 곧 그것들을 먹을 거예요, 맛있겠다!", // 12.txt
  "왜 우리의 나뭇잎 글라이더가 높이 날지 않을까요?", // 13.txt
  "네 무거운 돌들 때문에 날 수 없어요!", // 14.txt
  "그럼 무엇이 그것을 추락시키지 않을까요, 똑똑이?", // 15.txt
  "내 복슬복슬한 꼬리는 그것을 추락시키지 않을 거예요!", // 16.txt
  "누가 이것을 고치는 것을 도와주지 않을 거예요?", // 17.txt
  "네가 성질 부리면 도와주지 않을 거예요!", // 18.txt
  "그것이 부서지면 우리는 어디에 착륙하지 않을까요?", // 19.txt
  "우리는 가시 많은 덤불에 착륙하지 않을 거예요!", // 20.txt
  "그럼 우리는 어떻게 진흙투성이가 되지 않을까요?", // 21.txt
  "우리가 아주 잘 조종한다면 안 될 거예요!", // 22.txt
  "언제 우리는 꽃밭에 도달하지 못할까요?", // 23.txt
  "이 글라이더가 절대 날지 않는다면 도달하지 못할 거예요!", // 24.txt
  "우리는 이 작은 보트를 어디로 항해할까요?", // 25.txt
  "우리는 캔디 아일랜드로 항해할 거예요, 맛있겠다!", // 26.txt
  "캔디 아일랜드에서 무엇을 발견할까요?", // 27.txt
  "우리는 거기서 초콜릿 강을 발견할 거예요!", // 28.txt
  "왜 그곳에 초콜릿 강이 흐를까요?", // 29.txt
  "마법이 달콤한 강들이 흐르게 만들 거예요!", // 30.txt
  "캔디 아일랜드에서는 누가 왕이 될까요?", // 31.txt
  "제가 왕이 될 거예요, 너무 친절한 왕이요!", // 32.txt
  "당신은 어떻게 달콤한 왕국을 다스릴 건가요?", // 33.txt
  "저는 매일 모두에게 사탕을 나눠 줄 거예요!", // 34.txt
  "언제 우리는 캔디 축제를 열까요?", // 35.txt
  "우리는 착륙하자마자 축제를 열 거예요!", // 36.txt
  "왜 벌레는 자기 빛을 나눠주지 않을까요?", // 37.txt
  "너무 수줍음이 많아서 나눠주지 않을 거예요!", // 38.txt
  "무엇이 벌레를 더 숨게 하지 않을까요?", // 39.txt
  "큰 소리는 그것이 안전하다고 느끼게 도와주지 않을 거예요!", // 40.txt
  "누가 그 예쁘고 따뜻한 빛을 좋아하지 않을까요?", // 41.txt
  "저는 그 반짝임을 놓치고 싶지 않아요!", // 42.txt
  "그것은 어디서 밝게 빛나고 싶지 않을까요?", // 43.txt
  "그것은 성질 나쁜 두꺼비 근처에서 빛나지 않을 거예요!", // 44.txt
  "어떻게 우리는 친구가 되려고 시도하지 않을까요?", // 45.txt
  "우리는 그것을 찌르지 않고 허밍을 할 거예요!", // 46.txt
  "언제 그것은 우리와 함께 수줍어하지 않을까요?", // 47.txt
  "그것은 부드러운 친구들과 함께 수줍어하지 않을 거예요!", // 48.txt
  "어디서 우리는 이 거대한 낙하산을 테스트할 수 있을까요?", // 49.txt
  "우리는 이 높은 절벽에서 뛰어내릴 수 있어요!", // 50.txt
  "왜 너는 지금 그렇게 용감할 수 있니?", // 51.txt
  "저는 토토와 함께 있으면 용감해질 수 있어요!", // 52.txt
  "누가 낙하산을 정말 꽉 잡을 수 있을까요?", // 53.txt
  "우리 둘 다 그것을 아주 꽉 잡을 수 있어요!", // 54.txt
  "저 위에서 무엇을 볼 수 있을까요?", // 55.txt
  "우리는 넓은 정글 전체를 볼 수 있어요!", // 56.txt
  "어떻게 우리는 깃털처럼 부드럽게 착륙할 수 있을까요?", // 57.txt
  "우리는 저 큰 꽃밭 쪽으로 방향을 조종할 수 있어요!", // 58.txt
  "언제 우리는 큰 \"만세!\"를 외칠 수 있을까요?", // 59.txt
  "우리는 안전하게 착륙했을 때 외칠 수 있어요!", // 60.txt
  "왜 너는 이 나무에서 내려올 수 없니?", // 61.txt
  "저는 아래를 볼 수 없어요; 너무 높아요!", // 62.txt
  "내려오기 위해 우리가 무엇을 사용할 수 없을까요?", // 63.txt
  "우리는 그 얇고 약한 덩굴들을 사용할 수 없어요!", // 64.txt
  "누가 저 큰 튼튼한 가지에 닿을 수 없을까요?", // 65.txt
  "저는 닿을 수 없어요, 핑핑!", // 66.txt
  "어디서 우리는 더 부드러운 착륙 지점을 찾을 수 없을까요?", // 67.txt
  "우리는 저 뾰족한 바위들에 착륙할 수 없어요!", // 68.txt
  "어떻게 우리는 도움을 요청할 신호를 보낼 수 없을까요?", // 69.txt
  "우리는 크게 소리칠 수 없어요; 목소리가 작아요!", // 70.txt
  "이 까다로운 상황은 언제 끝날 수 없을까요?", // 71.txt
  "우리가 시도하지 않으면 끝날 수 없어요!", // 72.txt
  "무엇이 이 거대한 발자국들을 여기에 남길 수 있을까요?", // 73.txt
  "복슬복슬한 눈 괴물이 그것들을 만들 수 있었을 거예요!", // 74.txt
  "왜 그것이 우리로부터 숨을 수 있을까요?", // 75.txt
  "그것은 저 반짝 벌레처럼 수줍음이 많을 수 있어요!", // 76.txt
  "어디서 우리는 이 생물을 찾을 수 있을까요?", // 77.txt
  "우리는 저 얼음 동굴 안에서 찾을 수 있을 거예요!", // 78.txt
  "누가 어둠 속으로 길을 인도할 수 있을까요?", // 79.txt
  "제가 할게요! 저는 용감한 펭귄이에요!", // 80.txt
  "어떻게 우리는 그것과 친구가 될 수 있을까요?", // 81.txt
  "우리는 맛있는 생선 간식을 줄 수 있어요!", // 82.txt
  "언제 우리는 그것의 행복한 얼굴을 볼 수 있을까요?", // 83.txt
  "우리가 부드럽고 친절하다면 볼 수 있을 거예요!", // 84.txt
  "왜 너는 흔들거리는 다리를 건널 수 없었니?", // 85.txt
  "저는 균형을 잡을 수 없었어요; 너무 많이 흔들렸어요!", // 86.txt
  "무엇이 우리가 안전하게 건너는 것을 도울 수 없었을까요?", // 87.txt
  "그 바보 같은 긴 막대기는 우리를 도울 수 없었어요!", // 88.txt
  "누가 내가 미끄러졌을 때 웃음을 멈출 수 없었나요?", // 89.txt
  "저는 참을 수 없었어요; 너 정말 우스꽝스러웠어요!", // 90.txt
  "어디서 우리는 더 나은 건널 곳을 찾을 수 없었나요?", // 91.txt
  "우리는 폭포 근처에서 찾을 수 없었어요!", // 92.txt
  "어떻게 우리는 그냥 뛰어넘을 수 없었을까요?", // 93.txt
  "우리는 뛰어넘을 수 없었어요; 너무 넓었어요!", // 94.txt
  "언제 우리는 새 계획을 시도할 수 없었을까요?", // 95.txt
  "제 새 아이디어로는 실패할 수 없었어요!" // 96.txt
];
// --- END: 새로운 96개 한국어 번역 ---


let sentenceIndex = Number(localStorage.getItem('sentenceIndex') || 0);
sentenceIndex = sentenceIndex % sentences.length; // Ensure it's within bounds

const playerImg = new Image();
playerImg.src = 'images/player.png';

const enemyImgs = [
  'images/enemy1.png', // 0
  'images/enemy2.png', // 1 (coffee cup)
  'images/enemy3.png', // 2 (cosmos)
  'images/enemy4.png', // 3 (maple leaf)
  'images/enemy5.png'  // 4
].map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

const bulletImg = new Image();
bulletImg.src = 'images/bubble_bullet.png';

// sounds 폴더의 모든 배경음악 파일을 순서대로 재생하는 시스템
let bgmFiles = []; // 배경음악 파일 경로 배열
let bgmIndex = 0;  // 현재 재생 중인 음악의 인덱스
let bgmAudio = null; // 배경음악 오디오 객체

// 파일 존재 여부 확인 함수
function checkFileExists(url) {
  return fetch(url, { method: 'HEAD', cache: 'no-store' })
    .then(response => response.ok)
    .catch(() => false);
}

// 배경음악 파일 목록 초기화
function initBgmFiles() {
  // 기존 목록 초기화
  bgmFiles = [];
  
  // 배경음악 파일 검색 (최대 100개)
  for (let i = 1; i <= 100; i++) {
    const filepath = `sounds/background${i}.mp3`;
    // 배열에 모든 파일 경로 추가
    bgmFiles.push(filepath);
  }
}

// 배경음악 목록 초기화
initBgmFiles();

// 초기 오디오 객체 생성
bgmAudio = new Audio(bgmFiles[0]);

// 볼륨 설정 - PC에서는 더 크게, 모바일에서는 작게
const isMobileBGM = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
bgmAudio.volume = isMobileBGM ? 0.021 : 0.126;
bgmAudio.loop = false; // 반복 재생 대신 onended 이벤트로 다음 곡 재생

// 배경음악이 끝날 때 다음 음악으로 넘어가는 함수
function playNextBgm() {
  // 다음 음악 인덱스로 이동 (마지막 음악 재생 후 첫번째로 돌아가기)
  bgmIndex = (bgmIndex + 1) % bgmFiles.length;
  
  // 한 바퀴 다 돌았으면 파일 목록 다시 초기화 (새 파일 추가 감지)
  if (bgmIndex === 0) {
    console.log("모든 배경음악 재생 완료, 다시 처음부터 재생");
    initBgmFiles();
  }
  
  console.log(`다음 배경음악 재생: ${bgmIndex+1}`);
  
  // 새 오디오 객체 생성
  bgmAudio = new Audio(bgmFiles[bgmIndex]);
  
  // 재생 지연을 방지하기 위해 미리 로드
  bgmAudio.preload = "auto";
  
  // 볼륨 설정
  bgmAudio.volume = isMuted ? 0 : (isMobileBGM ? 0.021 : 0.126);
  bgmAudio.loop = false;
  
  // 이벤트 핸들러 다시 설정
  bgmAudio.onended = function() {
    // 즉시 다음 곡 재생 (지연 없이)
    playNextBgm();
  };
  
  // 음악 재생 - 지연 없이 바로 시작
  bgmAudio.play().catch(error => {
    console.error('배경음악 재생 오류, 즉시 다음 곡으로 넘어갑니다');
    // 오류 발생 시 즉시 다음 음악으로 넘어감 (지연 제거)
    playNextBgm();
  });
}

// 초기 이벤트 핸들러 설정
bgmAudio.onended = function() {
  playNextBgm();
};

const volumeBtn = document.getElementById('volumeBtn');
let isMuted = false;
function updateVolumeIcon() {
  volumeBtn.textContent = isMuted ? "🔇" : "🔊";
}

let currentSentenceAudio = null;
let originalBgmVolume = 0.021; // Store original BGM volume
let isDucking = false;
let duckingTimeout = null;
let lastSoundTime = 0; // Track when last sound was played
let gameInProgress = false; // Track if game is in progress
let silenceCheckInterval = null;

// Enhanced background music ducking system
function startGameDucking() {
  if (!gameInProgress) {
    gameInProgress = true;
    // Detect if mobile for volume calculation
    const isMobileDuck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    originalBgmVolume = isMobileDuck ? 0.021 : 0.126;
    
    if (bgmAudio && !isMuted && !isDucking) {
      isDucking = true;
      // Gradually reduce BGM volume to 4% of original (60% more reduction from 10%)
      const targetVolume = originalBgmVolume * 0.04;
      fadeVolume(bgmAudio, bgmAudio.volume, targetVolume, 200);
    }
    
    // Start checking for silence
    startSilenceCheck();
  }
}

function recordSoundActivity() {
  lastSoundTime = Date.now();
}

function startSilenceCheck() {
  // Clear any existing interval
  if (silenceCheckInterval) {
    clearInterval(silenceCheckInterval);
  }
  
  silenceCheckInterval = setInterval(() => {
    const now = Date.now();
    const timeSinceLastSound = now - lastSoundTime;
    
    // If 10 seconds of silence and game is in progress, restore BGM
    if (timeSinceLastSound >= 10000 && gameInProgress && isDucking) {
      restoreBGMAfterSilence();
    }
  }, 1000); // Check every second
}

function restoreBGMAfterSilence() {
  gameInProgress = false;
  isDucking = false;
  
  if (silenceCheckInterval) {
    clearInterval(silenceCheckInterval);
    silenceCheckInterval = null;
  }
  
  if (bgmAudio && !isMuted) {
    fadeVolume(bgmAudio, bgmAudio.volume, originalBgmVolume, 1000);
  }
}

// Legacy function for backwards compatibility
function duckBGM() {
  recordSoundActivity();
  if (!gameInProgress) {
    startGameDucking();
  }
}

function restoreBGM() {
  recordSoundActivity();
}

let currentFadeInterval = null;

function fadeVolume(audio, startVolume, endVolume, duration) {
  // Clear any existing fade
  if (currentFadeInterval) {
    clearInterval(currentFadeInterval);
  }
  
  const steps = 20;
  const stepDuration = duration / steps;
  const volumeStep = (endVolume - startVolume) / steps;
  let currentStep = 0;
  
  currentFadeInterval = setInterval(() => {
    currentStep++;
    const newVolume = startVolume + (volumeStep * currentStep);
    if (audio && !audio.paused) {  // Check if audio still exists
      audio.volume = Math.max(0, Math.min(1, newVolume));
    }
    
    if (currentStep >= steps) {
      clearInterval(currentFadeInterval);
      currentFadeInterval = null;
      if (audio && !audio.paused) {
        audio.volume = endVolume;
      }
    }
  }, stepDuration);
}

async function playSentenceAudio(index) {
  return new Promise((resolve, reject) => {
    if (currentSentenceAudio) {
      currentSentenceAudio.pause();
      currentSentenceAudio.currentTime = 0;
      currentSentenceAudio.onended = null;
      currentSentenceAudio.onerror = null;
    }

    const audioFilePath = `sounds/96_audio/${index + 1}.mp3`;
    currentSentenceAudio = new Audio(audioFilePath);
    currentSentenceAudio.volume = 0.8;

    // Duck background music when sentence audio starts
    duckBGM();

    currentSentenceAudio.onended = () => {
      currentSentenceAudio = null;
      // Record that sentence audio ended (activity)
      recordSoundActivity();
    };
    currentSentenceAudio.onerror = (e) => {
      console.error(`Error playing sentence audio: ${audioFilePath}`, e);
      currentSentenceAudio = null;
      // Record activity even on error
      recordSoundActivity();
      reject(e);
    };

    currentSentenceAudio.play().then(() => {
        resolve();
    }).catch(e => {
      console.error(`Failed to play ${audioFilePath}`, e);
      currentSentenceAudio = null;
      // Record activity even on play error
      recordSoundActivity();
      reject(e);
    });
  });
}


volumeBtn.onclick = function () {
  isMuted = !isMuted;
  // Set volume - 50% louder for PC, normal for mobile
  const isMobileVolumeBtn = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const targetVolume = isMuted ? 0 : (isMobileVolumeBtn ? 0.021 : 0.126);
  
  // 기존 BGM 오디오 제어
  if (bgmAudio) {
    bgmAudio.volume = targetVolume;
    if (!isMuted && bgmAudio.paused && isGameRunning && !isGamePaused) {
      bgmAudio.play().catch(e => console.error("BGM play on unmute error:", e));
    }
  }
  
  updateVolumeIcon();
  
  // 배경음악 플레이어 제어 (추가)
  const backgroundMusicPlayer = document.getElementById('backgroundMusicPlayer');
  if (backgroundMusicPlayer) {
    if (isMuted) {
      backgroundMusicPlayer.volume = 0;
      // 음소거 상태에서는 일시 중지하지 않고 무음으로만 설정
    } else {
      // 음소거 해제 시 볼륨 복원
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      backgroundMusicPlayer.volume = isMobile ? 0.021 : 0.164;
      
      // 음소거 해제 시 배경음악이 일시중지 상태였다면 다시 재생
      if (backgroundMusicPlayer.paused && !isGamePaused) {
        backgroundMusicPlayer.play().catch(e => console.error("Background music play error:", e));
      }
    }
  }
  
  updateVolumeIcon();
};
updateVolumeIcon();


const sounds = {
  shoot: new Audio('sounds/shoot.mp3'),
  explosion: new Audio('sounds/explosion.mp3')
};

// Detect if device is mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Set volume - PC에서 더 크게, mobile은 그대로
sounds.shoot.volume = isMobile ? 0.05 : 0.3;  // PC에서 총소리 더 크게 (0.2에서 50% 증가)
sounds.explosion.volume = isMobile ? 0.05 : 0.13;  // PC에서 2배 볼륨

setInterval(() => {
  if (bgmAudio) {
    // Set volume - 50% louder for PC, normal for mobile
    const isMobileInterval = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const targetVolume = isMuted ? 0 : (isMobileInterval ? 0.021 : 0.126);
    if (bgmAudio.volume !== targetVolume) {
      bgmAudio.volume = targetVolume;
    }
  }
}, 1000);


let allAssetsReady = false;
let assetsToLoad = 1 + enemyImgs.length + 1;
let loadedAssetCount = 0;
let coffeeVideoAssetReady = false;

function assetLoaded() {
  loadedAssetCount++;
  checkAllAssetsReady();
}

function coffeeVideoReady() {
  if (!coffeeVideoAssetReady) {
    coffeeVideoAssetReady = true;
    checkAllAssetsReady();
  }
}

function coffeeVideoError() {
  if (!coffeeVideoAssetReady) {
    console.error("Coffee steam video could not be loaded. Steam effect will be disabled.");
    coffeeVideoAssetReady = true;
    checkAllAssetsReady();
  }
}

function checkAllAssetsReady() {
  if (loadedAssetCount >= assetsToLoad && coffeeVideoAssetReady) {
    allAssetsReady = true;
    console.log("All game assets (images and video) are ready.");
  }
}

playerImg.onload = assetLoaded;
playerImg.onerror = () => { console.error("Failed to load player image."); assetLoaded(); };

enemyImgs.forEach(img => {
  img.onload = assetLoaded;
  img.onerror = () => { console.error(`Failed to load enemy image: ${img.src}`); assetLoaded(); };
});

bulletImg.onload = assetLoaded;
bulletImg.onerror = () => { console.error("Failed to load bullet image."); assetLoaded(); };


if (coffeeSteamVideo) {
  coffeeSteamVideo.oncanplaythrough = coffeeVideoReady;
  coffeeSteamVideo.onerror = coffeeVideoError;
  if (coffeeSteamVideo.readyState >= HTMLVideoElement.HAVE_ENOUGH_DATA) coffeeVideoReady();
  else if (coffeeSteamVideo.error) coffeeVideoError();
} else {
  console.warn("coffeeSteamVideo element not found in HTML. Assuming ready without steam effect.");
  coffeeVideoAssetReady = true;
  checkAllAssetsReady();
}


const PLAYER_SIZE = 50;
const ENEMY_SIZE = 40;
const ENEMY_MOVEMENT_SPEED_PPS = 60;

const MIN_BUBBLE_SIZE = 15;
const MAX_BUBBLE_SIZE = 35;

const BUBBLE_BASE_SPEED_Y_PPS = -120;
const BUBBLE_SPEED_Y_VARIATION_PPS = 40;

const BUBBLE_SWAY_FREQUENCY_MIN = 1.5;
const BUBBLE_SWAY_FREQUENCY_MAX = 3.5;

const BUBBLE_SWAY_AMPLITUDE_FACTOR_MIN = 0.3;
const BUBBLE_SWAY_AMPLITUDE_FACTOR_MAX = 0.8;

const BUBBLE_HORIZONTAL_DRIFT_PPS_MAX = 25;

const PETAL_SIZE = 20;
const PETAL_FALL_SPEED_PPS = 25;
const PETAL_ROTATION_SPEED_BASE = 1.5;
const PETAL_SWAY_AMPLITUDE_BASE = 12;
const PETAL_SWAY_SPEED_BASE = 1.8;
const PETAL_DRIFT_X_PPS_BASE = 30;
const PETAL_FLUTTER_AMPLITUDE_BASE = 3.5;
const PETAL_FLUTTER_SPEED_BASE = 3.0;

const SENTENCE_VERTICAL_ADJUSTMENT = -41; // 기존 -36에서 5px 더 감소시켜 첫 번째 문장을 추가로 위로 올림
const ANSWER_OFFSET_Y = 57; // 62에서 57로 변경하여 두 번째 문장을 5px 위로 올림
const LINE_HEIGHT = 30;
// 첫째줄과 둘째줄 사이의 간격을 40% 확대한 값 (30 * 1.4 = 42)
const INCREASED_LINE_SPACING = 42;
const PLAYER_TOUCH_Y_OFFSET = 15;

let player = { x: 0, y: 0, w: PLAYER_SIZE, h: PLAYER_SIZE };
let bullets = [];
let enemies = [];
let enemyBullets = [];
let detachedPetals = [];

let isGameRunning = false;
let isGamePaused = false;

// 패턴 감지 전역 변수
window.lastDetectedPattern = "unknown";
let lastTime = 0;

const burstColors = [
  '#FF5252', '#FF9800', '#FFD600', '#4CAF50', '#2196F3',
  '#9C27B0', '#E040FB', '#00BCD4', '#FFEB3B', '#FF69B4'
];

let fireworks = null;
let fireworksState = null;

let currentQuestionSentence = null;
let currentAnswerSentence = null;
let currentQuestionSentenceIndex = null;
let currentAnswerSentenceIndex = null;

let centerAlpha = 1.0;
let sentenceActive = false;

let showPlayButton = false;
let playButtonRect = null;
let showPlayButtonQuestion = false;
let playButtonRectQuestion = null;

let showTranslationForQuestion = false;
let showTranslationForAnswer = false;
let isActionLocked = false;

let centerSentenceWordRects = [];
let activeWordTranslation = null;
let wordTranslationTimeoutId = null;
const WORD_TRANSLATION_DURATION = 3000;

const MODAL_AUX = [
  // 기본형
  "can", "could", "will", "would", "shall", "should", "may", "might", "must",
  // 축약형 (아포스트로피 없는 버전)
  "cant", "couldnt", "wont", "wouldnt", "shant", "shouldnt", "maynt", "mightnt", "mustnt",
  // 축약형 (아포스트로피 있는 버전)
  "can't", "couldn't", "won't", "wouldn't", "shan't", "shouldn't", "mayn't", "mightn't", "mustn't",
  // 기타 변형
  "cannot"
];
const DO_AUX = [
  // 기본형
  "do", "does", "did", 
  // 축약형 (아포스트로피 없는 버전)
  "dont", "doesnt", "didnt",
  // 축약형 (아포스트로피 있는 버전)
  "don't", "doesn't", "didn't"
];
const notVerbIng = [
  "morning", "evening", "everything", "anything", "nothing", "something",
  "building", "ceiling", "meeting", "feeling", "wedding", "clothing"
];

// 특별한 축약형 조동사 목록
const CONTRACTION_AUX = [
  "wont", "wouldnt", "cant", "couldnt", "dont", "doesnt", "didnt"
];

function isAux(word) {
  // 단어의 가능한 모든 형태를 확인하도록 정규화
  const lowerWord = word.toLowerCase().replace(/[^a-z0-9']/g, '');
  const lowerWordWithoutApostrophes = lowerWord.replace(/'/g, '');
  
  // 모든 조동사 목록을 체계적으로 확인 (모듈화)
  return MODAL_AUX.includes(lowerWord) || 
         DO_AUX.includes(lowerWord) || 
         MODAL_AUX.includes(lowerWordWithoutApostrophes) || 
         DO_AUX.includes(lowerWordWithoutApostrophes) ||
         // 특별한 축약형 조동사 체크
         CONTRACTION_AUX.includes(lowerWord);
}
function isWh(word) {
  const whs = ["what","when","where","who","whom","whose","which","why","how"];
  return whs.includes(word.toLowerCase().replace(/[^a-z0-9]/g, ''));
}
// 동사 목록을 별도로 모듈화하여 관리
const BASIC_VERBS = [
  // 기본 동사들
  "build", "make", "come", "wear", "fight", "hide", "bring", "catch", "use", "share", "play", "feel", "clean",
  "allowed", "join", "break", "crash", "fly", "cry", "got", "lost", "visit", "talk", "help", "stuck", "eat",
  "go", "melt", "laugh", "see", "fix", "jump", "practiced", "open", "hear", "find", "hiding", "start",
  "taken", "rolled", "carry", "set", "keep"
];

const BE_VERBS = [
  // BE 동사들
  "be", "is", "am", "are", "was", "were", "been"
];

const ADDITIONAL_VERBS = [
  // 새로 추가된 동사들
  "land", "signal", "sail", "cross", "climb", "reach", "leap", "fail", "shout", "steer", "search", "lead", 
  "become", "offer", "balance", "stop", "giggling", "try", "poke", "hum", "test", "look", 
  "hold", "end", "swing", "choose", "ride", "care", "put", "left", "liked",
  "get", "locked", "cooking", "whisper", "let", "sit"
];

// 새 문장에 필요한 동사들
const NEW_VERBS = [
  "drink", "wonder", "speed", "change", "show", "split", "pour", "drive", "pick",
  "bake", "wait", "need", "believe", "bark", "skip", "roar", "leave",
  "stay", "blow", "run", "tell", "teach"
];

// 본동사 우선순위 목록 (일반적으로 문장에서 주요 동작을 나타내는 동사들)
const MAIN_VERB_PRIORITY = [
  // 움직임/행동 동사
  "run", "jump", "walk", "swim", "fly", "climb", "ride", "drive", 
  // 생성/파괴 동사
  "make", "build", "create", "destroy", "break",
  // 일반 동사
  "eat", "drink", "sleep", "read", "write", "play", "work",
  // 소통 동사
  "say", "tell", "speak", "talk", "shout", "whisper",
  // 기타 주요 동작
  "bring", "carry", "catch", "find", "give", "take", "put", "set"
];

// 동사가 아닌 단어들 확장 (방향, 전치사, 부사 등)
const NOT_VERBS = [
  "down", "up", "in", "out", "off", "on", "over", "under", "there", "here", "away", "back", 
  "again", "now", "then", "just", "very", "too", "more", "most", "some", "any", "all", "none",
  "the", "a", "an", "this", "that", "these", "those", "my", "your", "his", "her", "our", "their",
  "today", "tomorrow", "yesterday", "after", "before", "during"
];

// 일반 동사 여부 확인 (모든 종류의 동사 포함)
function isVerb(word) {
  // 모든 동사 목록을 합침
  const allVerbs = [...BASIC_VERBS, ...BE_VERBS, ...ADDITIONAL_VERBS, ...NEW_VERBS];
  
  const lowerWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // 조동사인지 먼저 확인 (조동사는 동사로 처리하지 않음)
  if (isAux(lowerWord)) return false;
  
  // 동사가 아닌 단어인지 확인
  if (NOT_VERBS.includes(lowerWord)) return false;
  
  // 특수 케이스
  if (lowerWord === "bringback") return true;
  if (lowerWord === "setup") return true;
  
  // 포괄적 동사 체크 (완전 일치 또는 접두어 일치)
  return allVerbs.some(v => lowerWord === v || lowerWord.startsWith(v));
}

// 본동사 식별 함수 (문장에서 가장 중요한 동작을 나타내는 동사)
function isMainVerb(word, wordIndex, totalWords) {
  const lowerWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // 조동사는 본동사가 아님
  if (isAux(lowerWord)) return false;
  
  // 위치 기반 점수 계산 (문장의 첫 번째 동사일 가능성이 높음)
  let score = 0;
  if (wordIndex === 1) score += 2; // 두 번째 단어일 경우 (조동사 다음)
  if (wordIndex === 2) score += 1; // 세 번째 단어일 경우 
  
  // 우선순위 동사 목록에 있는지 확인
  const mainVerbPriority = MAIN_VERB_PRIORITY.findIndex(v => 
    lowerWord === v || lowerWord.startsWith(v)
  );
  
  if (mainVerbPriority !== -1) {
    score += (MAIN_VERB_PRIORITY.length - mainVerbPriority) / MAIN_VERB_PRIORITY.length * 3;
  }
  
  // 일반 동사인지 확인
  if (isVerb(word)) {
    score += 1;
  } else {
    return false; // 동사가 아니면 본동사가 될 수 없음
  }  
  return score >= 1; // 점수가 1 이상이면 본동사로 간주
}
function isVing(word) {
  let lw = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (notVerbIng.includes(lw)) return false;
  if (lw.endsWith('ing') && lw.length > 3) {
    let base = lw.slice(0, -3);
    if (base.endsWith('e') && !base.endsWith('ee') && base !== 'be' && base.length > 1) {
        if(isVerb(base)) return true;
        if(isVerb(base + 'e')) return true;
        if (base.endsWith('i')) {
             base = base.slice(0, -1) + 'e';
        }
    } else if (base.length > 1 && base.charAt(base.length -1) === base.charAt(base.length-2) && !['ss','ll','ff','zz'].includes(base.slice(-2))) {
        base = base.slice(0,-1);
    }
    return isVerb(base) || (base.endsWith('y') && isVerb(base.slice(0, -1) + 'ie'));
  }
  return false;
}
function isBeen(word) {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '') === 'been';
}
function isQuestion(sentenceText) {
  return sentenceText.trim().endsWith('?');
}

// --- START: New isPastParticiple function ---
function isPastParticiple(word) {
    const lowerWord = word.toLowerCase().replace(/[^a-z]/g, ''); // Keep only letters
    if (!lowerWord) return false;

    const irregularPPs = [
        "been", "begun", "broken", "brought", "built", "bought", "caught", "chosen", "come", "cost",
        "cut", "done", "drawn", "dreamt", "dreamed", "drunk", "driven", "eaten", "fallen", "felt",
        "fought", "found", "flown", "forgotten", "forgiven", "frozen", "got", "gotten", "given",
        "gone", "grown", "hung", "had", "heard", "hidden", "hit", "held", "hurt", "kept",
        "known", "laid", "led", "left", "lent", "let", "lain", "lit", "lost", "made",
        "meant", "met", "paid", "put", "quit", "read", "ridden", "rung", "risen", "run",
        "said", "seen", "sold", "sent", "set", "shaken", "shone", "shot", "shown", "shut",
        "sung", "sunk", "sat", "slept", "spoken", "spent", "spread", "stood", "stolen",
        "stuck", "sworn", "swept", "swum", "taken", "taught", "torn", "told", "thought",
        "thrown", "understood", "woken", "worn", "won", "written"
    ];

    if (irregularPPs.includes(lowerWord)) {
        return true;
    }

    if (lowerWord.length > 2 && lowerWord.endsWith("ed")) {
        const nonVerbEdEndings = ["bed", "red", "shed", "wed"];
        if (nonVerbEdEndings.includes(lowerWord)) return false;
        return true;
    }
    return false;
}
// --- END: New isPastParticiple function ---

async function getWordTranslation(word, targetLang = 'ko') {
  const cleanedWord = word.replace(/[^a-zA-Z0-9']/g, "").toLowerCase().trim();
  if (!cleanedWord) return "Error: Invalid word";
  // =======================================================================
  // START OF FULLY UPDATED mockTranslations (반드시 이 부분을 사용해주세요)
  // =======================================================================
  const mockTranslations = {
    "what": "무엇", "will": "～할 것이다", "we": "우리", "build": "짓다", "with": "～으로",
    "these": "이것들", "big": "큰", "boxes": "상자들", "make": "만들다", "a": "하나의",
    "spaceship": "우주선", "for": "～을 위한", "our": "우리의", "trip": "여행", "when": "언제",
    "they": "그들", "come": "오다", "to": "～으로", "the": "그", "them": "그들을/그것들을", // "them" 추가
    "backyard": "뒷마당", "party": "파티", "i": "나", "wear": "입다", "it": "그것",
    "because": "왜냐하면", "fight": "싸우다", "monsters": "괴물들", "right": "바로/오른쪽",
    "after": "～후에", "their": "그들의", "nap": "낮잠", "time": "시간", "where": "어디에",
    "you": "너/당신", "hide": "숨기다", "birthday": "생일", "surprise": "깜짝 선물",
    "gift": "선물", "under": "～아래에", "green": "초록색", "slide": "미끄럼틀", "who": "누가",
    "bring": "가져오다", "cake": "케이크", "picnic": "소풍", "today": "오늘", "my": "나의",
    "mom": "엄마", "in": "～안에", "her": "그녀의", "blue": "파란", "basket": "바구니",
    "how": "어떻게", "catch": "잡다", "tiny": "아주 작은", "rainbow": "무지개",
    "butterfly": "나비", "net": "그물", "and": "그리고", "be": "이다/되다", "is": "이다", "are": "이다/있다", "was": "~이었다", "were": "~이었다", // "is", "are", "was", "were" 추가
    "very": "매우", "gentle": "부드러운", "won't": "～하지 않을 것이다", "wont": "～하지 않을 것이다",
    "share": "공유하다", "from": "～로부터", "your": "너의/당신의", "lunchbox": "점심 도시락",
    "jelly": "젤리", "special": "특별한", "why": "왜", "sister": "자매/언니/누나",
    "play": "놀다", "tag": "술래잡기", "us": "우리", "she": "그녀", "feels": "느끼다",
    "too": "너무/또한", "sleepy": "졸린", "have": "가지다/해야 한다", "has": "가지다/해야 한다 (3인칭 단수)", // "has" 추가
    "clean": "청소하다/깨끗한", "playroom": "놀이방", "if": "만약", "already": "이미",
    "tidy": "단정한/정돈하다", "allowed": "허용된", "snacks": "간식", "library": "도서관",
    "room": "방", "tomorrow": "내일", "zoo": "동물원", "grandpa": "할아버지", "his": "그의",
    "knee": "무릎", "toy": "장난감", "car": "자동차", "break": "고장나다/부수다", "again": "다시",
    "soon": "곧", "don't": "～하지 않다", "dont": "～하지 않다", "crash": "충돌하다",
    "hard": "세게/어려운", "would": "～일 것이다 (가정)", "do": "하다", "does": "하다 (3인칭 단수)", "did": "했다", // "does", "did" 추가
    "flying": "나는", "carpet": "양탄자", "fly": "날다", "grandma's": "할머니의",
    "grandmas": "할머니의", "house": "집", "cookies": "쿠키들", "cookie": "쿠키",
    "he": "그", "cry": "울다", "watching": "보는 중", "movie": "영화", "puppy": "강아지",
    "got": "얻었다/되었다", "lost": "잃어버린", "visit": "방문하다", "underwater": "물속의",
    "castle": "성", "during": "～동안", "summer": "여름", "dream": "꿈/꿈꾸다",
    "had": "가졌었다/했었다", "fairy": "요정", "wings": "날개", "island": "섬", "sky": "하늘",
    "talk": "말하다", "forest": "숲", "elf": "요정", "whisper": "속삭이다", "magic": "마법/마법의",
    "ring": "반지/울리다", "kite": "연", "stuck": "걸린/꼼짝 못하는", "dad": "아빠",
    "help": "돕다", "long": "긴/오랫동안", "stick": "막대기/붙이다",
    "wouldn't": "～하지 않을 것이다 (가정)", "wouldnt": "～하지 않을 것이다 (가정)",
    "eat": "먹다", "even": "심지어", "hungry": "배고픈", "broccoli": "브로콜리",
    "ice": "얼음", "cream": "크림", "yucky": "역겨운", "teddy": "테디베어", "bear": "곰/참다",
    "tea": "차", "outside": "밖에", "together": "함께", "started": "시작했다", "start": "시작하다",
    "thunderstorming": "뇌우가 치는", "secret": "비밀/비밀의", "treasure": "보물",
    "box": "상자", "bathroom": "욕실", "wet": "젖은", "snowman": "눈사람", "melt": "녹다",
    "quickly": "빨리", "built": "지어진/지었다", "shade": "그늘", "laugh": "웃다",
    "funny": "웃기는", "dance": "춤/춤추다", "moves": "동작/움직이다", "teacher": "선생님",
    "stop": "멈추다", "laughing": "웃는 중", "can": "～할 수 있다/깡통", "shiny": "빛나는",
    "rock": "돌/흔들다", "stone": "돌", "cannot": "～할 수 없다", "not": "아니다",
    "now": "지금", "raining": "비가 오는", "mommy": "엄마", "said": "말했다",
    "muddy": "진흙탕의", "see": "보다", "new": "새로운", "over": "～너머로/끝난",
    "lunch": "점심", "space": "우주/공간", "aliens": "외계인", "behind": "～뒤에",
    "tree": "나무", "fix": "고치다", "robot": "로봇", "dinner": "저녁", "jump": "뛰다",
    "so": "그렇게/매우", "high": "높이/높은", "like": "～처럼/좋아하다",
    "that": "저것/그것/그 (접속사/지시형용사)", "practiced": "연습했다", "every": "매",
    "day": "날", "trampoline": "트램펄린", "can't": "～할 수 없다", "cant": "～할 수 없다",
    "before": "～전에", "open": "열다/열린", "jar": "병/단지", "locked": "잠긴",
    "tight": "단단히/꽉 끼는", "kitchen": "부엌", "cooking": "요리하는 중",
    "crumbs": "부스러기", "couch": "소파", "keep": "유지하다/계속하다", "secrets": "비밀들",
    "longer": "더 오래", "than": "～보다", "hours": "시간들", "hear": "듣다",
    "crunch": "바삭거리는 소리/바삭거리다", "cartoons": "만화", "playing": "재생 중/놀고있는",
    "loudly": "시끄럽게", "could": "～할 수 있었다", "find": "찾다", "there": "거기에/저기",
    "hiding": "숨는 중", "scared": "무서워하는", "of": "～의", "vacuum": "진공청소기",
    "cleaner": "청소기/더 깨끗한", "noise": "소음", "looking": "찾는 중/보는 중",
    "him": "그를", "snack": "간식", "afternoon": "오후", "gone": "사라진/가버린",
    "last": "지난/마지막의", "night": "밤", "rolled": "굴러갔다", "chest": "상자/가슴",
    "bed": "침대", "taken": "가져간/차지된", "garden": "정원", "while": "～하는 동안/반면에",
    "safely": "안전하게", "carry": "나르다", "superhero": "슈퍼히어로", "backpack": "배낭",
    "couldn't": "～할 수 없었다", "couldnt": "～할 수 없었다", "paper": "종이",
    "show": "보여주다/쇼", "puppet": "인형", "missing": "사라진/잃어버린/그리워하는",
    "race": "경주/경주하다", "thunder": "천둥", "loud": "시끄러운/큰 소리로",
    "lemonade": "레모네이드", "stand": "서다/가판대", "set": "놓다/세우다/설정하다", // "set" 추가
    "dripping": "물이 떨어지는", "caught": "잡힌/걸린", "cold": "추운/감기",
    "socks": "양말", "getting": "되는 중/얻는 중", "dry": "마른/말리다",
    "without": "～없이", "rain": "비/비가 오다", "boots": "장화", "on": "위에/계속",
    "join": "참여하다/함께하다", // "join" 추가
    "bringback": "데려오다", "setup": "설치하다", "it's": "그것은 ~이다", "its": "그것의",
    "he's": "그는 ~이다", "hes": "그는 ~이다", "she's": "그녀는 ~이다", "shes": "그녀는 ~이다",
    "you're": "너는 ~이다", "youre": "너는 ~이다", "we're": "우리는 ~이다",
    "they're": "그들은 ~이다", "theyre": "그들은 ~이다", "i'm": "나는 ~이다", "im": "나는 ~이다",
    "i'll": "나는 ~할 것이다", "ill": "나는 ~할 것이다/아픔",
    "you'll": "너는 ~할 것이다", "youll": "너는 ~할 것이다",
    "he'll": "그는 ~할 것이다", "hell": "그는 ~할 것이다/지옥",
    "she'll": "그녀는 ~할 것이다", "shell": "그녀는 ~할 것이다/조개껍질",
    "we'll": "우리는 ~할 것이다", "well": "우리는 ~할 것이다/잘/우물",
    "they'll": "그들은 ~할 것이다", "theyll": "그들은 ~할 것이다",
    "i'd": "나는 ~하곤 했다/나는 ~할 것이다", "id": "나는 ~하곤 했다/나는 ~할 것이다",
    "you'd": "너는 ~하곤 했다/너는 ~할 것이다", "youd": "너는 ~하곤 했다/너는 ~할 것이다",
    "he'd": "그는 ~하곤 했다/그는 ~할 것이다", "hed": "그는 ~하곤 했다/그는 ~할 것이다",
    "she'd": "그녀는 ~하곤 했다/그녀는 ~할 것이다", "shed": "그녀는 ~하곤 했다/그녀는 ~할 것이다/헛간",
    "we'd": "우리는 ~하곤 했다/우리는 ~할 것이다", "wed": "우리는 ~하곤 했다/우리는 ~할 것이다/결혼하다",
    "they'd": "그들은 ~하곤 했다/그들은 ~할 것이다", "theyd": "그들은 ~하곤 했다/그들은 ~할 것이다",
    "let's": "～하자", "lets": "～하자/허락하다",
    "doesn't": "～하지 않는다", "doesnt": "～하지 않는다",
    "didn't": "～하지 않았다", "didnt": "～하지 않았다",
    "mom's": "엄마의", "moms": "엄마의",
    "dad's": "아빠의", "dads": "아빠의",
    "grandpa's": "할아버지의", "grandpas": "할아버지의",
    "wasn't": "～이 아니었다 (과거)", "wasnt": "～이 아니었다 (과거)",
    "weren't": "～들이 아니었다 (과거)", "werent": "～들이 아니었다 (과거)",
    "hasn't": "～한 적이 없다 (현재완료)", "hasnt": "～한 적이 없다 (현재완료)",
    "haven't": "～한 적이 없다 (현재완료)", "havent": "～한 적이 없다 (현재완료)",
    "hadn't": "～한 적이 없었다 (과거완료)", "hadnt": "～한 적이 없었다 (과거완료)",
    "isn't": "～이 아니다", "isnt": "～이 아니다",
    "aren't": "～들이 아니다", "arent": "～들이 아니다",
    
    "giggling": "킥킥 웃는",
    "slip": "미끄러짐/실수",
    "at": "~에서/~에게",
    "help": "돕다/도움",
    "looked": "보였다",
    "funny": "웃기는/재미있는"
  };  // =======================================================================
  // END OF FULLY UPDATED mockTranslations
  // =======================================================================
  
  if (mockTranslations[cleanedWord]) {
    return mockTranslations[cleanedWord];
  }
  
  // 새로운 단어 사전에서 단어 찾기
  const koreanWordDictionary = {
    "a": "하나의", 
    "all": "모든",
    "am": "~이다 (I am)",
    "are": "~이다 (you/we/they are)",
    "as": "~하자마자",
    "at": "~에",
    "back": "돌아오다",
    "balance": "균형을 잡다",
    "balls": "공들",
    "be": "~이다, 되다",
    "become": "~이 되다",
    "berries": "베리류 (산딸기 등)",
    "better": "더 나은",
    "big": "큰",
    "boat": "보트",
    "both": "둘 다",
    "bounce": "튀다",
    "bravest": "가장 용감한",
    "breaks": "부서지다",
    "bridge": "다리",
    "bug": "벌레",
    "build": "짓다, 만들다",
    "bushes": "덤불들",
    "can": "~할 수 있다",
    "can't": "~할 수 없다",
    "cannot": "~할 수 없다",
    "candies": "사탕들",
    "candy": "사탕",
    "cave": "동굴",
    "choose": "선택하다",
    "chocolate": "초콜릿",
    "climb": "오르다",
    "cliff": "절벽",
    "could": "~할 수 있었다",
    "couldn't": "~할 수 없었다",
    "crash": "충돌하다",
    "cross": "건너다",
    "crossing": "건널목",
    "daily": "매일",
    "darkness": "어둠",
    "don't": "~하지 않다",
    "down": "아래로",
    "eat": "먹다",
    "end": "끝나다",
    "everyone": "모두",
    "face": "얼굴",
    "fail": "실패하다",
    "feast": "축제, 잔치",
    "feathers": "깃털들",
    "feel": "느끼다",
    "field": "들판",
    "find": "찾다",
    "first": "첫 번째로",
    "fish": "물고기",
    "fix": "고치다",
    "flies": "날다 (3인칭 단수)",
    "flimsy": "약한, 얄팍한",
    "flow": "흐르다",
    "flower": "꽃",
    "flowerbed": "화단",
    "fluffy": "푹신한, 솜털 같은",
    "fly": "날다",
    "footprints": "발자국들",
    "for": "~을 위해",
    "friends": "친구들",
    "from": "~로부터",
    "funny": "웃기는",
    "gentle": "부드러운",
    "get": "얻다, 되다",
    "giant": "거대한",
    "giggling": "킥킥거리는",
    "glider": "글라이더",
    "glimmer": "희미하게 빛나다",
    "glow": "빛나다",
    "go": "가다",
    "grumpy": "심술궂은",
    "happen": "일어나다, 발생하다",
    "happy": "행복한",
    "heavy": "무거운",
    "help": "돕다",
    "here": "여기에",
    "hide": "숨다",
    "hiding": "숨어있는",
    "high": "높이",
    "hold": "잡다",
    "how": "어떻게",
    "hum": "콧노래를 부르다",
    "hurray": "만세",
    "i": "나",
    "icy": "얼음의, 몹시 찬",
    "idea": "생각, 아이디어",
    "if": "만약 ~라면",
    "in": "~안에",
    "inside": "~안에",
    "into": "~안으로",
    "is": "~이다",
    "island": "섬",
    "it": "그것",
    "its": "그것의",
    "juicy": "즙이 많은",
    "jump": "점프하다",
    "jungle": "정글",
    "just": "그냥, 단지",
    "kind": "친절한",
    "king": "왕",
    "kingdom": "왕국",
    "land": "착륙하다, 땅",
    "lead": "이끌다",
    "leaf": "잎",
    "leap": "뛰어넘다",
    "light": "빛",
    "like": "~처럼",
    "little": "작은",
    "long": "긴",
    "look": "보다",
    "looked": "보였다",
    "love": "사랑하다",
    "magic": "마법",
    "make": "만들다",
    "me": "나를",
    "miss": "놓치다",
    "monster": "괴물",
    "more": "더",
    "much": "많이",
    "muddy": "진흙투성이의",
    "my": "나의",
    "near": "~근처에",
    "never": "결코 ~않다",
    "new": "새로운",
    "now": "지금",
    "of": "~의",
    "offer": "제공하다",
    "on": "~위에",
    "our": "우리의",
    "over": "~위로",
    "parachute": "낙하산",
    "penguin": "펭귄",
    "pingping": "핑핑 (이름)",
    "poke": "찌르다",
    "pointy": "뾰족한",
    "pretty": "예쁜",
    "prickly": "뾰족뾰족한, 가시가 많은",
    "quite": "꽤",
    "raft": "뗏목",
    "reach": "도착하다",
    "really": "정말로",
    "ride": "타기, 탑승",
    "rivers": "강들",
    "rocks": "바위들",
    "rubber": "고무",
    "rule": "다스리다",
    "safe": "안전한",
    "safely": "안전하게",
    "sail": "항해하다",
    "search": "찾다",
    "see": "보다",
    "share": "나누다",
    "shout": "외치다",
    "shouts": "외침",
    "shy": "수줍어하는",
    "signal": "신호를 보내다",
    "silly": "어리석은",
    "situation": "상황",
    "slip": "미끄러짐",
    "small": "작은",
    "smarty": "똑똑한 체하는 사람",
    "snacks": "간식",
    "snow": "눈",
    "so": "그래서, 매우",
    "soft": "부드러운",
    "some": "약간의",
    "soon": "곧",
    "sparkle": "반짝임",
    "sparklebug": "스파클버그 (이름)",
    "speedy": "빠른",
    "steer": "조종하다",
    "stick": "막대기",
    "stones": "돌들",
    "stop": "멈추다",
    "successful": "성공적인",
    "super": "아주, 엄청난",
    "sweet": "달콤한",
    "swing": "흔들리다, 그네를 타다",
    "tail": "꼬리",
    "tall": "키가 큰",
    "test": "시험하다",
    "that": "저것, 그것",
    "the": "그",
    "them": "그것들을",
    "then": "그러면",
    "there": "거기에",
    "these": "이것들",
    "thing": "것",
    "this": "이것",
    "those": "저, 그",
    "tight": "꽉",
    "to": "~로",
    "toad": "두꺼비",
    "toto": "토토 (이름)",
    "towards": "~쪽으로",
    "tree": "나무",
    "tricky": "까다로운",
    "try": "시도하다",
    "too": "너무",
    "us": "우리를",
    "use": "사용하다",
    "very": "매우",
    "vine": "덩굴",
    "vines": "덩굴들",
    "voices": "목소리들",
    "want": "원하다",
    "warm": "따뜻한",
    "was": "~였다",
    "waterfall": "폭포",
    "way": "길",
    "we": "우리",
    "weak": "약한",
    "well": "잘",
    "what": "무엇",
    "when": "언제",
    "where": "어디에",
    "who": "누구",
    "whole": "전체의",
    "why": "왜",
    "wide": "넓은",
    "will": "~할 것이다",
    "with": "~와 함께",
    "wobbly": "흔들거리는",
    "won't": "~하지 않을 것이다",
    "would": "~할 것이다 (가정)",
    "wouldn't": "~하지 않을 것이다 (가정)",
    "you": "너, 당신",
    "your": "너의",
    "yummy": "맛있는"
  };
  
  if (koreanWordDictionary[cleanedWord]) {
    return koreanWordDictionary[cleanedWord];
  }
    console.warn(`[번역 누락] '${cleanedWord}'의 한글 뜻을 mockTranslations에 추가해주세요.`);
  return cleanedWord; // 괄호 없이 원래 단어 그대로 반환
}

// 음성 관련 상태 변수
let _voices = [];
let voicesPromise = null;
let voicesLoaded = false;

function getVoicesReliably() {
    // 이미 로드된 음성이 있는 경우 바로 반환
    if (voicesPromise && _voices.length > 0 && voicesLoaded) {
        return Promise.resolve(_voices);
    }
    
    // 새 Promise 생성
    if (!voicesPromise) {
        voicesPromise = new Promise((resolve, reject) => {
            // 음성 목록을 가져와서 저장하는 함수
            const tryGetAndResolveVoices = () => {
                try {
                    const currentVoices = window.speechSynthesis.getVoices();
                    if (currentVoices && currentVoices.length) {
                        _voices = currentVoices;
                        voicesLoaded = true;
                        resolve(_voices);
                        return true;
                    }
                } catch (e) {
                    console.error("음성 목록 가져오기 오류:", e);
                }
                return false;
            };

            // 즉시 음성 가져오기 시도
            if (tryGetAndResolveVoices()) return;

            // onvoiceschanged 이벤트 사용 (크롬, 에지 등)
            if ('onvoiceschanged' in window.speechSynthesis) {
                window.speechSynthesis.onvoiceschanged = () => {
                    if (tryGetAndResolveVoices()) {
                        window.speechSynthesis.onvoiceschanged = null;
                    } else {
                        // 이벤트 발생 후에도 음성이 없다면 짧은 지연 후 다시 시도
                        setTimeout(() => {
                            if(tryGetAndResolveVoices()){
                                window.speechSynthesis.onvoiceschanged = null;
                            } else {
                                console.warn("getVoicesReliably: 이벤트 후에도 음성이 로드되지 않았습니다.");
                                // 빈 배열이라도 반환하여 실패하지 않도록 함
                                _voices = [];
                                voicesLoaded = true;
                                resolve(_voices);
                                window.speechSynthesis.onvoiceschanged = null;
                            }
                        }, 300);
                    }
                };
                // onvoiceschanged 이벤트 트리거
                window.speechSynthesis.getVoices(); 
            } else {
                // 이벤트가 지원되지 않는 경우 폴링 방식으로 시도
                let attempts = 0;
                const maxAttempts = 25;  // 최대 시도 횟수 증가
                const intervalId = setInterval(() => {
                    attempts++;
                    if (tryGetAndResolveVoices()) {
                        clearInterval(intervalId);
                    } else if (attempts >= maxAttempts) {
                        clearInterval(intervalId);
                        console.warn("getVoicesReliably: 여러 번 시도해도 음성이 로드되지 않았습니다.");
                        // 빈 배열이라도 반환
                        _voices = [];
                        voicesLoaded = true;
                        resolve(_voices);
                    }
                }, 200);
            }
        }).catch(error => {
            console.error("getVoicesReliably Promise 내 오류:", error);
            voicesPromise = null;
            _voices = [];
            voicesLoaded = false;
            return [];
        });
    }
    
    return voicesPromise;
}

async function getVoice(lang = 'en-US', gender = 'female') {
  let availableVoices;
  try {
    // 음성 목록 가져오기
    availableVoices = await getVoicesReliably();
    console.log(`getVoice: 가져온 음성 수: ${availableVoices.length}`);
  } catch (error) {
    console.error("getVoice: 음성 로드 실패:", error);
    return null;
  }

  // 음성 목록이 비어있으면 null 반환
  if (!availableVoices || availableVoices.length === 0) {
      console.warn("getVoice: 사용 가능한 음성이 없습니다.");
      return null;
  }

  // 언어 정규화 (소문자로)
  const langNormalized = lang.toLowerCase();
  // 원하는 언어의 음성만 필터링
  const langVoices = availableVoices.filter(v => {
    try {
      return v.lang.toLowerCase() === langNormalized;
    } catch (e) {
      console.warn("음성 필터링 중 오류:", e);
      return false;
    }
  });

  // 해당 언어의 음성이 없는 경우
  if (langVoices.length === 0) {
    // 주 언어 코드만 사용해 다시 시도 (예: 'en-US' -> 'en')
    const primaryLang = langNormalized.split('-')[0];
    const primaryLangVoices = availableVoices.filter(v => {
      try {
        return v.lang.toLowerCase().startsWith(primaryLang);
      } catch (e) {
        return false;
      }
    });
    
    if (primaryLangVoices.length > 0) {
        return primaryLangVoices[0];
    }
  } else {
    // 성별에 따른 음성 선택
    if (gender === 'female') {
        // 여성 음성 필터링
        const femaleKeywords = ['female', 'zira', 'samantha', 'susan', 'eva', 
                              'google us english', '여자', ' 여성', 'siri'];
        
        const femaleVoices = langVoices.filter(v => {
          try {
            const nameLower = v.name.toLowerCase();
            return femaleKeywords.some(keyword => nameLower.includes(keyword));
          } catch (e) {
            return false;
          }
        });
        
        if (femaleVoices.length > 0) return femaleVoices[0];
    } else if (gender === 'male') {
        // 남성 음성 필터링
        const maleKeywords = ['male', 'daniel', 'tom', 'google us english', '남자', ' 남성'];
        
        const maleVoices = langVoices.filter(v => {
          try {
            const nameLower = v.name.toLowerCase();
            return maleKeywords.some(keyword => nameLower.includes(keyword));
          } catch (e) {
            return false;
          }
        });
        
        if (maleVoices.length > 0) return maleVoices[0];
    }
    
    // 성별 필터링에 실패한 경우 해당 언어의 첫 번째 음성 반환
    return langVoices[0];
  }

  // 기본 음성 찾기
  const defaultVoice = availableVoices.find(v => {
    try {
      return v.default === true;
    } catch (e) {
      return false;
    }
  });
  
  if (defaultVoice) return defaultVoice;
  
  // 어떤 음성이라도 있으면 첫 번째 것 반환
  if (availableVoices.length > 0) return availableVoices[0];

  console.warn("getVoice: 모든 대체 방법을 시도했으나 음성을 찾을 수 없습니다.");
  return null;
}


// 웹 음성 합성 API 초기화 플래그
let speechSynthesisInitialized = false;

/**
 * 웹 음성 합성 API를 초기화하고 음성을 가져오는 함수
 */
function initSpeechSynthesis() {
  if (speechSynthesisInitialized) return Promise.resolve();
  
  return new Promise((resolve) => {
    // speechSynthesis API가 있는지 확인
    if (!window.speechSynthesis) {
      console.error("음성 합성 API를 지원하지 않는 브라우저입니다.");
      resolve();
      return;
    }
    
    // 모바일 디바이스 감지
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    console.log(`음성 합성 초기화 시작 (디바이스: ${isMobile ? (isIOS ? 'iOS' : (isAndroid ? 'Android' : 'Mobile')) : 'PC'})`);
    
    // 이미 진행 중인 음성 취소
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn("음성 취소 중 오류:", e);
      }
    }
    
    // Chrome 버그 픽스 및 모바일 지원: resume()을 호출하여 일시정지된 음성 합성을 재개
    try {
      window.speechSynthesis.resume();
      
      // 모바일에서는 추가 resume 호출
      if (isMobile) {
        setTimeout(() => {
          try {
            window.speechSynthesis.resume();
          } catch (e) {}
        }, 100);
        
        setTimeout(() => {
          try {
            window.speechSynthesis.resume();
          } catch (e) {}
        }, 300);
      }
    } catch (e) {
      console.warn("음성 합성 재개 중 오류:", e);
    }
    
    // 모바일에서는 더미 발화로 시스템 준비
    if (isMobile) {
      try {
        // iOS용 빈 발화
        if (isIOS) {
          const iosWakeup = new SpeechSynthesisUtterance("");
          iosWakeup.volume = 0;
          iosWakeup.lang = 'en-US';
          window.speechSynthesis.speak(iosWakeup);
        }
        
        // Android용 짧은 단어 발화
        if (isAndroid) {
          const androidWakeup = new SpeechSynthesisUtterance("ready");
          androidWakeup.volume = 0;
          androidWakeup.lang = 'en-US';
          window.speechSynthesis.speak(androidWakeup);
        }
      } catch (e) {
        console.warn("모바일 음성 합성 웨이크업 중 오류:", e);
      }
    }
    
    // 음성 미리 로드
    getVoicesReliably()
      .then(() => {
        speechSynthesisInitialized = true;
        console.log("음성 합성 초기화 완료");
        resolve();
      })
      .catch(err => {
        console.error("음성 초기화 오류:", err);
        speechSynthesisInitialized = true; // 오류가 발생해도 초기화된 것으로 처리
        resolve(); // 오류가 발생해도 계속 진행
      });
  });
}

/**
 * 단어를 소리내어 읽어주는 함수
 * @param {string} word - 읽을 단어
 * @returns {Promise} - 음성 합성이 완료되면 resolve되는 Promise
 */
async function speakWord(word) {
  // 단어에서 알파벳과 숫자만 유지
  const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "").trim();
  if (!cleanWord) return Promise.resolve(); // 읽을 내용이 없으면 바로 종료
  
  // 모바일 디바이스 감지
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  console.log(`모바일 단어 읽기 요청: "${cleanWord}", 디바이스: ${isMobile ? (isIOS ? 'iOS' : (isAndroid ? 'Android' : 'Mobile')) : 'PC'}`);
  
  // 음성 합성 API 초기화
  await initSpeechSynthesis();
  
  // 음성 합성 API가 없으면 종료
  if (!window.speechSynthesis) {
    console.warn("음성 합성 API를 지원하지 않는 브라우저입니다.");
    return Promise.resolve();
  }
  
  // 모바일에서는 추가 준비 작업
  if (isMobile) {
    try {
      // 기존 음성 완전히 정리
      window.speechSynthesis.cancel();
      
      // 모바일에서는 resume을 여러 번 호출
      window.speechSynthesis.resume();
      
      // 추가 대기 시간
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // iOS에서는 더미 발화로 시스템 활성화
      if (isIOS) {
        const dummyUtter = new SpeechSynthesisUtterance("");
        dummyUtter.volume = 0;
        dummyUtter.lang = 'en-US';
        window.speechSynthesis.speak(dummyUtter);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Android에서는 짧은 단어로 시스템 활성화
      if (isAndroid) {
        const testUtter = new SpeechSynthesisUtterance("test");
        testUtter.volume = 0;
        testUtter.lang = 'en-US';
        window.speechSynthesis.speak(testUtter);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    } catch (e) {
      console.warn("모바일 음성 합성 준비 중 오류:", e);
    }
  }
  
  // 이미 진행 중인 음성 취소
  try {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
  } catch (e) {
    console.warn("기존 음성 취소 중 오류:", e);
  }

  return new Promise(async (resolve, reject) => {
    try {
      console.log(`"${cleanWord}" 단어 읽기 시작`);
      
      // 발화 객체 생성
      const utter = new window.SpeechSynthesisUtterance(cleanWord);
      utter.lang = 'en-US';
      utter.rate = 0.9; // 속도를 약간 느리게 조정
      utter.pitch = 1.0;
      utter.volume = 1.0;
      
      // 모바일에서는 더 긴 타임아웃 설정
      const timeoutDuration = isMobile ? 15000 : 10000;
      const timeoutId = setTimeout(() => {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
        console.warn(`"${cleanWord}" 단어 읽기 타임아웃 (${timeoutDuration}ms)`);
        resolve(); // 타임아웃이어도 오류로 처리하지 않음
      }, timeoutDuration);
      
      // 음성 선택 시도
      try {
        const voice = await getVoice('en-US', 'female');
        if (voice) {
          utter.voice = voice;
          console.log(`선택된 음성: ${voice.name}`);
        } else {
          console.warn(`'${cleanWord}' 단어의 en-US 여성 음성을 찾을 수 없습니다. 시스템 기본값 사용.`);
        }
      } catch (voiceErr) {
        console.warn(`음성 가져오기 오류: ${voiceErr.message}, 기본값 사용`);
      }
      
      // 이벤트 처리
      utter.onstart = () => {
        console.log(`"${cleanWord}" 음성 재생 시작됨`);
      };
      
      utter.onend = () => {
        clearTimeout(timeoutId);
        console.log(`"${cleanWord}" 단어 읽기 완료`);
        resolve();
      };
      
      utter.onerror = (event) => {
        clearTimeout(timeoutId);
        console.error(`"${cleanWord}" 단어 읽기 오류: ${event.error || '알 수 없는 오류'}`, event);
        
        // 오류가 발생해도 Promise를 reject하지 않고 resolve하여 앱 실행을 계속함
        resolve();
      };
      
      // 음성 합성 시작
      window.speechSynthesis.speak(utter);
      
      // 모바일에서는 추가 처리
      if (isMobile) {
        // 음성 시작 후 즉시 resume 호출 (모바일에서 중요)
        setTimeout(() => {
          try {
            window.speechSynthesis.resume();
          } catch (e) {}
        }, 50);
        
        // iOS에서는 추가로 한 번 더
        if (isIOS) {
          setTimeout(() => {
            try {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            } catch (e) {}
          }, 200);
        }
        
        // Android에서는 주기적인 resume 호출
        if (isAndroid) {
          const resumeInterval = setInterval(() => {
            try {
              if (window.speechSynthesis.speaking) {
                window.speechSynthesis.resume();
              } else {
                clearInterval(resumeInterval);
              }
            } catch (e) {
              clearInterval(resumeInterval);
            }
          }, 500);
          
          // 최대 10초 후 정리
          setTimeout(() => {
            clearInterval(resumeInterval);
          }, 10000);
        }
      }
      
    } catch (error) {
      console.error(`"${cleanWord}" 단어 읽기 중 예외 발생:`, error);
      
      // 예외가 발생해도 Promise를 reject하지 않고 resolve하여 앱 실행을 계속함
      resolve();
    }
  });
}

const englishFont = "21.168px Arial";
const translationFont = "17.0px Arial";

// =======================================================================
// START OF MODIFIED splitSentence FUNCTION
// =======================================================================
function splitSentence(sentenceText, isCurrentlyQuestion = null) {
    if (!sentenceText) return ["", ""];
    
    // 명시적 줄바꿈이 있는 경우 그대로 사용
    if (sentenceText.includes('\n')) {
        const parts = sentenceText.split('\n');
        return [parts[0].trim(), (parts[1] || "").trim()];
    }
    
    const words = sentenceText.trim().split(" ");
    const originalSentenceForShortCheck = sentenceText.trim();

    let line1Words = [];
    let line2Words = [];    // 의문사+조동사+주어+동사 패턴 확인 및 특별 처리
    console.log("🔍 Checking splitSentence for:", sentenceText);
    console.log("🔍 Words:", words);
    console.log("🔍 isCurrentlyQuestion:", isCurrentlyQuestion);
    
    const firstWordClean = words.length > 0 ? words[0].toLowerCase().replace(/[^a-z0-9']/g, "") : "";
    const secondWordClean = words.length > 1 ? words[1].toLowerCase().replace(/[^a-z0-9']/g, "") : "";
    
    console.log("🔍 First word clean:", firstWordClean, "isWh:", isWh(firstWordClean));
    console.log("🔍 Second word clean:", secondWordClean, "isAux:", isAux(secondWordClean));
    
    const isQuestionWordAuxSubjectVerbForm = isCurrentlyQuestion !== false && 
        words.length >= 4 && 
        isWh(firstWordClean) &&
        isAux(secondWordClean);
    
    console.log("🔍 Pattern match result:", isQuestionWordAuxSubjectVerbForm);    if (isQuestionWordAuxSubjectVerbForm) {
        // 의문사+조동사+주어+동사 패턴에서는 최소 4개 단어까지 첫째 줄에 포함
        // 추가로 동사를 찾아서 동사까지 포함시킴
        let verbIndex = 3; // 최소 4번째 단어(인덱스 3)까지는 포함
        
        for (let i = 3; i < words.length; i++) {
            const word = words[i].toLowerCase().replace(/[^a-z0-9']/g, "");
            console.log("🔍 Checking word at index", i, ":", word, "isVerb:", isVerb(word), "isAux:", isAux(word));
            
            // 특별 케이스: "do"는 의문문에서 일반동사로 취급
            const isMainVerb = (isVerb(word) && !isAux(word)) || 
                               (word === "do" && i > 1); // 2번째 위치 이후의 "do"는 일반동사
            
            if (isMainVerb) {
                verbIndex = i;
                console.log("✅ Found verb at index", i, ":", word);
                break;
            }
        }
        
        // 동사까지 또는 최소 4개 단어까지 첫째 줄에 포함
        line1Words = words.slice(0, verbIndex + 1);
        line2Words = words.slice(verbIndex + 1);        console.log("🎯 Question word + aux + subject + verb pattern detected, forcing verb to line 1");
        console.log("  - Line 1:", line1Words.join(" "));
        console.log("  - Line 2:", line2Words.join(" "));
        return [line1Words.join(" "), line2Words.join(" ").trim()];
    }

    let modalHavePpFoundAndSplit = false;

    for (let i = 0; i < words.length; i++) {
        if (isAux(words[i])) {
            let modalIdx = i;
            let haveIdx = -1;
            let ppIdx = -1;

            if (modalIdx + 2 < words.length &&
                words[modalIdx + 1].toLowerCase().replace(/'/g, "") === "have" &&
                isPastParticiple(words[modalIdx + 2])) {
                haveIdx = modalIdx + 1;
                ppIdx = modalIdx + 2;
            }
            else if (modalIdx + 3 < words.length &&
                     words[modalIdx + 2].toLowerCase().replace(/'/g, "") === "have" &&
                     isPastParticiple(words[modalIdx + 3])) {
                haveIdx = modalIdx + 2;
                ppIdx = modalIdx + 3;
            }

            if (ppIdx !== -1) {
                let endIndexForLine1 = ppIdx + 1;
                line1Words = words.slice(0, endIndexForLine1);
                line2Words = words.slice(endIndexForLine1);
                modalHavePpFoundAndSplit = true;
                break;
            }
        }
    }

    if (!modalHavePpFoundAndSplit) {
        const isEffectiveQuestionType = (isCurrentlyQuestion !== null) ? isCurrentlyQuestion : originalSentenceForShortCheck.endsWith('?');
        let wordsConsumed = 0;
        let wordsConsumedForLine1 = 0;

        if (isEffectiveQuestionType) {
            if (words.length > 0) {
                if (isWh(words[0])) {
                    line1Words.push(words[0]); wordsConsumed = 1;
                    if (wordsConsumed < words.length && isAux(words[wordsConsumed])) {
                        line1Words.push(words[wordsConsumed++]);
                        if (wordsConsumed < words.length) {
                            line1Words.push(words[wordsConsumed++]);
                            if (wordsConsumed < words.length && isVerb(words[wordsConsumed]) && !isAux(words[wordsConsumed])) {
                                line1Words.push(words[wordsConsumed++]);
                            }
                        }
                    } else if (wordsConsumed < words.length && (isVerb(words[wordsConsumed]) && !isAux(words[wordsConsumed]))) {
                        line1Words.push(words[wordsConsumed++]);
                    } else if (wordsConsumed < words.length) {
                        line1Words.push(words[wordsConsumed++]);
                        if (wordsConsumed < words.length && (isAux(words[wordsConsumed]) || (isVerb(words[wordsConsumed]) && !isAux(words[wordsConsumed])) ) ) {
                            if (line1Words.length < 4) { line1Words.push(words[wordsConsumed++]); }
                        }
                    }
                } else if (isAux(words[0])) {
                    line1Words.push(words[0]); wordsConsumed = 1;
                    if (wordsConsumed < words.length) {
                        line1Words.push(words[wordsConsumed++]);
                        if (wordsConsumed < words.length && isVerb(words[wordsConsumed]) && !isAux(words[wordsConsumed])) {
                            line1Words.push(words[wordsConsumed++]);
                        }
                    }
                }
            }
            if (line1Words.length === 0 && words.length > 0) {
                let splitIdx = (words.length <= 3) ? words.length : Math.min(2, words.length);
                if (words.length === 4) splitIdx = 2;
                else if (words.length === 5) splitIdx = 3;
                line1Words = words.slice(0, splitIdx);
                wordsConsumed = line1Words.length;
            }
            line2Words = words.slice(wordsConsumed);
        } else { // Statement
            let subjectEndIdx = -1;
            for (let k = 0; k < words.length; k++) {
                if (isAux(words[k]) || (isVerb(words[k]) && !isAux(words[k])) || isVing(words[k]) || isBeen(words[k])) {
                    subjectEndIdx = k; break;
                }
            }
            if (subjectEndIdx > 0) { // Subject found, and it's not the first word
                for (let k = 0; k < subjectEndIdx; k++) line1Words.push(words[k]);
                wordsConsumedForLine1 = subjectEndIdx;

                // Add auxiliary if present
                if (wordsConsumedForLine1 < words.length && isAux(words[wordsConsumedForLine1])) {
                    line1Words.push(words[wordsConsumedForLine1++]);
                }
                // Add main verb (or -ing form, or 'been') if present
                let verbAddedToLine1 = false;
                if (wordsConsumedForLine1 < words.length && (isVerb(words[wordsConsumedForLine1]) || isVing(words[wordsConsumedForLine1]) || isBeen(words[wordsConsumedForLine1]))) {
                    let addVerb = true;
                    // Avoid duplicating aux if it's also identified as a verb (e.g. "can")
                    if (line1Words.length > subjectEndIdx && line1Words.length > 0) {
                        const lastWordInL1 = line1Words[line1Words.length - 1].toLowerCase().replace(/[^a-z0-9']/g, '');
                        const currentVerbCandidate = words[wordsConsumedForLine1].toLowerCase().replace(/[^a-z0-9']/g, '');
                        if (lastWordInL1 === currentVerbCandidate && isAux(words[wordsConsumedForLine1])) addVerb = false;
                    }
                    if (addVerb) { line1Words.push(words[wordsConsumedForLine1]); verbAddedToLine1 = true; }
                    wordsConsumedForLine1++;
                }
                // If a verb was added and there's more, add one more word (likely an object or particle)
                if (verbAddedToLine1 && wordsConsumedForLine1 < words.length && line1Words.length < 4) { // Limit line 1 length
                    line1Words.push(words[wordsConsumedForLine1++]);
                }
                line2Words = words.slice(wordsConsumedForLine1);

            } else if (subjectEndIdx === 0 && words.length > 0) { // First word is a verb/aux
                line1Words.push(words[0]); wordsConsumedForLine1 = 1;
                let verbAddedToLine1 = (isVerb(words[0]) && !isAux(words[0])) || isVing(words[0]) || isBeen(words[0]);

                // If first word was Aux, and next is Verb/Ving/Been (not Aux), add it
                if (wordsConsumedForLine1 < words.length && isAux(words[0]) &&
                    (isVerb(words[wordsConsumedForLine1]) || isVing(words[wordsConsumedForLine1]) || isBeen(words[wordsConsumedForLine1])) &&
                    !isAux(words[wordsConsumedForLine1])) {
                    line1Words.push(words[wordsConsumedForLine1++]); verbAddedToLine1 = true;
                }
                // If a verb was part of line 1, and there's more, add one more word if line is short
                if (verbAddedToLine1 && wordsConsumedForLine1 < words.length && line1Words.length < 3) {
                    line1Words.push(words[wordsConsumedForLine1++]);
                }
                line2Words = words.slice(wordsConsumedForLine1);
            } else { // No clear subject-verb split early, or very short sentence
                const half = Math.max(1, Math.ceil(words.length / 2));
                line1Words = words.slice(0, half);
                line2Words = words.slice(half);
            }
        }
    }
    // If sentence is very short (<=4 words and <35 chars), put all on line 1,
    // unless it was a modal+have+pp split where line 2 was intentionally empty.
    if (words.length <= 4 && originalSentenceForShortCheck.length < 35) {
        if (!(modalHavePpFoundAndSplit && line2Words.length === 0)) {
            line1Words = words.slice(); // All words to line1
            line2Words = [];          // Line2 becomes empty
        }
    }
    // Ensure line1 is not empty if original sentence had words
    if (line1Words.length === 0 && words.length > 0) {
        line1Words = [words[0]];
        line2Words = words.slice(1);
    }

    return [line1Words.join(" "), line2Words.join(" ").trim()];
}
// =======================================================================
// END OF MODIFIED splitSentence FUNCTION
// =======================================================================

// --- START: Word Animation Variables and Functions (Refactored for multiple animations) ---
let activeAnimations = []; // Holds all currently active word animations

// Duration and height constants for word animations
const WORD_ANIM_DURATION_UP = 220;
const WORD_ANIM_DURATION_DOWN = 550;
const WORD_ANIM_MAX_HEIGHT = 18;

// --- START: 의문사 복제본 관련 변수들 ---
let questionWordClones = []; // 생성된 의문사 복제본들을 저장
const CLONE_OFFSET_Y = 33; // 의문사 복제본이 원본에서 위로 얼마나 떨어져 있을지 (7px 내림)
let cloneCreatedForCurrentQuestion = false; // 현재 질문에서 복제본이 이미 생성되었는지 추적
// --- END: 의문사 복제본 관련 변수들 ---

// --- START: 주어+조동사 복제본 관련 변수들 ---
let subjectAuxClones = []; // 생성된 주어+조동사 복제본들을 저장
const SUBJECT_AUX_CLONE_OFFSET_Y = 50; // 주어+조동사 복제본이 원본에서 위로 얼마나 떨어져 있을지 (의문사 복제본보다 10px 더 위)
const SUBJECT_AUX_CLONE_OFFSET_X = 15; // 주어+조동사 복제본이 의문사 복제본에서 오른쪽으로 15px 떨어져 있을지
let cloneCreatedForCurrentAnswer = false; // 현재 답변에서 복제본이 이미 생성되었는지 추적
// --- END: 주어+조동사 복제본 관련 변수들 ---

// --- START: 동사 복제본 관련 변수들 ---
let verbClones = []; // 생성된 동사 복제본들을 저장
// VERB_CLONE_OFFSET_X는 동적으로 계산됨 (adjustedSpaceWidth와 동일)
// --- END: 동사 복제본 관련 변수들 ---

// --- START: 바운스 애니메이션 관련 변수들 ---
let activeBounceAnimations = []; // 활성 바운스 애니메이션들을 저장
const BOUNCE_DURATION_UP = WORD_ANIM_DURATION_UP; // 올라가는 시간: 220ms (웨이브와 동일)
const BOUNCE_DURATION_DOWN = WORD_ANIM_DURATION_DOWN; // 내려오는 시간: 550ms (웨이브와 동일)
const BOUNCE_HEIGHT = WORD_ANIM_MAX_HEIGHT; // 바운스 높이: 18px (웨이브와 동일)
const BOUNCE_DELAY_BETWEEN_WORDS = 100; // 단어 간 바운스 지연 시간 (ms)
// --- END: 바운스 애니메이션 관련 변수들 ---


function startWordWaveAnimation(wordRect, drawingContext, enableCloneGeneration = true) {
  if (!wordRect || !wordRect.word || !drawingContext) return;

  // 의문사인지 확인
  const isQuestionWordToClone = isWh(wordRect.word.toLowerCase().replace(/[^a-z0-9']/g, ""));
  
  // 조동사인지 확인
  const isAuxiliaryWord = isAux(wordRect.word.toLowerCase().replace(/[^a-z0-9']/g, ""));

  // 의문사인 경우, 복제본 생성이 허용되고 현재 질문에서 복제본이 아직 생성되지 않은 경우에만 기존 복제본들을 제거
  if (isQuestionWordToClone && enableCloneGeneration && !cloneCreatedForCurrentQuestion) {
    // 동일한 의문사의 기존 복제본들 제거
    questionWordClones = questionWordClones.filter(clone => 
      clone.word.toLowerCase().replace(/[^a-z0-9']/g, "") !== wordRect.word.toLowerCase().replace(/[^a-z0-9']/g, "")
    );
  }

  // Remove any existing animation for this *specific* wordRect to avoid duplicates if re-triggered quickly
  activeAnimations = activeAnimations.filter(anim => {
      // Basic check: if word, x, y, lineIndex, and type (question/answer) are the same
      return !(anim.targetWordRect.word === wordRect.word &&
               Math.abs(anim.targetWordRect.x - wordRect.x) < 1 &&
               Math.abs(anim.targetWordRect.y - wordRect.y) < 1 &&
               anim.targetWordRect.lineIndex === wordRect.lineIndex &&
               anim.targetWordRect.isQuestionWord === wordRect.isQuestionWord);
  });  const newAnimation = {
    targetWordRect: { ...wordRect }, // Store a copy of the wordRect
    wordText: wordRect.word,
    startTime: performance.now(),
    durationUp: WORD_ANIM_DURATION_UP,
    durationDown: WORD_ANIM_DURATION_DOWN,
    maxHeight: WORD_ANIM_MAX_HEIGHT,
    isActive: true, // Indicates this animation object is live
    charPositions: [], // { char, x, originalY, currentY, width }
    isQuestionWord: isQuestionWordToClone, // 의문사 여부 저장
    isAuxiliaryWord: isAuxiliaryWord, // 조동사 여부 저장
    cloneCreated: false, // 복제본 생성 여부 추적 (매번 새로 초기화)
    enableCloneGeneration: enableCloneGeneration // 복제본 생성 허용 여부
  };

  const letters = newAnimation.wordText.split('');
  let currentDeferredX = 0;
  drawingContext.font = englishFont; // Ensure context has the correct font for measurement

  letters.forEach((char) => {
    const charWidth = drawingContext.measureText(char).width;
    newAnimation.charPositions.push({
      char: char,
      x: wordRect.x + currentDeferredX, // Base X from the wordRect
      originalY: wordRect.y,           // Base Y (center of text line) from the wordRect
      currentY: wordRect.y,
      width: charWidth
    });
    currentDeferredX += charWidth;
  });

  activeAnimations.push(newAnimation);
}

function updateWordAnimations(currentTime) { // Plural, as it updates all active animations
  for (let i = activeAnimations.length - 1; i >= 0; i--) {
    const anim = activeAnimations[i];

    if (!anim.isActive || !anim.targetWordRect) { // Should ideally not happen if managed well
      activeAnimations.splice(i, 1);
      continue;
    }

    const elapsedTime = currentTime - anim.startTime;
    let yOffsetFactor;    if (elapsedTime < anim.durationUp) {
      // Up phase
      const t = elapsedTime / anim.durationUp;
      yOffsetFactor = t * (2 - t); // ease-out quad      
      
      // 의문사가 정점(80% 지점)에 도달했을 때 복제본 생성 (복제본 생성이 허용된 경우에만)
      if (anim.isQuestionWord && !anim.cloneCreated && anim.enableCloneGeneration && !cloneCreatedForCurrentQuestion && t >= 0.8) {
        createQuestionWordClone(anim);        anim.cloneCreated = true;
        cloneCreatedForCurrentQuestion = true; // 현재 질문에 대한 복제본 생성 완료 플래그 설정
        console.log("✅ Question word clone created - flag set to true");
        console.log("  - Question index:", currentQuestionSentenceIndex);
        console.log("  - Clone word:", anim.wordText);
      }
        // 조동사가 정점(80% 지점)에 도달했을 때 주어+조동사 복제본 생성 (복제본 생성이 허용된 경우에만)
      if (anim.isAuxiliaryWord && !anim.cloneCreated && anim.enableCloneGeneration && !cloneCreatedForCurrentAnswer && t >= 0.8) {
        // 해당 조동사와 함께 애니메이션되는 주어 찾기
        const subjectAnimation = findSubjectAnimationForAux(anim);
        if (subjectAnimation) {
          createSubjectAuxClone(subjectAnimation, anim);
          
          // 질문 문장인 경우 동사 복제본도 함께 생성 (애니메이션 없이)
          if (currentQuestionSentence && anim.targetWordRect.isQuestionWord) {
            const verbWordRect = findVerbWordRectForQuestion();
            if (verbWordRect) {
              createVerbClone(verbWordRect);
            }
          }
          
          anim.cloneCreated = true;
          cloneCreatedForCurrentAnswer = true; // 현재 답변에 대한 복제본 생성 완료 플래그 설정
        }
      }
    } else if (elapsedTime < anim.durationUp + anim.durationDown) {
      // Down phase
      const t = (elapsedTime - anim.durationUp) / anim.durationDown;
      yOffsetFactor = Math.pow(1 - t, 2); // ease-in quad (but for offset, so it goes from 1 down to 0)
    } else {
      // Animation finished
      activeAnimations.splice(i, 1); // Remove from active list
      continue;
    }

    const yOffset = yOffsetFactor * anim.maxHeight;

    anim.charPositions.forEach((cp) => {
      cp.currentY = cp.originalY - yOffset; // Apply offset to each character
    });
  }
}

// 의문사 복제본 생성 함수
function createQuestionWordClone(animation) {
  if (!animation || !animation.targetWordRect || !animation.charPositions) return;
  
  // 패턴2가 감지된 경우 복제본 생성 무시
  if (window.lastDetectedPattern === "pattern2") {
    console.log("⛔ 패턴2 감지됨: 의문사 복제본 생성 취소");
    return;
  }
  
  if (!animation.enableCloneGeneration) {
    console.log("⛔ enableCloneGeneration이 false: 의문사 복제본 생성 취소");
    return;
  }
  
  // 현재 애니메이션의 고점 위치 계산 (의문사가 현재 도달한 위치)
  const currentAnimationHighPoint = animation.targetWordRect.y - animation.maxHeight;
  
  const clone = {
    word: animation.wordText,
    originalX: animation.targetWordRect.x,
    originalY: currentAnimationHighPoint, // 고점에서 시작
    targetY: currentAnimationHighPoint - CLONE_OFFSET_Y, // 고점에서 50px 더 위로
    currentY: currentAnimationHighPoint, // 고점에서 시작
    charPositions: animation.charPositions.map(cp => ({
      char: cp.char,
      x: cp.x,
      originalY: currentAnimationHighPoint, // 모든 문자도 고점에서 시작
      currentY: currentAnimationHighPoint,
      width: cp.width
    })),
    createdTime: performance.now(),
    animationPhase: 'moving_up', // 'moving_up', 'stationary'
    alpha: 1.0
  };
  
  console.log("✅ 의문사 복제본 생성됨:", clone.word);
  questionWordClones.push(clone);
}

// 의문사 복제본 업데이트 함수
function updateQuestionWordClones(currentTime) {
  for (let i = questionWordClones.length - 1; i >= 0; i--) {
    const clone = questionWordClones[i];
    const elapsedTime = currentTime - clone.createdTime;
    
    if (clone.animationPhase === 'moving_up') {
      const moveUpDuration = 300; // 300ms 동안 위로 이동
      if (elapsedTime < moveUpDuration) {
        const t = elapsedTime / moveUpDuration;
        const easedT = 1 - Math.pow(1 - t, 3); // ease-out cubic for smooth stop
        clone.currentY = clone.originalY + (clone.targetY - clone.originalY) * easedT;
        
        // 각 문자 위치도 업데이트
        clone.charPositions.forEach(cp => {
          cp.currentY = cp.originalY + (clone.targetY - cp.originalY) * easedT;
        });
      } else {
        // 이동 완료, 정지 상태로 전환
        clone.animationPhase = 'stationary';
        clone.currentY = clone.targetY;
        clone.charPositions.forEach(cp => {
          cp.currentY = clone.targetY;
        });
      }
    }
    
    // 자동 제거 로직 제거 - 수동으로만 제거됨
  }
}

// 의문사 복제본을 수동으로 제거하는 함수 (주어+조동사 복제본과 동사 복제본도 함께 제거)
function clearQuestionWordClones() {
  console.log("🧹 Clearing question word clones - before:", questionWordClones.length, "clones");
  questionWordClones = [];
  // 의문사 복제본이 사라질 때 주어+조동사 복제본과 동사 복제본도 동시에 제거
  clearSubjectAuxClones();
  clearVerbClones();
  console.log("🧹 Question word clones cleared");
}

// --- START: 주어+조동사 복제본 관련 함수들 ---

// 주어+조동사 복제본 생성 함수 (원래 순서 유지)
function createSubjectAuxClone(subjectAnimation, auxAnimation) {
  if (!subjectAnimation || !auxAnimation || !subjectAnimation.targetWordRect || !auxAnimation.targetWordRect) return;
  
  // 패턴2가 감지된 경우 복제본 생성 무시
  if (window.lastDetectedPattern === "pattern2") {
    console.log("⛔ 패턴2 감지됨: 주어+조동사 복제본 생성 취소");
    return;
  }
  
  if (!auxAnimation.enableCloneGeneration) {
    console.log("⛔ enableCloneGeneration이 false: 주어+조동사 복제본 생성 취소");
    return;
  }
  
  // 현재 조동사 애니메이션의 고점 위치 계산
  const currentAnimationHighPoint = auxAnimation.targetWordRect.y - auxAnimation.maxHeight;
  
  // 조동사 + 주어 텍스트 결합 (원래 순서 유지)
  const combinedText = auxAnimation.wordText + " " + subjectAnimation.wordText;
  
  // 의문사 복제본이 있는 경우 그 끝 위치를 찾아서 10px 떨어뜨리기
  let targetX = auxAnimation.targetWordRect.x; // 기본값: 조동사 위치
  
  if (questionWordClones.length > 0) {
    const questionClone = questionWordClones[0]; // 첫 번째 의문사 복제본 사용
    if (questionClone.charPositions && questionClone.charPositions.length > 0) {
      // 의문사 복제본의 마지막 문자 위치 + 너비 + 10px
      const lastChar = questionClone.charPositions[questionClone.charPositions.length - 1];
      targetX = lastChar.x + lastChar.width + SUBJECT_AUX_CLONE_OFFSET_X;
    }
  }  const clone = {
    subjectWord: subjectAnimation.wordText,
    auxWord: auxAnimation.wordText,
    combinedText: combinedText,
    originalX: targetX, // 의문사 복제본 끝에서 10px 떨어진 위치
    originalY: currentAnimationHighPoint,
    targetY: currentAnimationHighPoint - CLONE_OFFSET_Y, // 의문사 복제본과 같은 높이로
    currentY: currentAnimationHighPoint,
    charPositions: [], // 결합된 텍스트의 각 문자 위치
    createdTime: performance.now(),
    animationPhase: 'moving_up',
    alpha: 1.0,
    waitStartTime: 0, // 대기 시작 시간
    swapStartTime: 0, // 위치 교환 시작 시간
    isSwapping: false, // 위치 교환 중인지 여부
    auxLength: auxAnimation.wordText.length, // 조동사 길이
    spaceIndex: auxAnimation.wordText.length, // 공백 위치 인덱스
    subjectWidth: 0, // 주어 너비 (계산될 예정)
    auxWidth: 0    // 조동사 너비 (계산될 예정)
  };
    // 결합된 텍스트의 문자 위치 계산
  ctx.font = englishFont;
  const letters = combinedText.split('');
  let currentX = clone.originalX;
  
  // 조동사와 주어의 너비를 계산하기 위한 변수
  let auxWidthSum = 0;
  let subjectWidthSum = 0;
  let isInAux = true; // 조동사 부분인지 여부
  let isSpace = false; // 공백인지 여부
  
  letters.forEach((char, index) => {
    const charWidth = ctx.measureText(char).width;
    
    // 조동사/주어 너비 누적
    if (index < clone.auxLength) {
      auxWidthSum += charWidth;
    } else if (index > clone.auxLength) { // 공백 다음이면 주어
      subjectWidthSum += charWidth;
    }
    
    clone.charPositions.push({
      char: char,
      x: currentX,
      originalY: currentAnimationHighPoint,
      currentY: currentAnimationHighPoint,
      width: charWidth
    });
    currentX += charWidth;
  });
  
  // 계산된 너비 저장
  clone.auxWidth = auxWidthSum;
  clone.subjectWidth = subjectWidthSum;
  
  subjectAuxClones.push(clone);
}

// 주어+조동사 복제본 업데이트 함수
function updateSubjectAuxClones(currentTime) {
  for (let i = subjectAuxClones.length - 1; i >= 0; i--) {
    const clone = subjectAuxClones[i];
    const elapsedTime = currentTime - clone.createdTime;
    
    if (clone.animationPhase === 'moving_up') {
      const moveUpDuration = 300; // 300ms 동안 위로 이동
      if (elapsedTime < moveUpDuration) {
        const t = elapsedTime / moveUpDuration;
        const easedT = 1 - Math.pow(1 - t, 3); // ease-out cubic
        clone.currentY = clone.originalY + (clone.targetY - clone.originalY) * easedT;
        
        // 각 문자의 위치도 업데이트
        clone.charPositions.forEach(cp => {
          cp.currentY = cp.originalY + (clone.targetY - cp.originalY) * easedT;
        });
      } else {
        // 이동 완료, 잠시 대기 상태로 전환
        clone.animationPhase = 'waiting';
        clone.waitStartTime = currentTime;
        clone.currentY = clone.targetY;
        
        // 각 문자별 원래 위치 저장
        clone.charPositions.forEach(cp => {
          cp.currentY = clone.targetY;
          cp.originalX = cp.x;
          cp.originalY = cp.currentY;
        });
      }
    } else if (clone.animationPhase === 'waiting') {
      // 2초 대기 후 위치 교환 시작
      const waitDuration = 2000; // 2초(2000ms) 대기
      const waitElapsedTime = currentTime - clone.waitStartTime;
      
      if (waitElapsedTime >= waitDuration) {
        // 대기 완료, 위치 교환 애니메이션 시작
        clone.animationPhase = 'swapping';
        clone.swapStartTime = currentTime;
      }    } else if (clone.animationPhase === 'swapping') {
      const swapDuration = 2000; // 2초(2000ms) 동안 위치 교환
      const swapElapsedTime = currentTime - clone.swapStartTime;
        if (swapElapsedTime < swapDuration) {
        const t = swapElapsedTime / swapDuration;
        const easedT = t; // 선형 애니메이션으로 시작
        
        // 조동사와 주어 부분 나누기
        // 조동사 부분(0 ~ auxLength)
        const auxChars = clone.charPositions.slice(0, clone.auxLength);
        // 공백(auxLength)
        const spaceChar = clone.charPositions[clone.auxLength];
        // 주어 부분(auxLength+1 ~ end)
        const subjectChars = clone.charPositions.slice(clone.auxLength + 1);
        
        // 원래 위치 계산
        const auxStartX = clone.charPositions[0].originalX;
        const subjectStartX = clone.charPositions[clone.auxLength + 1].originalX;
        const auxWidth = auxChars.reduce((sum, c) => sum + c.width, 0);
        const subjectWidth = subjectChars.reduce((sum, c) => sum + c.width, 0);
        
        // 주어 전체 블록 이동 거리 계산
        const subjectDistanceToMove = auxStartX - subjectStartX;
        
        // 조동사 전체 블록 이동 거리 계산
        const auxDistanceToMove = (subjectStartX - auxStartX) + (subjectWidth - auxWidth + spaceChar.width);
        
        // 반원 계산을 위한 변수
        const arcRadius = 40; // 반원의 반지름
        const baseY = clone.targetY; // 기본 Y 위치
        
        // 주어 문자들 이동 (그룹으로 이동하면서 반원을 그리며)
        subjectChars.forEach((cp, idx) => {
          const relativePosition = cp.originalX - subjectStartX; // 주어 시작점으로부터 상대적 위치
          cp.x = subjectStartX + relativePosition + (subjectDistanceToMove * easedT);
          
          // 반원 형태로 이동 (sin 함수 사용)
          // t가 0→1로 증가하므로 sin(t*π)는 0→1→0의 형태
          // 이를 활용하여 Y축으로 위로 올라갔다가 내려오는 반원 형태 구현
          const yOffset = Math.sin(easedT * Math.PI) * arcRadius;
          cp.currentY = baseY - yOffset; // 위로 올라갔다가 내려옴
        });
        
        // 공백 위치 조정 (주어 뒤에 붙어서 이동하며 같은 반원 형태)
        const lastSubjectChar = subjectChars[subjectChars.length - 1];
        spaceChar.x = lastSubjectChar ? lastSubjectChar.x + lastSubjectChar.width : subjectStartX + (subjectDistanceToMove * easedT);
        const spaceYOffset = Math.sin(easedT * Math.PI) * arcRadius;
        spaceChar.currentY = baseY - spaceYOffset;
        
        // 조동사 문자들 이동 (그룹으로 수평 이동)
        auxChars.forEach((cp, idx) => {
          const relativePosition = cp.originalX - auxStartX; // 조동사 시작점으로부터 상대적 위치
          cp.x = auxStartX + relativePosition + (auxDistanceToMove * easedT);
          // Y 위치 유지 (수평 이동)
          cp.currentY = baseY;
        });} else {
        // 교환 완료, 정지 상태로 전환
        clone.animationPhase = 'stationary';
        
        // 최종 위치 설정 (완전히 교환된 상태)
        // 조동사 부분
        const auxChars = clone.charPositions.slice(0, clone.auxLength);
        // 공백
        const spaceChar = clone.charPositions[clone.auxLength];
        // 주어 부분
        const subjectChars = clone.charPositions.slice(clone.auxLength + 1);
        
        // 원래 위치 계산
        const auxStartX = clone.charPositions[0].originalX;
        const subjectStartX = clone.charPositions[clone.auxLength + 1].originalX;
        
        // 주어와 조동사의 최종 위치 계산        // 주어를 조동사 위치로 이동하되 상대적 간격 유지
        const subjectDistanceToMove = auxStartX - subjectStartX;
        subjectChars.forEach(cp => {
          const relativePosition = cp.originalX - subjectStartX; // 주어 시작점으로부터 상대적 위치
          cp.x = auxStartX + relativePosition;
          cp.currentY = clone.targetY; // Y 위치 복원 (반원 이동 후 원래 높이로)
        });
        
        // 공백 위치 조정 (주어 뒤에 붙임)
        const lastSubjectChar = subjectChars[subjectChars.length - 1];
        spaceChar.x = lastSubjectChar ? lastSubjectChar.x + lastSubjectChar.width : auxStartX;
        spaceChar.currentY = clone.targetY; // Y 위치 복원
        
        // 조동사를 주어 위치로 이동하되 상대적 간격 유지
        const auxDistanceToMove = (subjectStartX - auxStartX);
        auxChars.forEach(cp => {
          const relativePosition = cp.originalX - auxStartX; // 조동사 시작점으로부터 상대적 위치
          cp.x = spaceChar.x + spaceChar.width + relativePosition;
        });
      }
    }
  }
}

// 주어+조동사 복제본을 수동으로 제거하는 함수
function clearSubjectAuxClones() {
  subjectAuxClones = [];
}

// --- START: 동사 복제본 관련 함수들 ---

// 동사 복제본 생성 함수 (부드러운 애니메이션으로 원본 위치에서 목표 위치로 이동)
function createVerbClone(verbWordRect) {
  if (!verbWordRect) return;
  
  // 패턴2가 감지된 경우 동사 복제본 생성 무시
  if (window.lastDetectedPattern === "pattern2") {
    console.log("⛔ 패턴2 감지됨: 동사 복제본 생성 취소");
    return;
  }
  
  // adjustedSpaceWidth를 동적으로 계산 (다른 단어들 간의 간격과 동일하게)
  ctx.font = englishFont;
  const originalSpaceWidth = ctx.measureText(" ").width;
  const adjustedSpaceWidth = originalSpaceWidth * 1.20;
  
  // 주어+조동사 복제본이 있는 경우 그 끝 위치를 찾아서 adjustedSpaceWidth만큼 떨어뜨리기
  let targetX = verbWordRect.x; // 기본값: 원본 동사 위치
  let targetY = verbWordRect.y - CLONE_OFFSET_Y; // 의문사 복제본과 같은 높이
  
  if (subjectAuxClones.length > 0) {
    const subjectAuxClone = subjectAuxClones[0]; // 첫 번째 주어+조동사 복제본 사용
    if (subjectAuxClone.charPositions && subjectAuxClone.charPositions.length > 0) {
      // 주어+조동사 복제본의 마지막 문자 위치 + 너비 + adjustedSpaceWidth
      const lastChar = subjectAuxClone.charPositions[subjectAuxClone.charPositions.length - 1];
      targetX = lastChar.x + lastChar.width + adjustedSpaceWidth;
      targetY = subjectAuxClone.targetY; // 주어+조동사 복제본과 같은 높이
    }
  }
  
  const clone = {
    word: verbWordRect.word,
    originalX: verbWordRect.x, // 원본 동사의 실제 위치에서 시작
    originalY: verbWordRect.y, // 원본 동사의 실제 위치에서 시작
    targetX: targetX, // 목표 X 위치
    targetY: targetY, // 목표 Y 위치
    currentX: verbWordRect.x, // 현재 X 위치 (원본에서 시작)
    currentY: verbWordRect.y, // 현재 Y 위치 (원본에서 시작)
    charPositions: [],
    createdTime: performance.now(),
    animationPhase: 'moving_up', // 부드러운 이동 애니메이션 상태
    alpha: 1.0
  };
  
  // 동사 텍스트의 문자 위치 계산 (초기에는 원본 위치)
  const letters = clone.word.split('');
  let currentX = clone.originalX;
  
  letters.forEach((char) => {
    const charWidth = ctx.measureText(char).width;
    clone.charPositions.push({
      char: char,
      x: currentX,
      originalY: clone.originalY,
      currentY: clone.originalY,
      width: charWidth
    });
    currentX += charWidth;
  });
  
  verbClones.push(clone);
  console.log("✅ Verb clone created with smooth animation:", clone.word, "from", verbWordRect.x, verbWordRect.y, "to", targetX, targetY);
}

// 동사 복제본 업데이트 함수 (부드러운 애니메이션 처리)
function updateVerbClones(currentTime) {
  for (let i = verbClones.length - 1; i >= 0; i--) {
    const clone = verbClones[i];
    const elapsedTime = currentTime - clone.createdTime;
    
    if (clone.animationPhase === 'moving_up') {
      const moveUpDuration = 400; // 400ms 동안 부드럽게 위로 이동
      if (elapsedTime < moveUpDuration) {
        const t = elapsedTime / moveUpDuration;
        // ease-out cubic: 빠르게 시작해서 부드럽게 감속
        const easedT = 1 - Math.pow(1 - t, 3);
        
        // 현재 위치 계산 (X, Y 모두 부드럽게 이동)
        clone.currentX = clone.originalX + (clone.targetX - clone.originalX) * easedT;
        clone.currentY = clone.originalY + (clone.targetY - clone.originalY) * easedT;
          // 각 문자의 위치도 업데이트 (상대적 위치 보존)
        let currentCharX = clone.currentX;
        clone.charPositions.forEach((charPos, index) => {
          charPos.x = currentCharX;
          charPos.currentY = clone.currentY;
          currentCharX += charPos.width;
        });
      } else {
        // 이동 완료, 정지 상태로 전환
        clone.animationPhase = 'stationary';
        clone.currentX = clone.targetX;
        clone.currentY = clone.targetY;
        
        // 최종 위치로 문자 위치들 고정
        let finalCharX = clone.targetX;
        clone.charPositions.forEach(charPos => {
          charPos.x = finalCharX;
          charPos.currentY = clone.targetY;
          finalCharX += charPos.width;
        });
        
        console.log("✅ Verb clone animation completed smoothly:", clone.word);
      }
    }
  }
}

// 동사 복제본을 수동으로 제거하는 함수
function clearVerbClones() {
  verbClones = [];
}

// --- END: 동사 복제본 관련 함수들 ---

// 조동사와 함께 애니메이션되는 주어 찾기
function findSubjectAnimationForAux(auxAnimation) {
  // 같은 시간대에 활성화된 애니메이션 중에서 주어를 찾음
  const currentTime = performance.now();
  const timeThreshold = 100; // 100ms 이내로 시작된 애니메이션들 고려
  
  for (const anim of activeAnimations) {
    if (anim !== auxAnimation && 
        !anim.isQuestionWord && 
        !anim.isAuxiliaryWord &&
        Math.abs(anim.startTime - auxAnimation.startTime) <= timeThreshold) {
      // 주어로 판단되는 조건: 의문사도 조동사도 아닌 동시에 시작된 애니메이션
      return anim;
    }
  }
  return null;
}

// 질문 문장에서 동사 wordRect를 찾는 함수
function findVerbWordRectForQuestion() {
  if (!currentQuestionSentence || !centerSentenceWordRects) return null;
  
  const fullQuestionText = (currentQuestionSentence.line1 + " " + currentQuestionSentence.line2).trim();
  const wordsInSentence = fullQuestionText.split(" ").filter(w => w.length > 0);
  
  // 의문사, 조동사, 주어 다음에 나오는 동사 찾기
  for (let i = 3; i < wordsInSentence.length; i++) { // 3번째 인덱스부터 (의문사+조동사+주어 다음)
    const word = wordsInSentence[i];
    if (isVerb(word) && !isAux(word)) {
      // centerSentenceWordRects에서 해당 동사의 wordRect 찾기
      const questionWordRects = centerSentenceWordRects.filter(r => r.isQuestionWord === true);
      if (questionWordRects.length > i && questionWordRects[i]) {
        const candidateRect = questionWordRects[i];
        const candidateTextClean = candidateRect.word.replace(/[^a-zA-Z0-9']/g, "").toLowerCase();
        const verbTextClean = word.replace(/[^a-zA-Z0-9']/g, "").toLowerCase();
        
        if (candidateTextClean === verbTextClean) {
          console.log("✅ Found verb wordRect for question:", word, "at index", i);
          return candidateRect;
        }
      }
    }
  }
  
  console.log("❌ No verb wordRect found for question");
  return null;
}

// --- END: 주어+조동사 복제본 관련 함수들 ---

// --- START: 바운스 애니메이션 관련 함수들 ---

// 바운스 애니메이션 트리거 함수
function triggerBounceAnimationForWords(sentenceObject, isQuestion) {
  console.log("🏀 triggerBounceAnimationForWords called:", { isQuestion, sentenceObject });
  
  if (!sentenceObject || !centerSentenceWordRects || centerSentenceWordRects.length === 0) {
    console.log("❌ No sentence or word rects available for bounce animation");
    return;
  }
  
  // 현재 표시되는 문장이 질문인지 답변인지 판단
  // 질문 문장과 답변 문장 모두 화면에 표시될 수 있으므로, sentenceObject로 구분
  const isCurrentlyQuestion = currentQuestionSentence && 
    sentenceObject.line1 === currentQuestionSentence.line1 && 
    sentenceObject.line2 === currentQuestionSentence.line2;
  
  const isCurrentlyAnswer = currentAnswerSentence && 
    sentenceObject.line1 === currentAnswerSentence.line1 && 
    sentenceObject.line2 === currentAnswerSentence.line2;
  
  console.log("🔍 Sentence type detection:", { isCurrentlyQuestion, isCurrentlyAnswer });
  
  // 해당 문장 타입의 첫 번째 줄(lineIndex === 0)의 단어들만 가져오기
  const firstLineWords = centerSentenceWordRects.filter(r => {
    if (isCurrentlyQuestion) {
      return r.lineIndex === 0 && r.isQuestionWord === true;
    } else if (isCurrentlyAnswer) {
      return r.lineIndex === 0 && r.isQuestionWord === false;
    } else {
      // 문장 타입을 정확히 판단할 수 없는 경우, 기본적으로 질문으로 처리
      return r.lineIndex === 0 && r.isQuestionWord === true;
    }
  });
  
  if (firstLineWords.length === 0) {
    console.log("❌ No words found in first line for sentence type");
    return;
  }

  let relevantWordRects = [];
  
  if (isQuestion) {
    // 의문사만: 첫 번째 줄에서 실제 의문사인 단어들만
    relevantWordRects = firstLineWords.filter(wordRect => {
      const cleanWord = wordRect.word.toLowerCase().replace(/[^a-z0-9']/g, '');
      const isWhWord = isWh(cleanWord);
      console.log(`🔍 Checking word "${wordRect.word}" (clean: "${cleanWord}") - isWh: ${isWhWord}`);
      return isWhWord;
    });
  } else {
    if (isCurrentlyQuestion) {
      // 질문 문장에서 조동사+주어만: 첫 번째 줄에서 조동사이거나 주어인 단어들만
      relevantWordRects = firstLineWords.filter(wordRect => {
        const cleanWord = wordRect.word.toLowerCase().replace(/[^a-z0-9']/g, '');
        const isAuxWord = isAux(cleanWord);
        const isSubject = !isWh(cleanWord) && !isAux(cleanWord) && !isVerb(cleanWord);
        console.log(`🔍 Checking word "${wordRect.word}" (clean: "${cleanWord}") - isAux: ${isAuxWord}, isSubject: ${isSubject}`);
        return isAuxWord || isSubject;
      });
    } else if (isCurrentlyAnswer) {
      // 답변 문장에서 조동사만: 첫 번째 줄에서 조동사인 단어들만
      relevantWordRects = firstLineWords.filter(wordRect => {
        const cleanWord = wordRect.word.toLowerCase().replace(/[^a-z0-9']/g, '');
        const isAuxWord = isAux(cleanWord);
        console.log(`🔍 Checking answer word "${wordRect.word}" (clean: "${cleanWord}") - isAux: ${isAuxWord}`);
        return isAuxWord;
      });
    }
  }
  
  if (relevantWordRects.length === 0) {
    console.log("❌ No relevant words found for bounce animation");
    return;
  }

  console.log(`🏀 Found ${relevantWordRects.length} words to bounce:`, relevantWordRects.map(r => r.word));
  // 단어들을 순서대로 바운스 애니메이션 시작
  relevantWordRects.forEach((wordRect, index) => {
    setTimeout(() => {
      if (!isGameRunning || isGamePaused) return;
      
      const bounceAnimation = {
        wordRect: { ...wordRect },
        startTime: performance.now(),
        durationUp: BOUNCE_DURATION_UP,
        durationDown: BOUNCE_DURATION_DOWN,
        maxHeight: BOUNCE_HEIGHT,
        currentYOffset: 0,
        isActive: true
      };
      
      activeBounceAnimations.push(bounceAnimation);
      console.log(`🏀 Started bounce animation for word: ${wordRect.word}`);
    }, index * BOUNCE_DELAY_BETWEEN_WORDS);
  });
}

// 바운스 애니메이션 업데이트 함수
function updateBounceAnimations(currentTime) {
  for (let i = activeBounceAnimations.length - 1; i >= 0; i--) {
    const bounceAnim = activeBounceAnimations[i];
    
    if (!bounceAnim.isActive) {
      activeBounceAnimations.splice(i, 1);
      continue;
    }

    const elapsedTime = currentTime - bounceAnim.startTime;
    const totalDuration = bounceAnim.durationUp + bounceAnim.durationDown;
    
    if (elapsedTime >= totalDuration) {
      // 애니메이션 완료
      bounceAnim.currentYOffset = 0;
      bounceAnim.isActive = false;
      activeBounceAnimations.splice(i, 1);
      continue;
    }

    // 웨이브 애니메이션과 동일한 부드러운 이징 적용
    let yOffsetFactor;
    if (elapsedTime < bounceAnim.durationUp) {
      // Up phase - ease-out quad (웨이브 애니메이션과 동일)
      const t = elapsedTime / bounceAnim.durationUp;
      yOffsetFactor = t * (2 - t);
    } else {
      // Down phase - ease-in quad (웨이브 애니메이션과 동일)
      const downTime = elapsedTime - bounceAnim.durationUp;
      const t = downTime / bounceAnim.durationDown;
      yOffsetFactor = (1 - t) * (1 - t);
    }
    
    bounceAnim.currentYOffset = -yOffsetFactor * bounceAnim.maxHeight;
  }
}

// 바운스 애니메이션을 수동으로 제거하는 함수
function clearBounceAnimations() {
  activeBounceAnimations = [];
}

// --- END: 바운스 애니메이션 관련 함수들 ---
// --- END: Word Animation Variables and Functions ---

// 의문사 + 조동사 + 주어 + 동사 패턴 감지 함수
function shouldCreateCloneForQuestionPattern(sentenceText) {
  const words = sentenceText.trim().split(" ").filter(w => w.length > 0);
  console.log("🔍 Pattern detection for:", sentenceText);
  console.log("🔍 Words:", words);
  
  if (words.length < 3) {
    console.log("❌ Too few words for any pattern (need at least 3)");
    return false;
  }
  
  // 첫 번째 단어가 의문사인지 확인
  const firstWord = words[0].toLowerCase().replace(/[^a-z0-9']/g, "");
  if (!isWh(firstWord)) {
    console.log("❌ First word is not a question word:", firstWord);
    return false;
  }
  
  // 두 번째 단어가 조동사인지 확인
  const secondWord = words[1].toLowerCase().replace(/[^a-z0-9']/g, "");
  if (!isAux(secondWord)) {
    console.log("❌ Second word is not auxiliary:", secondWord);
    return false;
  }
  
  // 패턴 2 확인: "의문사 + 조동사 + 동사" (우선 확인)
  // 이 패턴에서는 복제본을 생성하지 않음
  const thirdWord = words[2].toLowerCase().replace(/[^a-z0-9']/g, "");
  if (isVerb(thirdWord) && !isAux(thirdWord)) {
    console.log("🚫 Pattern 2 확인됨: '의문사 + 조동사 + 동사' - 복제본 생성 금지");
    console.log("🚫 문장: ", sentenceText);
    console.log("🚫 패턴2 감지됨: ", firstWord, secondWord, thirdWord);
    window.lastDetectedPattern = "pattern2"; // 패턴2 감지 플래그
    return false;
  }
  
  // 패턴 1 확인: "의문사 + 조동사 + 주어 + 동사"
  // 세 번째 단어가 주어인지 확인 (의문사도 조동사도 동사도 아닌 경우)
  if (isWh(thirdWord) || isAux(thirdWord) || isVerb(thirdWord)) {
    console.log("❌ Third word is not a proper subject:", thirdWord);
    return false;
  }
  
  // "의문사 + 조동사 + have + PP" 패턴 체크 (복제본 생성 안함)
  if (thirdWord === "have") {
    console.log("❌ Pattern 'question word + aux + have + PP' detected - no clones should be created");
    return false;
  }
  
  // 네 번째 단어 이후에 동사가 있는지 확인 (패턴 1의 경우)
  if (words.length < 4) {
    console.log("❌ Not enough words for pattern 1");
    return false;
  }
  
  let hasVerb = false;
  for (let i = 3; i < words.length; i++) {
    const word = words[i].toLowerCase().replace(/[^a-z0-9']/g, "");
    if (isVerb(word) && !isAux(word)) {
      hasVerb = true;
      console.log("✅ Found verb at position", i + 1, ":", word);
      break;
    }
  }
  
  const result = hasVerb;
  console.log("🎯 패턴 결과:", result ? "패턴1 매치됨 (복제본 생성 가능)" : "패턴 매치 안됨 (복제본 생성 불가)");
  window.lastDetectedPattern = result ? "pattern1" : "unknown";
  return result;
}

// --- START: New/Modified triggerSentenceWordAnimation Function ---
function triggerSentenceWordAnimation(sentenceObject, isQuestion, allWordRects, drawingContext, animationStartDelay = 0, enableCloneGeneration = true) {
  console.log("🚀 triggerSentenceWordAnimation called:");
  console.log("  - isQuestion:", isQuestion);
  console.log("  - enableCloneGeneration:", enableCloneGeneration);
  console.log("  - sentenceObject:", sentenceObject);
  console.log("  - cloneCreatedForCurrentQuestion:", cloneCreatedForCurrentQuestion);
  
  if (!isGameRunning || isGamePaused || !sentenceObject || !allWordRects || allWordRects.length === 0) {
    console.log("❌ Early return due to game state or missing data");
    return;
  }

  setTimeout(() => { // 전체 애니메이션 로직 시작 전 지연
    if (!isGameRunning || isGamePaused) return; // 지연 후 게임 상태 재확인

    const relevantWordRects = allWordRects.filter(r => r.isQuestionWord === isQuestion)
      .sort((a, b) => { // 라인과 x축 기준으로 정렬하여 올바른 순서 보장
        if (a.lineIndex !== b.lineIndex) return a.lineIndex - b.lineIndex;
        return a.x - b.x;
      });
    
    console.log("📝 Relevant word rects count:", relevantWordRects.length);

    if (relevantWordRects.length === 0) return;    if (isQuestion) {
      // 이미 복제본이 생성된 질문인 경우 애니메이션을 다시 시작하지 않음
      // 추가 안전장치: 현재 질문이 유효한지도 확인
      if (cloneCreatedForCurrentQuestion) {
        console.log("⚠️ Clone already created for current question, skipping animation");
        console.log("  - Current question valid:", !!currentQuestionSentence);
        console.log("  - Question index:", currentQuestionSentenceIndex);
        return;
      }
      
      // 현재 질문 상태 재확인 (타이밍 이슈 방지)
      if (!currentQuestionSentence || currentQuestionSentenceIndex === null) {
        console.log("⚠️ Current question state invalid, skipping animation");
        return;
      }      // 질문 문장 전체 텍스트 구성
      const fullQuestionText = (sentenceObject.line1 + " " + sentenceObject.line2).trim();
      console.log("🔍 Full question text:", fullQuestionText);
      
      // 패턴 감지를 통해 복제본 생성 허용 여부 결정
      // 패턴2인 경우 항상 복제본 생성 금지
      window.lastDetectedPattern = "unknown"; // 기본값 초기화
      const shouldAllowClones = shouldCreateCloneForQuestionPattern(fullQuestionText);
      
      // 패턴2가 감지되었으면 복제본 생성 강제 금지
      const isPattern2 = window.lastDetectedPattern === "pattern2";
      const finalEnableCloneGeneration = isPattern2 ? false : (enableCloneGeneration && shouldAllowClones);
      
      console.log("🎭 Clone generation decision:");
      console.log("  - Original enableCloneGeneration:", enableCloneGeneration);
      console.log("  - Pattern allows clones:", shouldAllowClones);
      console.log("  - Detected pattern:", window.lastDetectedPattern);
      console.log("  - Is Pattern 2:", isPattern2);
      console.log("  - Final enableCloneGeneration:", finalEnableCloneGeneration);
      
      // 질문 문장 애니메이션 로직 (isPlayBtnQuestionTouched 로직과 유사)
      const firstWordRectToAnimate = relevantWordRects[0];
      console.log("🎯 Starting animation for first word:", firstWordRectToAnimate.word);
      startWordWaveAnimation(firstWordRectToAnimate, drawingContext, finalEnableCloneGeneration);

      const wordsToAnimateSubsequently = [];
      const firstWordIndexInRects = 0;

      if (firstWordIndexInRects + 1 < relevantWordRects.length) {
        const secondWordRect = relevantWordRects[firstWordIndexInRects + 1];
        const secondWordTextClean = secondWordRect.word.toLowerCase().replace(/[^a-z0-9']/g, "");

        if (isAux(secondWordTextClean)) {
          wordsToAnimateSubsequently.push(secondWordRect);

          if (firstWordIndexInRects + 2 < relevantWordRects.length) {
            const thirdWordRect = relevantWordRects[firstWordIndexInRects + 2];
            const thirdWordTextClean = thirdWordRect.word.toLowerCase().replace(/[^a-z0-9']/g, "");
            if (thirdWordTextClean === "have" || (!isVerb(thirdWordTextClean) && !isAux(thirdWordTextClean))) {
               wordsToAnimateSubsequently.push(thirdWordRect);
            }
          }
        }
      }
      
      console.log("⏭️ Words to animate subsequently:", wordsToAnimateSubsequently.length);

      if (wordsToAnimateSubsequently.length > 0) {
        setTimeout(() => { // 첫 단어가 정점에 도달할 시간 후 다음 단어들 애니메이션
          if (!isGameRunning || isGamePaused) return;
          wordsToAnimateSubsequently.forEach(rect => {
            console.log("🎯 Starting animation for subsequent word:", rect.word);
            startWordWaveAnimation(rect, drawingContext, finalEnableCloneGeneration);
          });
        }, WORD_ANIM_DURATION_UP);
      }
    } else { // 답변 문장 애니메이션 로직 (isPlayBtnAnswerTouched 로직과 유사)
      const fullSentenceText = (sentenceObject.line1 + " " + sentenceObject.line2).trim();
      const wordsInSentence = fullSentenceText.split(" ").filter(w => w.length > 0);

      if (wordsInSentence.length > 0) {
        let subjectEndIndex = -1;
        for (let i = 0; i < wordsInSentence.length; i++) {
          if (isAux(wordsInSentence[i]) ||
              (isVerb(wordsInSentence[i]) && !isAux(wordsInSentence[i])) ||
              isVing(wordsInSentence[i]) ||
              isBeen(wordsInSentence[i])) {
            subjectEndIndex = i - 1;
            break;
          }
          if (i === wordsInSentence.length - 1) { // 문장 끝까지 주어일 경우
            subjectEndIndex = i;
          }
        }

        let auxWordForAnimation = null;
        let auxWordGlobalIndexInSentence = -1;

        if (subjectEndIndex >= 0 && (subjectEndIndex + 1) < wordsInSentence.length) {
          const potentialAux = wordsInSentence[subjectEndIndex + 1];
          if (isAux(potentialAux)) {
            auxWordForAnimation = potentialAux;
            auxWordGlobalIndexInSentence = subjectEndIndex + 1;
          }
        }

        if (auxWordForAnimation && auxWordGlobalIndexInSentence !== -1) {
          if (relevantWordRects.length > auxWordGlobalIndexInSentence) {
            const targetWordRectCandidate = relevantWordRects[auxWordGlobalIndexInSentence];
            // 안전하게 단어 텍스트도 비교 (이미 정렬되었으므로 인덱스가 맞아야 함)
            const candidateTextClean = targetWordRectCandidate.word.replace(/[^a-zA-Z0-9']/g, "").toLowerCase();
            const auxWordTextClean = auxWordForAnimation.replace(/[^a-zA-Z0-9']/g, "").toLowerCase();

            if (candidateTextClean === auxWordTextClean) {
              startWordWaveAnimation(targetWordRectCandidate, drawingContext, enableCloneGeneration);
            }
          }
        }
      }
    }
  }, animationStartDelay); // 인자로 받은 지연 시간 적용
}
// --- END: New/Modified triggerSentenceWordAnimation Function ---

function drawSingleSentenceBlock(sentenceObject, baseY, isQuestionBlock, blockContext) {
    if (!sentenceObject) return { lastY: baseY, wordRects: [] };

    let localWordRects = [];
    ctx.font = englishFont;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    let lines = [sentenceObject.line1, sentenceObject.line2].filter(l => l && l.trim());
    if (lines.length === 0) return { lastY: baseY, wordRects: [] };

    let blockHeight = lines.length * LINE_HEIGHT;
    let yFirstLineTextCenter;

    if (isQuestionBlock) {
        yFirstLineTextCenter = baseY - blockHeight / 2 + LINE_HEIGHT / 2;
    } else {
        yFirstLineTextCenter = baseY + LINE_HEIGHT / 2;
    }

    let lastDrawnTextBottomY = baseY;

    const sentenceFullText = (sentenceObject.line1 + " " + sentenceObject.line2).trim();
    const isCurrentBlockContentQuestionType = isQuestion(sentenceFullText);

    for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i];
        
        // 첫째줄과 둘째줄 사이의 간격 조정을 위해 둘째줄(i === 1)인 경우 INCREASED_LINE_SPACING 사용
        let lineSpacing = i === 0 ? LINE_HEIGHT : INCREASED_LINE_SPACING;
        let currentLineCenterY;
        
        if (i === 0) {
            // 첫째줄은 원래 위치에서 2px 위로 이동 (y축 -2px)
            currentLineCenterY = yFirstLineTextCenter - 2;
        } else {
            // 둘째줄은 첫째줄 + 증가된 줄간격
            currentLineCenterY = yFirstLineTextCenter + LINE_HEIGHT + (lineSpacing - LINE_HEIGHT);
        }
        
        // 모바일 환경 감지
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // 각 줄마다 색상 플래그 초기화 (줄별로 독립적으로 색상 처리)
        // 의문문과 답변문을 분리해서 처리
        if (isCurrentBlockContentQuestionType) {
            // 의문문 문장일 경우, 원래 색상 로직 유지
            if (i === 0) {
                blockContext.verbColored = false;
                blockContext.auxColored = false;
                blockContext.verbFoundInPattern2 = false;
            } else if (i === 1) {
                blockContext.verbColored = false;
                blockContext.auxColored = false;
            }
        } else {
            // 답변 문장일 경우, 각 줄마다 독립적으로 색상 플래그 초기화
            if (i === 0) {
                blockContext.verbColored = false; // 동사 색상 플래그 초기화 - 동사 하나만 노란색으로
                blockContext.auxColored = false;  // 조동사 색상 플래그 초기화 - 조동사 하나만 파란색으로
                blockContext.verbFoundInPattern2 = false;
            } else if (i === 1) {
                blockContext.verbColored = false;
                blockContext.auxColored = false;
            }
        }

        if (isQuestionBlock) {
            if (i === 0) currentLineCenterY -= 10;
        } else {
            if (i === 1) currentLineCenterY += 10;
        }
        // 두번째 문장만 핸드폰(모바일)에서 y축 6px 더 위로 올림 (기존 -5px에서 -11px로)
        if (isMobile && i === 1) {
            currentLineCenterY -= 11;
        }

        const words = lineText.split(" ");
        let wordMetrics = words.map(w => ctx.measureText(w));
        const originalSpaceWidth = ctx.measureText(" ").width;
        const adjustedSpaceWidth = originalSpaceWidth * 1.20;
        let totalLineWidth = wordMetrics.reduce((sum, m) => sum + m.width, 0);
        if (words.length > 1) {
            totalLineWidth += adjustedSpaceWidth * (words.length - 1);
        }

        let currentX = (canvas.width - totalLineWidth) / 2;
        const wordHeight = parseFloat(englishFont.match(/(\d*\.?\d*)px/)[1]);

        for (let j = 0; j < words.length; j++) {
            let rawWord = words[j];
            const wordStartX = currentX;
            const measuredWordWidth = wordMetrics[j].width;            let lowerCleanedWordForColor = rawWord.toLowerCase().replace(/[^a-z0-9']/g, '');
            let originalLowerWord = rawWord.toLowerCase();
            
            // 기본 색상은 흰색
            let color = "#fff"; 
            
            // 의문문 첫 번째 줄에서만 특별한 색상 규칙 적용
            if (isCurrentBlockContentQuestionType && i === 0) {
                // 특수문자 제거 및 소문자 변환된 배열 (색상 로직용)
                const cleanedWords = words.map(w => w.toLowerCase().replace(/[^a-z0-9']/g, ''));
                
                // 첫 번째 단어가 의문사인지 확인
                const isFirstWordWh = isWh(cleanedWords[0]);
                
                // 두 번째 단어가 조동사인지 확인 (있을 경우)
                const isSecondWordAux = words.length > 1 ? isAux(cleanedWords[1]) : false;

                // "패턴 1": 의문사 + 조동사 + 주어 + 동사 (총 4단어)
                // 이전에 `words.length > 3`는 정확히 4개의 단어를 의도하는 것으로 보입니다.
                const isPattern1 = isFirstWordWh && isSecondWordAux && words.length === 4;

                if (isPattern1) {
                    if (j === 0) { // 의문사
                        color = '#249F24'; // 녹색
                    } else if (j === 1) { // 조동사
                        color = "#4A9FFF"; // 스카이 블루
                    } else if (j === 2 || j === 3) { // 주어 또는 동사
                        color = "#1A6DFF"; // 짙은 파란색
                    } else {
                        color = "#fff"; // 그 외는 흰색 (패턴 1은 4단어이므로 이 else는 작동하지 않을 것)
                    }
                } else { // 패턴 1이 아닌 의문문 첫 번째 줄의 경우 (이전 로직 기반, 필요에 따라 조정)
                    if (j === 0 && isFirstWordWh) {
                        color = '#249F24'; // 의문사 - 녹색
                    } else if (j > 0 && isAux(cleanedWords[j])) {
                        color = "#4A9FFF"; // 조동사 - 스카이 블루
                    }
                    else {
                        color = "#fff"; // 그 외는 흰색
                    }
                }
            }            // 의문문의 둘째줄은 모두 흰색으로 표시
            else if (isCurrentBlockContentQuestionType && i === 1) {
                // 모든 단어를 흰색으로 표시 (이미 기본 색상이 흰색이므로 추가 작업 불필요)
                color = "#fff"; // 명시적으로 흰색 설정
            }            // 답변 문장 (의문문이 아닌 경우)에는 조동사 하나만 파란색, 본동사 하나만 노란색, 나머지 모두 흰색
            else if (!isCurrentBlockContentQuestionType) {
                // 기본적으로 모든 단어는 흰색
                color = "#fff";

                // 주어 다음(두번째 단어, j==1)만 조동사이고, 그 외는 모두 흰색
                if (j === 1 && isAux(lowerCleanedWordForColor)) {
                    color = "#4A9FFF"; // 조동사: 스카이 블루
                }
                // 조동사 다음에 오는 본동사(세 번째 단어 이상)
                else if (j > 1 && isAux(words[j-1].toLowerCase().replace(/[^a-z0-9']/g, '')) && isVerb(lowerCleanedWordForColor)) {
                    color = "#1A6DFF"; // 본동사: 파란색(기존대로)
                }
                // 나머지는 모두 흰색(기본값)
            }
            
            // 디버그용 콘솔 로그 (필요시 활성화)
            // if (isCurrentBlockContentQuestionType && i === 0) {
            //     console.log(`Word: ${rawWord}, Position: ${j}, Color: ${color}`);
            // }
            ctx.fillStyle = color;

            const currentWordRectData = {
                word: rawWord, x: wordStartX, y: currentLineCenterY,
                w: measuredWordWidth, h: wordHeight, lineIndex: i, isQuestionWord: isQuestionBlock
            };

            let matchingAnimation = null;
            for (const anim of activeAnimations) {
                if (anim.targetWordRect.word === currentWordRectData.word &&
                    Math.abs(anim.targetWordRect.x - currentWordRectData.x) < 1 &&
                    Math.abs(anim.targetWordRect.y - currentWordRectData.y) < 1 &&
                    anim.targetWordRect.h === currentWordRectData.h &&
                    anim.targetWordRect.lineIndex === currentWordRectData.lineIndex &&
                    anim.targetWordRect.isQuestionWord === currentWordRectData.isQuestionWord) {
                    matchingAnimation = anim;
                    break;
                }
            }            if (matchingAnimation) {
                matchingAnimation.charPositions.forEach((charPos) => {
                    ctx.fillText(charPos.char, charPos.x, charPos.currentY);
                });
            } else {
                // 바운스 애니메이션 오프셋 확인
                let bounceOffset = 0;
                for (const bounceAnim of activeBounceAnimations) {
                    if (bounceAnim.wordRect.word === currentWordRectData.word &&
                        Math.abs(bounceAnim.wordRect.x - currentWordRectData.x) < 1 &&
                        Math.abs(bounceAnim.wordRect.y - currentWordRectData.y) < 1) {
                        bounceOffset = bounceAnim.currentYOffset;
                        break;
                    }
                }
                ctx.fillText(rawWord, wordStartX, currentLineCenterY + bounceOffset);
            }

            localWordRects.push(currentWordRectData);

            if (j < words.length - 1) {
                currentX += measuredWordWidth + adjustedSpaceWidth;
            } else {
                currentX += measuredWordWidth;
            }
        }
        lastDrawnTextBottomY = currentLineCenterY + LINE_HEIGHT / 2;
        if (isQuestionBlock && i === 0) {
            lastDrawnTextBottomY -=10;
        } else if (!isQuestionBlock && i === 1) {
            lastDrawnTextBottomY +=10;
        }
    }
    return { lastY: lastDrawnTextBottomY, wordRects: localWordRects };
}


function drawPlayButton(buttonRect, baseScaleForOriginalSize) {
    if (!buttonRect) return;
    const visualShrinkFactor = 0.72;
    const visualWidth = buttonRect.w * visualShrinkFactor;
    const visualHeight = buttonRect.h * visualShrinkFactor;
    const visualX = buttonRect.x + (buttonRect.w - visualWidth) / 2;
    const visualY = buttonRect.y + (buttonRect.h - visualHeight) / 2;
    const internalElementScale = baseScaleForOriginalSize * visualShrinkFactor;

    ctx.save();
    ctx.globalAlpha = Math.min(1.0, centerAlpha + 0.2) * 0.82;
    ctx.fillStyle = "#222";
    ctx.beginPath();
    const cornerRadius = 20 * internalElementScale;
    ctx.roundRect(visualX, visualY, visualWidth, visualHeight, cornerRadius);
    ctx.fill();

    ctx.globalAlpha = centerAlpha;
    ctx.strokeStyle = "#4CAF50";
    ctx.lineWidth = 3 * internalElementScale;
    ctx.beginPath();
    ctx.roundRect(visualX, visualY, visualWidth, visualHeight, cornerRadius);
    ctx.stroke();

    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    const playSize = 36 * internalElementScale;
    const btnPad = 18 * internalElementScale;
    const triangleSymbolVerticalLineXOffset = 6 * internalElementScale;
    ctx.moveTo(visualX + btnPad + triangleSymbolVerticalLineXOffset, visualY + btnPad);
    ctx.lineTo(visualX + btnPad + triangleSymbolVerticalLineXOffset, visualY + visualHeight - btnPad);
    ctx.lineTo(visualX + btnPad + playSize, visualY + visualHeight / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}


function drawCenterSentence() {
    // 문장이 없고 폭죽도 없으면 모든 복제본 제거하고 종료
    if (!currentQuestionSentence && !currentAnswerSentence && !fireworks) {
        // 모든 종류의 복제본 및 클론 제거
        centerSentenceWordRects = [];
        sentenceWordRects = [];
        questionWordClones = [];
        subjectAuxClones = [];
        verbClones = [];
        
        // 추가 클론 배열 초기화
        try {
            if (window.wordClones) window.wordClones = [];
            if (window.auxiliaryClones) window.auxiliaryClones = [];
            if (window.textClones) window.textClones = [];
            if (window.explosionParticles) window.explosionParticles = [];
        } catch(e) {
            console.log("복제본 제거 중 오류:", e);
        }
        return;
    }
    
    // 복제본 관련 배열 항상 초기화 - 중복을 방지하기 위해
    centerSentenceWordRects = [];

    let newWordRects = [];

    ctx.save();
    ctx.globalAlpha = centerAlpha;

    const mainRenderAreaYCenter = topOffset + (canvas.height - topOffset) / 2;
    const questionBlockCenterY = mainRenderAreaYCenter + SENTENCE_VERTICAL_ADJUSTMENT;

    let questionBlockContext = { verbColored: false, auxColored: false, verbFoundInPattern2: false };
    let questionDrawOutput = { lastY: questionBlockCenterY - LINE_HEIGHT, wordRects: [] };

    const baseOverallScale = 0.49;
    const visualReductionFactor = 0.8;
    const currentVisualScaleForHitbox = baseOverallScale * visualReductionFactor;

    const btnH_forHitbox = (36 * currentVisualScaleForHitbox) + (18 * currentVisualScaleForHitbox * 2);
    const btnW_forHitbox = (36 * currentVisualScaleForHitbox) + (18 * currentVisualScaleForHitbox * 2);
    const btnX = 10;

    if (currentQuestionSentence) {
        questionDrawOutput = drawSingleSentenceBlock(currentQuestionSentence, questionBlockCenterY, true, questionBlockContext);
        newWordRects.push(...questionDrawOutput.wordRects);

        let playButtonQuestionY = questionBlockCenterY - btnH_forHitbox / 2;
        const questionLinesForHeight = [currentQuestionSentence.line1, currentQuestionSentence.line2].filter(l => l && l.trim());
        if (questionLinesForHeight.length > 0) {
            let actualFirstLineCenterY = questionBlockCenterY - (questionLinesForHeight.length * LINE_HEIGHT) / 2 + LINE_HEIGHT / 2;
            if (questionLinesForHeight.length > 0) actualFirstLineCenterY -=10;
            playButtonQuestionY = actualFirstLineCenterY - btnH_forHitbox / 2;
        }

        playButtonRectQuestion = { x: btnX, y: playButtonQuestionY, w: btnW_forHitbox, h: btnH_forHitbox };
        if (showPlayButtonQuestion) {
            drawPlayButton(playButtonRectQuestion, currentVisualScaleForHitbox);
        }

        if (showTranslationForQuestion && currentQuestionSentenceIndex !== null && translations[currentQuestionSentenceIndex]) {
            ctx.save();
            ctx.globalAlpha = centerAlpha;
            ctx.font = translationFont;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#2E8B57";
            ctx.shadowColor = "#111"; ctx.shadowBlur = 4;
            const translationTextHeight = parseFloat(translationFont.match(/(\d*\.?\d*)px/)[1]);
            const translationBelowY = questionDrawOutput.lastY + 10 + translationTextHeight / 2;
            ctx.fillText(translations[currentQuestionSentenceIndex], canvas.width / 2, translationBelowY);
            ctx.restore();
        }
    }

    if (currentAnswerSentence) {
        const answerLines = [currentAnswerSentence.line1, currentAnswerSentence.line2].filter(l => l && l.trim());
        const answerBlockHeight = answerLines.length * LINE_HEIGHT;
        let topYForAnswerBlock;

        if (currentQuestionSentence) {
            topYForAnswerBlock = questionDrawOutput.lastY + ANSWER_OFFSET_Y;
        } else {
            let effectiveCenterY = mainRenderAreaYCenter;
            if (answerLines.length === 2) effectiveCenterY -= 10 / 2;
             topYForAnswerBlock = effectiveCenterY - (answerBlockHeight / 2);
        }

        const answerFirstLineCenterY = topYForAnswerBlock + LINE_HEIGHT / 2;
        playButtonRect = { x: btnX, y: answerFirstLineCenterY - btnH_forHitbox / 2, w: btnW_forHitbox, h: btnH_forHitbox };
        if (showPlayButton) {
            drawPlayButton(playButtonRect, currentVisualScaleForHitbox);
        }

        let answerBlockContext = { verbColored: false, auxColored: false, verbFoundInPattern2: false };
        const answerDrawOutput = drawSingleSentenceBlock(currentAnswerSentence, topYForAnswerBlock, false, answerBlockContext);
        newWordRects.push(...answerDrawOutput.wordRects);

        if (showTranslationForAnswer && currentAnswerSentenceIndex !== null && translations[currentAnswerSentenceIndex]) {
            ctx.save();
            ctx.globalAlpha = centerAlpha;
            ctx.font = translationFont;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#2E8B57";
            ctx.shadowColor = "#111"; ctx.shadowBlur = 4;
            const translationTextHeight = parseFloat(translationFont.match(/(\d*\.?\d*)px/)[1]);
            const translationBelowY = answerDrawOutput.lastY + 3 + translationTextHeight / 2;
            ctx.fillText(translations[currentAnswerSentenceIndex], canvas.width / 2, translationBelowY);
            ctx.restore();
        }
    }    centerSentenceWordRects = newWordRects;    // 의문사 복제본 렌더링
    if (questionWordClones.length > 0) {
        ctx.save();
        ctx.globalAlpha = centerAlpha;
        ctx.font = englishFont;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        
        questionWordClones.forEach(clone => {
            // 복제본 단어 그리기 (원본과 같은 녹색)
            ctx.fillStyle = '#249F24';
            clone.charPositions.forEach(charPos => {
                ctx.fillText(charPos.char, charPos.x, charPos.currentY);
            });
              // "?" 기호 그리기 (복제본의 마지막 글자 위에 위치)
            ctx.fillStyle = '#FFD600';
            ctx.textAlign = "center";
            
            // 마지막 글자의 위치 계산
            if (clone.charPositions && clone.charPositions.length > 0) {
                const lastCharPos = clone.charPositions[clone.charPositions.length - 1];
                const questionMarkX = lastCharPos.x + (lastCharPos.width / 2);
                const questionMarkY = clone.currentY - 15;
                ctx.fillText("?", questionMarkX, questionMarkY);
            } else {
                // 폴백: 단어 전체 중앙에 표시
                const questionMarkX = clone.originalX + ctx.measureText(clone.word).width / 2;
                const questionMarkY = clone.currentY - 15;
                ctx.fillText("?", questionMarkX, questionMarkY);
            }
            
            ctx.textAlign = "left"; // 다시 기본값으로 복원
        });
        
        ctx.restore();
    }

    // 주어+조동사 복제본 렌더링
    if (subjectAuxClones.length > 0) {
        ctx.save();
        ctx.globalAlpha = centerAlpha;
        ctx.font = englishFont;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        subjectAuxClones.forEach(clone => {
            // 복제본 텍스트 그리기 (조동사는 파란색, 주어는 흰색)
            const auxLength = clone.auxWord.length;
            const spaceLength = 1; // 공백 문자 1개
            
            // 애니메이션 중이거나 완료 후 색상 적용
            if ((clone.animationPhase === 'swapping' || (clone.animationPhase === 'stationary' && clone.swapStartTime > 0))) {
                // 조동사 부분(0 ~ auxLength)
                const auxChars = clone.charPositions.slice(0, clone.auxLength);
                // 공백(auxLength)
                const spaceChar = clone.charPositions[clone.auxLength];
                // 주어 부분(auxLength+1 ~ end)
                const subjectChars = clone.charPositions.slice(clone.auxLength + 1);
                
                // 조동사는 항상 파란색
                auxChars.forEach(charPos => {
                    ctx.fillStyle = '#4A9FFF'; // 조동사 - 파란색
                    ctx.fillText(charPos.char, charPos.x, charPos.currentY);
                });
                
                // 공백은 흰색
                ctx.fillStyle = '#ffffff';
                ctx.fillText(spaceChar.char, spaceChar.x, spaceChar.currentY);
                
                // 주어는 항상 흰색
                subjectChars.forEach(charPos => {
                    ctx.fillStyle = '#ffffff'; // 주어 - 흰색
                    ctx.fillText(charPos.char, charPos.x, charPos.currentY);
                });
                return; // 이미 그렸으므로 아래 코드 실행하지 않음
            }
            
            // 기본 상태일 때 색상 적용
            clone.charPositions.forEach((charPos, index) => {
                if (index < auxLength) {
                    // 조동사 부분 - 파란색
                    ctx.fillStyle = '#4A9FFF';
                } else if (index < auxLength + spaceLength) {
                    // 공백 부분 - 흰색
                    ctx.fillStyle = '#ffffff';
                } else {
                    // 주어 부분 - 흰색
                    ctx.fillStyle = '#ffffff';
                }
                ctx.fillText(charPos.char, charPos.x, charPos.currentY);            });
        });
          ctx.restore();
    }

    // 동사 복제본 렌더링
    if (verbClones.length > 0) {
        ctx.save();
        ctx.globalAlpha = centerAlpha;
        ctx.font = englishFont;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        
        verbClones.forEach(clone => {
            // 동사 복제본 그리기 (동사는 파란색)
            ctx.fillStyle = '#4A9FFF';
            clone.charPositions.forEach(charPos => {
                ctx.fillText(charPos.char, charPos.x, charPos.currentY);
            });
        });
        
        ctx.restore();
    }

    // START OF MODIFIED WORD TRANSLATION DRAWING LOGIC
    if (activeWordTranslation && activeWordTranslation.show) {
        ctx.save();
        ctx.globalAlpha = centerAlpha;
        const wordTransFontFamily = "'Malgun Gothic', 'Nanum Gothic', Arial, sans-serif";
        const wordTransFontSize = 16;
        ctx.font = `${wordTransFontSize}px ${wordTransFontFamily}`;
        ctx.fillStyle = "#2E8B57";
        ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 2; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1;

        const angleDegrees = 40;
        const basePadding = 8;
        const textOffset = 5;

        const wordCenterX = activeWordTranslation.x + activeWordTranslation.w / 2;
        const englishWordMiddleY = activeWordTranslation.y;
        const englishWordHalfHeight = activeWordTranslation.h / 2;

        let translateX, translateY, angleRad, textAlign, textBaseline, drawX, drawY;        if (activeWordTranslation.lineIndex === 0) { // 위쪽 줄 단어: 우상향 40도 ("//" 모양)
            translateX = wordCenterX;
            // Y 위치: 기존 verticalClearanceFirstLine (13) 에서 25px 아래로 이동 요청 반영 (20px + 추가 5px)
            const verticalClearanceFirstLine = 13 - 25; // 즉, -12. 결과적으로 단어 윗면에서 (basePadding(8) + (-12)) = -4px 아래가 회전 중심 Y.
            translateY = englishWordMiddleY - englishWordHalfHeight - basePadding - verticalClearanceFirstLine;

            angleRad = -angleDegrees * Math.PI / 180; // 우상향 (-40도)

            textAlign = 'left';
            textBaseline = 'bottom';
            drawX = textOffset;
            drawY = -textOffset;        } else { // 아래쪽 줄 단어: 좌하향 40도 ("//" 모양), 글자 정상
            translateX = wordCenterX;

            // Y 위치: 단어의 아랫면에서 간격을 두고 회전 기준점 설정 (사용자 요청 30px 위로 이동 반영)
            // verticalClearanceSecondLine (이전 30) 에서 30px 위로 -> 0
            const verticalClearanceSecondLine = 20 + 10 - 30; // 즉, 총 0px의 추가 간격 (basePadding만 남음)
            translateY = englishWordMiddleY + englishWordHalfHeight + basePadding + verticalClearanceSecondLine;

            angleRad = -angleDegrees * Math.PI / 180; // 우상향과 동일한 각도 (-40도)로 회전

            textAlign = 'right';  // 텍스트의 오른쪽 끝을 기준으로 그림
            textBaseline = 'bottom'; // 텍스트의 아래쪽을 기준으로 그림

            // X축 위치 조정: 첫 번째 문장과 두 번째 문장의 두 번째 줄 모두 오른쪽으로 5px 이동
            drawX = -textOffset + 5;
            drawY = textOffset;
        }

        ctx.translate(translateX, translateY);
        ctx.rotate(angleRad);
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.fillText(activeWordTranslation.translation, drawX, drawY);

        ctx.restore();
    }
    // END OF MODIFIED WORD TRANSLATION DRAWING LOGIC
    ctx.restore();
}


function drawFireworks() {
  if (!fireworks) return;
  ctx.save();
  ctx.font = englishFont;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fireworks.forEach(fw => {
    ctx.globalAlpha = 1;
    ctx.fillStyle = fw.color;
    ctx.fillText(fw.text, fw.x, fw.y);
  });
  ctx.restore();
}


function getClockwiseAngle(index, total) {
  return -Math.PI / 2 + (index * 2 * Math.PI) / total;
}


function startFireworks(sentenceTextForFireworks, globalSentenceIndex, explosionX, explosionY) {
    let roleOfNewSentence;
    let questionTextForLayout = "";
    const isNewSentenceQuestion = globalSentenceIndex % 2 === 0;
    roleOfNewSentence = isNewSentenceQuestion ? 'question' : 'answer';    if (roleOfNewSentence === 'question') {
        currentQuestionSentence = null; currentAnswerSentence = null;
        currentQuestionSentenceIndex = null; currentAnswerSentenceIndex = null;
        showPlayButton = false; showPlayButtonQuestion = false;
        showTranslationForQuestion = false; showTranslationForAnswer = false;
        
        // 새로운 질문 시작 시 복제본 생성 플래그 리셋
        cloneCreatedForCurrentQuestion = false;    } else { // Answer
        if (currentQuestionSentence && currentQuestionSentenceIndex === globalSentenceIndex - 1) {
            questionTextForLayout = (currentQuestionSentence.line1 + " " + currentQuestionSentence.line2).trim();
        } else if (globalSentenceIndex > 0 && sentences[globalSentenceIndex - 1]) {
            questionTextForLayout = sentences[globalSentenceIndex - 1];
        } else {
            questionTextForLayout = " ";
        }
        currentAnswerSentence = null; currentAnswerSentenceIndex = null;
        showPlayButton = false;
        showTranslationForAnswer = false;
        
        // 답변 폭발 시작 시 클론 플래그 리셋
        cloneCreatedForCurrentAnswer = false;
    }if (activeWordTranslation) activeWordTranslation.show = false;
    activeWordTranslation = null;
    if (wordTranslationTimeoutId) { clearTimeout(wordTranslationTimeoutId); wordTranslationTimeoutId = null; }
    centerSentenceWordRects = [];    // 폭발 시퀀스 시작 시 모든 활성 애니메이션과 기존 복제본들을 정리
    console.log("🧹 Clearing active animations and existing clones during fireworks start");
    activeAnimations = [];
    
    // 폭발 시작 시 모든 클론 제거 및 모든 플래그 리셋 (새로운 사이클 시작)
    console.log("🧹 Clearing all clones and resetting all flags for new sentence cycle");
    clearQuestionWordClones(); // 모든 클론 제거
    cloneCreatedForCurrentQuestion = false; // 새 문장 사이클 시작
    cloneCreatedForCurrentAnswer = false;

    const [fireworkLine1, fireworkLine2] = splitSentence(sentenceTextForFireworks, isNewSentenceQuestion);
    const wordsForFireworks = [];
    if (fireworkLine1.trim()) wordsForFireworks.push(...fireworkLine1.split(" ").map(word => ({ word, row: 0 })));
    if (fireworkLine2.trim()) wordsForFireworks.push(...fireworkLine2.split(" ").map(word => ({ word, row: 1 })));

    if(wordsForFireworks.length === 0) {
        sentenceActive = false; return;
    }

    const baseRadius = 51.2 * 0.88; const maxRadius = 120.96 * 0.88 * 0.95 * 0.93 * 0.95 * 0.94 * 0.97; // Adjusted maxRadius - 7% 축소 + 5% 축소 + 추가 6% 축소 + 3% 추가 축소
    let centerX = explosionX; const margin = 8;
    if (centerX - maxRadius < margin) centerX = margin + maxRadius;
    if (centerX + maxRadius > canvas.width - margin) centerX = canvas.width - margin - maxRadius;    fireworks = [];    fireworksState = {
        t: 0, phase: "explode", holdDuration: 40, 
        // PC에서는 폭발 과정 0.92초(92), 문장 정렬 1초(100)로 설정, 모바일에서는 기존 값 유지
        explodeDuration: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 180 : 92,
        gatherDuration: /Android|webOS|iPhone|iPad|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 170 : 100,
        originX: centerX, originY: explosionY,
        sentenceTextToDisplayAfter: sentenceTextForFireworks,
        finalSentenceIndex: globalSentenceIndex,
        roleOfNewSentence: roleOfNewSentence,
        isMobileDevice: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    };

    const mainRenderAreaYCenter = topOffset + (canvas.height - topOffset) / 2;
    const [sL1_fw, sL2_fw] = splitSentence(sentenceTextForFireworks, isNewSentenceQuestion);
    const sLines_fw = [sL1_fw, sL2_fw].filter(l => l && l.trim());
    const sentenceBlockFinalHeight_fw = sLines_fw.length * LINE_HEIGHT + (sLines_fw.length === 2 && isNewSentenceQuestion ? -10 : (sLines_fw.length === 2 && !isNewSentenceQuestion ? 10 : 0));


    for (let j = 0; j < wordsForFireworks.length; j++) {
        const angle = getClockwiseAngle(j, wordsForFireworks.length);
        const color = burstColors[j % burstColors.length];
        let wordTargetY;

        if (roleOfNewSentence === 'question') {
            const qBlockFinalCenterY = mainRenderAreaYCenter + SENTENCE_VERTICAL_ADJUSTMENT;
            wordTargetY = qBlockFinalCenterY - sentenceBlockFinalHeight_fw / 2 + (wordsForFireworks[j].row * LINE_HEIGHT) + (LINE_HEIGHT / 2);
            if (wordsForFireworks[j].row === 0) wordTargetY -= 10;
        } else { // Answer
            const [qTextL1_layout, qTextL2_layout] = splitSentence(questionTextForLayout, true);
            const qTextLines_layout = [qTextL1_layout, qTextL2_layout].filter(l => l && l.trim());
            let questionBlockActualHeight_layout = qTextLines_layout.length * LINE_HEIGHT;
            if(qTextLines_layout.length === 1) questionBlockActualHeight_layout -=10;

            const questionBlockActualCenterY_layout = mainRenderAreaYCenter + SENTENCE_VERTICAL_ADJUSTMENT;
            let questionBlockActualBottomY_layout = questionBlockActualCenterY_layout + questionBlockActualHeight_layout / 2;
             if (qTextLines_layout.length === 1) {
                 questionBlockActualBottomY_layout = questionBlockActualCenterY_layout - 10;
             } else if (qTextLines_layout.length === 2){
                 questionBlockActualBottomY_layout = questionBlockActualCenterY_layout + LINE_HEIGHT - 10;
             } else if (qTextLines_layout.length === 0) {
                 questionBlockActualBottomY_layout = questionBlockActualCenterY_layout;
             }


            let answerBlockFinalTopY_fw;
            if (qTextLines_layout.length > 0) {
                answerBlockFinalTopY_fw = questionBlockActualBottomY_layout + ANSWER_OFFSET_Y;
            } else {
                answerBlockFinalTopY_fw = questionBlockActualCenterY_layout - sentenceBlockFinalHeight_fw / 2;
            }
            wordTargetY = answerBlockFinalTopY_fw + (wordsForFireworks[j].row * LINE_HEIGHT) + (LINE_HEIGHT / 2);
            if (wordsForFireworks[j].row === 1) wordTargetY += 10;
        }


        fireworks.push({
            text: wordsForFireworks[j].word, angle: angle, rowInSentence: wordsForFireworks[j].row,
            x: centerX, y: explosionY,
            radius: baseRadius, maxRadius: maxRadius,
            color: color,
            targetX: 0,
            targetY: wordTargetY,
        });
    }
    sentenceActive = true; centerAlpha = 1.0;
}


function updateFireworks() {
  if (!fireworks || !fireworksState) return false;
  
  // 모바일 장치 감지 속성이 없으면 추가
  if (fireworksState.isMobileDevice === undefined) {
    fireworksState.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  fireworksState.t++;

  if (fireworksState.phase === "explode") {
    const progress = Math.min(fireworksState.t / fireworksState.explodeDuration, 1);
    const ease = 1 - Math.pow(1 - progress, 2);
    const currentRadius = 51.2 * 0.88 + (120.96 * 0.88 - 51.2 * 0.88) * ease;
    fireworks.forEach((fw) => {
      fw.radius = currentRadius;
      fw.x = fireworksState.originX + Math.cos(fw.angle) * fw.radius;
      fw.y = fireworksState.originY + Math.sin(fw.angle) * fw.radius;
    });
    if (progress >= 1) { fireworksState.phase = "hold"; fireworksState.t = 0; }
  } else if (fireworksState.phase === "hold") {
    if (fireworksState.t >= fireworksState.holdDuration) {
      fireworksState.phase = "gather"; fireworksState.t = 0;
      centerAlpha = 0;
    }  } else if (fireworksState.phase === "gather") {
    const progress = Math.min(fireworksState.t / fireworksState.gatherDuration, 1);
    // 핸드폰 모드에서만 더 정확하고 부드러운 이징 적용
    let ease;
    if (fireworksState.isMobileDevice) {
      // 핸드폰에서는 경로를 따라 자연스럽게 이동하는 이징
      ease = Math.sin(progress * Math.PI / 2); // 0에서 시작하여 1로 부드럽게 증가
    } else {
      // PC에서는 기존 이징 로직 유지
      ease = progress < 0.6 ? Math.pow(progress, 2) : 1 - Math.pow(1 - progress, 3);
    }
    
    // 경로 초기화가 필요한 경우를 위해 플래그 설정
    if (fireworksState.t === 1) {
      fireworksState.pathsInitialized = false;
    }
    const tempCtx = canvas.getContext('2d');
    tempCtx.font = englishFont;
    const isGatherSentenceQuestion = fireworksState.roleOfNewSentence === 'question';
    const [sentenceLine1Gather, sentenceLine2Gather] = splitSentence(fireworksState.sentenceTextToDisplayAfter, isGatherSentenceQuestion);
    let sentenceLineWordArrays = [];
    if(sentenceLine1Gather.trim()) sentenceLineWordArrays.push(sentenceLine1Gather.split(" "));
    if(sentenceLine2Gather.trim()) sentenceLineWordArrays.push(sentenceLine2Gather.split(" "));

    const originalSpaceWidthFireworks = tempCtx.measureText(" ").width;
    const adjustedSpaceWidthFireworks = originalSpaceWidthFireworks * 1.20;    let wordIndexInFireworks = 0;
    for (let i = 0; i < sentenceLineWordArrays.length; i++) {
        const wordsInLine = sentenceLineWordArrays[i];
        let wordMetrics = wordsInLine.map(w => tempCtx.measureText(w));
        let currentLineTotalWidth = 0;
        for(let k=0; k < wordMetrics.length; k++) {
            currentLineTotalWidth += wordMetrics[k].width;
            if (k < wordMetrics.length - 1) {
                currentLineTotalWidth += adjustedSpaceWidthFireworks;
            }
        }
        let currentXTargetForWord = (canvas.width - currentLineTotalWidth) / 2;
        for (let j = 0; j < wordsInLine.length; j++) {
            if (fireworks[wordIndexInFireworks]) {
                // 각 단어에 정확한 목표 위치 설정
                fireworks[wordIndexInFireworks].targetX = currentXTargetForWord + (wordMetrics[j].width / 2);
                // 목표 위치에 도달 여부를 저장하는 플래그 추가
                fireworks[wordIndexInFireworks].reachedTarget = false;
                // 단어 인덱스를 저장 (줄과 위치를 기억)
                fireworks[wordIndexInFireworks].lineIndex = i;
                fireworks[wordIndexInFireworks].wordIndex = j;
                
                // 다음 단어의 x 위치 계산
                currentXTargetForWord += wordMetrics[j].width;
                if (j < wordsInLine.length - 1) {
                    currentXTargetForWord += adjustedSpaceWidthFireworks;
                }
            }
            wordIndexInFireworks++;
        }
    }
    
    // 모바일에서 단어들이 서로 겹치지 않게 확인
    if (fireworksState.isMobileDevice && !fireworksState.pathsInitialized && fireworksState.t === 1) {
        // 각 단어마다 유일한 경로와 시작/끝 위치를 설정
        for (let i = 0; i < fireworks.length; i++) {
            // 시작 위치는 폭발 단계에서 이미 설정됨
            // 끝 위치는 단어의 최종 위치
            fireworks[i].originalTargetX = fireworks[i].targetX;
            fireworks[i].originalTargetY = fireworks[i].targetY;
        }
        fireworksState.pathsInitialized = true;
    }// 첫 프레임에서만 초기 위치와 목표 위치를 저장 (경로가 겹치지 않도록)
    if (fireworksState.t === 1) {
      fireworks.forEach((fw) => {
        fw.startX = fw.x;
        fw.startY = fw.y;
        fw.pathAngle = Math.atan2(fw.targetY - fw.y, fw.targetX - fw.x);
        // 약간의 변동성을 주어 단어들이 서로 다른 경로로 이동하도록 함
        fw.pathVariation = (Math.random() * 0.4) - 0.2;
      });
    }
    
    fireworks.forEach((fw) => {
      // 핸드폰에서는 단어들이 직접적인 경로로 정확하게 이동
      if (fireworksState.isMobileDevice) {
        // 베지어 곡선 방식으로 직접적인 경로를 만듦
        const t = ease;
        const startX = fw.startX;
        const startY = fw.startY;
        const endX = fw.targetX;
        const endY = fw.targetY;
        
        // 곡선 제어점 계산 (단어 별로 경로가 약간 다르게 설정됨)
        const controlX = startX + (endX - startX) * 0.5 + Math.cos(fw.pathAngle + Math.PI/2) * 30 * fw.pathVariation;
        const controlY = startY + (endY - startY) * 0.5 + Math.sin(fw.pathAngle + Math.PI/2) * 30 * fw.pathVariation;
        
        // 2차 베지어 곡선으로 위치 계산 (t 값에 따른 정확한 위치)
        fw.x = Math.pow(1-t, 2) * startX + 2 * (1-t) * t * controlX + Math.pow(t, 2) * endX;
        fw.y = Math.pow(1-t, 2) * startY + 2 * (1-t) * t * controlY + Math.pow(t, 2) * endY;
        
        // 끝부분에서는 정확히 목표 위치에 도달
        if (progress > 0.95) {
          fw.x = fw.targetX;
          fw.y = fw.targetY;
        }
      } else {
        // PC에서는 기존 이동 방식 유지
        const smoothedEase = progress < 0.8 ? ease : 1 - Math.pow(1 - progress, 3);
        const moveSpeed = 0.3;
        fw.x += (fw.targetX - fw.x) * smoothedEase * moveSpeed;
        fw.y += (fw.targetY - fw.y) * smoothedEase * moveSpeed;
      }
    });
      // 핸드폰에서는 투명도 변화도 더 천천히
    const alphaSpeed = fireworksState.isMobileDevice ? 0.15 : 0.25;
    centerAlpha += (1.0 - centerAlpha) * ease * alphaSpeed;
    
    // 애니메이션 마지막 5%에서는 모든 단어를 정확한 위치로 고정
    if (fireworksState.isMobileDevice && progress >= 0.95) {
        fireworks.forEach(fw => {
            fw.x = fw.targetX; // 정확한 X 위치로 고정
            fw.y = fw.targetY; // 정확한 Y 위치로 고정
        });
    }

    if (progress >= 1) {
        fireworksState.phase = "done";
        const newSentenceText = fireworksState.sentenceTextToDisplayAfter;
        const newSentenceIndex = fireworksState.finalSentenceIndex;
        const roleOfNewSentence = fireworksState.roleOfNewSentence;
        const isFinalSentenceQuestion = roleOfNewSentence === 'question';
        const [newLine1, newLine2] = splitSentence(newSentenceText, isFinalSentenceQuestion);
        const newSentenceObject = { line1: newLine1, line2: newLine2 };
        let playAudioForThisSentence = false;        if (roleOfNewSentence === 'question') {
            currentQuestionSentence = newSentenceObject; currentQuestionSentenceIndex = newSentenceIndex;
            currentAnswerSentence = null; currentAnswerSentenceIndex = null;
            showPlayButton = false; showPlayButtonQuestion = true;
            playAudioForThisSentence = true;
            
            // 새로운 질문 설정 시 복제본 생성 플래그 리셋
            cloneCreatedForCurrentQuestion = false;        } else { // Answer
            const questionIndexOfThisAnswer = newSentenceIndex - 1;
            if (questionIndexOfThisAnswer >= 0 && sentences[questionIndexOfThisAnswer]) {
                // 질문이 이미 있고 동일한 인덱스인 경우, 복제본 플래그 유지
                const shouldPreserveCloneFlag = currentQuestionSentence && currentQuestionSentenceIndex === questionIndexOfThisAnswer;
                
                if (!currentQuestionSentence || currentQuestionSentenceIndex !== questionIndexOfThisAnswer) {
                    const [qL1, qL2] = splitSentence(sentences[questionIndexOfThisAnswer], true);
                    currentQuestionSentence = {line1: qL1, line2: qL2};
                    currentQuestionSentenceIndex = questionIndexOfThisAnswer;
                    
                    // 새로운 질문이 로드된 경우에만 복제본 플래그 리셋
                    if (!shouldPreserveCloneFlag) {
                        cloneCreatedForCurrentQuestion = false;
                    }
                }
                 showPlayButtonQuestion = true;
            } else {
                currentQuestionSentence = null; currentQuestionSentenceIndex = null;
                showPlayButtonQuestion = false;
                // 질문이 없어진 경우에만 복제본 플래그 리셋
                cloneCreatedForCurrentQuestion = false;
            }currentAnswerSentence = newSentenceObject; currentAnswerSentenceIndex = newSentenceIndex;
            showPlayButton = true;
            playAudioForThisSentence = true;
            
            // 새로운 답변 설정 시 복제본 생성 플래그 리셋
            cloneCreatedForCurrentAnswer = false;
        }        centerAlpha = 1.0;        fireworks = null; fireworksState = null; sentenceActive = false;
        if (activeWordTranslation) activeWordTranslation.show = false;
        activeWordTranslation = null; if (wordTranslationTimeoutId) clearTimeout(wordTranslationTimeoutId);
        
        // 답변 문장으로 넘어갈 때는 이미지를 숨기지 않음 (다음 폭발 때까지 유지)
        // 이미지는 다음 새로운 질문 문장이 시작될 때 사라짐// 폭발 후 자동 오디오 재생 (복제본 생성 없음)
        console.log("DEBUG: Checking auto audio playback - playAudioForThisSentence:", playAudioForThisSentence);
        if (playAudioForThisSentence) {
            let audioIndexToPlay = null;

            if (roleOfNewSentence === 'question' && currentQuestionSentenceIndex !== null) {
                audioIndexToPlay = currentQuestionSentenceIndex;
                console.log("DEBUG: Auto audio for question, index:", audioIndexToPlay);
            } else if (roleOfNewSentence === 'answer' && currentAnswerSentenceIndex !== null) {
                audioIndexToPlay = currentAnswerSentenceIndex;
                console.log("DEBUG: Auto audio for answer, index:", audioIndexToPlay);
            }            if (audioIndexToPlay !== null) {
                console.log("DEBUG: Setting auto audio timeout for index:", audioIndexToPlay);
                setTimeout(() => {
                    console.log("DEBUG: Auto audio timeout triggered, playing audio for index:", audioIndexToPlay);
                    window.speechSynthesis.cancel();
                    playSentenceAudio(audioIndexToPlay)
                        .then(() => {
                            // 오디오 재생 완료 후 바운스 애니메이션 트리거
                            console.log("Auto audio playback completed for sentence:", audioIndexToPlay);
                            
                            // 음성 읽기 시 바운스 애니메이션 트리거
                            if (roleOfNewSentence === 'question') {
                                // 첫번째 문장(질문): "의문사"와 "조동사+주어"를 바운스
                                console.log("🏀 Triggering bounce animations for question sentence during auto TTS");
                                
                                // 의문사 먼저 바운스 (질문 읽기 타이밍에 맞춤)
                                setTimeout(() => {
                                    if (currentQuestionSentence) {
                                        triggerBounceAnimationForWords(currentQuestionSentence, true); // 의문사
                                    }
                                }, 100); // 음성 시작 후 100ms 후 의문사 바운스
                                
                                // 조동사+주어는 조금 더 지연해서 바운스 (읽기 진행에 맞춤)
                                setTimeout(() => {
                                    if (currentQuestionSentence) {
                                        triggerBounceAnimationForWords(currentQuestionSentence, false); // 조동사+주어
                                    }
                                }, 600); // 음성 시작 후 600ms 후 조동사+주어 바운스
                                
                            } else if (roleOfNewSentence === 'answer') {
                                // 두번째 문장(답변): "조동사"를 바운스
                                console.log("🏀 Triggering bounce animation for answer sentence during auto TTS");
                                
                                // 답변에서 조동사 바운스 (답변 읽기 타이밍에 맞춤)
                                setTimeout(() => {
                                    if (currentAnswerSentence) {
                                        triggerBounceAnimationForWords(currentAnswerSentence, false); // 조동사 바운스
                                    }
                                }, 300); // 음성 시작 후 300ms 후 조동사 바운스
                            }
                        })
                        .catch(err => console.error("Error in auto audio playback:", err));
                }, 450);
            } else {
                console.log("DEBUG: No audio index to play");
            }
        } else {
            console.log("DEBUG: Auto audio playback disabled");
        }
    }
  }
}


function spawnEnemy() {
  const idx = Math.floor(Math.random() * enemyImgs.length);
  const img = enemyImgs[idx];
  const x = Math.random() * (canvas.width - ENEMY_SIZE);
  const spawnYMax = canvas.height * 0.2;
  const y = topOffset + Math.random() * spawnYMax + 20;
  let enemy = {
    x, y, w: ENEMY_SIZE, h: ENEMY_SIZE, img, shot: false, imgIndex: idx,
    baseY: y, initialX: x, rotation: 0
  };
  if (idx === 3) { // Maple Leaf
    enemy.swayAngle = Math.random() * Math.PI * 2;
    enemy.swaySpeed = (Math.random() * 2 + 1.5) * (Math.random() > 0.5 ? 1 : -1);
    enemy.swayAmplitude = Math.random() * 20 + 20;
    enemy.driftXPerSecond = (Math.random() - 0.5) * 60;
    enemy.flutterAngle = Math.random() * Math.PI * 2;
    enemy.flutterSpeed = Math.random() * 5 + 3;
    enemy.flutterAmplitude = Math.random() * 3 + 3;
  } else if (idx === 2) { // Cosmos
    enemy.rotationSpeed = (Math.random() * 0.8 + 0.4) * (Math.random() > 0.5 ? 1 : -1);
    enemy.driftXPerSecond = (Math.random() - 0.5) * 20;
    enemy.swayAngle = Math.random() * Math.PI * 2;
    enemy.swaySpeed = (Math.random() * 0.8 + 0.4);
    enemy.swayAmplitude = Math.random() * 10 + 5;
    const petal = {
        x: enemy.x + enemy.w / 2 - PETAL_SIZE / 2, y: enemy.y + enemy.h / 2,
        w: PETAL_SIZE, h: PETAL_SIZE, img: enemyImgs[2],
        baseY: enemy.y + enemy.h / 2,
        initialX: enemy.x + enemy.w / 2 - PETAL_SIZE / 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * PETAL_ROTATION_SPEED_BASE * 2 + (Math.random() > 0.5 ? 0.3 : -0.3),
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: (Math.random() * 0.5 + 0.75) * PETAL_SWAY_SPEED_BASE * (Math.random() > 0.5 ? 1 : -1),
        swayAmplitude: Math.random() * (PETAL_SWAY_AMPLITUDE_BASE * 0.6) + (PETAL_SWAY_AMPLITUDE_BASE * 0.7),
        driftXPerSecond: (Math.random() - 0.5) * PETAL_DRIFT_X_PPS_BASE * 1.5,
        flutterAngle: Math.random() * Math.PI * 2,
        flutterSpeed: (Math.random() * 0.8 + 0.6) * PETAL_FLUTTER_SPEED_BASE,
        flutterAmplitude: Math.random() * (PETAL_FLUTTER_AMPLITUDE_BASE * 0.5) + (PETAL_FLUTTER_AMPLITUDE_BASE * 0.5),
        fallSpeedPPS: PETAL_FALL_SPEED_PPS * (Math.random() * 0.4 + 0.8)
    };
    detachedPetals.push(petal);
  }
  enemies.push(enemy);
}

function update(delta) {
  enemies = enemies.filter(e => e.y <= canvas.height + e.h);
  while (enemies.length < 2) { spawnEnemy(); }
  enemies.forEach(e => {
    const deltaTimeSeconds = delta / 1000.0;
    e.baseY += ENEMY_MOVEMENT_SPEED_PPS * deltaTimeSeconds;
    let newX = e.x; let newY = e.baseY;
    if (e.imgIndex === 3) {
      e.initialX += e.driftXPerSecond * deltaTimeSeconds;
      e.swayAngle += e.swaySpeed * deltaTimeSeconds;
      newX = e.initialX + Math.sin(e.swayAngle) * e.swayAmplitude;
      e.rotation = Math.sin(e.swayAngle * 0.7) * 0.7;
      e.flutterAngle += e.flutterSpeed * deltaTimeSeconds;
      newY = e.baseY + Math.sin(e.flutterAngle) * e.flutterAmplitude;
    } else if (e.imgIndex === 2) {
      e.initialX += e.driftXPerSecond * deltaTimeSeconds;
      e.rotation += e.rotationSpeed * deltaTimeSeconds;
      e.swayAngle += e.swaySpeed * deltaTimeSeconds;
      newX = e.initialX + Math.sin(e.swayAngle) * e.swayAmplitude;
    }
    e.x = newX; e.y = newY;
  });

  bullets = bullets.filter(b => b.y + b.h > 0);
  bullets.forEach(b => {
    b.timeAlive += delta;
    const deltaTimeSeconds = delta / 1000.0;
    b.y += b.velocityY * deltaTimeSeconds;
    b.baseX += b.driftXPerSecond * deltaTimeSeconds;
    const swayOffset = Math.sin( (b.timeAlive / 1000.0) * b.swayFrequency + b.swayPhaseOffset ) * b.swayAmplitude;
    b.x = b.baseX + swayOffset;
  });

  detachedPetals.forEach((p, index) => {
      const deltaTimeSeconds = delta / 1000.0;
      p.baseY += p.fallSpeedPPS * deltaTimeSeconds;
      p.initialX += p.driftXPerSecond * deltaTimeSeconds;
      p.swayAngle += p.swaySpeed * deltaTimeSeconds;
      let currentX = p.initialX + Math.sin(p.swayAngle) * p.swayAmplitude;
      p.flutterAngle += p.flutterSpeed * deltaTimeSeconds;
      let currentY = p.baseY + Math.sin(p.flutterAngle) * p.flutterAmplitude;
      p.rotation += p.rotationSpeed * deltaTimeSeconds;
      p.x = currentX; p.y = currentY;
  });
  detachedPetals = detachedPetals.filter(p => p.y <= canvas.height + p.h);


  enemyBullets = enemyBullets.filter(b => b.y < canvas.height).map(b => { b.y += b.speed; return b; });
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      const collisionPaddingFactor = 0.25;
      const coreBulletOffsetX = b.w * collisionPaddingFactor;
      const coreBulletOffsetY = b.h * collisionPaddingFactor;
      const coreBulletX = b.x + coreBulletOffsetX;
      const coreBulletY = b.y + coreBulletOffsetY;
      const coreBulletWidth = b.w * (1 - 2 * collisionPaddingFactor);
      const coreBulletHeight = b.h * (1 - 2 * collisionPaddingFactor);      if (coreBulletX < e.x + e.w && coreBulletX + coreBulletWidth > e.x &&
          coreBulletY < e.y + e.h && coreBulletY + coreBulletHeight > e.y) {
        if (!sentenceActive) {
            const sentenceToFirework = sentences[sentenceIndex];
            const globalIndexOfSentence = sentenceIndex;
            
            // 모든 문장(홀수/짝수) 폭발 시 미디어 표시
            if (typeof showSentenceImage === 'function') {
                if (globalIndexOfSentence % 2 === 0) {
                    console.log(`홀수 문장 폭발: ${globalIndexOfSentence+1}번 문장, 상단 미디어 표시`);
                } else {
                    console.log(`짝수 문장 폭발: ${globalIndexOfSentence+1}번 문장, 상단 미디어 표시`);
                }
                // 모든 문장 폭발 시 미디어 처리 함수 호출
                showSentenceImage(globalIndexOfSentence);
            }
            
            startFireworks(sentenceToFirework, globalIndexOfSentence, e.x + e.w / 2, e.y + e.h / 2);
            sentenceIndex = (sentenceIndex + 1) % sentences.length;
            localStorage.setItem('sentenceIndex', sentenceIndex.toString());
            // Duck background music and play explosion sound
            duckBGM();
            sounds.explosion.play();
            
            // 폭발 횟수 증가 및 첫 번째 폭발에서 하단 미디어 시작
            explosionCount++;
            if (explosionCount === 1 && typeof onGameExplosion === 'function') {
                console.log("첫 번째 폭발 감지: 하단 미디어 표시 함수 호출");
                // 새로운 독립 로직: 첫 폭발 시 onGameExplosion 함수 호출
                onGameExplosion();
            }
        }
        enemies.splice(ei, 1); bullets.splice(bi, 1);
      }
    });
  });
  if (sentenceActive) { updateFireworks(); }

  if (!currentQuestionSentence && !currentAnswerSentence && !sentenceActive) {
    showPlayButton = false; showPlayButtonQuestion = false;
    showTranslationForQuestion = false; showTranslationForAnswer = false;
    if (activeWordTranslation) activeWordTranslation.show = false;
  } else if (!sentenceActive) {
      showPlayButtonQuestion = !!currentQuestionSentence;
      showPlayButton = !!currentAnswerSentence;
  }
  // Update word animations (plural)
  if (activeAnimations.length > 0) { // Check if there are any active animations
    updateWordAnimations(performance.now());
  }
    // Update question word clones
  if (questionWordClones.length > 0) {
    updateQuestionWordClones(performance.now());
  }
  // Update subject+auxiliary clones
  if (subjectAuxClones.length > 0) {
    updateSubjectAuxClones(performance.now());
  }
  
  // Update verb clones
  if (verbClones.length > 0) {
    updateVerbClones(performance.now());
  }
  
  // Update bounce animations
  if (activeBounceAnimations.length > 0) {
    updateBounceAnimations(performance.now());
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 게임이 실행 중일 때만 플레이어와 적, 총알 등을 그림
  if (isGameRunning) {
    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
    enemies.forEach(e => {
      if (e.imgIndex === 2 || e.imgIndex === 3) {
        ctx.save();
        ctx.translate(e.x + e.w / 2, e.y + e.h / 2);
        ctx.rotate(e.rotation);
        ctx.drawImage(e.img, -e.w / 2, -e.h / 2, e.w, e.h);
        ctx.restore();
      } else { ctx.drawImage(e.img, e.x, e.y, e.w, e.h); }
      if (e.imgIndex === 1 && coffeeSteamVideo && coffeeSteamVideo.readyState >= HTMLVideoElement.HAVE_ENOUGH_DATA && !coffeeSteamVideo.paused) {
        const steamScale = 0.5; const steamWidth = e.w * steamScale * 1.5;
        const steamHeight = e.h * steamScale * 1.6; const steamOffsetX = (e.w - steamWidth) / 2;
        const steamOffsetY = -steamHeight * 0.85;
        const prevCompositeOperation = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.65;
        ctx.drawImage(coffeeSteamVideo, e.x + steamOffsetX, e.y + steamOffsetY, steamWidth, steamHeight);
        ctx.globalAlpha = 1.0; ctx.globalCompositeOperation = prevCompositeOperation;
      }
    });
    bullets.forEach(b => {
      if (b.img && b.img.complete && b.img.naturalWidth > 0) {
        ctx.drawImage(b.img, b.x, b.y, b.w, b.h);
      }
    });
    detachedPetals.forEach(p => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate(p.rotation);
        ctx.drawImage(p.img, -p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
    });
  }

  const previousGlobalCenterAlpha = centerAlpha;
  if (sentenceActive && fireworks && fireworksState) {
    if (fireworksState.roleOfNewSentence === 'answer' && currentQuestionSentence) {
      centerAlpha = 1.0;
      const tempAnswerSentence = currentAnswerSentence;
      const tempAnswerIndex = currentAnswerSentenceIndex;
      currentAnswerSentence = null; currentAnswerSentenceIndex = null;
      drawCenterSentence();
      currentAnswerSentence = tempAnswerSentence; currentAnswerSentenceIndex = tempAnswerIndex;
    }
    centerAlpha = previousGlobalCenterAlpha;
    drawFireworks();
  } else {
    if (currentQuestionSentence || currentAnswerSentence) {
      centerAlpha = 1.0;
      drawCenterSentence();
    }
  }
  if (!sentenceActive) centerAlpha = 1.0;
  else if (fireworksState && fireworksState.phase === "gather") { /* Alpha managed by gather */ }
  else centerAlpha = previousGlobalCenterAlpha;
}

function gameLoop(time) {
  if (!isGameRunning || isGamePaused) { if (isGamePaused) draw(); return; }
  const delta = time - lastTime; lastTime = time;
  update(delta); draw();
  requestAnimationFrame(gameLoop);
}

document.getElementById('startBtn').onclick = function() {
  if (!isGameRunning && !isGamePaused) {
    startGame();
  }
};
document.getElementById('pauseBtn').onclick = togglePause;
document.getElementById('stopBtn').onclick = function() {
    // 드롭다운이 열려있을 때는 STOP 버튼 기능 비활성화
    const sentenceList = document.getElementById('sentenceList');
    if (sentenceList && sentenceList.style.display === 'block') {
        console.log("드롭다운 열린 상태에서 STOP 버튼 클릭 - 무시");
        return false;
    }
    
    stopGame();
};

function resetGameStateForStartStop() {
    bullets = []; enemies = []; enemyBullets = []; detachedPetals = [];
    fireworks = null; fireworksState = null;
    currentQuestionSentence = null; currentAnswerSentence = null;
    currentQuestionSentenceIndex = null; currentAnswerSentenceIndex = null;
    sentenceActive = false; centerAlpha = 1.0;
    showPlayButton = false; playButtonRect = null;
    showPlayButtonQuestion = false; playButtonRectQuestion = null;
    showTranslationForQuestion = false; showTranslationForAnswer = false;
    if (activeWordTranslation) activeWordTranslation.show = false;
    activeWordTranslation = null;
    if (wordTranslationTimeoutId) { clearTimeout(wordTranslationTimeoutId); wordTranslationTimeoutId = null; }
    centerSentenceWordRects = []; isActionLocked = false;
    sentenceWordRects = []; // 문장 단어 사각형 초기화
    
    // 폭발 횟수 초기화
    explosionCount = 0;
    
    // 이미지 숨기기
    if (typeof hideSentenceImage === 'function') {
        hideSentenceImage();
    }

    // Reset word animations
    activeAnimations = []; // Clear the array of active animations
    
    // 게임 시작/정지 시 모든 클론 제거 및 모든 플래그 리셋 (완전 초기화)
    console.log("🔄 Game start/stop - clearing all clones and resetting all flags");
    
    // 모든 종류의 복제본 및 클론 배열 초기화
    clearQuestionWordClones(); // 의문사 클론 제거
    clearSubjectAuxClones(); // 주어+조동사 클론 제거 
    clearVerbClones(); // 동사 클론 제거
    
    // 추가 클론 배열 초기화
    try {
        if (window.wordClones) window.wordClones = [];
        if (window.auxiliaryClones) window.auxiliaryClones = [];
        if (window.textClones) window.textClones = [];
        if (window.explosionParticles) window.explosionParticles = [];
        if (window.sentenceWordObjects) window.sentenceWordObjects = [];
        if (window.floatingWords) window.floatingWords = [];
        if (window.flyingElements) window.flyingElements = [];
    } catch(e) {
        console.log("추가 복제본 제거 중 오류:", e);
    }
    
    cloneCreatedForCurrentQuestion = false; // 게임 초기화
    cloneCreatedForCurrentAnswer = false;
    
    // 바운스 애니메이션 정리
    clearBounceAnimations();
    
    console.log("게임 상태 완전 초기화 및 모든 복제본 제거 완료");
}

function startGame() {
  calculateTopOffset();
  if (!allAssetsReady) {
    console.warn("Assets not ready. Please wait and try starting again.");
    ctx.fillStyle = "white"; ctx.font = "16px Arial"; ctx.textAlign = "center";
    ctx.fillText("이미지 및 비디오 로딩 중... 잠시 후 다시 시도하세요.", canvas.width / 2, canvas.height / 2);
    return;
  }
    // 게임 시작 시 음성 합성 초기화
  initSpeechSynthesis().then(() => {
    console.log("음성 합성 시스템이 초기화되었습니다.");
  }).catch(err => {
    console.warn("음성 합성 초기화 오류 (무시됨):", err);
  });
  
  // 시작 시 상단 이미지 초기화 (기존 이미지 숨김)
  if (typeof hideSentenceImage === 'function') {
    hideSentenceImage();
  }
  
  isGameRunning = true; 
  isGamePaused = false;
  document.getElementById('pauseBtn').textContent = 'PAUSE';
  
  // 배경 음악 설정
  if (bgmAudio) { 
    bgmAudio.pause(); 
  }
  
  // 게임 시작 시 배경음악 파일 목록 초기화
  initBgmFiles();
  
  // 게임 시작 시 항상 첫 번째 음악부터 재생
  bgmIndex = 0;
  bgmAudio = new Audio(bgmFiles[bgmIndex]);
  
  // 재생 지연을 방지하기 위해 미리 로드 설정
  bgmAudio.preload = "auto";
  
  // Set BGM volume - 50% louder for PC, normal for mobile
  const isMobileBGMGame = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  bgmAudio.volume = isMuted ? 0 : (isMobileBGMGame ? 0.021 : 0.126); 
  bgmAudio.loop = false; // 끝나면 다음 음악으로 넘어가도록 loop 비활성화
  
  // 배경음악이 끝났을 때 다음 음악 재생
  bgmAudio.onended = function() {
    // 즉시 다음 곡 재생 (지연 없이)
    playNextBgm();
  };
  
  // 배경 음악 재생
  const playPromise = bgmAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => { 
      console.error('BGM play error on start:', error);
      // 첫 번째 음악 재생 실패 시 즉시 다음 음악 시도
      playNextBgm();
    });
  }
  if (coffeeSteamVideo && coffeeVideoAssetReady) {
    coffeeSteamVideo.currentTime = 0;
    const coffeePlayPromise = coffeeSteamVideo.play();
    if (coffeePlayPromise !== undefined) {
      coffeePlayPromise.catch(error => console.error("Error playing coffee steam video:", error));
    }
  }
  // 현재 문장 정보 임시 저장
  const tempCurrentQuestionSentence = currentQuestionSentence;
  const tempCurrentAnswerSentence = currentAnswerSentence;
  const tempCurrentQuestionSentenceIndex = currentQuestionSentenceIndex;
  const tempCurrentAnswerSentenceIndex = currentAnswerSentenceIndex;
  
  resetGameStateForStartStop();
  
  // 선택된 문장이 있는 경우 문장 정보 복원
  if (tempCurrentQuestionSentence || tempCurrentAnswerSentence) {
    currentQuestionSentence = tempCurrentQuestionSentence;
    currentAnswerSentence = tempCurrentAnswerSentence;
    currentQuestionSentenceIndex = tempCurrentQuestionSentenceIndex;
    currentAnswerSentenceIndex = tempCurrentAnswerSentenceIndex;
    console.log("시작 시 선택된 문장 유지");
  }
  
  let storedIndex = Number(localStorage.getItem('sentenceIndex') || 0);
  sentenceIndex = storedIndex % sentences.length;
  
  // 홀수 인덱스인 경우 이전 짝수 인덱스로 조정 (항상 짝수로 시작하기 위함)
  if (sentenceIndex % 2 === 1) { // 홀수 번호 차례라면
    sentenceIndex = sentenceIndex - 1; // 직전 짝수 번호로 설정
    if (sentenceIndex < 0) sentenceIndex = sentences.length - 2; // 음수가 되면 마지막 짝수 인덱스로 설정
    console.log(`홀수 인덱스를 이전 짝수 인덱스(${sentenceIndex})로 조정함`);
  }
  
  localStorage.setItem('sentenceIndex', sentenceIndex.toString());
  spawnEnemy(); spawnEnemy();
  player.x = canvas.width / 2 - PLAYER_SIZE / 2;
  player.y = topOffset + (canvas.height - topOffset) - PLAYER_SIZE - 10;
  player.y = Math.max(topOffset, player.y);
  lastTime = performance.now();
  getVoicesReliably().catch(err => console.error("startGame: Error during voice pre-warming:", err));
  requestAnimationFrame(gameLoop);
}

function togglePause() {
  // 문장이 선택된 상태에서 게임이 아직 시작되지 않은 경우(START를 누르지 않고 문장만 선택한 경우)
  // RESUME 버튼을 클릭했을 때 게임을 시작
  if (!isGameRunning && (currentQuestionSentence || currentAnswerSentence) && document.getElementById('pauseBtn').textContent === 'RESUME') {
    console.log("문장이 선택된 상태에서 RESUME 클릭 - 게임을 시작합니다");
    
    // 현재 선택된 문장을 기억하고 게임 시작 (문장이 초기화되지 않게 함)
    startGame();
    return;
  }
  
  // 기존 토글 일시정지 로직
  if (!isGameRunning) return;
  isGamePaused = !isGamePaused;
  const pauseButton = document.getElementById('pauseBtn');
  if (isGamePaused) {
    pauseButton.textContent = 'RESUME';
    if (bgmAudio && !bgmAudio.paused) bgmAudio.pause();
    if (coffeeSteamVideo && !coffeeSteamVideo.paused) coffeeSteamVideo.pause();
    window.speechSynthesis.cancel();
    if (currentSentenceAudio) currentSentenceAudio.pause();
  } else {
    pauseButton.textContent = 'PAUSE';
    if (bgmAudio && bgmAudio.paused && !isMuted) {
      // 일시정지 후 재생 재개
      bgmAudio.play().catch(e => {
        console.error("BGM resume error:", e);
        // 오류 발생 시 다음 곡으로 넘어감
        setTimeout(playNextBgm, 500);
      });
    }
    if (coffeeSteamVideo && coffeeSteamVideo.paused && coffeeVideoAssetReady) {
        coffeeSteamVideo.play().catch(error => console.error("Error resuming coffee steam video:", error));
    }
    if (currentSentenceAudio && currentSentenceAudio.paused) {
        currentSentenceAudio.volume = 0.8;
        currentSentenceAudio.play().catch(e => console.error("Sentence audio resume error:", e));
    }
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }
}

function stopGame() {
  isGameRunning = false; isGamePaused = false;
  document.getElementById('pauseBtn').textContent = 'PAUSE';
  if (bgmAudio) bgmAudio.pause();
  if (coffeeSteamVideo && !coffeeSteamVideo.paused) coffeeSteamVideo.pause();
  window.speechSynthesis.cancel();
  if (currentSentenceAudio) {
      currentSentenceAudio.pause(); currentSentenceAudio.currentTime = 0; currentSentenceAudio = null;
  }
  
  // 하단 미디어 정지 및 초기화
  if (typeof stopBottomMediaShow === 'function') {
    stopBottomMediaShow();
  }
  
  // 상단 미디어 초기화 및 숨김
  if (SentenceMediaManager && typeof SentenceMediaManager.hideAllMedia === 'function') {
    SentenceMediaManager.hideAllMedia();
  }
  
  resetGameStateForStartStop();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const expandedMargin = 10;

function handleCanvasInteraction(clientX, clientY, event) {
  if (!isGameRunning || isGamePaused) return;
  if (!isActionLocked) {
    const isPlayBtnQuestionTouched = showPlayButtonQuestion && playButtonRectQuestion &&
      clientX >= (playButtonRectQuestion.x - expandedMargin) && clientX <= (playButtonRectQuestion.x + playButtonRectQuestion.w + expandedMargin) &&
      clientY >= (playButtonRectQuestion.y - expandedMargin) && clientY <= (playButtonRectQuestion.y + playButtonRectQuestion.h + expandedMargin);

    const isPlayBtnAnswerTouched = showPlayButton && playButtonRect &&
      clientX >= (playButtonRect.x - expandedMargin) && clientX <= (playButtonRect.x + playButtonRect.w + expandedMargin) &&
      clientY >= (playButtonRect.y - expandedMargin) && clientY <= (playButtonRect.y + playButtonRect.h + expandedMargin);

    if (isPlayBtnQuestionTouched) {
      showTranslationForQuestion = true; showTranslationForAnswer = false;
      if (activeWordTranslation) activeWordTranslation.show = false;
      if (wordTranslationTimeoutId) clearTimeout(wordTranslationTimeoutId);
      activeWordTranslation = null; isActionLocked = true;      if (currentQuestionSentenceIndex !== null && currentQuestionSentence) {
          console.log("🎮 Question play button touched - Current state:");
          console.log("  - Question Index:", currentQuestionSentenceIndex);
          console.log("  - Clone Created:", cloneCreatedForCurrentQuestion);
          console.log("  - Question Sentence:", currentQuestionSentence);
          
          window.speechSynthesis.cancel();
          playSentenceAudio(currentQuestionSentenceIndex)
              .then(() => {
                  // 첫 번째 터치인지 확인 (복제본이 아직 생성되지 않은 경우)
                  // 추가 안전장치: 현재 질문이 유효한지도 확인
                  if (!cloneCreatedForCurrentQuestion && currentQuestionSentence && currentQuestionSentenceIndex !== null) {
                      console.log("🎯 First touch - triggering wave animation with clone generation");
                      // 첫 번째 터치: 복제본을 생성하는 wave 애니메이션 트리거
                      triggerSentenceWordAnimation(
                          currentQuestionSentence,
                          true, // isQuestion
                          centerSentenceWordRects,
                          ctx,
                          300 // AUX_ANIMATION_DELAY_QUESTION 과 동일한 지연
                      );
                                    } else if (cloneCreatedForCurrentQuestion && currentQuestionSentence) {
                      console.log("🏀 Subsequent touch - triggering bounce animation only");
                      // 두 번째 이후 터치: 바운스 애니메이션 트리거 (복제본 생성 없음)
                      // 의문사 단어들 먼저 바운스
                      triggerBounceAnimationForWords(currentQuestionSentence, true);
                      // 100ms 지연 후 조동사+주어 단어들 바운스
                      setTimeout(() => {
                          triggerBounceAnimationForWords(currentQuestionSentence, false);
                      }, 100);
                  } else {
                      console.log("⚠️ Unexpected state in question play button handler");
                      console.log("  - cloneCreated:", cloneCreatedForCurrentQuestion);
                      console.log("  - currentQuestion:", !!currentQuestionSentence);
                      console.log("  - questionIndex:", currentQuestionSentenceIndex);
                  }
              })
              .catch(err => console.error("Error playing question sentence audio from play button:", err));
      }
      event.preventDefault(); setTimeout(() => { isActionLocked = false; }, 200); return;
    }    if (isPlayBtnAnswerTouched) {
      showTranslationForAnswer = true; showTranslationForQuestion = false;
      if (activeWordTranslation) activeWordTranslation.show = false;
      if (wordTranslationTimeoutId) clearTimeout(wordTranslationTimeoutId);
      activeWordTranslation = null;
      isActionLocked = true;      // 답변 플레이 버튼 터치 시 모든 클론들 제거 및 모든 플래그 리셋
      console.log("🎯 Answer play button touched - clearing all clones and resetting all flags");
      clearQuestionWordClones(); // 모든 클론 제거
      cloneCreatedForCurrentQuestion = false; // 질문 클론 플래그도 리셋
      cloneCreatedForCurrentAnswer = false; // 답변 클론 플래그 리셋

      if (currentAnswerSentenceIndex !== null) {
          window.speechSynthesis.cancel();
          playSentenceAudio(currentAnswerSentenceIndex)
              .then(() => {
                  // 오디오 시작 후 애니메이션 트리거
                  triggerSentenceWordAnimation(
                      currentAnswerSentence,
                      false, // isQuestion
                      centerSentenceWordRects,
                      ctx,
                      300 // AUX_ANIMATION_DELAY 와 동일한 지연
                  );
              })
              .catch(err => console.error("Error playing answer sentence audio from play button:", err));
      }
      event.preventDefault();
      setTimeout(() => { isActionLocked = false; }, 200);
      return;
    }    if ((currentQuestionSentence || currentAnswerSentence) && centerSentenceWordRects.length > 0) {
        // 첫 번째 문장의 경계 상자 계산 (모든 문장 단어 포함)
        let questionBoundingBox = null;
        let answerBoundingBox = null;
        
        if (currentQuestionSentence && centerSentenceWordRects.some(rect => rect.isQuestionWord !== undefined)) {
            const questionWordRects = centerSentenceWordRects.filter(rect => rect.isQuestionWord === true || rect.isQuestionWord === undefined);
            if (questionWordRects.length > 0) {
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                questionWordRects.forEach(rect => {
                    minX = Math.min(minX, rect.x - expandedMargin);
                    minY = Math.min(minY, rect.y - rect.h / 2 - expandedMargin);
                    maxX = Math.max(maxX, rect.x + rect.w + expandedMargin);
                    maxY = Math.max(maxY, rect.y + rect.h / 2 + expandedMargin);
                });
                questionBoundingBox = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
            }
        }
        
        if (currentAnswerSentence && centerSentenceWordRects.some(rect => rect.isQuestionWord !== undefined)) {
            const answerWordRects = centerSentenceWordRects.filter(rect => rect.isQuestionWord === false);
            if (answerWordRects.length > 0) {
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                answerWordRects.forEach(rect => {
                    minX = Math.min(minX, rect.x - expandedMargin);
                    minY = Math.min(minY, rect.y - rect.h / 2 - expandedMargin);
                    maxX = Math.max(maxX, rect.x + rect.w + expandedMargin);
                    maxY = Math.max(maxY, rect.y + rect.h / 2 + expandedMargin);
                });
                answerBoundingBox = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
            }
        }
        
        // 클릭이 문장 영역 안에 있는지 확인
        const isInQuestionBox = questionBoundingBox && 
            clientX >= questionBoundingBox.x && clientX <= questionBoundingBox.x + questionBoundingBox.width &&
            clientY >= questionBoundingBox.y && clientY <= questionBoundingBox.y + questionBoundingBox.height;
            
        const isInAnswerBox = answerBoundingBox && 
            clientX >= answerBoundingBox.x && clientX <= answerBoundingBox.x + answerBoundingBox.width &&
            clientY >= answerBoundingBox.y && clientY <= answerBoundingBox.y + answerBoundingBox.height;
        
        // 특정 단어가 클릭되었는지 확인
        for (const wordRect of centerSentenceWordRects) {          if (clientX >= (wordRect.x - expandedMargin/2) && clientX <= (wordRect.x + wordRect.w + expandedMargin/2) &&
              clientY >= (wordRect.y - wordRect.h / 2 - expandedMargin/2) && clientY <= (wordRect.y + wordRect.h / 2 + expandedMargin/2) ) {            // 모든 진행 중인 음성 취소
            try {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
            } catch (e) {
              console.warn("음성 취소 중 오류:", e);
            }
            
            // 모바일 디바이스 감지
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            const isAndroid = /Android/i.test(navigator.userAgent);
            
            console.log(`"${wordRect.word}" 단어를 터치했습니다. 음성 합성 시작... (디바이스: ${isMobile ? (isIOS ? 'iOS' : (isAndroid ? 'Android' : 'Mobile')) : 'PC'})`);
            
            // 모바일에서는 즉시 음성 합성 재준비
            if (isMobile && window.speechSynthesis) {
              try {
                window.speechSynthesis.cancel();
                window.speechSynthesis.resume();
                
                // iOS에서는 터치 즉시 더미 발화로 시스템 활성화
                if (isIOS) {
                  const quickDummy = new SpeechSynthesisUtterance("");
                  quickDummy.volume = 0;
                  quickDummy.lang = 'en-US';
                  window.speechSynthesis.speak(quickDummy);
                }
                
                // Android에서는 테스트 단어로 활성화
                if (isAndroid) {
                  const quickTest = new SpeechSynthesisUtterance("hi");
                  quickTest.volume = 0;
                  quickTest.lang = 'en-US';
                  window.speechSynthesis.speak(quickTest);
                }
              } catch (e) {
                console.warn("모바일 음성 합성 즉시 준비 중 오류:", e);
              }
            }
            
            // 단어 읽기 - 모바일에서는 약간의 지연을 추가
            const speakDelay = isMobile ? (isAndroid ? 200 : 150) : 0;
            
            setTimeout(() => {
              speakWord(wordRect.word)
                .then(() => console.log(`"${wordRect.word}" 단어 읽기 완료`))
                .catch(err => console.error(`"${wordRect.word}" 단어 읽기 오류:`, err));
            }, speakDelay);
            
            // 기존 단어 번역 타이머 제거
            if (wordTranslationTimeoutId) clearTimeout(wordTranslationTimeoutId);
            if (activeWordTranslation) activeWordTranslation.show = false;
            
            // 액션 잠금 설정
            activeWordTranslation = null;
            isActionLocked = true;
            
            // 단어 번역 가져오기
            getWordTranslation(wordRect.word).then(translation => {
                activeWordTranslation = {
                    word: wordRect.word, translation: translation, x: wordRect.x, y: wordRect.y,
                    w: wordRect.w, h: wordRect.h, lineIndex: wordRect.lineIndex,
                    isQuestionWord: wordRect.isQuestionWord, show: true
                };
                wordTranslationTimeoutId = setTimeout(() => {
                    if (activeWordTranslation && activeWordTranslation.word === wordRect.word) activeWordTranslation.show = false;
                }, WORD_TRANSLATION_DURATION);
            }).catch(err => console.error("Error getting word translation:", err));
            showTranslationForQuestion = false; showTranslationForAnswer = false;            event.preventDefault(); setTimeout(() => { isActionLocked = false; }, 300); return;
          }
        }
        
        // 문장 영역 안에서 클릭한 경우 (단어가 직접 클릭되지 않았더라도)
        if (isInQuestionBox || isInAnswerBox) {
            console.log("클릭이 문장 영역 안에서 발생했습니다: " + (isInQuestionBox ? "질문 문장" : "답변 문장"));
            event.preventDefault();
            return; // 비행기 이동 방지
        }
    }
  }

  // 문장 영역 밖에서만 비행기 이동
  player.x = clientX - player.w / 2;
  if (event.type === 'touchstart' || event.type === 'touchmove') player.y = clientY - player.h / 2 - PLAYER_TOUCH_Y_OFFSET;
  else player.y = clientY - player.h / 2;
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(topOffset, Math.min(canvas.height - player.h, player.y));
  if (activeWordTranslation && activeWordTranslation.show) {
    activeWordTranslation.show = false;
    if (wordTranslationTimeoutId) { clearTimeout(wordTranslationTimeoutId); wordTranslationTimeoutId = null; }
  }
  showTranslationForQuestion = false; showTranslationForAnswer = false;
  const size = MIN_BUBBLE_SIZE + Math.random() * (MAX_BUBBLE_SIZE - MIN_BUBBLE_SIZE);
  const spawnX = player.x + player.w / 2 - size / 2;
  bullets.push({
    x: spawnX, y: player.y, w: size, h: size, img: bulletImg, timeAlive: 0,
    velocityY: BUBBLE_BASE_SPEED_Y_PPS + (Math.random() - 0.5) * 2 * BUBBLE_SPEED_Y_VARIATION_PPS,
    baseX: spawnX,
    swayFrequency: BUBBLE_SWAY_FREQUENCY_MIN + Math.random() * (BUBBLE_SWAY_FREQUENCY_MAX - BUBBLE_SWAY_FREQUENCY_MIN),
    swayAmplitude: size * (BUBBLE_SWAY_AMPLITUDE_FACTOR_MIN + Math.random() * (BUBBLE_SWAY_AMPLITUDE_FACTOR_MAX - BUBBLE_SWAY_AMPLITUDE_FACTOR_MIN)),
    swayPhaseOffset: Math.random() * Math.PI * 2,
    driftXPerSecond: (Math.random() - 0.5) * 2 * BUBBLE_HORIZONTAL_DRIFT_PPS_MAX,
  });  
  // Duck background music and play shoot sound
  duckBGM();
  sounds.shoot.play();
    // 탄환 발사 시 모든 클론들 제거 및 모든 플래그 리셋 (새로운 사이클 시작)
  console.log("🚀 Bullet fired - clearing all clones and resetting all clone flags for fresh cycle");
  clearQuestionWordClones(); // 모든 클론 제거
  cloneCreatedForCurrentQuestion = false; // 질문 클론 플래그 리셋 (새 사이클)
  cloneCreatedForCurrentAnswer = false; // 답변 클론 플래그 리셋
  event.preventDefault();
}

canvas.addEventListener('touchstart', e => {
  const touch = e.touches[0];
  
  // 모바일 디바이스 감지
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  // 터치 이벤트 시 음성 합성 초기화 시도 (모바일에서 사용자 제스처 이벤트 필요)
  if (window.speechSynthesis && isMobile) {
    try {
      // 모바일에서는 매번 음성 합성 상태를 리셋하고 재초기화
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      
      // iOS에서는 더미 발화로 시스템 웨이크업
      if (isIOS) {
        const dummyUtterance = new SpeechSynthesisUtterance("");
        dummyUtterance.volume = 0;
        dummyUtterance.lang = 'en-US';
        window.speechSynthesis.speak(dummyUtterance);
      }
      
      // 안드로이드에서는 짧은 단어로 시스템 활성화
      if (isAndroid) {
        speechSynthesisInitialized = false; // 강제 재초기화
        const testUtterance = new SpeechSynthesisUtterance("test");
        testUtterance.volume = 0;
        testUtterance.lang = 'en-US';
        window.speechSynthesis.speak(testUtterance);
      }
      
      // 초기화 진행
      if (!speechSynthesisInitialized || isMobile) {
        initSpeechSynthesis().then(() => {
          console.log("모바일 터치 이벤트에서 음성 합성 초기화 완료");
        }).catch(err => {
          console.warn("모바일 터치 이벤트에서 음성 합성 초기화 실패", err);
        });
      }
    } catch (e) {
      console.warn("모바일 음성 합성 준비 중 오류:", e);
    }
  } else if (!speechSynthesisInitialized) {
    // PC에서는 기존 방식으로 초기화
    initSpeechSynthesis().then(() => {
      console.log("터치 이벤트에서 음성 합성 초기화 완료");
    }).catch(err => {
      console.warn("터치 이벤트에서 음성 합성 초기화 실패", err);
    });
  }
  
  handleCanvasInteraction(touch.clientX, touch.clientY, e);
}, { passive: false });

canvas.addEventListener('mousedown', e => {
  handleCanvasInteraction(e.clientX, e.clientY, e);
});

canvas.addEventListener('touchmove', e => {
  if (!isGameRunning || isGamePaused) return;
  const touch = e.touches[0];
  const isOverPlayBtnQ = showPlayButtonQuestion && playButtonRectQuestion &&
    touch.clientX >= (playButtonRectQuestion.x - expandedMargin) && touch.clientX <= (playButtonRectQuestion.x + playButtonRectQuestion.w + expandedMargin) &&
    touch.clientY >= (playButtonRectQuestion.y - expandedMargin) && touch.clientY <= (playButtonRectQuestion.y + playButtonRectQuestion.h + expandedMargin);
  const isOverPlayBtnA = showPlayButton && playButtonRect &&
    touch.clientX >= (playButtonRect.x - expandedMargin) && touch.clientX <= (playButtonRect.x + playButtonRect.w + expandedMargin) &&
    touch.clientY >= (playButtonRect.y - expandedMargin) && touch.clientY <= (playButtonRect.y + playButtonRect.h + expandedMargin);
  
  // 문장 영역 확인
  let isOverSentenceArea = false;
  let isOverWord = false;
  
  if ((currentQuestionSentence || currentAnswerSentence) && centerSentenceWordRects.length > 0) {
    // 문장 바운딩 박스 계산
    let questionBoundingBox = null;
    let answerBoundingBox = null;
    
    if (currentQuestionSentence && centerSentenceWordRects.some(rect => rect.isQuestionWord !== undefined)) {
      const questionWordRects = centerSentenceWordRects.filter(rect => rect.isQuestionWord === true || rect.isQuestionWord === undefined);
      if (questionWordRects.length > 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        questionWordRects.forEach(rect => {
          minX = Math.min(minX, rect.x - expandedMargin);
          minY = Math.min(minY, rect.y - rect.h / 2 - expandedMargin);
          maxX = Math.max(maxX, rect.x + rect.w + expandedMargin);
          maxY = Math.max(maxY, rect.y + rect.h / 2 + expandedMargin);
        });
        questionBoundingBox = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      }
    }
    
    if (currentAnswerSentence && centerSentenceWordRects.some(rect => rect.isQuestionWord !== undefined)) {
      const answerWordRects = centerSentenceWordRects.filter(rect => rect.isQuestionWord === false);
      if (answerWordRects.length > 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        answerWordRects.forEach(rect => {
          minX = Math.min(minX, rect.x - expandedMargin);
          minY = Math.min(minY, rect.y - rect.h / 2 - expandedMargin);
          maxX = Math.max(maxX, rect.x + rect.w + expandedMargin);
          maxY = Math.max(maxY, rect.y + rect.h / 2 + expandedMargin);
        });
        answerBoundingBox = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      }
    }
    
    // 터치가 문장 영역 안에 있는지 확인
    isOverSentenceArea = 
      (questionBoundingBox && 
       touch.clientX >= questionBoundingBox.x && touch.clientX <= questionBoundingBox.x + questionBoundingBox.width &&
       touch.clientY >= questionBoundingBox.y && touch.clientY <= questionBoundingBox.y + questionBoundingBox.height) ||
      (answerBoundingBox && 
       touch.clientX >= answerBoundingBox.x && touch.clientX <= answerBoundingBox.x + answerBoundingBox.width &&
       touch.clientY >= answerBoundingBox.y && touch.clientY <= answerBoundingBox.y + answerBoundingBox.height);
       
    // 단어 검사 (기존 코드)
    for (const wordRect of centerSentenceWordRects) {
      if ( touch.clientX >= wordRect.x && touch.clientX <= wordRect.x + wordRect.w &&
           touch.clientY >= wordRect.y - wordRect.h/2 && touch.clientY <= wordRect.y + wordRect.h/2 ) {
        isOverWord = true; break;
      }
    }
  }
  
  if (isOverPlayBtnQ || isOverPlayBtnA || isOverWord || isOverSentenceArea) { e.preventDefault(); return; }

  player.x = touch.clientX - player.w / 2;
  player.y = touch.clientY - player.h / 2 - PLAYER_TOUCH_Y_OFFSET;
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(topOffset, Math.min(canvas.height - player.h, player.y));
  e.preventDefault();
}, { passive: false });

canvas.addEventListener('mousemove', e => {
  if (!isGameRunning || isGamePaused || e.buttons !== 1) return;
  const isOverPlayBtnQ = showPlayButtonQuestion && playButtonRectQuestion &&
      e.clientX >= (playButtonRectQuestion.x - expandedMargin) && e.clientX <= (playButtonRectQuestion.x + playButtonRectQuestion.w + expandedMargin) &&
      e.clientY >= (playButtonRectQuestion.y - expandedMargin) && e.clientY <= (playButtonRectQuestion.y + playButtonRectQuestion.h + expandedMargin);
  const isOverPlayBtnA = showPlayButton && playButtonRect &&
      e.clientX >= (playButtonRect.x - expandedMargin) && e.clientX <= (playButtonRect.x + playButtonRect.w + expandedMargin) &&
      e.clientY >= (playButtonRect.y - expandedMargin) && e.clientY <= (playButtonRect.y + playButtonRect.h + expandedMargin);
      
  // 문장 영역 확인
  let isOverSentenceArea = false;
  let isOverWord = false;
  
  if ((currentQuestionSentence || currentAnswerSentence) && centerSentenceWordRects.length > 0) {
    // 문장 바운딩 박스 계산
    let questionBoundingBox = null;
    let answerBoundingBox = null;
    
    if (currentQuestionSentence && centerSentenceWordRects.some(rect => rect.isQuestionWord !== undefined)) {
      const questionWordRects = centerSentenceWordRects.filter(rect => rect.isQuestionWord === true || rect.isQuestionWord === undefined);
      if (questionWordRects.length > 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        questionWordRects.forEach(rect => {
          minX = Math.min(minX, rect.x - expandedMargin);
          minY = Math.min(minY, rect.y - rect.h / 2 - expandedMargin);
          maxX = Math.max(maxX, rect.x + rect.w + expandedMargin);
          maxY = Math.max(maxY, rect.y + rect.h / 2 + expandedMargin);
        });
        questionBoundingBox = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      }
    }
    
    if (currentAnswerSentence && centerSentenceWordRects.some(rect => rect.isQuestionWord !== undefined)) {
      const answerWordRects = centerSentenceWordRects.filter(rect => rect.isQuestionWord === false);
      if (answerWordRects.length > 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        answerWordRects.forEach(rect => {
          minX = Math.min(minX, rect.x - expandedMargin);
          minY = Math.min(minY, rect.y - rect.h / 2 - expandedMargin);
          maxX = Math.max(maxX, rect.x + rect.w + expandedMargin);
          maxY = Math.max(maxY, rect.y + rect.h / 2 + expandedMargin);
        });
        answerBoundingBox = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      }
    }
    
    // 마우스가 문장 영역 안에 있는지 확인
    isOverSentenceArea = 
      (questionBoundingBox && 
       e.clientX >= questionBoundingBox.x && e.clientX <= questionBoundingBox.x + questionBoundingBox.width &&
       e.clientY >= questionBoundingBox.y && e.clientY <= questionBoundingBox.y + questionBoundingBox.height) ||
      (answerBoundingBox && 
       e.clientX >= answerBoundingBox.x && e.clientX <= answerBoundingBox.x + answerBoundingBox.width &&
       e.clientY >= answerBoundingBox.y && e.clientY <= answerBoundingBox.y + answerBoundingBox.height);
    
    // 단어 검사 (기존 코드)
    for (const wordRect of centerSentenceWordRects) {
      if ( e.clientX >= wordRect.x && e.clientX <= wordRect.x + wordRect.w &&
           e.clientY >= wordRect.y - wordRect.h/2 && e.clientY <= wordRect.y + wordRect.h/2 ) {
        isOverWord = true; break;
      }
    }
  }
  
  if (isOverPlayBtnQ || isOverPlayBtnA || isOverWord || isOverSentenceArea) return;

  player.x = e.clientX - player.w / 2;
  player.y = e.clientY - player.h / 2;
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(topOffset, Math.min(canvas.height - player.h, player.y));
});

window.addEventListener('load', () => {
    console.log("윈도우 로드 이벤트 실행");
    calculateTopOffset();
    let storedIndex = Number(localStorage.getItem('sentenceIndex') || 0);
    sentenceIndex = storedIndex % sentences.length;
    localStorage.setItem('sentenceIndex', sentenceIndex.toString());
    if (bgmFiles && bgmFiles.length > 0) {
        console.log("BGM object initialized on load.");
    }
    getVoicesReliably().then(voices => {
        if(voices.length > 0) console.log("Voices pre-warmed successfully.");
        else console.warn("Voices pre-warming done, but no voices found.");
    }).catch(err => console.error("Error pre-warming voices on load:", err));
    
    // 드롭다운 문장 목록 초기화 (지연 실행으로 안정성 확보)
    setTimeout(() => {
        try {
            initializeSentenceDropdown();
        } catch (e) {
            console.error("드롭다운 초기화 오류:", e);
        }
    }, 500);
});

// ---- 문장 드롭다운 기능 (기존 코드와 독립적으로 동작) ----
function initializeSentenceDropdown() {
    console.log("드롭다운 초기화 시작");
    const dropdownBtn = document.getElementById('dropdownBtn');
    const sentenceList = document.getElementById('sentenceList');
    
    if (!dropdownBtn || !sentenceList) {
        console.error("드롭다운 요소를 찾을 수 없습니다.");
        return;
    }
    
    // 버튼 텍스트 업데이트 - 드롭다운 화살표 아이콘으로 고정
    dropdownBtn.innerHTML = '&#9662;';  // 아래쪽 삼각형만 표시, 한글 제거
    dropdownBtn.style.fontSize = '47px'; // 크기 고정
    
    // 드롭다운 버튼 클릭 이벤트 (터치와 클릭 모두 처리)
    function toggleDropdown(event) {
        console.log("드롭다운 토글 이벤트 발생");
        if (event.cancelable) event.preventDefault();
        event.stopPropagation();
        
        // 시작화면(!isGameRunning && !isGamePaused) 또는 게임 resume 상태(isGameRunning && isGamePaused)에서만 동작
        const isStartScreen = !isGameRunning && !isGamePaused;
        const isResumeState = isGameRunning && isGamePaused;
        
        if (!isStartScreen && !isResumeState) {
            console.log("드롭다운 허용되지 않는 상태: 게임 실행 중");
            return; // 게임 실행 중이면 드롭다운 불가
        }
        
        // 드롭다운 토글
        if (sentenceList.style.display === 'block') {
            console.log("드롭다운 닫기");
            sentenceList.style.display = 'none';
            // 드롭다운 닫힐 때 게임 상태 복원 및 버튼 활성화
            stopDropdownMp3Playback(); // 영어 읽기 중단
            
            // 드롭다운 버튼 원상 복구
            dropdownBtn.innerHTML = '&#9662;';
            dropdownBtn.style.fontSize = '47px';
            dropdownBtn.style.lineHeight = '';
            dropdownBtn.style.minWidth = '';
            dropdownBtn.style.minHeight = '';
            dropdownBtn.style.padding = '';
            
            // 미디어 컨테이너 다시 표시
            const sentenceImageContainer = document.getElementById('sentenceImageContainer');
            if (sentenceImageContainer) {
                sentenceImageContainer.style.display = 'block';
                console.log("미디어 컨테이너 표시");
            }
            
            // 시작 화면으로 돌아갈 때 버튼 활성화
            setTopButtonsDisabled(false);
            
            // resume 상태에서 드롭다운을 열었던 경우
            if (isDropdownPause) {
                isDropdownPause = false;
            }
            
            // 하단 미디어가 일시정지 상태였다면 재생
            if (isDropdownBottomMediaPaused) {
                if (typeof toggleBottomMediaPause === 'function') toggleBottomMediaPause();
                isDropdownBottomMediaPaused = false;
            }
        } else {
            console.log("드롭다운 열기");
            // 항상 목록 새로 생성하여 최신 상태 유지
            populateSentenceList();
            
            // 목록 표시
            sentenceList.style.display = 'block';
            
            // 드롭다운 열릴 때 항상 버튼 비활성화
            setTopButtonsDisabled(true);
            
            // 현재 선택된 문장으로 스크롤
            setTimeout(() => {
                const activeItem = sentenceList.querySelector(`.sentence-item:nth-child(${sentenceIndex + 1})`);
                if (activeItem) {
                    activeItem.scrollIntoView({ behavior: 'auto', block: 'center' });
                }
            }, 100); // 시간을 늘려 안정적으로 스크롤 처리
            
            // resume 상태에서 드롭다운을 열었을 경우 flag 설정
            if (isGameRunning && isGamePaused) {
                isDropdownPause = true;
            }
            
            // 하단 미디어가 재생 중이면 일시정지
            if (typeof isBottomMediaPlaying !== 'undefined' && isBottomMediaPlaying) {
                if (typeof toggleBottomMediaPause === 'function') toggleBottomMediaPause();
                isDropdownBottomMediaPaused = true;
            }
            
            // 미디어 컨테이너 숨기기 (드롭다운 메뉴가 위에 표시되도록)
            const sentenceImageContainer = document.getElementById('sentenceImageContainer');
            if (sentenceImageContainer) {
                sentenceImageContainer.style.display = 'none';
                console.log("미디어 컨테이너 숨김");
            }
            
            // 드롭다운 버튼 모양 변경
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
            
            // 영어 문장 읽어주기 (현재 선택된 문장)
            setTimeout(() => {
              dropdownMp3Index = (dropdownSentenceIndex + 1) % 96;
              playAllSentenceMp3sFromStart();
            }, 200);
        }
    }
    
    // 이벤트 리스너 제거 후 다시 등록 (중복 방지)
    dropdownBtn.removeEventListener('click', toggleDropdown);
    dropdownBtn.removeEventListener('touchend', toggleDropdown);
    
    // 클릭 이벤트 리스너
    dropdownBtn.addEventListener('click', toggleDropdown);
    
    // 터치 이벤트 리스너 (모바일)
    dropdownBtn.addEventListener('touchend', toggleDropdown);
    
    // 모바일 터치 이벤트 처리
    sentenceList.addEventListener('touchstart', function(e) {
        e.stopPropagation();
    }, { passive: true });
    
    sentenceList.addEventListener('touchmove', function(e) {
        e.stopPropagation();
    }, { passive: true });
    
    // 문서 클릭 시 드롭다운 닫기 (드롭다운 버튼 클릭만 허용하도록 수정)
    document.removeEventListener('click', documentClickHandler);
    document.addEventListener('click', documentClickHandler);
    
    function documentClickHandler(event) {
        // 드롭다운이 열려있을 때, 문장 목록 내부의 요소나 드롭다운 버튼 클릭만 처리
        if (sentenceList.style.display === 'block') {
            // 드롭다운 목록이나 버튼이 아닌 다른 요소 클릭 시 이벤트 무시
            if (!sentenceList.contains(event.target) && event.target !== dropdownBtn) {
                console.log("드롭다운 열린 상태에서 외부 요소 클릭 - 이벤트 차단");
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }
    }
    
    console.log("드롭다운 초기화 완료");
}

// 문장 목록 생성 함수
function populateSentenceList() {
    console.log("문장 목록 생성 시작");
    const sentenceList = document.getElementById('sentenceList');
    if (!sentenceList) {
        console.error("문장 목록 요소를 찾을 수 없습니다.");
        return;
    }
      // 기존 목록 비우기
    sentenceList.innerHTML = '';    // 모든 문장 표시
    // 반드시 영어 문장 배열만 사용
    const sentencesToShow = sentences;
    
    sentencesToShow.forEach((sentence, index) => {
        const sentenceItem = document.createElement('div');
        sentenceItem.className = 'sentence-item';
        sentenceItem.setAttribute('data-index', String(index));
          // 홀수 문장(의문문)에 배경색 추가 - 인덱스는 0부터 시작하므로 짝수 인덱스가 홀수 문장
        if (index % 2 === 0) {
            sentenceItem.classList.add('question-sentence');
        } 
        // 짝수 번호 문장(인덱스 1, 3, 5...)에 추가 마진 클래스 적용
        else {
            sentenceItem.classList.add('answer-sentence');
        }        // 문장 번호와 내용 추가
        const sentenceNumber = document.createElement('span');
        sentenceNumber.className = 'sentence-number';
        sentenceNumber.style.color = 'white'; // 번호 색상을 흰색으로 직접 지정
        sentenceNumber.style.fontSize = '13.68px'; // 문장 번호 크기 20% 축소 (17.1px * 0.8)
        sentenceNumber.textContent = `${index + 1}.`;
        
        const sentenceText = document.createElement('span');
        sentenceText.className = 'sentence-text';
          // 모든 줄바꿈을 제거하고 한 줄로 표시 (\\n 이스케이프 문자와 실제 줄바꿈 모두 처리)
        let cleanedText = sentence.replace(/\\n|\n|\r/g, ' ');
        // 두 개 이상의 연속된 공백을 하나로 줄임
        cleanedText = cleanedText.replace(/\s+/g, ' ');
        
        // 홀수 문장(인덱스가 0, 2, 4...)에 대해서만 의문사와 조동사에 색상 적용
        if (index % 2 === 0) { // 인덱스가 짝수면 실제로는 홀수 문장
            sentenceText.innerHTML = ''; // textContent 대신 innerHTML 사용
            
            // 문장을 단어로 분리
            const words = cleanedText.split(' ');
            
            words.forEach((word, wordIndex) => {
                const wordSpan = document.createElement('span');
                
                // 실제 단어 추출 (마침표, 콤마 등 제외)
                const actualWord = word.replace(/[^\w\']/g, '');
                
                // 의문사 다음에 나오는 조동사만 #1A6DFF, 그 외 의문사는 녹색, 나머지 조동사는 기존대로
                if (isQuestionWord(actualWord)) {
                    wordSpan.style.color = '#249F24'; // 의문사 진한 녹색
                } else if (
                    wordIndex > 0 && isModalVerb(actualWord) && isQuestionWord(words[wordIndex - 1].replace(/[^\w\']/g, ''))
                ) {
                    wordSpan.style.color = '#4A9FFF'; // 의문사 다음 조동사만 스카이 블루
                } else if (isModalVerb(actualWord)) {
                    wordSpan.style.color = '#1A6DFF'; // 나머지 조동사 파란색
                } else {
                    wordSpan.style.color = 'white'; // 나머지 흰색
                }
                
                // 마지막 단어가 아니면 공백 추가
                wordSpan.textContent = word + (wordIndex < words.length - 1 ? ' ' : '');
                sentenceText.appendChild(wordSpan);
            });
        } else {
            sentenceText.textContent = cleanedText; // 짝수 문장은 그대로 표시
        }
        
        // 의문사 확인 함수
        function isQuestionWord(word) {
            const questionWords = ['what', 'where', 'when', 'why', 'who', 'how', 'which', 'whose'];
            return questionWords.includes(word.toLowerCase());
        }
        
        // 조동사 확인 함수
        function isModalVerb(word) {
            const modalVerbs = ['will', 'won\'t', 'would', 'wouldn\'t', 'can', 'can\'t', 'could', 'couldn\'t', 
                              'shall', 'should', 'shouldn\'t', 'may', 'might', 'must', 'mustn\'t'];
            return modalVerbs.includes(word.toLowerCase());
        }
        
        sentenceItem.appendChild(sentenceNumber);
        sentenceItem.appendChild(sentenceText);
        // 번호 클릭 이벤트 - 영어 읽기만
        sentenceNumber.style.cursor = 'pointer';
        sentenceNumber.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            stopDropdownMp3Playback();
            playAllSentenceMp3sFromStart(index);
        });
        // 문장 클릭 이벤트 - 기존 게임 시작 기능
        sentenceText.style.cursor = 'pointer';
        sentenceText.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            sentenceIndex = index;
            localStorage.setItem('sentenceIndex', sentenceIndex.toString());
            sentenceList.style.display = 'none';
            stopDropdownMp3Playback();
            dropdownBtn.innerHTML = '&#9662;';
            dropdownBtn.style.fontSize = '47px';
            dropdownBtn.style.lineHeight = '';
            dropdownBtn.style.minWidth = '';
            dropdownBtn.style.minHeight = '';
            dropdownBtn.style.padding = '';
            setTopButtonsDisabled(false);
            
            // 게임을 자동으로 시작하지 않고, 문장만 선택하여 화면에 표시
            const isOdd = index % 2 === 0;
            const sentenceTextVal = sentences[index];
            const lines = sentenceTextVal.split(/\\n|\n/);
            const line1 = lines[0] ? lines[0].trim() : "";
            const line2 = lines[1] ? lines[1].trim() : "";
            const sentenceObj = { line1, line2 };
            
            // 이전 문장 초기화
            currentQuestionSentence = null;
            currentAnswerSentence = null;
            currentQuestionSentenceIndex = null;
            currentAnswerSentenceIndex = null;
            
            // 새 문장 설정
            if (isOdd) {
                currentQuestionSentence = sentenceObj;
                currentQuestionSentenceIndex = index;
            } else {
                currentAnswerSentence = sentenceObj;
                currentAnswerSentenceIndex = index;
            }
            
            // 문장 선택에 관한 메시지 출력
            console.log(`문장 ${index + 1} 선택됨. 문장이 화면에 표시됩니다. 게임을 시작하려면 START 또는 RESUME 버튼을 클릭하세요.`);
            
            // 시작 화면에서만(게임이 시작되지 않은 상태) PAUSE 버튼을 RESUME으로 바꾸고 게임을 준비 상태로 만듦
            if (!isGameRunning && !isGamePaused) {
                // START 버튼을 누른 효과를 주어 게임을 준비 상태로 만듦
                // isGameRunning은 true로 설정하지 않고, 문장만 선택된 상태로 유지
                
                // PAUSE 버튼을 RESUME으로 바꿈
                const pauseBtn = document.getElementById('pauseBtn');
                pauseBtn.textContent = 'RESUME';
                
                // 게임 일시정지 상태로 설정하지 않음 (isGamePaused는 false로 유지)
                // 이렇게 하면 RESUME 버튼을 한 번만 클릭해도 게임이 시작됨
                
                console.log("시작 화면에서 문장 선택 - RESUME 버튼으로 바꾸고 게임 준비 상태로 설정");
                
                // 게임이 준비됨 -> 하단 미디어는 아래에서 올라오게 함
                if (typeof onGamePaused === 'function') {
                    onGamePaused();
                }
            }
            
            // 항상 문장을 화면에 표시 (게임 상태와 무관하게)
            
            // 선택된 문장 정보 저장 (resetGameStateForStartStop 이후 복원하기 위해)
            const selectedSentenceInfo = {
                isOdd: isOdd,
                sentenceObj: sentenceObj,
                index: index
            };
            console.log(`선택한 문장 정보 저장: ${index + 1}번 문장`);
            
            // 게임 상태 완전 초기화 (resetGameStateForStartStop 함수 호출)
            console.log("드롭다운에서 문장 선택: 게임 상태 완전 초기화 시작");
            resetGameStateForStartStop();
            
            // 선택한 문장 정보 복원
            console.log(`선택한 문장 정보 복원: ${index + 1}번 문장`);
            if (selectedSentenceInfo.isOdd) {
                currentQuestionSentence = selectedSentenceInfo.sentenceObj;
                currentQuestionSentenceIndex = selectedSentenceInfo.index;
            } else {
                currentAnswerSentence = selectedSentenceInfo.sentenceObj;
                currentAnswerSentenceIndex = selectedSentenceInfo.index;
            }
            
            // 캔버스 완전히 초기화 (복제본도 모두 제거하기 위함)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 추가 확인: 모든 복제본 관련 배열 명시적 초기화
            centerSentenceWordRects = [];
            sentenceWordRects = [];
            
            // 모든 문장 복제본 클론 배열 초기화 (중요: 이것이 복제본 문제 해결의 핵심)
            questionWordClones = [];
            subjectAuxClones = [];
            verbClones = [];
            
            // 두 번 더 확실하게 복제본 제거를 위한 함수 호출
            try {
                if (typeof clearQuestionWordClones === 'function') {
                    clearQuestionWordClones(); // 의문사 클론 제거
                }
                if (typeof clearSubjectAuxClones === 'function') {
                    clearSubjectAuxClones(); // 주어+조동사 클론 제거
                }
                if (typeof clearVerbClones === 'function') {
                    clearVerbClones(); // 동사 클론 제거
                }
                
                // 복제본과 관련된 모든 요소 초기화
                if (window.explosionParticles) window.explosionParticles = [];
                if (window.sentenceWordObjects) window.sentenceWordObjects = [];
                if (window.floatingWords) window.floatingWords = [];
                if (window.flyingElements) window.flyingElements = [];
                
                // 게임 엔진 상태 초기화 플래그
                cloneCreatedForCurrentQuestion = false;
                cloneCreatedForCurrentAnswer = false;
                
                // 추가 클론 배열 초기화 (다른 종류의 복제본도 모두 제거)
                if (window.wordClones) window.wordClones = [];
                if (window.auxiliaryClones) window.auxiliaryClones = [];
                if (window.textClones) window.textClones = [];
                
                console.log("모든 종류의 복제본 제거 완료");
            } catch(e) {
                console.log("복제본 제거 중 오류:", e);
            }
            
            // 기본 게임 화면 그리기
            draw();
            
            // 문장이 설정되었는지 확인하고 로깅
            console.log(`문장 설정 확인: currentQuestionSentence=${!!currentQuestionSentence}, currentAnswerSentence=${!!currentAnswerSentence}`);
            
            // 중앙 문장 표시 (필요한 경우 강제로 투명도 설정)
            centerAlpha = 1.0;
            drawCenterSentence();
            
            console.log("문장 선택: 게임 화면 초기화 및 새 문장 표시");
            
            // 다음 프레임에서도 한 번 더 그려서 확실하게 표시되도록 함
            // 이는 게임 정지 상태에서 resetGameStateForStartStop 함수가 호출되어 
            // currentQuestionSentence와 currentAnswerSentence를 null로 설정하는 문제를 해결하기 위함
            requestAnimationFrame(function() {
                // 캔버스 완전히 초기화
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // 중앙 문장만 표시
                centerAlpha = 1.0;
                drawCenterSentence();
                
                console.log("문장 선택: 다음 프레임에서 화면 다시 그리기 완료");
            });
        });
        // sentenceItem에는 클릭 이벤트를 부여하지 않는다.
        
        sentenceList.appendChild(sentenceItem);
    });
    
    console.log(`문장 목록 생성 완료: ${sentences.length}개 문장`);
    return sentenceList;
}
