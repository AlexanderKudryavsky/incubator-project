import React from 'react'
import styles from './LeftCards.module.css'

export function LeftCards(props) {

    const onClickLeftCards = (coordinates) => {
        props.onClickLeftCards(coordinates)
    }

    let schoolsList = props.state.map((s, i) => {
        return (
            <li className={styles.schoolWrapper} key={i}>
                <div className={props.darkMode? styles.schoolTitleBlack : styles.schoolTitleWhite} onClick={() => onClickLeftCards(s.coordinate)}>
                    <h3 className={props.darkMode ? styles.titleBlack : styles.titleWhite}>{s.title}</h3>
                    <h5>Mode: {s.workTime}</h5>
                </div>
                <div className={props.darkMode ? styles.directionBlack : styles.directionWhite}>
                    <div>Country: {s.country}</div>
                    <div>City: {s.city}</div>
                </div>
            </li>
        )
    })

    return (
        <div className={styles.schoolsPanel}>
            <div className={styles.schoolsList}>
                <ul>
                    {schoolsList}
                </ul>
            </div>
        </div>
    )
}