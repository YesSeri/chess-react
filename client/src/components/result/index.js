import React from 'react'
import { Container } from './styles/result'

export default function Result({ children, ...restProps }) {
    return (
        <Container {...restProps}>{children}</Container>
    )
}
