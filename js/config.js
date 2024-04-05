// Use Remix to deploy smart contract to local Ganache blockchain.
// Make note of the address the contract was deployed to, and paste it below.

let contractAddress = "0x65a34197f7eBB946d2B8a6598E459418F37e0631";

// Define the smart contract ABI (Application Binary Interface).
let contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_priority",
        type: "uint256",
      },
    ],
    name: "addBug",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_bugIndex",
        type: "uint256",
      },
    ],
    name: "deleteBug",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_bugIndex",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
    ],
    name: "updateBugDescription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_bugIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_priority",
        type: "uint256",
      },
    ],
    name: "updateBugPriority",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_bugIndex",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_status",
        type: "bool",
      },
    ],
    name: "updateBugStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBugCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_bugIndex",
        type: "uint256",
      },
    ],
    name: "getTask",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isDone",
            type: "bool",
          },
          {
            internalType: "enum BugTracker.Priority",
            name: "priority",
            type: "uint8",
          },
        ],
        internalType: "struct BugTracker.Bug",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
