import React from 'react'
import style from './yandexMap.module.css'
import {LeftCards} from "../LeftCards/LeftCards";
import {Clusterer, GeolocationControl, Map, Placemark, SearchControl, YMaps, ZoomControl} from 'react-yandex-maps'

export const YandexMap = () => {

    const startStateMapZoom = {center: [42.50, -41.74], zoom: 3} // Minsk

    const coordinates = [
        {
            coordinate: [53.917501, 27.604851],
            country: 'Belarus',
            city: 'Minsk',
            logo: null,
            title: 'IT-KAMASUTRA',
            description: 'Some info about school...',
            workTime: '09:00 - 21:00',
            rating: {
                star: 5
            },
            social: [
                {vk: ''},
                {fb: ''},
                {ig: ''}
            ]
        },
        {
            coordinate: [53.905044, 27.540433],
            country: 'Belarus',
            city: 'Minsk',
            logo: null,
            title: 'IT-ACADEMY',
            description: 'Some info about school...',
            workTime: '09:00 - 21:00',
            rating: {
                star: 1 // фуфуфу...))
            },
            social: [
                {vk: ''},
                {fb: ''},
                {ig: ''}
            ]
        }
    ]

    const clickPlacemark = () => {
        console.log('Clicked')
    }

    return (
        <YMaps enterprise
               query={{apikey: '1c7f4567-d722-4829-8b8c-6dae4d41a40c'}}>
            <LeftCards/>
            <Map state={startStateMapZoom}
                 className={`${style.container} ${style.yMaps_layers_pane}`}>

                <Clusterer
                    options={{
                        preset: 'islands#invertedVioletClusterIcons',
                        groupByCoordinates: false
                    }}>

                    {/* applied placemarks */}
                    {coordinates.map((point, index) => <Placemark key={index}
                                                          geometry={point.coordinate}
                                                          onClick={clickPlacemark}/>)}

                </Clusterer>
                {/* control buttons */}
                <ZoomControl options={{float: 'right'}}/>
                <GeolocationControl options={{float: 'left'}}/>
                <SearchControl options={{float: 'right'}}/>
            </Map>
        </YMaps>
    )
}