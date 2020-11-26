import React, {useRef, useState} from 'react'
import {
    Clusterer,
    GeolocationControl,
    Map,
    Placemark,
    RoutePanel,
    SearchControl,
    YMaps,
    ZoomControl
} from 'react-yandex-maps'
import {AddPlacemarkForm} from '../AddPlacemarkForm/AddPlacemarkForm'
import style from './yandexMap.module.css'
import {LeftCards} from '../LeftCards/LeftCards'
import {ConfirmationWindow} from "../ConfirmationWindow/ConfirmationWindow";

export const YandexMap = () => {

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

    const map = useRef()
    const ymaps = useRef(null)
    const [panelOpen, setPanelOpen] = useState(false)
    const [placemarkObjects, setPlacemarkObjects] = useState(coordinates)
    const [newPlacemarkCoordinates, setNewPlacemarkCoordinates] = useState([])
    const [startStateMapZoom, setStartStateMapZoom] = useState({center: [42.50, -27.74], zoom: 3}) // Minsk
    const modules = ['layout.ImageWithContent', 'GeoObjectCollection', 'Placemark']
    const [positionConfWindow, setPositionConfWindow] = useState([]);
    const [positionConfWindowOpen, setPositionConfWindowOpen] = useState(false)

    const onClickLeftCards = (coordinates) => {
        map.current.panTo(coordinates, {flying: 1})
    }

    const openPanelControl = () => !panelOpen && setPanelOpen(!panelOpen)

    const openConfirmationWindow = (e) => {
        if(panelOpen) {
            return ;
        }
        const position = e.get('coords');
        const windowPosition = e.get('clientPixels');
        setPositionConfWindow(windowPosition);
        setNewPlacemarkCoordinates(position)
        setPositionConfWindowOpen(!positionConfWindowOpen);
    }

    const addPlacemark = ({coordinates, country, city, title, description, workTime}) => {
        let newPlacemark = {
            coordinate: coordinates,
            country: country,
            city: city,
            logo: null,
            title: title,
            description: description,
            workTime: workTime,
            rating: {
                star: 5
            },
            social: [
                {vk: ''},
                {fb: ''},
                {ig: ''}
            ]
        }
        let newArray = [...placemarkObjects, newPlacemark]
        setPlacemarkObjects(newArray)
        setStartStateMapZoom({center: map.current.getCenter(), zoom: 3})
    }

    const dataConvert = (routes) => {
        let features = []
        routes &&
        routes.map((route) => {
            const lat = route.coordinate[0]
            const lon = route.coordinate[1]
            let tmpObj = {
                type: 'Feature',
                id: route.title,
                route: route,
                geometry: {
                    type: 'Point',
                    coordinates: [lat, lon]
                }
            }
            return features.push(tmpObj)
        })
        return features
    }

    class CustomSearchProvider {
        constructor(points) {
            this.points = points
        }

        geocode(request, options) {

            let deferred = ymaps.current && ymaps.current.vow.defer()
            let geoObjects = ymaps.current && new ymaps.current.GeoObjectCollection()

            let offset = options.skip || 0
            let limit = options.results || 20

            let points = []
            for (let i = 0, l = this.points.length; i < l; i++) {
                let point = this.points[i]

                if (point.title.toLowerCase().indexOf(request.toLowerCase()) !== -1) {
                    points.push(point)
                }
            }

            // При формировании ответа можно учитывать offset и limit.
            points = points.splice(offset, limit)

            // Добавляем точки в результирующую коллекцию.
            for (let i = 0, l = points.length; i < l; i++) {
                let point = points[i],
                    coordinates = point.coordinates,
                    routeId = point.title

                geoObjects.add(
                    new ymaps.current.Placemark(coordinates, {
                        name: routeId,
                        description: `${point.country}, ${point.city}`,
                        balloonContentBody: '<p>' + routeId + '</p>',
                        boundedBy: [coordinates, coordinates]
                    })
                )
            }

            deferred.resolve({
                // Геообъекты поисковой выдачи.
                geoObjects,
                // Метаинформация ответа.
                metaData: {
                    geocoder: {
                        // Строка обработанного запроса.
                        request,
                        // Количество найденных результатов.
                        found: geoObjects.getLength(),
                        // Количество возвращенных результатов.
                        results: limit,
                        // Количество пропущенных результатов.
                        skip: offset
                    }
                }
            })
            // Возвращаем объект-обещание.
            return deferred.promise()
        }
    }

    return (
        <YMaps enterprise
               query={{
                   apikey: '1c7f4567-d722-4829-8b8c-6dae4d41a40c\n'
               }}>
            <Map state={startStateMapZoom}
                 className={style.container}
                 modules={modules}
                 onLoad={(api) => ymaps.current = api}
                 features={dataConvert(coordinates)}
                 instanceRef={map}
                 onContextMenu={openConfirmationWindow}>
                <SearchControl options={{
                    float: 'left',
                    maxWidth: 190,
                    noPlacemark: true,
                    provider: new CustomSearchProvider(coordinates),
                    resultsPerPage: 5
                }}/>
                <ZoomControl options={{float: 'right'}}/>
                {positionConfWindowOpen && <ConfirmationWindow openPanelControl={openPanelControl}
                                                               setPositionConfWindow={setPositionConfWindowOpen}
                                                               positionConfWindow = {positionConfWindow}
                />}
                <AddPlacemarkForm
                    panelOpen={panelOpen}
                    openPanelControl={setPanelOpen}
                    addPlacemark={addPlacemark}
                    newPlacemarkCoordinates={newPlacemarkCoordinates}
                    setNewPlacemarkCoordinates={setNewPlacemarkCoordinates}/>
                <Clusterer
                    options={{
                        preset: 'islands#invertedVioletClusterIcons',
                        groupByCoordinates: false
                    }}>
                    {placemarkObjects.map((point, index) => {
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
                                          geometry={point.coordinate}/>
                    })}
                </Clusterer>
                <GeolocationControl/>
                <LeftCards state={placemarkObjects} onClickLeftCards={onClickLeftCards}/>
                <RoutePanel options={{float: 'right', autofocus: false}}/>
                {/*<LeftCards state={coordinates} onClickLeftCards={onClickLeftCards}/>*/}
            </Map>
        </YMaps>
    )
}