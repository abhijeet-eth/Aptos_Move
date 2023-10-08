/* eslint-disable no-console */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var dotenv = require("dotenv");
dotenv.config();
var _a = require("aptos"), AptosClient = _a.AptosClient, AptosAccount = _a.AptosAccount, FaucetClient = _a.FaucetClient, BCS = _a.BCS, TransactionBuilderMultiEd25519 = _a.TransactionBuilderMultiEd25519, TxnBuilderTypes = _a.TxnBuilderTypes;
var aptosCoinStore = require("./common").aptosCoinStore;
var assert = require("assert");
var NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
var FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";
/**
 * This code example demonstrates the process of moving test coins from one multisig
 * account to a single signature account.
 */
(function () { return __awaiter(_this, void 0, void 0, function () {
    var client, faucetClient, account1, account2, account3, multiSigPublicKey, authKey, mutisigAccountAddress, resources, accountResource, balance, account4, entryFunctionPayload, _a, sequenceNumber, chainId, rawTxn, txnBuilder, bcsTxn, transactionRes;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                client = new AptosClient(NODE_URL);
                faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
                account1 = new AptosAccount();
                account2 = new AptosAccount();
                account3 = new AptosAccount();
                multiSigPublicKey = new TxnBuilderTypes.MultiEd25519PublicKey([
                    new TxnBuilderTypes.Ed25519PublicKey(account1.signingKey.publicKey),
                    new TxnBuilderTypes.Ed25519PublicKey(account2.signingKey.publicKey),
                    new TxnBuilderTypes.Ed25519PublicKey(account3.signingKey.publicKey),
                ], 
                // Threshold
                2);
                authKey = TxnBuilderTypes.AuthenticationKey.fromMultiEd25519PublicKey(multiSigPublicKey);
                mutisigAccountAddress = authKey.derivedAddress();
                return [4 /*yield*/, faucetClient.fundAccount(mutisigAccountAddress, 100000000)];
            case 1:
                _b.sent();
                return [4 /*yield*/, client.getAccountResources(mutisigAccountAddress)];
            case 2:
                resources = _b.sent();
                accountResource = resources.find(function (r) { return r.type === aptosCoinStore; });
                balance = parseInt((accountResource === null || accountResource === void 0 ? void 0 : accountResource.data).coin.value);
                assert(balance === 100000000);
                console.log("multisig account coins: ".concat(balance, ". Should be 100000000!"));
                account4 = new AptosAccount();
                entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(TxnBuilderTypes.EntryFunction.natural(
                // Fully qualified module name, `AccountAddress::ModuleName`
                "0x1::aptos_account", 
                // Module function
                "transfer", 
                // The coin type to transfer
                [], 
                // Arguments for function `transfer`: receiver account address and amount to transfer
                [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(account4.address())), BCS.bcsSerializeUint64(123)]));
                return [4 /*yield*/, Promise.all([
                        client.getAccount(mutisigAccountAddress),
                        client.getChainId(),
                    ])];
            case 3:
                _a = _b.sent(), sequenceNumber = _a[0].sequence_number, chainId = _a[1];
                rawTxn = new TxnBuilderTypes.RawTransaction(
                // Transaction sender account address
                TxnBuilderTypes.AccountAddress.fromHex(mutisigAccountAddress), BigInt(sequenceNumber), entryFunctionPayload, 
                // Max gas unit to spend
                BigInt(10000), 
                // Gas price per unit
                BigInt(100), 
                // Expiration timestamp. Transaction is discarded if it is not executed within 10 seconds from now.
                BigInt(Math.floor(Date.now() / 1000) + 10), new TxnBuilderTypes.ChainId(chainId));
                txnBuilder = new TransactionBuilderMultiEd25519(function (signingMessage) {
                    var sigHexStr1 = account1.signBuffer(signingMessage);
                    var sigHexStr3 = account3.signBuffer(signingMessage);
                    // Bitmap masks which public key has signed transaction.
                    // See https://aptos-labs.github.io/ts-sdk-doc/classes/TxnBuilderTypes.MultiEd25519Signature.html#createBitmap
                    var bitmap = TxnBuilderTypes.MultiEd25519Signature.createBitmap([0, 2]);
                    // See https://aptos-labs.github.io/ts-sdk-doc/classes/TxnBuilderTypes.MultiEd25519Signature.html#constructor
                    var muliEd25519Sig = new TxnBuilderTypes.MultiEd25519Signature([
                        new TxnBuilderTypes.Ed25519Signature(sigHexStr1.toUint8Array()),
                        new TxnBuilderTypes.Ed25519Signature(sigHexStr3.toUint8Array()),
                    ], bitmap);
                    return muliEd25519Sig;
                }, multiSigPublicKey);
                bcsTxn = txnBuilder.sign(rawTxn);
                return [4 /*yield*/, client.submitSignedBCSTransaction(bcsTxn)];
            case 4:
                transactionRes = _b.sent();
                return [4 /*yield*/, client.waitForTransaction(transactionRes.hash)];
            case 5:
                _b.sent();
                return [4 /*yield*/, client.getAccountResources(mutisigAccountAddress)];
            case 6:
                resources = _b.sent();
                accountResource = resources.find(function (r) { return r.type === aptosCoinStore; });
                balance = parseInt((accountResource === null || accountResource === void 0 ? void 0 : accountResource.data).coin.value);
                console.log("multisig account coins: ".concat(balance, "."));
                return [4 /*yield*/, client.getAccountResources(account4.address())];
            case 7:
                resources = _b.sent();
                accountResource = resources.find(function (r) { return r.type === aptosCoinStore; });
                balance = parseInt((accountResource === null || accountResource === void 0 ? void 0 : accountResource.data).coin.value);
                assert(balance === 123);
                console.log("account4 coins: ".concat(balance, ". Should be 123!"));
                return [2 /*return*/];
        }
    });
}); })();
