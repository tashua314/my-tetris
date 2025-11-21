export const STORAGE_KEY = 'neon_tetris_final_v8';

// --- ブロックの色と光沢 ---
export const COLORS = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];
export const GLOW_COLORS = [
    null,
    'rgba(255,13,114,0.8)',
    'rgba(13,194,255,0.8)',
    'rgba(13,255,114,0.8)',
    'rgba(245,56,255,0.8)',
    'rgba(255,142,13,0.8)',
    'rgba(255,225,56,0.8)',
    'rgba(56,119,255,0.8)',
];

// --- レベル別背景色テーマ ---
export const LEVEL_COLORS = [
    { base: '#031c35', glow: '#00eaff' }, // Level 1 (Cyan/Initial)
    { base: '#2a0036', glow: '#ff4dff' }, // Level 5 (Magenta)
    { base: '#002a3d', glow: '#4dd0ff' }, // Level 10 (Azure)
    { base: '#203000', glow: '#ffe066' }, // Level 15 (Amber)
    { base: '#3a0a00', glow: '#ff6a00' }, // Level 20 (Orange/Pulse)
];

export const getArenaColor = (lvl) => {
    const index = (lvl - 1) % LEVEL_COLORS.length; // rotate palette every level
    return LEVEL_COLORS[index];
};

// --- サウンドパターン定義 ---
export const SOUND_PATTERNS = {
    Classic: {
        move: { freq: 300, dur: 0.03, type: 'square', amp: 0.3 },
        rotate: { freq: 660, dur: 0.08, type: 'triangle', amp: 0.4 },
        lock: { freq: 150, dur: 0.08, type: 'sine', amp: 0.5 },
        clear: { arpeggio: [440, 554, 659], speed: 0.06, type: 'square', amp: 0.7 },
        tetrisClear: { arpeggio: [900, 1100, 1400, 1800], speed: 0.04, type: 'square', amp: 1.0 },
        hardDrop: { freq: 1200, dur: 0.1, type: 'square', amp: 0.8 },
        gameOver: { freq: 50, dur: 0.5, type: 'sine', amp: 0.7 },
    },
    Cyber: {
        move: { freq: 400, dur: 0.02, type: 'sawtooth', amp: 0.4 },
        rotate: { freq: 880, dur: 0.05, type: 'sawtooth', amp: 0.5 },
        lock: { freq: 220, dur: 0.06, type: 'square', amp: 0.6 },
        clear: { arpeggio: [800, 1000, 1200], speed: 0.04, type: 'triangle', amp: 0.9 },
        tetrisClear: {
            arpeggio: [1000, 1250, 1600, 2000],
            speed: 0.03,
            type: 'sawtooth',
            amp: 1.2,
        },
        hardDrop: { freq: 1500, dur: 0.08, type: 'sawtooth', amp: 1.0 },
        gameOver: { freq: 100, dur: 0.7, type: 'square', amp: 0.8 },
    },
    Mellow: {
        move: { freq: 200, dur: 0.05, type: 'sine', amp: 0.2 },
        rotate: { freq: 500, dur: 0.1, type: 'sine', amp: 0.3 },
        lock: { freq: 100, dur: 0.15, type: 'sine', amp: 0.4 },
        clear: { arpeggio: [330, 440, 660], speed: 0.08, type: 'sine', amp: 0.5 },
        tetrisClear: { arpeggio: [523, 659, 783, 1046], speed: 0.06, type: 'triangle', amp: 0.7 },
        hardDrop: { freq: 800, dur: 0.15, type: 'triangle', amp: 0.6 },
        gameOver: { freq: 70, dur: 1.0, type: 'sine', amp: 0.6 },
    },
};

// --- 言語辞書 ---
export const TEXT = {
    EN: {
        title1: 'NEON',
        title2: 'TETRIS',
        score: 'SCORE',
        level: 'LEVEL',
        time: 'TIME',
        next: 'NEXT',
        startPrompt: 'PRESS SPACE',
        startBtn: 'START',
        gameOver: 'GAME OVER',
        yourScore: 'YOUR SCORE',
        enterName: 'ENTER NAME',
        save: 'SAVE RECORD',
        retry: 'RETRY',
        levelUp: 'LEVEL UP!',
        debugBtn: '🛠️ TEST FEATURES',
        debugTitle: '🛠️ FEATURE CHECK',
        featureShakeTitle: '1. SCREEN SHAKE',
        featureShakeDesc: 'Overview + quick check of the impact effect used on drops/line clears.',
        featureShakeBtn: '💥 TRIGGER SHAKE',
        featureNextTitle: '2. NEXT QUEUE (3 PCS)',
        featureNextDesc: 'Shows the next 3 pieces; uses 7-Bag Randomizer.',
        featureRandomTitle: '3. 7-BAG RANDOMIZER',
        featureRandomDesc: 'Pieces rotate through all 7 shapes to prevent drought.',
        featureWallKickTitle: '4. WALL KICK (SRS)',
        featureWallKickDesc: 'Rotations use SRS kicks near walls/floor.',
        featureSoundTitle: '5. SOUND TEST',
        featureSoundDesc: 'Quick sound check and pattern preview.',
        featureSoundBtn: '🔊 PLAY TEST TONE',
        volumeTest: 'Volume Tuning & Mute',
        volumeTestDesc: 'Adjust master volume or mute; use the test tone to verify.',
        rankingTest: 'Ranking Access',
        rankingTestDesc: 'Opens the Hall of Fame view.',
        levelBonusTitle: 'Level & Speed',
        levelBonusDesc: 'Level increases every ~30s; drop speed and background change.',
        tetrisBonusTitle: 'Tetris Bonus',
        tetrisBonusDesc: '4-line clears trigger extra visuals and scoring.',
        close: 'CLOSE',
        controls: '← → : Move\n↑ : Rotate\n↓ : Drop\nSPC : Hard Drop',
        controlsTouch: 'Controls: Tap the buttons below (Mobile)',
        settingsTitle: 'SETTINGS',
        volume: 'Volume',
        soundPattern: 'Sound Pattern',
        soundClassic: 'Classic',
        soundCyber: 'Cyber',
        soundMellow: 'Mellow',
        mute: 'Mute',
        rankingTitle: 'HALL OF FAME',
        rankName: 'NAME',
        rankScore: 'SCORE',
        tetrisEffect: 'TETRIS!',
    },
    JA: {
        title1: 'ネオン',
        title2: 'テトリス',
        score: 'スコア',
        level: 'レベル',
        time: 'タイム',
        next: '次',
        startPrompt: 'スペースキーで開始',
        startBtn: 'スタート',
        gameOver: 'ゲームオーバー',
        yourScore: '今回のスコア',
        enterName: '名前を入力',
        save: '記録を保存',
        retry: 'もう一度遊ぶ',
        levelUp: 'レベルアップ!',
        debugBtn: '🛠️ 機能テスト',
        debugTitle: '🛠️ 機能チェック',
        featureShakeTitle: '1. 画面振動 (シェイク)',
        featureShakeDesc: 'ハードドロップやライン消去で使う衝撃演出を確認＆テスト。',
        featureShakeBtn: '💥 振動させる',
        featureNextTitle: '2. NEXT表示 (3つ)',
        featureNextDesc: '次に落ちてくる3つを表示。7種1セット（7-Bag）で生成。',
        featureRandomTitle: '3. 7種1セット生成',
        featureRandomDesc: '全種類のブロックを巡回させ、出ない形が続かないよう制御。',
        featureWallKickTitle: '4. 壁蹴り (Wall Kick)',
        featureWallKickDesc: '壁際・床際でもSRSキックで回転を成立させます。',
        featureSoundTitle: '5. サウンドテスト',
        featureSoundDesc: '音声の確認やサウンドパターンのプレビュー。',
        featureSoundBtn: '🔊 テスト音を鳴らす',
        volumeTest: '音量調整＆ミュート',
        volumeTestDesc: 'マスターボリュームやミュートを調整し、テスト音で確認。',
        rankingTest: 'ランキング表示',
        rankingTestDesc: '殿堂入りスコア一覧を開きます。',
        levelBonusTitle: 'レベル＆スピード',
        levelBonusDesc: '約30秒ごとにレベルアップ、落下速度や背景が変化。',
        tetrisBonusTitle: 'テトリスボーナス',
        tetrisBonusDesc: '4列消しで特別な演出とスコア加算。',
        close: '閉じる',
        controls: '← → : 移動\n↑ : 回転\n↓ : 落下\nSPC : 一気に落下',
        controlsTouch: '操作方法: 下のボタンをタップ (モバイル向け)',
        settingsTitle: '設定',
        volume: '音量',
        soundPattern: 'サウンドパターン',
        soundClassic: 'クラシック',
        soundCyber: 'サイバー',
        soundMellow: 'メロウ',
        mute: '消音',
        rankingTitle: '殿堂入り',
        rankName: '名前',
        rankScore: 'スコア',
        tetrisEffect: 'テトリス！',
    },
};

// --- 壁蹴りオフセット (SRS) ---
export const KICK_OFFSETS = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [-1, -1],
];

// --- 初期状態 ---
export const INITIAL_PLAYER = {
    pos: { x: 0, y: 0 },
    matrix: null,
};
