
```solidity
// packages/compute-market/src/contracts/ComputeRWA.sol
// Author: J. Tian (uw2icg-core)
// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ComputeRWA
 * @dev Compute Power RWA Asset Contract
 */
contract ComputeRWA is AccessControl, Pausable {
    bytes32 public constant PROVIDER_ROLE = keccak256("PROVIDER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct ComputeAsset {
        string id;
        string spec;
        address provider;
        uint256 totalUnits;
        uint256 availableUnits;
        uint256 pricePerUnit;
        uint256 utilizationRate;
        string proofOfCompute;
        bool active;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Lease {
        string id;
        string assetId;
        address renter;
        uint256 units;
        uint256 totalPrice;
        uint256 startTime;
        uint256 endTime;
        string containerId;
        uint8 status;
    }

    mapping(string => ComputeAsset) public assets;
    mapping(string => Lease) public leases;
    mapping(address => uint256) public providerDeposits;

    IERC20 public jmsToken;

    event AssetRegistered(string indexed assetId, address indexed provider);
    event LeaseCreated(string indexed leaseId, address indexed renter, string assetId);
    event LeaseCompleted(string indexed leaseId);
    event PaymentLocked(address indexed user, uint256 amount);

    constructor(address _jmsToken) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        jmsToken = IERC20(_jmsToken);
    }

    function registerAsset(
        string memory id,
        string memory spec,
        uint256 totalUnits,
        uint256 pricePerUnit,
        string memory proofOfCompute
    ) external onlyRole(PROVIDER_ROLE) whenNotPaused {
        require(!assets[id].active, "Asset already exists");
        assets[id] = ComputeAsset({
            id: id,
            spec: spec,
            provider: msg.sender,
            totalUnits: totalUnits,
            availableUnits: totalUnits,
            pricePerUnit: pricePerUnit,
            utilizationRate: 0,
            proofOfCompute: proofOfCompute,
            active: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        emit AssetRegistered(id, msg.sender);
    }

    function createLease(
        string memory assetId,
        uint256 hours,
        string memory leaseId
    ) external payable whenNotPaused returns (bool) {
        ComputeAsset storage asset = assets[assetId];
        require(asset.active, "Asset not active");
        require(asset.availableUnits >= hours, "Insufficient units");
        require(msg.value >= asset.pricePerUnit * hours, "Insufficient payment");

        leases[leaseId] = Lease({
            id: leaseId,
            assetId: assetId,
            renter: msg.sender,
            units: hours,
            totalPrice: msg.value,
            startTime: block.timestamp,
            endTime: block.timestamp + hours * 3600,
            containerId: "",
            status: 1
        });

        asset.availableUnits -= hours;
        asset.utilizationRate = (asset.totalUnits - asset.availableUnits) * 100 / asset.totalUnits;

        emit LeaseCreated(leaseId, msg.sender, assetId);
        return true;
    }

    function completeLease(string memory leaseId) external onlyRole(VERIFIER_ROLE) {
        Lease storage lease = leases[leaseId];
        require(lease.status == 1, "Lease not active");
        lease.status = 2;
        emit LeaseCompleted(leaseId);

        uint256 providerShare = lease.totalPrice * 90 / 100;
        address provider = assets[lease.assetId].provider;
        payable(provider).transfer(providerShare);
    }

    function lockPayment(address user, uint256 amount) external {
        require(jmsToken.transferFrom(user, address(this), amount), "Transfer failed");
        emit PaymentLocked(user, amount);
    }
}
```
