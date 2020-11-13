import React, {useRef, useState} from 'react'
import {
    Clusterer, GeolocationControl,
    Map,
    Placemark,
    SearchControl,
    YMaps,
    ZoomControl
} from 'react-yandex-maps'
import {AddPlacemarkForm} from '../AddPlacemarkForm/AddPlacemarkForm'
import style from './yandexMap.module.css'
import {LeftCards} from "../LeftCards/LeftCards";

export const YandexMap = () => {

    const modules = ['layout.ImageWithContent', 'GeoObjectCollection', 'Placemark']

    const [startStateMapZoom, setStartStateMapZoom] = useState({center: [42.50, -27.74], zoom: 3}) // Minsk

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

    const [panelOpen, setPanelOpen] = useState(false)
    const [placemarkObjects, setPlacemarkObjects] = useState(coordinates)
    const [newPlacemarkCoordinates, setNewPlacemarkCoordinates] = useState([])
    const map = useRef()

    const onClickLeftCards = (coordinates) => {
        console.log(map.current.panTo)
        map.current.panTo(coordinates, {flying: 1})


    }

    const openPanelControl = () => !panelOpen && setPanelOpen(!panelOpen)

    const addPlacemarkCoordinates = (e) => {
        openPanelControl()
        const position = e.get('coords')
        setNewPlacemarkCoordinates(position)
    }

    const addPlacemark = (coordinates, country, city, title, description, workTime) => {
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
        setStartStateMapZoom({center: map.getCenter(), zoom: 3})
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

    const ymaps = useRef(null)

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
        <YMaps>
            <Map state={startStateMapZoom}
                 className={style.container}
                 modules={modules}
                 onLoad={(api) => ymaps.current = api}
                 features={dataConvert(coordinates)}
                 instanceRef={(map) => setMap(map)}
                 onContextMenu={addPlacemarkCoordinates}>
                <SearchControl options={{
                    float: 'right',
                    maxWidth: 190,
                    noPlacemark: true,
                    provider: new CustomSearchProvider(coordinates),
                    resultsPerPage: 5
                }}/>
                <ZoomControl options={{float: 'right'}}/>
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
                <LeftCards state={coordinates} onClickLeftCards={onClickLeftCards}/>
            </Map>
        </YMaps>
    )
}