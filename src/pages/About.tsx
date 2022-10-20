import { useWeb3React } from '@web3-react/core'
import { Box } from 'nft/components/Box'
import { DiscordIconMenu, GithubIconMenu, TwitterIconMenu } from 'nft/components/icons'
import React, { useEffect } from 'react'
import { ReactNode } from 'react'
import { ArrowUpRight } from 'react-feather'
import { useLandingIsOpen, useToggleLanding } from 'state/application/hooks'
import { useIsDarkMode } from 'state/user/hooks'
import styled, { useTheme } from 'styled-components/macro'

const IconRow = styled.span`
  display: flex;
  flex-direction: row;
`

const Icon = ({ href, children }: { href?: string; children: ReactNode }) => {
  return (
    <>
      <Box
        as={href ? 'a' : 'div'}
        href={href ?? undefined}
        target={href ? '_blank' : undefined}
        rel={href ? 'noopener noreferrer' : undefined}
        display="flex"
        flexDirection="column"
        color="textPrimary"
        background="none"
        border="none"
        justifyContent="center"
        textAlign="center"
        marginRight="12"
      >
        {children}
      </Box>
    </>
  )
}

const PageWrapper = styled.span<{ visible: boolean; isDarkMode: boolean }>`
  width: 100%;
  align-self: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: 250ms ease opacity;
`

const TitleText = styled.h2`
  font-size: 72px;
  font-weight: 600;
  margin-bottom: 0px;
`

const SubText = styled.h3`
  font-size: 28px;
  font-weight: 400;
`

const Body = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 18px;
`

const ContentWrapper = styled.span`
  max-width: 960px;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 5rem;
  gap: 24px;
`

const CardWrapper = styled.span`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
`

const BigCard = styled.a`
  background-color: ${({ theme }) => theme.backgroundModule};
  border-radius: 16px;
  padding: 2rem;
  min-height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  color: white;
  border: 2px solid transparent;
  font-size: 32px;
  font-weight: 500;

  &:hover {
    border: 2px solid ${({ theme }) => theme.accentAction};
  }
`

export default function About() {
  const open = useLandingIsOpen()
  const toggleLanding = useToggleLanding(false)
  const isDarkMode = useIsDarkMode()

  const { account } = useWeb3React()
  const theme = useTheme()

  useEffect(() => {
    if (account !== undefined) {
      toggleLanding()
    }
  }, [account, toggleLanding])

  return (
    <PageWrapper isDarkMode={isDarkMode} visible={open}>
      <ContentWrapper>
        <TitleText>About Uniswap</TitleText>
        <Body>
          The Uniswap Protocol is an open-source protocol for providing liquidity and trading ERC20 tokens on Ethereum.
          It eliminates trusted intermediaries and unnecessary forms of rent extraction, allowing for safe, accessible,
          and efficient exchange activity.
        </Body>

        <CardWrapper>
          <BigCard href="https://uniswap.org">
            Uniswap Protocol
            <ArrowUpRight color={theme.textTertiary} />
          </BigCard>
          <BigCard href="https://uniswap.org/blog">
            Blog
            <ArrowUpRight color={theme.textTertiary} />
          </BigCard>
          <BigCard href="https://boards.greenhouse.io/uniswaplabs">
            Careers
            <ArrowUpRight color={theme.textTertiary} />
          </BigCard>
        </CardWrapper>
        <CardWrapper>
          <BigCard href="https://uniswap.org">
            Support
            <ArrowUpRight color={theme.textTertiary} />
          </BigCard>
          <BigCard href="https://uniswap.org/blog">
            Twitter
            <ArrowUpRight color={theme.textTertiary} />
          </BigCard>
          <BigCard href="https://boards.greenhouse.io/uniswaplabs">
            Developers
            <ArrowUpRight color={theme.textTertiary} />
          </BigCard>
        </CardWrapper>
        <span>
          <Body>
            To create a new liquidity pool, provide liquidity, swap tokens, or vote on governance proposals, head over
            to the Uniswap Interface and connect a Web3 wallet. Remember, each transaction on Ethereum costs Ether
            (ETH). For a more detailed walkthrough, check out our Help Guides. If you’re a developer interested in
            building on top of the Uniswap Protocol, please refer to our extensive docs.
          </Body>
        </span>
        <span>
          <small>
            Media inquires for Uniswap Labs - Contact <a href="mailto:media@uniswap.org">media@uniswap.org</a>
          </small>
        </span>
        <IconRow>
          <Icon href="https://discord.com/invite/FCfyBSbCU5">
            <DiscordIconMenu width={24} height={24} color={theme.textSecondary} />
          </Icon>
          <Icon href="https://twitter.com/Uniswap">
            <TwitterIconMenu width={24} height={24} color={theme.textSecondary} />
          </Icon>
          <Icon href="https://github.com/Uniswap">
            <GithubIconMenu width={24} height={24} color={theme.textSecondary} />
          </Icon>
        </IconRow>
      </ContentWrapper>
    </PageWrapper>
  )
}
