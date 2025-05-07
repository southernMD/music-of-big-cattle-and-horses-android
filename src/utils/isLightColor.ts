/**
 * 判断十六进制颜色是浅色还是深色
 * @param hexColor - 例如 "#ffffff" 或 "#000000"
 * @returns true 表示浅色，false 表示深色
 */
export function isLightColor(hexColor: string): boolean {
    // 去除 "#"，并处理简写形式
    let hex = hexColor.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
  
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
  
    // 使用 W3C 推荐的相对亮度算法
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 128; // 这个阈值你可以调整，比如 128 更严格
  }
  