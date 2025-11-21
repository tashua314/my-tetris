<script>
    import { TEXT, STORAGE_KEY } from '../config.js';
    import { onMount } from 'svelte';

    // --- Props ---
    export let show; // モーダルの表示/非表示をバインド
    export let lang;

    // --- Local State ---
    let rankings = [];

    onMount(() => {
        loadRanking();
    });

    function loadRanking() {
        // App.svelteのロジックを再利用するか、ここで再度読み込む
        const data = localStorage.getItem(STORAGE_KEY);
        rankings = data
            ? JSON.parse(data)
            : [
                  { name: 'NEO', score: 5000 },
                  { name: 'TRON', score: 3500 },
              ];
    }

    // モーダルが開かれたときにランキングを再読み込み
    $: if (show) loadRanking();
</script>

{#if show}
    <div
        class="absolute inset-0 bg-black/95 flex flex-col p-6 z-50 border-2 border-pink-500 shadow-[0_0_20px_rgba(255,0,255,0.2)] pointer-events-auto"
    >
        <h2 class="text-pink-400 text-xl font-bold mb-4 border-b border-gray-700 pb-2">
            {TEXT[lang].rankingTitle}
        </h2>
        <div class="overflow-auto">
            <table class="w-full text-sm text-gray-300">
                <thead>
                    <tr class="text-gray-500 text-xs uppercase tracking-wider">
                        <th class="py-2 text-left">#</th>
                        <th class="py-2 text-left">{TEXT[lang].rankName}</th>
                        <th class="py-2 text-right">{TEXT[lang].rankScore}</th>
                    </tr>
                </thead>
                <tbody class="text-white">
                    {#each rankings as rank, i}
                        <tr class="border-b border-gray-800 last:border-0">
                            <td
                                class="py-2 font-bold {i === 0
                                    ? 'text-yellow-400'
                                    : i === 1
                                      ? 'text-gray-300'
                                      : i === 2
                                        ? 'text-orange-400'
                                        : 'text-gray-500'}">{i + 1}</td
                            >
                            <td class="py-2 uppercase">{rank.name}</td>
                            <td class="py-2 text-right">{rank.score}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <button
            on:click={() => (show = false)}
            class="mt-auto w-full bg-gray-800 hover:bg-gray-700 text-white py-3 border-t border-gray-600"
            >{TEXT[lang].close}</button
        >
    </div>
{/if}
