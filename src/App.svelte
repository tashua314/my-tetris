<script>
    import { onMount } from 'svelte';
    import Game from './components/Game.svelte';
    import GameUI from './components/GameUI.svelte'; // 新設するUIコンポーネント
    import ControlPad from './components/ControlPad.svelte';

    // configから定数をインポート
    import { SOUND_PATTERNS, TEXT } from './config.js';

    // --- State Management ---
    let gameState = 'MENU'; // 'MENU', 'PLAYING', 'GAMEOVER'
    let lang = 'JA';
    let score = 0;
    let level = 1;
    let gameStartTime = 0;
    let pausedAt = 0;
    let pauseAccumulated = 0;
    let time = '00:00';
    let isLevelUp = false;
    let dropInterval = 1000;

    // --- Audio State ---
    let audioContext;
    let gainNodeGlobal;
    let masterVolume = 0.5;
    let isMuted = false;
    let currentPattern = 'Cyber';
    let showDebugModal = false;
    let showSettingsModal = false;
    let showRankingModal = false;

    // --- Component References ---
    let gameControls; // Game.svelteから受け取る操作API
    let nextCanvasRef; // Next表示用キャンバス

    // --- Svelte Life Cycle ---
    onMount(() => {
        if (
            typeof window.AudioContext !== 'undefined' ||
            typeof window.webkitAudioContext !== 'undefined'
        ) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNodeGlobal = audioContext.createGain();
            gainNodeGlobal.connect(audioContext.destination);
            updateVolume(true);
        }
    });

    // --- Audio Functions (App.svelteに集約) ---

    export function updateVolume(silent = false) {
        if (gainNodeGlobal) {
            const finalVolume = isMuted ? 0 : masterVolume;
            gainNodeGlobal.gain.setValueAtTime(finalVolume, audioContext.currentTime);
        }
        if (!silent) playSound(440, 0.05, 'triangle', 0.5);
    }

    export function playSound(frequency, duration, type = 'square', amplitude = 0.5) {
        if (!audioContext || !gainNodeGlobal) return;
        if (audioContext.state === 'suspended') audioContext.resume();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(amplitude, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);
        oscillator.connect(gainNode);
        gainNode.connect(gainNodeGlobal);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    export function playArpeggio(sequence, speed = 0.05, type = 'triangle', amp = 0.7) {
        if (!audioContext) return;
        for (let i = 0; i < sequence.length; i++) {
            const freq = sequence[i];
            setTimeout(
                () => {
                    playSound(freq, speed * 1.5, type, amp);
                },
                i * speed * 1000
            );
        }
    }

    // --- Game Handlers ---

    function handleStartGame() {
        if (audioContext && audioContext.state === 'suspended') audioContext.resume();
        score = 0;
        level = 1;
        gameStartTime = Date.now();
        pausedAt = 0;
        pauseAccumulated = 0;
        gameState = 'PLAYING';
        gameControls?.startGame?.(gameStartTime); // Gameコンポーネントのスタート関数を呼び出す
    }

    function handleGameOver() {
        gameState = 'GAMEOVER';
        // Note: GameOver音はGame.svelte側で鳴らすように修正済み
    }

    function handleScoreUpdate(event) {
        score = event.detail; // Game.svelteから計算後のスコアを受け取る
    }

    function handleHardDropScore(event) {
        score += event.detail; // Hard Dropの追加スコアを加算
    }

    function checkLevel(event) {
        dropInterval = event.detail; // Gameからインターバルを受け取る（GameUIで表示する場合）
        const now = Date.now();
        const effectiveStart = gameStartTime + pauseAccumulated;
        const elapsed = Math.floor((now - effectiveStart) / 1000);

        // Time update
        const m = Math.floor(elapsed / 60)
            .toString()
            .padStart(2, '0');
        const s = (elapsed % 60).toString().padStart(2, '0');
        time = `${m}:${s}`;

        // Level update
        const newLevel = Math.floor(elapsed / 30) + 1;
        if (newLevel > level) {
            level = newLevel;
            isLevelUp = false;
            setTimeout(() => (isLevelUp = true), 50);
        }
    }

    // --- Key Input (App.svelteでグローバルに処理) ---
    function handleKeydown(event) {
        // モーダル表示中は操作をブロック（GameUI.svelte側で管理する）
        if (gameState !== 'PLAYING') {
            if (gameState === 'MENU' && event.code === 'Space') {
                handleStartGame();
            }
            return;
        }

        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
            event.preventDefault();
        }

        if (!gameControls) return; // Gameコンポーネントがまだマウントされていない場合

        if (event.code === 'ArrowLeft') gameControls.playerMove?.(-1);
        else if (event.code === 'ArrowRight') gameControls.playerMove?.(1);
        else if (event.code === 'ArrowDown') gameControls.playerDrop?.();
        else if (event.code === 'KeyQ' || event.code === 'ArrowUp') gameControls.playerRotate?.(1);
        else if (event.code === 'Space') gameControls.playerHardDrop?.();
    }

    // --- Control Pad helpers ---
    function canControl() {
        return gameState === 'PLAYING' && gameControls;
    }
    const moveLeft = () => {
        if (canControl()) gameControls.playerMove?.(-1);
    };
    const moveRight = () => {
        if (canControl()) gameControls.playerMove?.(1);
    };
    const softDrop = () => {
        if (canControl()) gameControls.playerDrop?.();
    };
    const hardDrop = () => {
        if (canControl()) gameControls.playerHardDrop?.();
    };
    const rotate = (dir = 1) => {
        if (canControl()) gameControls.playerRotate?.(dir);
    };

    // --- Visibility pause handling ---
    function handleVisibilityChange() {
        if (document.hidden) {
            pausedAt = Date.now();
        } else if (pausedAt) {
            pauseAccumulated += Date.now() - pausedAt;
            pausedAt = 0;
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} on:visibilitychange={handleVisibilityChange} />

<svelte:head>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body,
        html {
            background-color: #000 !important;
            color: white;
            overflow: hidden;
        }
        .text-shadow-neon {
            text-shadow:
                0 0 10px #0ff,
                0 0 20px #0ff;
        }
        .text-shadow-pink {
            text-shadow:
                0 0 20px #ff0d72,
                0 0 40px white;
        }
        .text-shadow-sm {
            text-shadow: 0 0 5px #fff;
        }

        @keyframes popAndFade {
            0% {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 0;
            }
            20% {
                transform: translate(-50%, -50%) scale(1.5);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(1.5);
                opacity: 0;
            }
        }
        .animate-pop {
            animation: popAndFade 1.5s forwards;
        }

        /* UIコンポーネントで使用するスタイルはそちらに移動することを推奨しますが、今回はグローバルスタイルをここに維持します */
        @keyframes flicker {
            0%,
            100% {
                opacity: 1;
            }
            50% {
                opacity: 0.8;
            }
        }
        .animate-flicker {
            animation: flicker 2s infinite;
        }
        @keyframes tetrisGlow {
            0% {
                transform: scale(1);
                text-shadow:
                    0 0 10px #f0f,
                    0 0 20px #f0f;
            }
            50% {
                transform: scale(1.1);
                text-shadow:
                    0 0 30px #0ff,
                    0 0 50px #0ff;
            }
            100% {
                transform: scale(1);
                text-shadow:
                    0 0 10px #f0f,
                    0 0 20px #f0f;
            }
        }
        .animate-tetris-glow {
            animation: tetrisGlow 0.5s ease-in-out infinite alternate;
        }
    </style>
</svelte:head>

<div
    class="bg-black text-white font-mono min-h-screen w-screen flex flex-col items-center overflow-auto select-none p-4 gap-6"
>
    <div class="flex-1 flex items-center justify-center">
        <div class="flex gap-6">
            <ControlPad
                {gameState}
                {lang}
                controlsText={TEXT[lang].controls}
                onStartGame={handleStartGame}
                {moveLeft}
                {moveRight}
                {softDrop}
                {hardDrop}
                rotateLeft={() => rotate(-1)}
                rotateRight={() => rotate(1)}
            />

            <Game
                bind:gameState
                bind:score
                bind:level
                bind:currentPattern
                let:tetrisEffectActive
                let:pieceQueue
                bind:nextCanvas={nextCanvasRef}
                bind:controls={gameControls}
                {playSound}
                {playArpeggio}
                on:gameOver={handleGameOver}
                on:scoreUpdate={handleScoreUpdate}
                on:hardDropScore={handleHardDropScore}
                on:checkLevel={checkLevel}
            >
                <GameUI
                    bind:gameState
                    bind:score
                    bind:level
                    bind:time
                    bind:lang
                    bind:masterVolume
                    bind:isMuted
                    bind:currentPattern
                    bind:isLevelUp
                    bind:showDebugModal
                    bind:showSettingsModal
                    bind:showRankingModal
                    {updateVolume}
                    {playSound}
                    {playArpeggio}
                    bind:nextCanvasRef
                    on:startGame={handleStartGame}
                    on:triggerShake={() => gameControls?.triggerShake?.()}
                    on:touchMove={gameControls ? (e) => gameControls.playerMove?.(e.detail) : null}
                    on:touchRotate={gameControls ? (e) => gameControls.playerRotate?.(e.detail) : null}
                    on:touchSoftDrop={gameControls ? () => gameControls.playerDrop?.() : null}
                    on:touchHardDrop={gameControls ? () => gameControls.playerHardDrop?.() : null}
                    {tetrisEffectActive}
                    {pieceQueue}
                />
            </Game>

            <GameUI
                bind:gameState
                bind:score
                bind:level
                bind:time
                bind:lang
                bind:masterVolume
                bind:isMuted
                bind:currentPattern
                bind:isLevelUp
                bind:showDebugModal
                bind:showSettingsModal
                bind:showRankingModal
                bind:nextCanvasRef
                {updateVolume}
                {playSound}
                {playArpeggio}
                on:startGame={handleStartGame}
                on:triggerShake={() => gameControls?.triggerShake?.()}
                panelOnly={true}
            />
        </div>
    </div>

    <footer class="w-full max-w-5xl text-xs text-gray-500 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-t border-white/10 pt-4">
        <div class="text-gray-300">Need help or want to report a bug?</div>
        <div class="flex flex-wrap gap-3">
            <a
                class="text-cyan-300 hover:text-white underline underline-offset-4"
                href="https://github.com/tashua314/my-tetris/issues"
                target="_blank"
                rel="noreferrer"
            >
                GitHub Issues
            </a>
            <span class="text-gray-600">/</span>
            <a
                class="text-cyan-300 hover:text-white underline underline-offset-4"
                href="https://github.com/tashua314"
                target="_blank"
                rel="noreferrer"
            >
                @tashua314
            </a>
            <span class="text-gray-600">/</span>
            <a
                class="text-cyan-300 hover:text-white underline underline-offset-4"
                href="https://x.com/tashua314"
                target="_blank"
                rel="noreferrer"
            >
                X (Twitter)
            </a>
        </div>
    </footer>
</div>
