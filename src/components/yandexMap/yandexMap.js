import React from 'react'
import style from './yandexMap.module.css'
import {Map, Placemark, YMaps} from 'react-yandex-maps'
import {LeftCards} from "../LeftCards/LeftCards";

export const YandexMap = () => {

    const startStateMapZoom = {center: [42.50, -27.74], zoom: 3} // Minsk

    const coordinates = [
        [53.91, 27.60], // it-incubator
        // some country...
        [59.94, 30.32],
        [52.23, 21.06],
        [41.89, 12.50],
        [52.50, 13.39],
        [39.48, -8.44],
        [25.79, -80.29],
        [49.25, -123.12]
    ]

    return <YMaps>
        <div>
            <LeftCards/>
            <Map className={`${style.container} ${style.yMaps_layers_pane}`}
                 state={startStateMapZoom}>
                {coordinates.map(point => <Placemark geometry={point}/>)}
            </Map>
        </div>
    </YMaps>
}