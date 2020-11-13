import React, {useRef} from 'react'
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

    const map = useRef()

    const onClickLeftCards = (coordinates) => {
        console.log(map.current.panTo)
        map.current.panTo(coordinates, {flying: 1})


    }


    return (
        <YMaps enterprise
               query={{apikey: '1c7f4567-d722-4829-8b8c-6dae4d41a40c'}}>
            <LeftCards state={coordinates} onClickLeftCards={onClickLeftCards}/>
            <Map state={startStateMapZoom}
                 className={`${style.container} ${style.yMaps_layers_pane}`}
                 options={{flying: 1}}
                 instanceRef={map}

            >


                <Clusterer
                    options={{
                        preset: 'islands#invertedVioletClusterIcons',
                        groupByCoordinates: false
                    }}>


                    {/* applied placemarks */}
                    {coordinates.map((point, index) => {
                        const schoolBalloon =
                            `<div id="menu">\
                                            <h3 class="titleInfo">${point.title}</h3>\
                                        <div>Address: ${point.city}, ${point.country}</div>
                                        <div>Mode: ${point.workTime}</div>
                                        <div>${point.description}</div>
                                    </div>`
                        return <Placemark key={index}
                                          properties={{
                                              balloonContent: [`${schoolBalloon}`]
                                          }}
                                          modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                                          geometry={point.coordinate}
                                          onClick={clickPlacemark}/>
                    })}

                </Clusterer>
                {/* control buttons */}
                <ZoomControl options={{float: 'right'}}/>
                <GeolocationControl options={{float: 'left'}}/>
                <SearchControl options={{float: 'right'}}/>
            </Map>
        </YMaps>
    )
}