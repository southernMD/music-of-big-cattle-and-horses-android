export function convertHttpToHttps(url: string): string {
    // 使用正则表达式将 http:// 替换为 https://
    return url?.replace(/^http:\/\//i, 'https://') ?? "";
}