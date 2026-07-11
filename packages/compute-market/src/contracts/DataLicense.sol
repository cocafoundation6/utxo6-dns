
```solidity
// packages/compute-market/src/contracts/DataLicense.sol
// Author: J. Tian (uw2icg-core)
// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title DataLicense
 * @dev Data License Contract
 */
contract DataLicense is AccessControl {
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    struct DataUTXO {
        string id;
        address owner;
        string hash;
        uint256 qualityScore;
        uint256 pricePerToken;
        bool available;
        uint256 createdAt;
    }

    struct License {
        string id;
        string dataId;
        address licensor;
        address licensee;
        string purpose;
        uint256 price;
        uint256 duration;
        uint8 status;          // 0: pending, 1: active, 2: expired, 3: revoked
        string accessKey;
        uint256 createdAt;
        uint256 activatedAt;
    }

    mapping(string => DataUTXO) public dataUTXOs;
    mapping(string => License) public licenses;

    event DataRegistered(string indexed dataId, address indexed owner);
    event LicenseCreated(string indexed licenseId, address indexed licensor);
    event LicenseActivated(string indexed licenseId, address indexed licensee);
    event LicenseRevoked(string indexed licenseId);

    /**
     * @dev Register Data UTXO
     */
    function registerData(
        string memory id,
        string memory hash,
        uint256 qualityScore,
        uint256 pricePerToken
    ) external {
        require(!dataUTXOs[id].available, "Data already registered");

        dataUTXOs[id] = DataUTXO({
            id: id,
            owner: msg.sender,
            hash: hash,
            qualityScore: qualityScore,
            pricePerToken: pricePerToken,
            available: true,
            createdAt: block.timestamp
        });

        emit DataRegistered(id, msg.sender);
    }

    /**
     * @dev Create a license
     */
    function createLicense(
        string memory licenseId,
        string memory dataId,
        address licensee,
        string memory purpose,
        uint256 price
    ) external returns (bool) {
        DataUTXO storage data = dataUTXOs[dataId];
        require(data.available, "Data not available");
        require(data.owner == msg.sender, "Not data owner");

        licenses[licenseId] = License({
            id: licenseId,
            dataId: dataId,
            licensor: msg.sender,
            licensee: licensee,
            purpose: purpose,
            price: price,
            duration: 30,
            status: 0,          // pending
            accessKey: "",
            createdAt: block.timestamp,
            activatedAt: 0
        });

        emit LicenseCreated(licenseId, msg.sender);
        return true;
    }

    /**
     * @dev Activate a license
     */
    function activateLicense(
        string memory licenseId,
        string memory accessKey
    ) external {
        License storage license = licenses[licenseId];
        require(license.licensee == msg.sender, "Not licensee");
        require(license.status == 0, "License not pending");

        license.status = 1;     // active
        license.accessKey = accessKey;
        license.activatedAt = block.timestamp;

        emit LicenseActivated(licenseId, msg.sender);
    }

    /**
     * @dev Revoke a license
     */
    function revokeLicense(string memory licenseId) external {
        License storage license = licenses[licenseId];
        require(license.licensor == msg.sender, "Not licensor");

        license.status = 3;     // revoked
        emit LicenseRevoked(licenseId);
    }

    /**
     * @dev Check if license is valid
     */
    function isLicenseValid(string memory licenseId) external view returns (bool) {
        License storage license = licenses[licenseId];
        if (license.status != 1) return false;
        if (block.timestamp > license.activatedAt + license.duration * 1 days) return false;
        return true;
    }
}
```
