"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.fungibleStore = exports.aptosCoinStore = exports.FAUCET_URL = exports.NODE_URL = void 0;
//:!:>section_1
exports.NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
exports.FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";
//<:!:section_1
exports.aptosCoinStore = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
exports.fungibleStore = "0x1::fungible_asset::FungibleStore";
