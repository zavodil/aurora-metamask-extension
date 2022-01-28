import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Box from '../../../../components/ui/box';
import SiteIcon from '../../../../components/ui/site-icon';
import Typography from '../../../../components/ui/typography/typography';
import {
  COLORS,
  TYPOGRAPHY,
  FONT_WEIGHT,
} from '../../../../helpers/constants/design-system';
import {
  CHAIN_ID_TO_NETWORK_IMAGE_URL_MAP,
  NETWORK_TO_NAME_MAP,
  UNKNOWN_NETWORK,
} from '../../../../../shared/constants/network';

export default function ConfirmationNetworkSwitch({ newNetwork }) {
  const currentNetwork = useSelector((state) => ({
    nickname: state.metamask.provider.nickname,
    type: state.metamask.provider.type,
    chainId: state.metamask.provider.chainId,
  }));

  return (
    <Box className="confirmation-network-switch">
      <Box className="confirmation-network-switch__result">
        <Box className="confirmation-network-switch__icons">
          <Box className="confirmation-network-switch__icon">
            <SiteIcon
              icon={
                CHAIN_ID_TO_NETWORK_IMAGE_URL_MAP[
                  currentNetwork.chainId in CHAIN_ID_TO_NETWORK_IMAGE_URL_MAP
                    ? currentNetwork.chainId
                    : UNKNOWN_NETWORK
                ]
              }
              name={currentNetwork.nickname}
              size={64}
            />
            <Typography
              color={COLORS.BLACK}
              variant={TYPOGRAPHY.H6}
              fontWeight={FONT_WEIGHT.NORMAL}
            >
              {currentNetwork.nickname ||
                NETWORK_TO_NAME_MAP[currentNetwork.type]}
            </Typography>
          </Box>
          <Box className="confirmation-network-switch__center-icon">
            <span className="confirmation-network-switch__check" />
            {renderBrokenLine()}
          </Box>
          <Box className="confirmation-network-switch__icon">
            <SiteIcon
              icon={
                CHAIN_ID_TO_NETWORK_IMAGE_URL_MAP[
                  newNetwork.chainId in CHAIN_ID_TO_NETWORK_IMAGE_URL_MAP
                    ? newNetwork.chainId
                    : UNKNOWN_NETWORK
                ]
              }
              name={newNetwork.name}
              size={64}
            />
            <Typography
              color={COLORS.BLACK}
              variant={TYPOGRAPHY.H6}
              fontWeight={FONT_WEIGHT.NORMAL}
            >
              {newNetwork.name}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  function renderBrokenLine() {
    return (
      <svg
        width="131"
        height="2"
        viewBox="0 0 131 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 1H134"
          stroke="#CDD1E4"
          strokeLinejoin="round"
          strokeDasharray="8 7"
        />
      </svg>
    );
  }
}

ConfirmationNetworkSwitch.propTypes = {
  newNetwork: PropTypes.shape({
    chainId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};
