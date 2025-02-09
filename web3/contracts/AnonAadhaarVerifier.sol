// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Verifier.sol";  // Importing from local directory

contract AnonAadhaarVerifier is Verifier {
    mapping(address => bool) public verifiedUsers;

    event UserVerified(address indexed user);

    function verifyAadhaarProof(
        uint[2] calldata _pA,  // ✅ Changed to `calldata`
        uint[2][2] calldata _pB,  // ✅ Changed to `calldata`
        uint[2] calldata _pC,  // ✅ Changed to `calldata`
        uint[9] calldata _pubSignals  // ✅ Already changed to `calldata`
    ) public {
        require(!verifiedUsers[msg.sender], "User already verified");

        bool isValid = verifyProof(_pA, _pB, _pC, _pubSignals); // ✅ Corrected argument type
        require(isValid, "Invalid Aadhaar proof");

        verifiedUsers[msg.sender] = true;
        emit UserVerified(msg.sender);
    }

    function isUserVerified(address user) public view returns (bool) {
        return verifiedUsers[user];
    }
}
