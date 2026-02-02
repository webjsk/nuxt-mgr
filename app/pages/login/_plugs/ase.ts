// app/utils/crypto.ts
import CryptoJS from 'crypto-js'

/**
 * AES 加密 (ECB模式)
 * @param word 要加密的内容
 * @param keyWord 16位密钥
 */
export const aesEncrypt = (word: string, keyWord: string = 'XwKsGlMcdPMEhR1B') => {
  // 1. 解析密钥和待加密内容
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const srcs = CryptoJS.enc.Utf8.parse(word)

  // 2. 执行加密
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })

  // 3. 返回 Base64 字符串
  return encrypted.toString()
}