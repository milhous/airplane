const script = `
    /*
     * 边界检测
     * @param {object} position 位置
     * @param {object} originSize 当前尺寸
     * @param {object} maxSize 最大尺寸
     * @param {object} result
     */
    const boundaryDetection = (position, originSize, maxSize) => {
        let { x, y } = position;
        const { width, height } = originSize;

        if (x - width / 2 < 0) {
            x = width / 2;
        }

        if (x + width / 2 > maxSize.width) {
            x = maxSize.width - width / 2;
        }

        if (y - height / 2 < 0) {
            y = height / 2;
        }

        if (y + height / 2 > maxSize.height) {
            y = maxSize.height - height / 2;
        }

        return {
            x,
            y
        };
    };

    /*
     * 缓动（每帧移动一段距离）
     * @param {object} start 起点
     * @param {object} end 终点
     * @param {number} speed 速度
     * @return {object} result 
     */
    const tween = (start, end, speed) => {
        const startX = start.x;
        const startY = start.y;
        const endX = end.x;
        const endY = end.y;

        let x = 0;
        let y = 0;

        // 缓动效果
        const offsetX = endX - startX > 0 ? speed : -speed;
        const offsetY = endY - startY > 0 ? speed : -speed;

        x += startX + offsetX;
        y += startY + offsetY;

        if ((offsetX > 0 && x > endX) || (offsetX < 0 && x < endX)) {
            x = endX;
        }

        if ((offsetY > 0 && y > endY) || (offsetY < 0 && y < endY)) {
            y = endY;
        }

        return {
            x,
            y
        }
    };

    onmessage = function(message) {
        const data = message.data;

        let result = null;

        switch (data.cmd) {
            case 'tween':
                const { start, end, speed } = data.preload;

                result = tween(start, end, speed);
                
                result.eid = data.preload.eid;
                result.ename = data.preload.ename;

                postMessage({
                    cmd: 'tween',
                    data: result
                });

                break;
            case 'boundaryDetection':
                const { position, originSize, maxSize } = data.preload;
                
                result = boundaryDetection(position, originSize, maxSize);

                result.eid = data.preload.eid;
                result.ename = data.preload.ename;

                postMessage({
                    cmd: 'boundaryDetection',
                    data: result
                });

                break;
        }
    };
`;

const blob = new Blob([script], { type: "application/octet-binary" });
const blobURL = URL.createObjectURL(blob);

export default blobURL;