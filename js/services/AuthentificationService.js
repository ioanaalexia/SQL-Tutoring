const jose = require('jose')

const dataToEncrypt = {
  userId: '123456789',
  username: 'john.doe@example.com'
  // alte câmpuri personalizate
};
async function encrypt(){
  const secret = jose.base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
  const jsonData=JSON.stringify(dataToEncrypt)
  const jwt = await new jose.EncryptJWT({ jsonData })
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h')
    .encrypt(secret)
  
  console.log(jwt)
}

encrypt();