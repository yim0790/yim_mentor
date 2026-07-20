# Mentor — 개인 콘텐츠 저장소 PWA

유튜브·소셜에서 본 좋은 영상과 글을 모아두고, 음성으로 들을 수 있는 웹앱.

## 폴더 구조

```
mentor/
├─ index.html        ← 앱 본체. 새 글 올릴 때 건드리지 않음
├─ manifest.json     ← 앱 이름·아이콘 설정
├─ sw.js             ← 오프라인 캐시(서비스워커)
├─ icons/            ← 아이콘 이미지
└─ content/
   ├─ posts.json     ← 목록 정보 (여기에 3~4줄 추가)
   └─ *.md           ← 본문 파일 (여기에 파일 1개 추가)
```

---

## 새 콘텐츠 올리는 법 — 2단계

### 1단계. 본문 파일 만들기

`content/` 안에 `날짜-영문제목.md` 형식으로 파일을 만들고, NotebookLM 요약을 붙여넣습니다.

```
## 핵심 한 줄

여기에 요약 한 문장.

## 내용

문단은 빈 줄로 구분합니다.

- 목록은 하이픈으로 시작
- 이렇게

> 인용문은 꺾쇠로 시작

**굵게**, *기울임*, [링크](https://예시.com) 사용 가능
```

유튜브 주소를 **한 줄에 단독으로** 적으면 영상이 자동으로 삽입됩니다.

```
https://www.youtube.com/watch?v=영상ID
```

### 2단계. `content/posts.json`에 목록 추가

`"posts": [` 바로 다음에 아래 블록을 붙여넣고 내용만 바꿉니다. **항목 사이 쉼표를 빠뜨리지 않도록** 주의.

```json
{
  "id": "2026-07-25-my-note",
  "title": "목록에 보일 제목",
  "date": "2026-07-25",
  "kind": "video",
  "source": "YouTube",
  "tags": ["투자", "마인드셋"],
  "summary": "한 줄 요약",
  "url": "https://www.youtube.com/watch?v=영상ID",
  "file": "2026-07-25-my-note.md"
},
```

| 항목 | 설명 |
|---|---|
| id | 겹치지 않는 고유값. 파일명과 같게 쓰면 편함 |
| date | YYYY-MM-DD. 최신 날짜가 목록 맨 위로 |
| kind | video / article / book / podcast |
| source | 출처 표시용 자유 텍스트 |
| tags | 목록 화면 필터 버튼으로 나타남 |
| url | 원본 링크. 없으면 `""` |
| file | content 폴더 안의 본문 파일명 |

끝. `index.html`은 영원히 수정하지 않습니다.

---

## 배포 (GitHub + Netlify)

**최초 1회**
1. GitHub에 저장소를 만들고 이 폴더 전체를 업로드
2. Netlify → Add new site → Import an existing project → 해당 저장소 선택
3. Build command 비움 / Publish directory `.` → Deploy

**이후 업데이트**
- GitHub 저장소 웹페이지에서 `content` 폴더로 들어가 **Add file → Upload files**로 `.md` 파일을 올리고,
  `posts.json`은 연필 아이콘으로 직접 편집 → Commit
- 1~2분 뒤 Netlify가 자동 반영

폰에서 사이트를 열고 **홈 화면에 추가**하면 앱처럼 실행됩니다.

---

## 음성(TTS)에 대해

브라우저 내장 음성을 사용합니다. 비용은 없지만 **기기에 설치된 한국어 음성만 쓸 수 있습니다.**

| 환경 | 한국어 음성 |
|---|---|
| Windows 11 (Chrome/Edge) | InJoon(남성) 선택 가능 |
| Android (Chrome) | 대체로 여성 음성 |
| iPhone / iPad (Safari) | 유나(여성) 위주 |

앱은 남성 음성이 있으면 **자동으로 우선 선택**하고, 없으면 하단 바에 안내가 뜹니다.
음성 목록은 하단 바 드롭다운에서 직접 바꿀 수 있고, 선택은 기기에 저장됩니다.

- **iPhone에 음성 추가**: 설정 → 손쉬운 사용 → 콘텐츠 말하기 → 음성 → 한국어
- **Android에 음성 추가**: 설정 → 시스템 → 언어 및 입력 → 텍스트 음성 변환

일관된 아나운서 남성 목소리가 꼭 필요하면 Naver Clova Voice 같은 유료 TTS를 붙여야 합니다(Netlify Functions 필요).

---

## 그 밖의 기능

- 제목·태그·요약 검색
- 태그 필터
- 읽은 글은 표시가 흐려짐 (기기에 저장)
- 재생 속도 0.9 / 1.0 / 1.1 / 1.25 / 1.5배
- 읽고 있는 문단에 형광펜 표시
- 오프라인에서도 이전에 본 글은 열림
- 시스템 다크모드 자동 대응

## 주의

- 로컬 PC에서 `index.html`을 더블클릭하면 본문을 못 읽습니다(브라우저 보안 정책).
  테스트하려면 해당 폴더에서 `python -m http.server 8000` 실행 후 `http://localhost:8000` 접속.
- `index.html`, `sw.js`를 수정했을 때는 `sw.js` 맨 위 `VERSION` 값을 `mentor-v2`처럼 올려야
  기존 사용자 기기의 캐시가 갱신됩니다.
