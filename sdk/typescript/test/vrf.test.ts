import { VRFGenerator } from '../src/core/vrf';

describe('VRFGenerator', () => {
  let generator: VRFGenerator;
  const testPrivateKey = new Uint8Array(32).fill(1);
  const testPublicKey = new Uint8Array(32).fill(2);
  const testMessage = new TextEncoder().encode('test-utxo-txid');

  beforeEach(() => {
    generator = new VRFGenerator();
  });

  test('should generate a proof and output hash from a message', () => {
    const { proof, output } = generator.generateProof(testPrivateKey, testMessage);

    expect(proof).toBeInstanceOf(Uint8Array);
    expect(proof.length).toBe(64);
    expect(output).toBeInstanceOf(Uint8Array);
    expect(output.length).toBe(32);
  });

  test('should verify a valid proof successfully', () => {
    const { proof, output } = generator.generateProof(testPrivateKey, testMessage);
    const isValid = generator.verifyProof(testPublicKey, proof, testMessage);

    expect(isValid).toBe(true);
  });

  test('should reject an invalid proof', () => {
    const { proof } = generator.generateProof(testPrivateKey, testMessage);
    const tamperedMessage = new TextEncoder().encode('tampered-message');
    const isValid = generator.verifyProof(testPublicKey, proof, tamperedMessage);

    expect(isValid).toBe(false);
  });

  test('should generate a deterministic 64-bit IPv6 IID from output', () => {
    const { output } = generator.generateProof(testPrivateKey, testMessage);
    const iid = generator.generateIPv6IID(output);

    expect(iid).toMatch(/^[0-9a-f]{16}$/);
    expect(iid.length).toBe(16);
  });
});
