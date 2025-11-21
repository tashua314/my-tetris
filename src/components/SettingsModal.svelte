<script>
    import { TEXT, SOUND_PATTERNS } from '../config.js';

    // --- Props ---
    export let show; // モーダルの表示/非表示をバインド
    export let lang;
    export let masterVolume;
    export let isMuted;
    export let currentPattern;
    export let updateVolume; // App.svelteからの関数
    export let testSound; // App.svelteからの関数

    function toggleMute() {
        isMuted = !isMuted;
        updateVolume(true);
    }

    function handlePatternChange(patternName) {
        currentPattern = patternName;
        testSound(); // 変更時にサンプル音を再生
    }
</script>

{#if show}
    <div
        class="absolute inset-0 bg-black/95 flex flex-col p-6 z-50 border-2 border-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.2)] pointer-events-auto"
    >
        <h2 class="text-cyan-400 text-xl font-bold mb-4 border-b border-gray-700 pb-2">
            {TEXT[lang].settingsTitle}
        </h2>
        <div class="space-y-6 text-sm text-gray-300 overflow-auto">
            <div>
                <h3 class="text-white font-bold mb-2 flex justify-between items-center">
                    {TEXT[lang].volume}
                    <button
                        on:click={toggleMute}
                        class="text-xs px-2 py-1 border border-gray-700 hover:border-red-500 transition-colors"
                    >
                        {isMuted ? '🔇' : '🔊'}
                        {isMuted ? TEXT[lang].mute : (masterVolume * 100).toFixed(0) + '%'}
                    </button>
                </h3>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    bind:value={masterVolume}
                    on:input={() => updateVolume(false)}
                    class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500"
                />
            </div>

            <div>
                <h3 class="text-white font-bold mb-2">{TEXT[lang].soundPattern}</h3>
                <div class="flex flex-col gap-2">
                    {#each Object.keys(SOUND_PATTERNS) as patternName}
                        <button
                            on:click={() => handlePatternChange(patternName)}
                            class="w-full py-2 border-2 transition-all text-center text-sm font-semibold {currentPattern ===
                            patternName
                                ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]'
                                : 'bg-gray-800 text-cyan-400 border-gray-700 hover:border-cyan-400'}"
                        >
                            {TEXT[lang][`sound${patternName}`]}
                        </button>
                    {/each}
                </div>
            </div>
        </div>
        <button
            on:click={() => (show = false)}
            class="mt-auto w-full bg-gray-800 hover:bg-gray-700 text-white py-3 border-t border-gray-600"
            >{TEXT[lang].close}</button
        >
    </div>
{/if}
