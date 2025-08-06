import type { CSSProperties, PropsWithChildren } from 'react'
import styles from './Card.module.css'
import clsx from 'clsx'

type CardProps = {
    variant? : "flat" | "gradient"
    className?: string;
    style?: CSSProperties
}

function Card({
    variant = "gradient", 
    className, 
    children,
    style
}: PropsWithChildren<CardProps>){
    return(
        <div 
            className={clsx(styles.card, styles[`card--${variant}`], `${className}`)}
            style={style}
        >
            {children}
        </div>
    )
}

export default Card