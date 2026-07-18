// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

/**
 * @title EVMVerifier
 * @dev On-chain ZK proof verifier for private transactions
 */
contract EVMVerifier {
    struct PublicSignals {
        bytes32 commitment;
        bytes32 nullifier;
        bytes32 merkleRoot;
    }

    mapping(bytes32 => bool) public nullifierUsed;
    mapping(bytes32 => bool) public verifiedCommitments;

    event ProofVerified(
        bytes32 indexed commitment,
        bytes32 indexed nullifier,
        bool valid
    );

    event NullifierSpent(bytes32 indexed nullifier);

    /**
     * @dev Verify a ZK proof on-chain
     */
    function verifyProof(
        bytes calldata proof,
        bytes calldata publicSignals
    ) external returns (bool) {
        // Decode public signals
        PublicSignals memory signals = decodePublicSignals(publicSignals);

        // Check nullifier not used (double spend prevention)
        require(!nullifierUsed[signals.nullifier], "Nullifier already used");

        // Verify the proof (simplified)
        bool isValid = verifyZKProof(proof, publicSignals);
        require(isValid, "Invalid proof");

        // Mark nullifier as used
        nullifierUsed[signals.nullifier] = true;
        verifiedCommitments[signals.commitment] = true;

        emit ProofVerified(signals.commitment, signals.nullifier, true);
        emit NullifierSpent(signals.nullifier);

        return true;
    }

    /**
     * @dev Batch verify multiple proofs
     */
    function verifyBatch(
        bytes[] calldata proofs,
        bytes[] calldata publicSignalsList
    ) external returns (bool[] memory results) {
        require(proofs.length == publicSignalsList.length, "Length mismatch");

        results = new bool[](proofs.length);

        for (uint256 i = 0; i < proofs.length; i++) {
            results[i] = this.verifyProof(proofs[i], publicSignalsList[i]);
        }

        return results;
    }

    /**
     * @dev Check if a nullifier has been used
     */
    function isNullifierUsed(bytes32 nullifier) external view returns (bool) {
        return nullifierUsed[nullifier];
    }

    /**
     * @dev Check if a commitment has been verified
     */
    function isCommitmentVerified(bytes32 commitment) external view returns (bool) {
        return verifiedCommitments[commitment];
    }

    /**
     * @dev Decode public signals
     */
    function decodePublicSignals(bytes calldata signals)
        internal
        pure
        returns (PublicSignals memory)
    {
        require(signals.length == 96, "Invalid signals length");

        bytes32 commitment;
        bytes32 nullifier;
        bytes32 merkleRoot;

        assembly {
            commitment := calldataload(signals.offset)
            nullifier := calldataload(add(signals.offset, 32))
            merkleRoot := calldataload(add(signals.offset, 64))
        }

        return PublicSignals({
            commitment: commitment,
            nullifier: nullifier,
            merkleRoot: merkleRoot
        });
    }

    /**
     * @dev Simulate ZK proof verification
     */
    function verifyZKProof(bytes calldata proof, bytes calldata publicSignals)
        internal
        pure
        returns (bool)
    {
        // In production, this would use actual ZK verification
        // This is a simulation
        return proof.length > 0 && publicSignals.length > 0;
    }
}
