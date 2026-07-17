# Implementation of UTXO Model on EVM

> **Abstract**: Integrating Bitcoin's UTXO model with Ethereum's EVM is an important innovative direction in blockchain infrastructure. This article systematically reviews four mainstream implementation paths: underlying chain architecture integration (Qtum), EVM protocol layer simulation (Zeto), Layer 2 scaling (Zulu), and cross-chain interoperability solutions. By comparing their design philosophies, technical approaches, and applicable scenarios, this article provides developers with a reference for making technology choices among performance, privacy, and ecosystem compatibility.

---

## 1. Introduction

The UTXO (Unspent Transaction Output) model is the ledger model adopted by early blockchains like Bitcoin. Its core feature is that each transaction output exists independently and must be spent entirely, naturally supporting parallel processing and privacy protection. Ethereum's EVM (Ethereum Virtual Machine), on the other hand, is based on the account model, which offers powerful smart contract programmability and a rich ecosystem of applications.

Each model has its own strengths. Can the advantages of the UTXO model be introduced into the EVM environment? This question has attracted exploration from many technical teams. There is currently no unified "standard implementation," but several mature technical paths have emerged. This article will interpret these solutions one by one, from the perspective of architectural depth.

---

## 2. Technical Path 1: Underlying Chain Architecture Integration – Qtum

**Representative Project**: Qtum (Quantum Chain)  
**Core Idea**: Integrate UTXO and EVM at the underlying blockchain level, rather than simulating on top of EVM.

### 2.1 Design Principles

Based on Bitcoin's core code, Qtum adds an **Account Abstraction Layer (AAL)**. As middleware, AAL "translates" the underlying UTXO transaction data into the account-model state that EVM can recognise. The specific process is as follows:

- When a user initiates a transaction, UTXOs are still used as inputs and outputs.
- The AAL layer maps these UTXOs to a set of temporary account states inside the EVM, allowing smart contracts to read and modify these states.
- After contract execution, the AAL converts the state changes back into UTXO creation and spending operations.

### 2.2 Advantages and Limitations

| Advantages | Limitations |
|------------|-------------|
| Underlying assets inherit the security of Bitcoin's UTXO model | Complex architecture; implementation and debugging of AAL are difficult |
| Full compatibility with Solidity and existing Ethereum toolchains | Cross-layer state synchronisation incurs some performance overhead |
| Clear separation of assets and contract logic with dual-model coexistence | Requires hard fork changes to the chain itself; cannot be directly used on existing Ethereum |

### 2.3 Code Snippet (Simplified AAL Core Logic)

```python
# Pseudo-code: AAL translates UTXO to account state
class AccountAbstractionLayer:
    def apply_tx(self, tx):
        # 1. Verify UTXO inputs
        inputs = [self.get_utxo(outpoint) for outpoint in tx.vin]
        total_in = sum(utxo.value for utxo in inputs)
        
        # 2. Build EVM transaction context
        context = {
            'sender': inputs[0].script_pubkey.to_address(),
            'value': total_in - tx.fee,
            'data': tx.data
        }
        
        # 3. Execute EVM contract
        result = self.evm.run(context)
        
        # 4. Sync output UTXOs with contract state
        for output in result.outputs:
            self.create_utxo(output.address, output.value)
```

---

## 3. Technical Path 2: EVM Protocol Layer Simulation – Zeto

**Representative Project**: Hyperledger Labs Zeto  
**Core Idea**: Simulate UTXO behaviour on existing EVM through smart contracts and cryptographic protocols (e.g., zero-knowledge proofs), without changing the underlying chain.

### 3.1 Design Principles

Zeto provides a UTXO token toolkit based on **Zero-Knowledge Proofs (ZKP)**. The core mechanism is that each UTXO is represented as a hash commitment, stored in a Merkle tree or mapping within the smart contract.

- **Create UTXO**: The user generates a random number, computes a commitment with the amount, owner public key, etc., and records the commitment on-chain.
- **Spend UTXO**: The user must provide a zero-knowledge proof that they know the secret behind a certain commitment (e.g., private key signature and random number) and that the commitment has not been spent. After verifying the proof, the contract marks the old commitment as spent and creates a new commitment as change.

### 3.2 Code Example (Solidity Core Structure)

```solidity
// Simplified UTXO contract
contract UTXOToken {
    struct UTXO {
        address owner;        // Owner address
        uint256 value;        // Amount
        bytes32 commitment;   // Commitment = hash(owner, value, nonce)
        bool spent;
    }
    
    mapping(bytes32 => UTXO) public utxos;
    
    // Create UTXO
    function create(uint256 value, bytes32 nonce) external {
        bytes32 commitment = keccak256(abi.encodePacked(msg.sender, value, nonce));
        require(utxos[commitment].commitment == bytes32(0), "Already exists");
        utxos[commitment] = UTXO(msg.sender, value, commitment, false);
    }
    
    // Spend UTXO (ZK proof required, simplified here)
    function spend(bytes32 inputCommitment, bytes32 outputCommitment, bytes calldata proof) external {
        require(!utxos[inputCommitment].spent, "Already spent");
        // Verify proof: prover owns the input commitment and the output is valid
        require(verifyProof(proof, inputCommitment, outputCommitment), "Invalid proof");
        utxos[inputCommitment].spent = true;
        // Create new output UTXO (usually belongs to receiver)
        // ...
    }
}
```

### 3.3 Advantages and Limitations

| Advantages | Limitations |
|------------|-------------|
| No underlying chain changes; can be deployed on any EVM-compatible network (e.g., Ethereum) | ZK proof generation and verification are costly in terms of gas |
| Inherits UTXO privacy (outsiders cannot directly see balances and transaction links) | Complex contract logic; steep learning curve for developers |
| Supports parallel processing; high theoretical throughput | User experience incompatible with existing wallets; requires additional client-side tools |

---

## 4. Technical Path 3: Layer 2 Scaling – Zulu Network

**Representative Project**: Zulu Network  
**Core Idea**: Place the UTXO model on Layer 2 (or Layer 3), separated from the EVM layer, to complement each other's functions.

### 4.1 Design Principles

Zulu Network builds a two-tier (or three-tier) architecture:

- **Layer 2 (ZuluPrime)**: An EVM-compatible execution layer for running smart contracts and general DApps.
- **Layer 3 (ZuluNexus)**: A dedicated UTXO innovation layer for high-frequency, concurrent asset transfers, and supporting UTXO-based smart contracts (similar to an extended Bitcoin Script).

Assets can be transferred between layers via cross-chain bridges or two-way pegs. Users can deposit L2 ERC‑20 tokens into the UTXO layer for fast transfers and later withdraw them back to L2.

### 4.2 Advantages and Limitations

| Advantages | Limitations |
|------------|-------------|
| Clear layered design; layers do not interfere with each other | Cross-layer interactions incur latency and trust assumptions |
| UTXO layer can be independently optimised for extreme performance | Multi‑layer architecture increases system complexity and operational costs |
| Preserves the integrity of the EVM ecosystem | Asset transfers between layers may face fragmentation of liquidity |

---

## 5. Technical Path 4: Cross‑Chain Interoperability Solutions

**Representative Projects**: Chainlogs, Findora, etc.  
**Core Idea**: Rather than fusing models, enable UTXO chains and EVM chains to understand and operate each other's assets and states through message passing or state proofs.

### 5.1 Implementation Methods

- **Chainlogs**: Parses transaction events on UTXO chains into EVM‑readable logs, allowing EVM contracts to "listen" to and respond to specific activities on UTXO chains.
- **Findora**: Installs an **Interoperability Layer** on-chain to handle special transactions between the UTXO and EVM ledgers, e.g., mapping assets from UTXO chains to tokens on EVM, and vice versa.

### 5.2 Advantages and Limitations

| Advantages | Limitations |
|------------|-------------|
| No need to modify any chain's underlying protocol; reuses existing infrastructure | Cross‑chain communication relies on trust in third‑party relayers or light clients |
| Can connect any UTXO chain (e.g., Bitcoin, Litecoin) with any EVM chain | Finality and confirmation times introduce delays |
| Highly flexible; can be configured on demand | Security is heavily dependent on bridge design |

---

## 6. Advantages and Challenges of the UTXO Model

### 6.1 Core Advantages

- **High Concurrency and Parallel Processing**: Since UTXOs have no shared state, transactions can be validated and packaged in parallel, significantly improving throughput.
- **Privacy‑Friendly**: UTXOs naturally support coin mixing and zero‑knowledge proofs, effectively hiding transaction graphs and balances.
- **Deterministic Execution**: Each UTXO is spent only once; state transitions are clear, facilitating parallel execution and rollback.
- **Simple Verifiability**: Verification of UTXOs only requires checking signatures and double‑spending, without global state.

### 6.2 Challenges

- **Programming Model Differences**: UTXO does not support complex global state, making it difficult to implement applications that require shared liquidity, such as DeFi.
- **Account Loss Risk**: UTXOs must be spent entirely, and the change mechanism increases user operational complexity.
- **Compatibility with Existing EVM Ecosystem**: Most existing DApps, wallets, and tools are built on the account model and require adaptation.

---

## 7. Summary and Outlook

“Implementation of UTXO Model on EVM” is not a single technology but a collection of innovative solutions designed to address specific issues (performance, privacy, compliance).

| Path | Applicable Scenarios | Recommendation |
|------|----------------------|----------------|
| Underlying Integration (Qtum) | Building a new chain from scratch that balances security and programmability | ★★★★ |
| Protocol Simulation (Zeto) | Adding private payment functionality on existing Ethereum | ★★★ |
| L2 Scaling (Zulu) | DApps requiring high‑frequency transactions, e.g., payments, gaming | ★★★★ |
| Cross‑Chain Interoperability | Interactions with existing UTXO chains (e.g., Bitcoin) | ★★★ |

In the future, with advances in zero‑knowledge proof technology and the maturity of Layer 2 infrastructure, the advantages of the UTXO model will be further unleashed in more scenarios. For developers, understanding the inherent differences among these paths will help in making more precise trade‑offs in architectural design.

---

## 8. References and Acknowledgements

**Author**: J.tian  
**Technical Guidance and Review**: UTXODNS Open Source Community  

The design and implementation of this project have been inspired by and reference the following excellent projects and standards:

- [Ethereum Foundation UTXO Demo](https://github.com/ethereum/utxo) — Proof‑of‑concept of UTXO on EVM
- [EIP‑3668 (CCIP‑Read)](https://eips.ethereum.org/EIPS/eip‑3668) — Off‑chain data retrieval standard
- [Intel SGX DCAP](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html) — Trusted Execution Environment remote attestation
- [GLEIF vLEI](https://www.gleif.org/en/lei-solutions/verifiable-lei-vlei) — Verifiable Legal Entity Identity standard
- [Aegis Solana TEE Agent](https://github.com/AegisSolana) — TEE implementation in transaction agents
- [Qtum Documentation](https://qtum.org/docs) — Account Abstraction Layer design
- [Hyperledger Labs Zeto](https://github.com/hyperledger-labs/zeto) — ZKP‑based UTXO token toolkit
- [Zulu Network Whitepaper](https://zulu.network) — Layered UTXO + EVM architecture

---

> 📌 **Version**: v1.0 | Release Date: 2026‑07‑17 | License: MIT  
> 📧 Feedback & Discussions: Please submit issues or pull requests on [UTXODNS GitHub](https://github.com/your-org/utxodns).

---

**This document is the final release version and can serve as a technical reference and basis for open‑source community discussions.**
