// src/logic.js

// --- Piece Matrix Definitions ---
export function getPieceMatrix(type) {
    switch (type) {
        case 'T':
            return [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ];
        case 'I':
            return [
                [0, 2, 0, 0],
                [0, 2, 0, 0],
                [0, 2, 0, 0],
                [0, 2, 0, 0],
            ];
        case 'S':
            return [
                [0, 3, 3],
                [3, 3, 0],
                [0, 0, 0],
            ];
        case 'Z':
            return [
                [4, 4, 0],
                [0, 4, 4],
                [0, 0, 0],
            ];
        case 'L':
            return [
                [0, 5, 0],
                [0, 5, 0],
                [0, 5, 5],
            ];
        case 'O':
            return [
                [6, 6],
                [6, 6],
            ];
        case 'J':
            return [
                [0, 7, 0],
                [0, 7, 0],
                [7, 7, 0],
            ];
        default:
            return null;
    }
}

// --- Matrix Utilities ---
export function createMatrix(w, h) {
    const matrix = [];
    while (h--) matrix.push(new Array(w).fill(0));
    return matrix;
}

// --- Piece Generation ---
export function fillPieceQueue(queue) {
    const pieces = 'TJLOSZI';
    while (queue.length < 7) {
        const bag = pieces.split('').sort(() => Math.random() - 0.5);
        for (let type of bag) {
            queue.push(getPieceMatrix(type));
        }
    }
    return queue;
}

// --- Collision Detection ---
export function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) return true;
        }
    }
    return false;
}

// --- Rotation Logic ---
export function rotate(matrix, dir) {
    // 転置
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    // 行の反転
    if (dir > 0) matrix.forEach((row) => row.reverse());
    // 列の反転
    else matrix.reverse();
}

// --- Merge (Lock) ---
export function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
        });
    });
}

// --- Line Clear Logic (Side effects handled by caller) ---
export function arenaSweep(arena, score, level) {
    let rowCount = 0;
    const newArena = JSON.parse(JSON.stringify(arena)); // Deep copy
    const linesCleared = []; // 削除された行のY座標を記録

    outer: for (let y = newArena.length - 1; y >= 0; --y) {
        for (let x = 0; x < newArena[y].length; ++x) {
            if (newArena[y][x] === 0) continue outer;
        }

        // 行を削除し、新しい行を先頭に追加 (spliceは破壊的な操作)
        newArena.splice(y, 1);
        newArena.unshift(new Array(newArena[0].length).fill(0));

        linesCleared.push(y);
        rowCount++;
        y++; // 削除後、インデックスを戻して同じ行を再チェック
    }

    // スコア計算
    let points = 0;
    let isTetris = false;

    if (rowCount > 0) {
        if (rowCount === 4) {
            points = 800;
            isTetris = true;
        } else {
            const linePoints = [0, 100, 300, 500]; // 1, 2, 3ライン消し
            points = linePoints[rowCount];
        }
        points *= level;
    }

    return {
        newArena,
        newScore: score + points,
        rowCount,
        isTetris,
        linesCleared: linesCleared.sort((a, b) => a - b), // 爆発演出用にソート
    };
}
