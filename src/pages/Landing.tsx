import { useWeb3React } from '@web3-react/core'
import { ButtonPrimary, ButtonSecondary } from 'components/Button'
import { AutoRow } from 'components/Row'
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useLandingIsOpen, useToggleLanding } from 'state/application/hooks'
import { useIsDarkMode } from 'state/user/hooks'
import styled from 'styled-components/macro'

const PageWrapper = styled.span<{ visible: boolean; isDarkMode: boolean }>`
  width: 100%;
  height: calc(100vh - 72px);
  position: absolute;
  background: ${({ isDarkMode }) =>
    isDarkMode
      ? 'linear-gradient(rgba(8, 10, 24, 0) 9.84%, rgb(8 10 24 / 86%) 35.35%)'
      : 'linear-gradient(rgba(8, 10, 24, 0) 9.84%, rgb(255 255 255 / 86%) 35.35%)'};
  padding: 5rem;
  z-index: ${({ visible }) => (visible ? '999' : '-1')};
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-self: start;
  pointer-events: none;
  opacity: ${({ visible }) => (visible ? '1' : '0')};
  transition: 250ms ease opacity;
`

const TitleText = styled.h1`
  font-size: 72px;
  font-weight: 600;
  margin-bottom: 0px;
`

const SubText = styled.h3`
  font-size: 28px;
  font-weight: 400;
`

const ButtonText = styled.h3`
  margin: 0px;
`

const ContentWrapper = styled.span`
  max-width: 720px;
  pointer-events: all;
`

export default function Landing() {
  const open = useLandingIsOpen()
  const toggleLanding = useToggleLanding(false)
  const isDarkMode = useIsDarkMode()

  const { account } = useWeb3React()

  useEffect(() => {
    if (account !== undefined) {
      toggleLanding()
    }
  }, [account, toggleLanding])

  return (
    <PageWrapper isDarkMode={isDarkMode} visible={open}>
      <ContentWrapper>
        <TitleText>Trade crypto and NFTs confidently</TitleText>
        <SubText>Swap tokens with the deepest liquidity and buy NFTs at the best prices.</SubText>
      </ContentWrapper>
      <ContentWrapper>
        <AutoRow gap="12px">
          <ButtonPrimary $borderRadius="12px" padding="1rem" width="content">
            <ButtonText onClick={() => toggleLanding()}>Get started</ButtonText>
          </ButtonPrimary>
          <NavLink to={'/about'}>
            <ButtonSecondary onClick={() => toggleLanding()} padding="1rem" width="content">
              <ButtonText>Learn more</ButtonText>
            </ButtonSecondary>
          </NavLink>
        </AutoRow>
      </ContentWrapper>
    </PageWrapper>
  )
}
