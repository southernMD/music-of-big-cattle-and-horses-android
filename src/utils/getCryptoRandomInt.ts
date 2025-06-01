/**
 * 使用 crypto.getRandomValues() 生成真随机数
 * 在指定范围内生成一个随机整数（闭区间）
 * 
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 范围内的随机整数
 */
export function getCryptoRandomInt(min: number, max: number): number {
    if (min > max) [min, max] = [max, min];
    min = Math.floor(min);
    max = Math.ceil(max);

    // 计算范围大小
    const range = max - min + 1;

    // 创建一个 Uint32Array 来存储随机值
    const randomBuffer = new Uint32Array(1);

    // 使用 crypto API 填充随机值
    crypto.getRandomValues(randomBuffer);

    // 将随机值映射到指定范围
    const randomNumber = min + (randomBuffer[0] % range);

    return randomNumber;
}
