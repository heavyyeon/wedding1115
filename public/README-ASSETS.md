# 실제 파일로 교체해주세요

지금 이 폴더에는 미리보기가 깨지지 않도록 자동 생성한 자리표시자 이미지/음원이 들어있습니다.
배포 전에 **같은 파일명 그대로** 실제 파일로 덮어써주세요.

| 경로 | 용도 | 권장 사이즈 |
|---|---|---|
| `main-photo.jpg` | 첫 화면(TitleCard) 배경 사진 | 세로형, 960×1600 이상 |
| `groom.jpg` | 신랑 소개 사진 (CastingSection) | 3:4 세로 |
| `bride.jpg` | 신부 소개 사진 (CastingSection) | 3:4 세로 |
| `invitation.png` | 손글씨/캘리그래피 이미지 (InvitationSection) | 투명 배경 PNG |
| `kakao.jpg` | 카카오톡 공유 시 보이는 썸네일 | 800×400 (2:1) |
| `bgm.mp3` | 배경음악 | mp3, 1~3분 루프 권장 |
| `gallery/1.jpg` ~ `gallery/22.jpg` | 갤러리 사진 22장 | 정사각형에 가까운 비율 권장 |

사진 장수를 22장보다 늘리거나 줄이고 싶다면
`src/data/wedding.ts` 의 `gallery.count` 값만 바꿔주면 됩니다.

이 안내 파일(`README-ASSETS.md`)은 실제 배포에는 영향이 없으니 지워도 됩니다.
