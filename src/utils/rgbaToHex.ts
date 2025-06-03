/**
 * 将 RGBA/RGB 颜色字符串转换为 16 进制格式（丢弃 Alpha 通道）
 * 如果输入已经是 16 进制颜色，则直接返回
 * 
 * @param color - 颜色字符串，可以是以下格式：
 *   - RGBA: "rgba(255, 99, 71, 0.5)"
 *   - RGB: "rgb(255, 99, 71)"
 *   - 16 进制: "#FF6347" 或 "#ff6347" 或 "FF6347"
 * @returns 6 位大写的 16 进制颜色代码（带 # 前缀）
 * @throws 如果颜色格式无效或颜色分量超出范围
 */
export function rgbaToHex(color: string): string {
    // 如果是 16 进制格式，直接返回（统一为大写带 # 的形式）
    const hexMatch = color.match(/^#?([0-9A-Fa-f]{3,8})$/);
    if (hexMatch) {
      const hex = hexMatch[1];
      // 如果是 3 位或 4 位短格式，扩展为 6 位或 8 位
      if (hex.length === 3 || hex.length === 4) {
        const expanded = hex.split('').map(c => c + c).join('');
        return `#${expanded.substring(0, 6)}`.toUpperCase();
      }
      // 如果是 6 位或 8 位，取前 6 位（丢弃 Alpha）
      return `#${hex.substring(0, 6)}`.toUpperCase();
    }
  
    // 尝试匹配 RGB/RGBA 格式
    const rgbaMatch = color.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)$/i);
    if (rgbaMatch) {
      // 提取 R, G, B 分量（忽略 A 分量）
      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);
  
      // 确保值在 0-255 范围内
      if ([r, g, b].some(c => c < 0 || c > 255)) {
        throw new Error(`Invalid color component value in ${color}. Values must be between 0 and 255.`);
      }
  
      // 将每个分量转换为两位 16 进制
      const toHex = (c: number) => c.toString(16).padStart(2, '0');
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }
  
    throw new Error(`Invalid color format: ${color}. Expected RGBA, RGB or HEX format.`);
}