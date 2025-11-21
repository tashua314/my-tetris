<script>
    import { TEXT } from '../config.js';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let lang;
    export let score;
    export let level;
    export let time;
    export let nextCanvas; // Game.svelteからバインドされたNext Canvas
    export let pieceQueue; // Game.svelteからバインドされたNext Piece Queue
    pieceQueue; // Suppress Svelte warning about unused export property
    export let tetrisEffectActive; // Tetris演出中か
</script>

<div class="w-44 flex flex-col text-left h-[640px] relative hidden md:flex">
    <button
        on:click={() => dispatch('toggleLang')}
        class="absolute top-0 right-0 text-xs border border-gray-700 px-2 py-1 hover:border-white transition-colors"
    >
        {lang === 'EN' ? 'JP' : 'EN'} / {lang}
    </button>
    <button
        on:click={() => dispatch('openSettings')}
        class="absolute top-0 left-0 text-lg text-gray-500 hover:text-cyan-400 transition-colors"
    >
        ⚙️
    </button>
    <button
        on:click={() => dispatch('openRanking')}
        class="absolute top-0 left-8 text-lg text-gray-500 hover:text-pink-400 transition-colors"
    >
        🏆
    </button>

    <h1 class="text-3xl mt-8 mb-6 text-white text-shadow-neon leading-none animate-flicker">
        {TEXT[lang].title1}<br />{TEXT[lang].title2}
    </h1>

    <div class="mb-6">
        <div class="text-gray-500 text-xs mb-1 tracking-widest">{TEXT[lang].next}</div>
        <div
            class="border border-gray-800 bg-neutral-950 h-[300px] w-[100px] relative flex justify-center items-center"
        >
            <canvas bind:this={nextCanvas} width="100" height="300" class="block"></canvas>
        </div>
    </div>

    <div class="mb-4">
        <div class="text-gray-500 text-xs mb-1 tracking-widest">{TEXT[lang].score}</div>
        <div
            class="text-2xl text-white text-shadow-sm font-bold {tetrisEffectActive
                ? 'text-yellow-400 animate-tetris-glow'
                : ''} transition-colors"
        >
            {score}
        </div>
    </div>

    <div class="mb-4">
        <div class="text-gray-500 text-xs mb-1 tracking-widest">{TEXT[lang].level}</div>
        <div class="text-2xl text-white text-shadow-sm font-bold">{level}</div>
    </div>

    <div class="mb-4">
        <div class="text-gray-500 text-xs mb-1 tracking-widest">{TEXT[lang].time}</div>
        <div class="text-2xl text-white text-shadow-sm font-bold">{time}</div>
    </div>

    <button
        on:click={() => dispatch('openDebug')}
        class="mb-4 text-xs text-yellow-600 hover:text-yellow-400 border border-gray-800 hover:border-yellow-600 p-1 text-center transition-colors"
    >
        {TEXT[lang].debugBtn}
    </button>
</div>

<style>
    /* アニメーションスタイルはApp.svelteに依存 */
</style>
