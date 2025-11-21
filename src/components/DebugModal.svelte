<script>
    import { createEventDispatcher } from 'svelte';
    import { TEXT } from '../config.js';

    export let show;
    export let lang;
    export let currentPattern;
    export let testSound;
    export let testVolumeSound;

    const dispatch = createEventDispatcher();

    const close = () => (show = false);
    const triggerShake = () => dispatch('triggerShake');
    const openRanking = () => {
        dispatch('openRanking');
        show = false;
    };
</script>

{#if show}
    <div
        class="absolute inset-0 bg-black/95 flex flex-col p-6 z-50 border-2 border-yellow-500 shadow-[0_0_20px_rgba(255,255,0,0.2)] pointer-events-auto"
    >
        <h2 class="text-yellow-400 text-xl font-bold mb-4 border-b border-gray-700 pb-2">
            {TEXT[lang].debugTitle}
        </h2>
        <div class="space-y-4 text-sm text-gray-300 overflow-auto">
            <div>
                <h3 class="text-cyan-400 font-bold mb-1">{TEXT[lang].featureShakeTitle}</h3>
                <p class="text-xs text-gray-500 mb-2">{TEXT[lang].featureShakeDesc}</p>
                <button
                    on:click={triggerShake}
                    class="w-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-black py-2 font-bold transition-colors"
                    >{TEXT[lang].featureShakeBtn}</button
                >
            </div>
            <div>
                <h3 class="text-cyan-400 font-bold mb-1">{TEXT[lang].featureNextTitle}</h3>
                <p class="text-xs text-gray-500">{TEXT[lang].featureNextDesc}</p>
            </div>
            <div>
                <h3 class="text-cyan-400 font-bold mb-1">
                    {TEXT[lang].featureRandomTitle}
                </h3>
                <p class="text-xs text-gray-500">{TEXT[lang].featureRandomDesc}</p>
            </div>
            <div>
                <h3 class="text-cyan-400 font-bold mb-1">{TEXT[lang].featureWallKickTitle}</h3>
                <p class="text-xs text-gray-500">{TEXT[lang].featureWallKickDesc}</p>
            </div>
            <div class="pt-2 border-t border-gray-800">
                <h3 class="text-cyan-400 font-bold mb-1">{TEXT[lang].levelBonusTitle}</h3>
                <p class="text-xs text-gray-500">{TEXT[lang].levelBonusDesc}</p>
            </div>
            <div>
                <h3 class="text-cyan-400 font-bold mb-1">{TEXT[lang].tetrisBonusTitle}</h3>
                <p class="text-xs text-gray-500">{TEXT[lang].tetrisBonusDesc}</p>
            </div>
            <div class="pt-2 border-t border-gray-800">
                <h3 class="text-pink-400 font-bold mb-1">
                    {TEXT[lang].featureSoundTitle} ({currentPattern})
                </h3>
                <p class="text-xs text-gray-500 mb-2">{TEXT[lang].featureSoundDesc}</p>
                <button
                    on:click={testSound}
                    class="w-full border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black py-2 font-bold transition-colors"
                    >{TEXT[lang].featureSoundBtn}</button
                >
            </div>
            <div class="pt-2 border-t border-gray-800">
                <h3 class="text-cyan-400 font-bold mb-1">{TEXT[lang].volumeTest}</h3>
                <p class="text-xs text-gray-500 mb-2">{TEXT[lang].volumeTestDesc}</p>
                <button
                    on:click={testVolumeSound}
                    class="w-full border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black py-2 font-bold transition-colors"
                    >🔊 {TEXT[lang].volume}をテスト</button
                >
            </div>
            <div class="pt-2 border-t border-gray-800">
                <h3 class="text-pink-400 font-bold mb-1">{TEXT[lang].rankingTest}</h3>
                <p class="text-xs text-gray-500 mb-2">{TEXT[lang].rankingTestDesc}</p>
                <button
                    on:click={openRanking}
                    class="w-full border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black py-2 font-bold transition-colors"
                    >🏆 {TEXT[lang].rankingTitle}を見る</button
                >
            </div>
        </div>
        <button
            on:click={close}
            class="mt-auto w-full bg-gray-800 hover:bg-gray-700 text-white py-3 border-t border-gray-600"
            >{TEXT[lang].close}</button
        >
    </div>
{/if}
