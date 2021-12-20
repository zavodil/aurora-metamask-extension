import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  CONFIRM_APPROVE_PATH,
  CONFIRM_SEND_TOKEN_PATH,
  CONFIRM_TOKEN_METHOD_PATH,
  CONFIRM_TRANSACTION_ROUTE,
  CONFIRM_TRANSFER_FROM_PATH,
} from '../../helpers/constants/routes';
import ConfirmApprove from '../confirm-approve';
import ConfirmSendToken from '../confirm-send-token/confirm-send-token.component';
import ConfirmTokenTransactionBaseContainer from '../confirm-token-transaction-base';
import ConfirmTransactionBase from '../confirm-transaction-base/confirm-transaction-base.component';
import ConfirmTransactionSwitch from '../confirm-transaction-switch';

const { useAssetDetails } = require('../../hooks/useAssetDetails');

export const ConfirmTokenTransactionSwitch = ({ transaction }) => {
  const {
    txParams: { data, to: tokenAddress, from: userAddress } = {},
  } = transaction;
  const {
    assetStandard,
    assetName,
    userBalance,
    tokenSymbol,
    decimals,
    tokenImage,
    toAddress,
    tokenAmount,
    tokenId,
  } = useAssetDetails(tokenAddress, userAddress, data);

  return (
    <Switch>
      <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_APPROVE_PATH}`}
        render={() => (
          <ConfirmApprove
            assetStandard={assetStandard}
            assetName={assetName}
            userBalance={userBalance}
            tokenSymbol={tokenSymbol}
            decimals={decimals}
            tokenImage={tokenImage}
            toAddress={toAddress}
            tokenAmount={tokenAmount}
            tokenId={tokenId}
            userAddress={userAddress}
            tokenAddress={tokenAddress}
            transaction={transaction}
          />
        )}
      />
      <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_TRANSFER_FROM_PATH}`}
        component={ConfirmTokenTransactionBaseContainer}
        render={() => (
          <ConfirmTokenTransactionBaseContainer
            assetStandard={assetStandard}
            assetName={assetName}
            userBalance={userBalance}
            tokenSymbol={tokenSymbol}
            decimals={decimals}
            tokenImage={tokenImage}
            toAddress={toAddress}
            tokenAmount={tokenAmount}
            tokenId={tokenId}
            userAddress={userAddress}
            tokenAddress={tokenAddress}
            transaction={transaction}
          />
        )}
      />
      <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_SEND_TOKEN_PATH}`}
        component={ConfirmSendToken}
      />
      <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_TOKEN_METHOD_PATH}`}
        component={ConfirmTransactionBase}
      />
      <Route path="*" component={ConfirmTransactionSwitch} />
    </Switch>
  );
};
