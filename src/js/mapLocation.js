(function() {
    const lat = document.querySelector('#PRP_latitud').value || -36.8269900;
    const lng = document.querySelector('#PRP_longitud').value || -73.0497700;
    const mapLoc = L.map('mapLocation').setView([lat, lng ], 16);
    let marker;

    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapLoc);

    marker = new L.marker([lat,lng],{
        draggable:true,
        autoPan:true
    }).addTo(mapLoc)
    marker.on('moveend',function(evt){
        marker = evt.target
        const position = marker.getLatLng();
        mapLoc.panTo(new L.LatLng(position.lat,position.lng));
        geocodeService.reverse().latlng(position, 16).run(function(error,resultado){
            marker.bindPopup(resultado.address.LongLabel)

            document.querySelector('.calle').textContent = `Dirección: ${resultado?.address?.Address ?? ''}`;
            document.querySelector('#PRP_direccion').value = resultado?.address?.Address ?? '';
            document.querySelector('#PRP_latitud').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#PRP_longitud').value = resultado?.latlng?.lng ?? '';
        })
    })

})()