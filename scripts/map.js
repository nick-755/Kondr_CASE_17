const companyCoordinates = [55.740468, 37.531958];

ymaps.ready(init);
function init()
{
  const myMap = new ymaps.Map("map",
  {
    center: companyCoordinates,
    zoom: 17,
  });

  const dotGeoOblect = new ymaps.GeoObject(
  {
    geometry:
    {
      type: "Point",
      coordinates: companyCoordinates
    }
  },
  { 
    preset: 'islands#icon',
    iconColor: '#f07826'
  });

  myMap.geoObjects.add(dotGeoOblect);
}
