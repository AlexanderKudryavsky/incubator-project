import React from 'react'
import styles from './LeftCards.module.css'

export function LeftCards(props) {

    let schoolsList = props.coordinates.map((s) => {
            return (
                <li className={styles.schoolWrapper}>
                    <div className={styles.schoolTitle}>
                        <h3 className={styles.title}>{s.title}</h3>
                    </div>
                    <div className={styles.direction}>
                        <div>Country: {s.country}</div>
                        <div>City: {s.city}</div>
                        <div>Rating: {s.rating.star}</div>
                    </div>
                </li>
            )
        }
    )

    return <div className={styles.schoolsPanel}>
        <div className={styles.titlePanel}>Schools:</div>
        <div className={styles.schoolsList}>
            <ul>
                {schoolsList}
            </ul>
        </div>
    </div>
}