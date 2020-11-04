import React from 'react'
import styles from './LeftCards.module.css'

export function LeftCards(props) {

    let schools = [  // Удаляй смело
        {title: 'IT-incubator', mode: '10:00 - 22:00', country: "Belarus", city: 'Minsk', rating: 5},
        {title: 'IT-academy', mode: '12:00 - 20:00', country: "Belarus", city: 'Minsk', rating: 3},
        {title: 'IT-academy', mode: '12:00 - 20:00', country: "Belarus", city: 'Minsk', rating: 3},
        {title: 'IT-academy', mode: '12:00 - 20:00', country: "Belarus", city: 'Minsk', rating: 3},
        {title: 'IT-academy', mode: '12:00 - 20:00', country: "Belarus", city: 'Minsk', rating: 3},
        {title: 'IT-academy', mode: '12:00 - 20:00', country: "Belarus", city: 'Minsk', rating: 3},
        {title: 'IT-academy', mode: '12:00 - 20:00', country: "Belarus", city: 'Minsk', rating: 3}
    ]
    let schoolsList = schools.map((s, i) => {  // замени на props.state.map
        return <li className={styles.schoolWrapper} key={i}>
            <div className={styles.schoolTitle}>
                <h3 className={styles.title}>{s.title}</h3>
                <h5>Mode: {s.mode}</h5>
            </div>
            <div className={styles.direction}>
                <div>Country: {s.country}</div>
                <div>City: {s.city}</div>
                <div>Rating: {s.rating}</div>
            </div>
        </li>
    })
    return (
        <div className={styles.schoolsPanel}>
            <div className={styles.titlePanel}>Schools:</div>
            <div className={styles.schoolsList}>
                <ul>
                    {schoolsList}
                </ul>
            </div>
        </div>
    )
}