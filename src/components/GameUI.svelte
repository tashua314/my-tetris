<script>
    import DebugModal from './DebugModal.svelte';
    import RankingModal from './RankingModal.svelte';
    import SettingsModal from './SettingsModal.svelte';
    import SidePanel from './SidePanel.svelte';
    import { TEXT, SOUND_PATTERNS } from '../config.js';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    // --- Props (App.svelteからバインドされる状態) ---
    export let gameState;
    export let score;
    export let level;
    export let time;
    export let lang;
    export let masterVolume;
    export let isMuted;
    export let currentPattern;
    export let isLevelUp;

    // --- Slot Props (Game.svelteから渡される情報) ---
    export let tetrisEffectActive;
    export let pieceQueue;
    export let nextCanvasRef;

    // --- 外部関数 (App.svelteから注入) ---
    export let updateVolume;
    export let playSound;
    export let playArpeggio;

    // --- Props for Panel/Mobile Mode ---
    export let panelOnly = false; // trueの場合、Game Boardのオーバーレイは描画しない (SidePanel用)

    // --- Local State for Modals/Inputs ---
    export let showDebugModal = false;
    export let showSettingsModal = false;
    export let showRankingModal = false;
    let playerName = ''; // Game Over時に入力される名前

    // --- Game Logic Handlers ---
    function handleStartGame() {
        dispatch('startGame');
    }

    // --- Save Logic (App.svelteのstore/handlersへ移譲しても良いが、今回はUIに保持) ---
    function loadRanking() {
        // App.svelteから渡されていないため、このコンポーネント内ではランキング操作ロジックは省略
        // 実際のプロジェクトではApp.svelteからranking stateとsaveRanking関数を渡します
    }

    function saveScoreAndGoToMenu() {
        // 仮の保存ロジック (App.svelteに移動することを推奨)
        const name = playerName.trim().toUpperCase() || 'UNKNOWN';
        dispatch('saveScore', { name, score });
        gameState = 'MENU';
    }

    // --- Debug/Settings Handlers ---
    function testSound() {
        const pattern = SOUND_PATTERNS[currentPattern].clear;
        playArpeggio(pattern.arpeggio, pattern.speed, pattern.type, pattern.amp);
    }

    function testVolumeSound() {
        playSound(440, 0.1, 'triangle', 0.8);
    }

    // --- Touch Control Handlers (Game.svelteの公開関数を呼び出す) ---
    function touchMove(dir) {
        if (gameState !== 'PLAYING') return;
        dispatch('touchMove', dir);
    }

    function touchRotate(dir) {
        if (gameState !== 'PLAYING') return;
        dispatch('touchRotate', dir);
    }

    function touchSoftDrop() {
        if (gameState !== 'PLAYING') return;
        dispatch('touchSoftDrop');
    }

    function touchHardDrop() {
        if (gameState !== 'PLAYING') return;
        dispatch('touchHardDrop');
    }
</script>

{#if panelOnly}
    <SidePanel
        bind:lang
        bind:score
        bind:level
        {time}
        bind:nextCanvas={nextCanvasRef}
        {pieceQueue}
        {tetrisEffectActive}
        on:toggleLang={() => (lang = lang === 'EN' ? 'JA' : 'EN')}
        on:openSettings={() => (showSettingsModal = true)}
        on:openRanking={() => (showRankingModal = true)}
        on:openDebug={() => (showDebugModal = true)}
    />
{:else}
    {#if gameState === 'MENU'}
        <div
            class="absolute inset-0 bg-black/90 flex flex-col justify-center items-center z-20 backdrop-blur-sm"
        >
            <div
                class="text-5xl text-cyan-400 text-shadow-neon mb-6 text-center animate-flicker leading-tight"
            >
                {TEXT[lang].title1}<br />{TEXT[lang].title2}
            </div>
            <p class="text-gray-300 text-sm mb-8 tracking-widest">{TEXT[lang].startPrompt}</p>
            <button
                on:click={handleStartGame}
                class="border-2 border-cyan-400 text-cyan-400 px-6 py-2 text-lg hover:bg-cyan-400 hover:text-black shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all"
            >
                {TEXT[lang].startBtn}
            </button>
        </div>
    {/if}

    {#if gameState === 'GAMEOVER'}
        <div
            class="absolute inset-0 bg-black/90 flex flex-col justify-center items-center z-30 backdrop-blur-sm"
        >
            <div class="text-4xl text-pink-500 text-shadow-pink mb-2 font-bold whitespace-nowrap">
                {TEXT[lang].gameOver}
            </div>
            <div class="text-xs text-gray-400 mb-1 tracking-widest">{TEXT[lang].yourScore}</div>
            <div class="text-4xl text-white mb-6 font-bold">{score}</div>
            <div class="flex flex-col items-center w-full px-8 mb-6">
                <input
                    type="text"
                    bind:value={playerName}
                    placeholder={TEXT[lang].enterName}
                    maxlength="8"
                    class="bg-transparent border-b-2 border-white text-white text-center text-xl w-full mb-4 outline-none focus:border-cyan-400 uppercase"
                />
                <button
                    on:click={saveScoreAndGoToMenu}
                    class="border border-cyan-400 text-cyan-400 text-sm px-4 py-1 hover:bg-cyan-400 hover:text-black transition-colors"
                >
                    {TEXT[lang].save}
                </button>
            </div>
            <button
                on:click={() => (showRankingModal = true)}
                class="text-xs text-gray-500 hover:text-cyan-400 mb-4"
                >{TEXT[lang].rankingTitle}</button
            >
            <button on:click={handleStartGame} class="mt-2 text-xs text-gray-500 hover:text-white"
                >{TEXT[lang].retry}</button
            >
        </div>
    {/if}

    {#if isLevelUp}
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-pink-500 text-shadow-pink pointer-events-none z-10 animate-pop whitespace-nowrap"
        >
            {TEXT[lang].levelUp}
        </div>
    {/if}

    {#if tetrisEffectActive}
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-pink-500 pointer-events-none z-10 whitespace-nowrap animate-tetris-glow"
        >
            {TEXT[lang].tetrisEffect}
        </div>
    {/if}

    <div class="absolute inset-0 z-50 pointer-events-none">
        <DebugModal
            bind:show={showDebugModal}
            {lang}
            {currentPattern}
            {testSound}
            {testVolumeSound}
            on:triggerShake={() => dispatch('triggerShake')}
            on:openRanking={() => (showRankingModal = true)}
        />

        <SettingsModal
            bind:show={showSettingsModal}
            bind:lang
            bind:masterVolume
            bind:isMuted
            bind:currentPattern
            {updateVolume}
            {testSound}
            {playSound}
        />

        <RankingModal bind:show={showRankingModal} bind:lang />
    </div>

    <div
        class="md:hidden fixed top-2 left-2 z-40 w-[260px] max-w-full p-3 bg-black/70 backdrop-blur border border-gray-800 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.15)] space-y-2"
    >
        <p class="text-left text-gray-400 text-xs whitespace-pre-wrap">
            {TEXT[lang].controlsTouch}
        </p>
        <div class="grid grid-cols-4 gap-2">
            <div class="col-span-1 flex flex-col gap-2">
                <button on:click={() => touchMove(-1)} class="touch-btn h-10">←</button>
                <button on:click={() => touchRotate(-1)} class="touch-btn h-10">↻</button>
            </div>

            <div class="col-span-2 flex flex-col gap-2">
                <button on:click={touchSoftDrop} class="touch-btn h-10">↓</button>
                <button on:click={touchHardDrop} class="touch-btn hard h-10">HD</button>
            </div>

            <div class="col-span-1 flex flex-col gap-2">
                <button on:click={() => touchMove(1)} class="touch-btn h-10">→</button>
                <button on:click={() => touchRotate(1)} class="touch-btn h-10">↺</button>
            </div>
        </div>
        <div class="flex justify-between items-center gap-2 text-center">
            <button
                on:click={() => (lang = lang === 'EN' ? 'JA' : 'EN')}
                class="text-xs border border-gray-700 px-2 py-1 hover:border-white transition-colors"
            >
                {lang === 'EN' ? 'JP' : 'EN'} / {lang}
            </button>
            <button
                on:click={() => (showDebugModal = true)}
                class="text-xs text-yellow-600 hover:text-yellow-400 border border-gray-800 hover:border-yellow-600 px-2 py-1 transition-colors"
            >
                {TEXT[lang].debugBtn}
            </button>
            <button
                on:click={() => (showSettingsModal = true)}
                class="text-lg text-gray-500 hover:text-cyan-400 transition-colors"
            >
                ⚙️
            </button>
            <button
                on:click={() => (showRankingModal = true)}
                class="text-lg text-gray-500 hover:text-pink-400 transition-colors"
            >
                🏆
            </button>
        </div>
    </div>
{/if}

<style>
    /* モバイルボタンのスタイルはここに維持 */
    .touch-btn {
        @apply bg-gray-800 text-cyan-400 font-bold rounded-xl border-2 border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.3)] flex items-center justify-center p-3 active:bg-cyan-500 active:text-black transition-colors duration-100;
        touch-action: manipulation;
        user-select: none;
    }
    .touch-btn.hard {
        @apply bg-red-700/50 border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.5)] text-red-400 active:bg-red-500 active:text-white;
    }
</style>
