<script>
    import { createEventDispatcher } from 'svelte';

    export let gameState;
    export let controlsText = '';
    export let onStartGame;
    export let moveLeft;
    export let moveRight;
    export let softDrop;
    export let hardDrop;
    export let rotateLeft;
    export let rotateRight;

    const dispatch = createEventDispatcher();

    const handleStart = () => {
        onStartGame?.();
        dispatch('start');
    };
</script>

<div class="hidden md:flex flex-col gap-3 w-40 text-left">
    <div class="text-gray-400 text-sm font-semibold tracking-wide">CONTROLS</div>
    <p class="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed">{controlsText}</p>
    <button
        on:click={handleStart}
        class="border border-cyan-500 text-cyan-400 py-2 px-3 rounded hover:bg-cyan-500/20 transition-colors"
    >
        {gameState === 'PLAYING' ? 'RESTART' : 'START'}
    </button>
    <div class="grid grid-cols-3 gap-2">
        <button
            on:click={moveLeft}
            class="bg-gray-800 text-cyan-400 font-bold rounded-xl border-2 border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.3)] flex items-center justify-center p-2 hover:bg-cyan-500/10 active:bg-cyan-500/30 transition-colors h-10 col-start-1 row-start-2"
        >
            ←
        </button>
        <button
            on:click={rotateLeft}
            class="bg-gray-800 text-cyan-400 font-bold rounded-xl border-2 border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.3)] flex items-center justify-center p-2 hover:bg-cyan-500/10 active:bg-cyan-500/30 transition-colors h-10 col-start-2 row-start-1"
        >
            ↻
        </button>
        <button
            on:click={rotateRight}
            class="bg-gray-800 text-cyan-400 font-bold rounded-xl border-2 border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.3)] flex items-center justify-center p-2 hover:bg-cyan-500/10 active:bg-cyan-500/30 transition-colors h-10 col-start-2 row-start-2"
        >
            ↺
        </button>
        <button
            on:click={moveRight}
            class="bg-gray-800 text-cyan-400 font-bold rounded-xl border-2 border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.3)] flex items-center justify-center p-2 hover:bg-cyan-500/10 active:bg-cyan-500/30 transition-colors h-10 col-start-3 row-start-2"
        >
            →
        </button>
        <button
            on:click={softDrop}
            class="bg-gray-800 text-cyan-400 font-bold rounded-xl border-2 border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.3)] flex items-center justify-center p-2 hover:bg-cyan-500/10 active:bg-cyan-500/30 transition-colors h-10 col-start-2 row-start-2"
        >
            ↓
        </button>
        <button
            on:click={hardDrop}
            class="bg-red-700/50 border-2 border-red-500 text-red-300 font-bold rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.4)] flex items-center justify-center p-2 hover:bg-red-600/60 active:bg-red-700/80 transition-colors h-10 col-span-3 row-start-3"
        >
            HARD DROP
        </button>
    </div>
</div>
