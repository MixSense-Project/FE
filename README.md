# 📂 폴더 구조

```text
/FE (Root Directory)
├── node_modules/
├── src/
│   ├── assets/              # 정적 자원
│   │   ├── img/             # 이미지 파일
│   │   └── sass/            # 스타일 시트
│   │       ├── section/
│   │       │   ├── components/
│   │       │   └── page/
│   │       ├── setting/
│   │       └── style.scss
│   ├── components/          # 공통 컴포넌트
|   |    ├── Ai_Dj/
|   |    ├── Home/      
|   |    ├── Library/
│   │    └── Preference/
│   ├── page/                # 페이지 컴포넌트
|   |    ├── Ai_Dj/
|   |    ├── Ai_search/
|   |    ├── Home/      
|   |    ├── Library/
|   |    ├── Music/
|   |    ├── Preference/
│   │    └── Splash/
|   ├── data/                # 데이터 파일
│   ├── App.jsx              # 메인 앱 컴포넌트
│   └── main.jsx             # 엔트리 포인트
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
