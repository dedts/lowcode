import JsEncrypt from 'jsencrypt'
const jse = new JsEncrypt()
export function encrypt(txt) {
  if (typeof txt === 'undefined' || txt == null || txt === '') {
    return txt
  } else {
    jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDQTSTUFQkRI8fKdbHruYN2GhNWVbixTue8oxA1
7rKZjXwAwRiQgngI3UFNWVm8EYbsU42rWAmEQxZoipWB9RJ/SycXLUYdYAi3q3Sbzhbh32mYXlWS
mhmBRaNR83rlXVTIVkxN+12dQv39kmr45BB9r0TZwEe2l9qT4NE/6VSdqQIDAQAB
-----END PUBLIC KEY-----`)
    return jse.encrypt(txt)
  }
}
export function decrypt(txt) {
  if (typeof txt === 'undefined' || txt == null || txt === '') {
    return txt
  } else {
    jse.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDSfjUuKuZB6WdqaLMrT49bTD9v0KtYPJceIbfrOWkBZBHxMAgt
xHbNd/Z/tRCpsrF+cUAR1HlwykjWZkZvIS/OlDZhY6kYLxrVZsEL4OvrLG9WjTZZ
/oYBoDndRaHZyasw13MWs/jJxfHdBZ+ak8TXNjtqA1gbm9jgl9/XvxwR+wIDAQAB
AoGAMEEej+blwlZvjsVRzav/gT6JjGiZ3zCEtDOmphYTLG50boZEWbmgQpotuDka
CM0eQ45S0cOT03eMGxp3KyLAgoCoecxoTRSrjmlTysGORSJmhq4grEVgihtMugyH
96tPHRtCmJ4Z97l4T9SjqxntERKgraoURHdMxyas3uuxZIECQQDpjcapUJfFrUC9
2LRG1AR75KjlFItmpBjHycwOTK3NIJtXD+9JRpuc52ibrKcaP2hnBVnB7MEwPwb7
gvyOpGyvAkEA5rkOgz0TrxMDz0+ZfMSihUR1JJlQiPEvhxPTt29F1J8pFygzIMTk
fdQK9TQdOmeHWfNDmXIxme1NJbMvSUV6dQJBAMzeoLVFDN1J7NCblwfKU2SaX80T
CHUw3MvkKCsi+BJH1/u27p/IYBhypUBpYuuTU3GLMAD8PTqlDurxK7m0YeECQQCq
GnnmrFsc0soWSDuDT336/zPWnepQbHF8B1Qqg7FaR1YGKq83U7KaSoEhsyBxdO7H
lKCcOyLyt5APYYJVZRIZAkBNsvkQdCs7WjYXQUZa59xN3Xn7ZlU9ZRSpk5vnvBRo
Gqv0SA86+gLfK+7e5V0bLucYe5nNtLkEsVjXAxFj58rn
-----END RSA PRIVATE KEY-----`)
    return jse.decrypt(txt)
  }
}
