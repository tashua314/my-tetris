<script>
    import { onMount, onDestroy } from 'svelte';
    import {
        createMatrix,
        collide,
        merge,
        rotate,
        arenaSweep,
        fillPieceQueue,
        getPieceMatrix,
    } from '../logic.js';
    import {
        COLORS,
        GLOW_COLORS,
        SOUND_PATTERNS,
        KICK_OFFSETS,
        getArenaColor,
        INITIAL_PLAYER,
    } from '../config.js';

    // --- Props (親コンポーネントからの受け渡し) ---
    export let gameState; // 'MENU', 'PLAYING', 'GAMEOVER'
    export let score;
    export let level;
    export let currentPattern;
    export let playSound; // サウンド関数 (App.svelteから注入)
    export let playArpeggio; // アルペジオ関数 (App.svelteから注入)
    export let nextCanvas; // 親から渡されるNext表示用キャンバス
    export let controls; // 親へ渡す操作APIオブジェクト

    // --- Emit Events (親コンポーネントへの通知) ---
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // --- Local State ---
    const ARENA_WIDTH = 10;
    const ARENA_HEIGHT = 20;
    let canvas;
    let context, nextContext;
    let animationId;
    let tetrisEffectActive = false;
    let isShaking = false;
    let particles = [];

    // --- Game State ---
    let arena = createMatrix(ARENA_WIDTH, ARENA_HEIGHT);
    let player = { ...INITIAL_PLAYER }; // 初期位置と行列
    let pieceQueue = [];
    let dropCounter = 0;
    let dropInterval = 1000;
    let lastTime = 0;
    let arenaTheme = getArenaColor(1);

    $: arenaTheme = getArenaColor(level);

    // --- Svelte Life Cycle ---
    function initContexts() {
        if (canvas && !context) {
            context = canvas.getContext('2d');
            context.scale(32, 32);
        }
        if (nextCanvas && !nextContext) {
            nextContext = nextCanvas.getContext('2d');
            nextContext.scale(25, 25);
        }
    }

    onMount(() => {
        initContexts();
        pieceQueue = fillPieceQueue([]);
        draw();
    });

    $: if (nextCanvas && !nextContext) {
        initContexts();
        drawNext();
    }

    onDestroy(() => {
        cancelAnimationFrame(animationId);
    });

    // --- External Handlers ---

    export function startGame(startTime) {
        arena = createMatrix(ARENA_WIDTH, ARENA_HEIGHT);
        pieceQueue = [];
        fillPieceQueue(pieceQueue);
        playerReset();
        lastTime = 0;
        dropInterval = 1000;
        dispatch('gameStart', startTime);
        requestAnimationFrame(update);
    }

    export function triggerShake() {
        isShaking = false;
        setTimeout(() => (isShaking = true), 10);
        setTimeout(() => (isShaking = false), 300);
    }

    // --- Core Logic ---

    function playerReset() {
        if (pieceQueue.length === 0) fillPieceQueue(pieceQueue);
        player.matrix = pieceQueue.shift();
        fillPieceQueue(pieceQueue);

        player.pos.y = 0;
        player.pos.x = ((ARENA_WIDTH / 2) | 0) - ((player.matrix[0].length / 2) | 0);

        if (collide(arena, player)) {
            dispatch('gameOver');
            const pattern = SOUND_PATTERNS[currentPattern];
            playSound(
                pattern.gameOver.freq,
                pattern.gameOver.dur,
                pattern.gameOver.type,
                pattern.gameOver.amp
            );
        }
    }

    function playerDrop() {
        player.pos.y++;
        if (collide(arena, player)) {
            player.pos.y--;
            merge(arena, player);

            // ピース固定音
            const pattern = SOUND_PATTERNS[currentPattern];
            playSound(pattern.lock.freq, pattern.lock.dur, pattern.lock.type, pattern.lock.amp);

            // ライン消去処理
            handleSweep();

            // 次のピース
            playerReset();
        }
        dropCounter = 0;
    }

    function handleSweep() {
        const result = arenaSweep(arena, score, level);
        arena = result.newArena;

        if (result.rowCount > 0) {
            // スコア更新を親に通知
            dispatch('scoreUpdate', result.newScore);
            triggerShake();

            const pattern = SOUND_PATTERNS[currentPattern];

            if (result.isTetris) {
                tetrisEffectActive = true;
                setTimeout(() => (tetrisEffectActive = false), 1000);
                playArpeggio(
                    pattern.tetrisClear.arpeggio,
                    pattern.tetrisClear.speed,
                    pattern.tetrisClear.type,
                    pattern.tetrisClear.amp
                );
            } else {
                playArpeggio(
                    pattern.clear.arpeggio,
                    pattern.clear.speed,
                    pattern.clear.type,
                    pattern.clear.amp
                );
            }

            // 爆発演出
            result.linesCleared.forEach((y) => spawnExplosion(y));
        }
    }

    export function playerMove(offset) {
        const initialX = player.pos.x;
        player.pos.x += offset;
        if (collide(arena, player)) {
            player.pos.x = initialX;
        } else if (player.pos.x !== initialX) {
            const pattern = SOUND_PATTERNS[currentPattern];
            playSound(pattern.move.freq, pattern.move.dur, pattern.move.type, pattern.move.amp);
        }
    }

    export function playerRotate(dir) {
        const pos = player.pos.x;
        const pattern = SOUND_PATTERNS[currentPattern];
        rotate(player.matrix, dir);

        if (!collide(arena, player)) {
            playSound(
                pattern.rotate.freq,
                pattern.rotate.dur,
                pattern.rotate.type,
                pattern.rotate.amp
            );
            return;
        }

        // 壁蹴り (Wall Kick) 判定
        for (const [offsetX, offsetY] of KICK_OFFSETS) {
            player.pos.x = pos + offsetX;
            player.pos.y += offsetY;

            if (!collide(arena, player)) {
                playSound(
                    pattern.rotate.freq,
                    pattern.rotate.dur,
                    pattern.rotate.type,
                    pattern.rotate.amp
                );
                return;
            }

            player.pos.y -= offsetY;
        }

        // 失敗したら元に戻す
        rotate(player.matrix, -dir);
        player.pos.x = pos;
    }

    export function playerHardDrop() {
        let linesDropped = 0;
        while (!collide(arena, player)) {
            player.pos.y++;
            linesDropped++;
        }
        player.pos.y--;
        linesDropped--;

        // Hard Dropで稼いだポイントをスコアに追加
        if (linesDropped > 0) dispatch('hardDropScore', linesDropped * 2);

        merge(arena, player);
        handleSweep();
        playerReset();
        dropCounter = 0;
        triggerShake();

        const pattern = SOUND_PATTERNS[currentPattern];
        playSound(
            pattern.hardDrop.freq,
            pattern.hardDrop.dur,
            pattern.hardDrop.type,
            pattern.hardDrop.amp
        );
    }

    // --- Animation Loop ---

    function update(timeStamp = 0) {
        if (gameState !== 'PLAYING') {
            draw();
            if (particles.length > 0) requestAnimationFrame(update);
            return;
        }

        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        dropCounter += deltaTime;
        if (dropCounter > dropInterval) playerDrop();

        // レベルとインターバル更新を親に通知
        dispatch('checkLevel', dropInterval);

        draw();
        animationId = requestAnimationFrame(update);
    }

    // 親コンポーネントへ公開する操作API
    controls = {
        startGame,
        triggerShake,
        playerMove,
        playerRotate,
        playerDrop,
        playerHardDrop,
    };

    // --- Drawing Utilities ---

    function spawnExplosion(yVal) {
        for (let x = 0; x < ARENA_WIDTH; x++) {
            for (let i = 0; i < 5; i++) {
                const color = GLOW_COLORS[arena[yVal][x] || Math.floor(Math.random() * 7) + 1]; // 消えたブロックの色かランダム
                particles.push({
                    x: x + 0.5,
                    y: yVal + 0.5,
                    color: color,
                    vx: (Math.random() - 0.5) * 0.7,
                    vy: (Math.random() - 0.5) * 0.7 - 0.1,
                    life: 1.0,
                    decay: Math.random() * 0.03 + 0.02,
                });
            }
        }
    }

    function drawMatrix(matrix, offset, ctx, isGhost = false) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const drawColor = COLORS[value];
                    const glowColor = GLOW_COLORS[value];

                    if (!isGhost) {
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = glowColor;
                        ctx.fillStyle = drawColor;
                    } else {
                        ctx.shadowBlur = 0;
                        ctx.strokeStyle = drawColor;
                        ctx.lineWidth = 0.05;
                        ctx.globalAlpha = 0.2;
                    }
                    if (!isGhost) {
                        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
                        ctx.fillStyle = 'rgba(255,255,255,0.3)';
                        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
                    } else {
                        ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
                    }
                    ctx.globalAlpha = 1;
                    ctx.shadowBlur = 0;
                }
            });
        });
    }

    function drawGhost(player) {
        const ghost = { pos: { ...player.pos }, matrix: player.matrix };
        while (!collide(arena, ghost)) ghost.pos.y++;
        ghost.pos.y--;
        drawMatrix(ghost.matrix, ghost.pos, context, true);
    }

    function drawNext() {
        if (!nextContext) return;
        nextContext.fillStyle = '#050505';
        nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

        let yOffset = 1;
        for (let i = 0; i < 3; i++) {
            if (pieceQueue[i]) {
                const piece = pieceQueue[i];
                const xOffset = 2 - piece[0].length / 2;
                drawMatrix(piece, { x: xOffset, y: yOffset }, nextContext);
                yOffset += 3.5;
            }
        }
    }

    function draw() {
        if (!context) return;

        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, arenaTheme.base);
        gradient.addColorStop(1, `${arenaTheme.glow}99`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawMatrix(arena, { x: 0, y: 0 }, context);

        if (gameState === 'PLAYING') {
            drawGhost(player);
            drawMatrix(player.matrix, player.pos, context);
        }

        particles.forEach((p, i) => {
            p.life -= p.decay;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02;
            context.globalAlpha = p.life;
            context.fillStyle = p.color;
            context.fillRect(p.x, p.y, 0.3, 0.3);
            context.globalAlpha = 1.0;
            if (p.life <= 0) particles.splice(i, 1);
        });

        drawNext();
    }
</script>

<div
    class="relative border-2 border-gray-800 p-2 rounded shadow-[0_0_50px_rgba(0,255,255,0.1)] w-[320px] h-[640px] {isShaking
        ? 'shake-effect'
        : ''}"
    style="
        background: radial-gradient(circle at 50% 30%, {arenaTheme.glow}22, {arenaTheme.base});
        box-shadow: 0 0 50px {arenaTheme.glow}50;
    "
>
    <canvas
        bind:this={canvas}
        width="320"
        height="640"
        class="block w-full h-full shadow-[inset_0_0_20px_#000]"
    ></canvas>

    <slot {tetrisEffectActive} {pieceQueue}></slot>
</div>

<style>
    /* 振動アニメーションのみここに残す */
    @keyframes shake {
        10%,
        90% {
            transform: translate3d(-2px, 0, 0);
        }
        20%,
        80% {
            transform: translate3d(4px, 0, 0);
        }
        30%,
        50%,
        70% {
            transform: translate3d(-6px, 0, 0);
        }
        40%,
        60% {
            transform: translate3d(6px, 0, 0);
        }
    }
    .shake-effect {
        animation: shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
</style>
