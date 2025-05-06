/**
 * 防抖函数
 * @param func 要执行的函数
 * @param wait 等待时间(毫秒)
 * @param immediate 是否立即执行
 * @returns 返回防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate: boolean = false
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
      const context = this;
      
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
  
      const callNow = immediate && !timeout;
      
      if (timeout) {
        clearTimeout(timeout);
      }
      
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
  }