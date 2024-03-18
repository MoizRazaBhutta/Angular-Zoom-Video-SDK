import { KJUR } from 'jsrsasign';

export function generateSignature(
  sdkKey: string,
  sdkSecret: string,
  sessionName: string,
  role: number,
  sessionKey: string,
  userIdentity: string
): string {
  const iat = Math.round((new Date().getTime() - 30000) / 1000);
  const exp = iat + 60 * 60 * 2;
  const oHeader = { alg: 'HS256', typ: 'JWT' };

  const oPayload = {
    app_key: sdkKey,
    tpc: sessionName,
    role_type: role,
    session_key: sessionKey,
    user_identity: userIdentity,
    version: 1,
    iat: iat,
    exp: exp,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret);
  return sdkJWT;
}
