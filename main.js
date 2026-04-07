class LunchRecommender extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        /* 컴포넌트 내부 스타일은 style.css의 @layer components 와 동일하게 유지 */
        :host {
          display: block;
          background-color: var(--surface-color, oklch(99% 0.01 240));
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow:
            0 2.8px 2.2px var(--shadow-color, oklch(20% 0.1 240 / 40%)),
            0 6.7px 5.3px var(--shadow-color, oklch(20% 0.1 240 / 40%)),
            0 12.5px 10px var(--shadow-color, oklch(20% 0.1 240 / 40%)),
            0 22.3px 17.9px var(--shadow-color, oklch(20% 0.1 240 / 40%)),
            0 41.8px 33.4px var(--shadow-color, oklch(20% 0.1 240 / 40%)),
            0 100px 80px var(--shadow-color, oklch(20% 0.1 240 / 40%));
          max-width: 700px;
        }

        .container {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 2rem;
        }

        .text-area {
            flex: 1;
            text-align: left;
        }

        h1 {
            font-size: 2rem;
            margin: 0 0 0.5rem 0;
            white-space: nowrap;
            color: var(--accent-color, oklch(65% 0.25 290));
        }

        .menu-display {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--text-color, oklch(25% 0.15 240));
            min-height: 2rem;
        }

        button {
            flex-shrink: 0;
            background-color: var(--accent-color, oklch(65% 0.25 290));
            color: white;
            border: none;
            border-radius: 0.75rem;
            padding: 1rem 2rem;
            font-size: 1.2rem;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 6px oklch(20% 0.1 290 / 30%);
            align-self: center;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 10px oklch(20% 0.1 290 / 40%);
        }
      </style>
      <div class="container">
        <div class="text-area">
          <h1>오늘 뭐 먹지?</h1>
          <div class="menu-display">점심 메뉴를 추천해 보세요!</div>
        </div>
        <button>추천받기</button>
      </div>
    `;

    shadow.appendChild(template.content.cloneNode(true));

    this.menuDisplay = shadow.querySelector('.menu-display');
    this.recommendButton = shadow.querySelector('button');

    this.menus = [
      '김치찌개',
      '된장찌개',
      '비빔밥',
      '돈까스',
      '초밥',
      '파스타',
      '라면',
      '햄버거',
      '샌드위치',
      '제육볶음',
      '순두부찌개',
      '냉면',
      '카레',
      '우동',
      '짜장면',
    ];

    this.recommendButton.addEventListener('click', () => this.recommendMenu());
  }

  recommendMenu() {
    const randomIndex = Math.floor(Math.random() * this.menus.length);
    this.menuDisplay.textContent = this.menus[randomIndex];
  }
}

customElements.define('lunch-recommender', LunchRecommender);