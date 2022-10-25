import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 420px;
  width: 100%;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  padding: 1rem;
  border: 2px solid transparent;
  background: linear-gradient(#1d1c1d, #1d1c1d),
    linear-gradient(155.05deg, rgba(255, 202, 76, 0.24) 6.93%, rgba(193, 121, 1, 0) 135.46%);
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
