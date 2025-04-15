/**
 * 非阻塞延迟函数
 * @param {number} ms 延迟时间（毫秒）
 * @returns {Promise<void>} 延迟结束后 resolve 的 Promise
 */
export function sleep(ms: number = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
* 模拟 setInterval
* @param {Function} callback 要重复执行的函数
* @param {number} interval 间隔时间（毫秒）
* @returns {{ clear: () => void }} 返回一个可清除 interval 的对象
*/
export function setIntervalWithSleep(callback: () => void, interval: number | undefined): { clear: () => void; } {
    let timerId:any; // 用于存储计时器ID

    function execute() {
        callback(); // 执行回调函数
        timerId = setTimeout(execute, interval); // 设置下一次调用
    }

    timerId = setTimeout(execute, interval); // 初始化定时器

    // 返回一个对象用于控制定时器
    return {
        clear: () => clearTimeout(timerId),
    };
}