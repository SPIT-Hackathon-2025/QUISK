// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TorRent is ReentrancyGuard {
    enum ContractStage { Unsigned, Signed, Active, Completed }

    address public landlord;
    address[] public tenants;
    uint256 public rentAmount;
    uint256 public securityDeposit;
    uint256 public contractDuration; // in weeks
    uint256 public startTime;
    uint256 public depositDeductionPerDay;
    bytes32 public contractClausesHash;

    ContractStage public currentStage;
    mapping(address => bool) public hasSigned;
    mapping(address => uint256) public rentPaidByTenant;
    mapping(address => uint256) public dueAmountByTenant;
    mapping(address => uint256) public securityDepositByTenant;
    mapping(address => uint256) public lastPaymentTimestamp;
    mapping(address => uint256) public landlordDueAmount;

    event ContractSigned(address indexed tenant);
    event TenantAdded(address indexed tenant);
    event RentAmountUpdated(uint256 newRent);
    event LeasingTermsUpdated(uint256 newDuration);
    event RentPaid(address indexed tenant, uint256 amount, uint256 remainingDue);
    event DueAmountReset(address indexed tenant, uint256 newDueAmount);
    event LatePaymentDeducted(address indexed tenant, uint256 deductionAmount);
    event AgreementTerminated(address indexed landlord);
    event SecurityDepositRefunded(address indexed tenant, uint256 amount);

    modifier onlyTenant() {
        require(isTenant(msg.sender), "Only tenants can call this function.");
        _;
    }

    modifier onlyLandlord() {
        require(msg.sender == landlord, "Only landlord can call this function.");
        _;
    }

    modifier contractInStage(ContractStage _stage) {
        require(currentStage == _stage, "Invalid contract stage.");
        _;
    }

    constructor() {
        landlord = msg.sender;
        currentStage = ContractStage.Unsigned;
    }

    function isTenant(address _addr) internal view returns (bool) {
        for (uint256 i = 0; i < tenants.length; i++) {
            if (tenants[i] == _addr) {
                return true;
            }
        }
        return false;
    }

    function addTenant(address _tenant) external onlyLandlord contractInStage(ContractStage.Unsigned) {
        require(!isTenant(_tenant), "Tenant already added.");
        tenants.push(_tenant);
        hasSigned[_tenant] = false;
        dueAmountByTenant[_tenant] = 0; // Will be set when tenancy starts
        securityDepositByTenant[_tenant] = securityDeposit / tenants.length;
        lastPaymentTimestamp[_tenant] = block.timestamp;
        emit TenantAdded(_tenant);
    }

    function setRentAmount(uint256 _rentAmount) external onlyLandlord contractInStage(ContractStage.Unsigned) {
        require(_rentAmount > 0, "Rent amount must be greater than zero.");
        rentAmount = _rentAmount;
        emit RentAmountUpdated(_rentAmount);
    }

    function setLeasingTerm(uint256 _weeks) external onlyLandlord contractInStage(ContractStage.Unsigned) {
        require(_weeks > 0, "Leasing term must be greater than zero.");
        contractDuration = _weeks;
        emit LeasingTermsUpdated(_weeks);
    }

    function signContract() external onlyTenant contractInStage(ContractStage.Unsigned) {
        hasSigned[msg.sender] = true;

        bool allSigned = true;
        for (uint256 i = 0; i < tenants.length; i++) {
            if (!hasSigned[tenants[i]]) {
                allSigned = false;
                break;
            }
        }

        if (allSigned) {
            currentStage = ContractStage.Signed;
        }

        emit ContractSigned(msg.sender);
    }

    function startTenancy() external onlyLandlord contractInStage(ContractStage.Signed) {
        require(tenants.length > 0, "No tenants added.");
        startTime = block.timestamp;
        currentStage = ContractStage.Active;

        uint256 individualDueAmount = rentAmount / tenants.length;

        for (uint256 i = 0; i < tenants.length; i++) {
            dueAmountByTenant[tenants[i]] = individualDueAmount;
            lastPaymentTimestamp[tenants[i]] = block.timestamp;
        }
    }

    function payRent() external payable onlyTenant contractInStage(ContractStage.Active) {
        require(block.timestamp >= startTime, "Tenancy period has not started.");
        require(msg.value > 0, "Payment must be greater than zero.");
        require(dueAmountByTenant[msg.sender] > 0, "No due rent remaining for you.");

        uint256 payment = msg.value;
        rentPaidByTenant[msg.sender] += payment;
        landlordDueAmount[landlord] += payment; // Track rent received by landlord

        if (payment >= dueAmountByTenant[msg.sender]) {
            dueAmountByTenant[msg.sender] = 0; // Fully paid
        } else {
            dueAmountByTenant[msg.sender] -= payment; // Partial payment
        }

        lastPaymentTimestamp[msg.sender] = block.timestamp; // Reset 30-day counter

        emit RentPaid(msg.sender, msg.value, dueAmountByTenant[msg.sender]);
    }

    function resetDueAmount() external contractInStage(ContractStage.Active) {
        for (uint256 i = 0; i < tenants.length; i++) {
            address tenant = tenants[i];

            if (block.timestamp >= lastPaymentTimestamp[tenant] + 30 days) {
                dueAmountByTenant[tenant] = rentAmount / tenants.length;
                lastPaymentTimestamp[tenant] = block.timestamp;
                emit DueAmountReset(tenant, dueAmountByTenant[tenant]);
            }
        }
    }

    function checkTenantDueAmount(address _tenant) external view returns (uint256) {
        return dueAmountByTenant[_tenant];
    }

    function checkLandlordDues() external view onlyLandlord returns (uint256) {
        return landlordDueAmount[msg.sender];
    }

    function terminateAgreement() external onlyLandlord contractInStage(ContractStage.Active) {
        currentStage = ContractStage.Completed;
        emit AgreementTerminated(landlord);
    }
    function getPenaltyEstimate(address _tenant) external view returns (uint256) {
    require(isTenant(_tenant), "Only tenants can check penalty.");
    return dueAmountByTenant[_tenant] * depositDeductionPerDay;
}


    function refundSecurityDeposit() external onlyLandlord contractInStage(ContractStage.Completed) {
        for (uint256 i = 0; i < tenants.length; i++) {
            address tenant = tenants[i];
            uint256 refundAmount = securityDepositByTenant[tenant];
            if (refundAmount > 0) {
                payable(tenant).transfer(refundAmount);
                emit SecurityDepositRefunded(tenant, refundAmount);
            }
        }
    }
}
