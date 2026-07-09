import { PRNClient, PRNAuditRecord } from '../src/core/prn';

describe('PRNClient', () => {
  let client: PRNClient;
  const mockEndpoints = ['https://prn-node1.example.com', 'https://prn-node2.example.com'];

  beforeEach(() => {
    client = new PRNClient(mockEndpoints);
    jest.spyOn(client as any, 'submitToPRN').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should compute audit hash consistently', () => {
    const tx = {
      txId: '0x123',
      domain: 'bob.coca.utxo',
      from: '0xfrom',
      to: '0xto',
      amount: '100',
      timestamp: 1234567890
    };
    const hash1 = (client as any).computeAuditHash(tx);
    const hash2 = (client as any).computeAuditHash(tx);
    
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^0x[0-9a-f]{64}$/);
  });

  test('should submit transaction to PRN and return pending status', async () => {
    const tx = {
      txId: '0x456',
      domain: 'alice.coca.utxo',
      from: '0xalice',
      to: '0xbob',
      amount: '50',
      timestamp: Date.now()
    };

    const result = await client.auditTransaction(tx);
    
    expect(result.status).toBe('pending');
    expect(result.auditHash).toBeDefined();
    expect(result.txId).toBe('0x456');
  });

  test('should retrieve audit status by txId', async () => {
    const status = await client.getAuditStatus('0x789');
    
    expect(status.txId).toBe('0x789');
    expect(['pending', 'approved', 'rejected']).toContain(status.status);
  });
});
