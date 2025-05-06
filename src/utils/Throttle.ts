interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}

/**
 * 节流函数
 * @param func 要执行的函数
 * @param wait 等待时间(毫秒)
 * @param options 选项 {leading: 是否立即执行, trailing: 是否在结束后执行}
 * @returns 返回节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options: ThrottleOptions = { leading: true, trailing: true }
): {
    (this: ThisParameterType<T>, ...args: Parameters<T>): void;
    cancel: () => void;
} {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let previous = 0;
    let context: ThisParameterType<T> | null;
    let args: Parameters<T> | null;

    const later = () => {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        if (args) func.apply(context, args);
        if (!timeout) context = args = null;
    };

    const throttled = function (this: ThisParameterType<T>, ...params: Parameters<T>) {
        const now = Date.now();

        if (!previous && options.leading === false) {
            previous = now;
        }

        const remaining = wait - (now - previous);
        context = this;
        args = params;

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    };

    throttled.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
        }
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
}