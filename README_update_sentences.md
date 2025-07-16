# 영어 문장 교체 안내서

아래 코드 블록에 정확히 줄바꿈이 적용된 96개의 영어 문장이 있습니다. 이 문장들을 script.js 파일에 적용하려면:

1. script.js 파일을 텍스트 편집기로 엽니다.
2. 기존 `sentences` 배열을 찾습니다 (30번 줄 근처에 있습니다).
3. 아래 코드 블록을 복사하여 기존 배열을 대체합니다.

```javascript
// --- START: 새로운 96개 영어 문장 ---
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
  "Where can we test \nthis giant parachute?", // 49.txt
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
  "When can't this tricky situation just end?", // 71.txt - 이 문장만 줄바꿈 없이 한 줄로
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
// --- END: 새로운 96개 영어 문장 ---
```

이 코드를 적용하면:

1. 모든 문장은 제공하신 정확한 위치에서 줄바꿈됩니다 (71번 제외).
2. 71번 문장은 줄바꿈 없이 한 줄로 표시됩니다.
3. 게임에서 문장이 화면에 나타날 때 정확히 같은 줄바꿈 위치로 표시될 것입니다.

파일을 저장한 후 웹 페이지를 새로고침하여 변경사항을 확인하세요.
