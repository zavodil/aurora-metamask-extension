import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/ui/loading-screen';
import ConfirmTransactionSwitch from '../confirm-transaction-switch';
import ConfirmTransactionBase from '../confirm-transaction-base';
import ConfirmSendEther from '../confirm-send-ether';
import ConfirmSendToken from '../confirm-send-token';
import ConfirmDeployContract from '../confirm-deploy-contract';
import ConfirmApprove from '../confirm-approve';
import ConfirmTokenTransactionBaseContainer from '../confirm-token-transaction-base';
import ConfirmDecryptMessage from '../confirm-decrypt-message';
import ConfirmEncryptionPublicKey from '../confirm-encryption-public-key';
import {
  CONFIRM_TRANSACTION_ROUTE,
  CONFIRM_DEPLOY_CONTRACT_PATH,
  CONFIRM_SEND_ETHER_PATH,
  CONFIRM_SEND_TOKEN_PATH,
  CONFIRM_APPROVE_PATH,
  CONFIRM_TRANSFER_FROM_PATH,
  CONFIRM_TOKEN_METHOD_PATH,
  SIGNATURE_REQUEST_PATH,
  DECRYPT_MESSAGE_REQUEST_PATH,
  ENCRYPTION_PUBLIC_KEY_REQUEST_PATH,
  DEFAULT_ROUTE,
} from '../../helpers/constants/routes';
import {
  disconnectGasFeeEstimatePoller,
  getGasFeeEstimatesAndStartPolling,
  addPollingTokenToAppState,
  removePollingTokenFromAppState,
  getContractMethodData,
  setDefaultHomeActiveTabName,
} from '../../store/actions';
import { usePrevious } from '../../hooks/usePrevious';
import { getUnapprovedTxs } from '../../ducks/metamask/metamask';
import { getSendTo } from '../../ducks/send';
import { unconfirmedTransactionsListSelector } from '../../selectors';
import { getMostRecentOverviewPage } from '../../ducks/history/history';
import {
  setTransactionToConfirm,
  clearConfirmTransaction,
} from '../../ducks/confirm-transaction/confirm-transaction.duck';
import { isTokenMethodAction } from '../../helpers/utils/transactions.util';
import ConfTx from './conf-tx';
import { ConfirmTokenTransactionSwitch } from './confirm-token-transaction-switch';

export const ConfirmTransaction = () => {
  const [pollingToken, setPollingToken] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  const history = useHistory();
  const dispatch = useDispatch();
  const { id: paramsTransactionId } = useParams();
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage);
  const unapprovedTxs = useSelector(getUnapprovedTxs);
  const sendTo = useSelector(getSendTo);
  const unconfirmedTransactions = useSelector(
    unconfirmedTransactionsListSelector,
  );
  const totalUnapprovedCount = unconfirmedTransactions.length;
  const transaction = totalUnapprovedCount
    ? unapprovedTxs[paramsTransactionId] || unconfirmedTransactions[0]
    : {};

  const { id: transactionId, type, txParams: { data } = {} } = transaction;

  const beforeUnload = () => {
    setIsMounted(false);
    if (pollingToken) {
      disconnectGasFeeEstimatePoller(pollingToken);
      removePollingTokenFromAppState(pollingToken);
    }
  };

  useEffect(() => {
    let pollingToken;
    const getAndSetPollingToken = async () => {
      pollingToken = await getGasFeeEstimatesAndStartPolling();
      if (isMounted) {
        setPollingToken(pollingToken);
        addPollingTokenToAppState(pollingToken);
      } else {
        disconnectGasFeeEstimatePoller(pollingToken);
        removePollingTokenFromAppState(pollingToken);
      }
    };
    getAndSetPollingToken();

    window.addEventListener('beforeunload', beforeUnload);

    if (!totalUnapprovedCount && !sendTo) {
      history.replace(mostRecentOverviewPage);
      return;
    }

    getContractMethodData(data);

    const txId = transactionId || paramsTransactionId;
    if (txId) {
      dispatch(setTransactionToConfirm(txId));
    }

    return () => {
      beforeUnload();
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, []);

  const previousParamsTransactionId = usePrevious(paramsTransactionId);
  const previousTransactionId = usePrevious(transactionId);

  useEffect(() => {
    if (
      paramsTransactionId &&
      transactionId &&
      previousParamsTransactionId !== paramsTransactionId
    ) {
      clearConfirmTransaction();
      getContractMethodData(data);
      setTransactionToConfirm(paramsTransactionId);
    } else if (
      previousTransactionId &&
      !transactionId &&
      !totalUnapprovedCount
    ) {
      dispatch(setDefaultHomeActiveTabName('Activity')).then(() => {
        history.replace(DEFAULT_ROUTE);
      });
    } else if (
      previousTransactionId &&
      transactionId &&
      previousTransactionId !== transactionId
    ) {
      history.replace(mostRecentOverviewPage);
    }
  }, [
    paramsTransactionId,
    previousParamsTransactionId,
    previousTransactionId,
    totalUnapprovedCount,
    data,
  ]);

  const validTransactionId =
    transactionId &&
    (!paramsTransactionId || Number(paramsTransactionId) === transactionId);

  if (isTokenMethodAction(type) && validTransactionId) {
    return <ConfirmTokenTransactionSwitch transaction={transaction} />;
  }

  // Show routes when state.confirmTransaction has been set and when either the ID in the params
  // isn't specified or is specified and matches the ID in state.confirmTransaction in order to
  // support URLs of /confirm-transaction or /confirm-transaction/<transactionId>
  return validTransactionId ? (
    <Switch>
      <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_DEPLOY_CONTRACT_PATH}`}
        component={ConfirmDeployContract}
      />
      <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_SEND_ETHER_PATH}`}
        component={ConfirmSendEther}
      />
      {/* <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_TOKEN_METHOD_PATH}`}
        component={ConfirmTransactionBase}
      /> */}
      {/* <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_SEND_TOKEN_PATH}`}
        component={ConfirmSendToken}
      />
      <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_APPROVE_PATH}`}
        component={ConfirmApprove}
      />
      <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_TRANSFER_FROM_PATH}`}
        component={ConfirmTokenTransactionBaseContainer}
      /> */}
      <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${SIGNATURE_REQUEST_PATH}`}
        component={ConfTx}
      />
      <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${DECRYPT_MESSAGE_REQUEST_PATH}`}
        component={ConfirmDecryptMessage}
      />
      <Route
        exact
        path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${ENCRYPTION_PUBLIC_KEY_REQUEST_PATH}`}
        component={ConfirmEncryptionPublicKey}
      />
      <Route path="*" component={ConfirmTransactionSwitch} />
    </Switch>
  ) : (
    <Loading />
  );
};

ConfirmTransaction.propTypes = {
  history: PropTypes.object.isRequired,
  totalUnapprovedCount: PropTypes.number.isRequired,
  sendTo: PropTypes.string,
  setTransactionToConfirm: PropTypes.func,
  clearConfirmTransaction: PropTypes.func,
  mostRecentOverviewPage: PropTypes.string.isRequired,
  transaction: PropTypes.object,
  getContractMethodData: PropTypes.func,
  transactionId: PropTypes.string,
  paramsTransactionId: PropTypes.string,
  isTokenMethodAction: PropTypes.bool,
  setDefaultHomeActiveTabName: PropTypes.func,
};
